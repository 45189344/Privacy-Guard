import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '@/types';
import { StorageService, SEED_USERS } from '@/services/storage';
import { isSupabaseConfigured, supabase } from '@/services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDPOAdmin: boolean;
  isAuditor: boolean;
  isDemoMode: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, fullName: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const currentUser = StorageService.getCurrentUser();
            setUser({
              ...(currentUser || SEED_USERS[0]),
              id: session.user.id,
              email: session.user.email || currentUser?.email || '',
            });
            setIsDemoMode(false);
          } else {
            setUser(null);
            setIsDemoMode(true);
          }
        } catch {
          setUser(null);
          setIsDemoMode(true);
        }
      } else {
        // Local mode: strictly start unauthenticated unless logged in during this active browser session
        const stored = StorageService.getCurrentUser();
        setUser(stored);
        setIsDemoMode(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && _password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _password });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const matchedProfile = StorageService.getUsers().find((u) => u.email === email) || {
            id: data.user.id,
            email,
            fullName: email.split('@')[0],
            role: 'user' as UserRole,
            identityVerified: true,
            createdAt: new Date().toISOString(),
          };
          setUser(matchedProfile);
          StorageService.setCurrentUser(matchedProfile);
          setIsDemoMode(false);
          setLoading(false);
          return { success: true };
        }
      }

      // Demonstration mode authentication lookup
      const users = StorageService.getUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        setUser(existing);
        StorageService.setCurrentUser(existing);
        StorageService.logAuditEvent({
          eventType: 'USER_LOGIN',
          actorId: existing.id,
          actorEmail: existing.email,
          actorRole: existing.role,
          outcome: 'SUCCESS',
          correlationId: `cor_login_${existing.id}_${Date.now()}`,
          ipAddressMasked: '103.***.***.***',
          metadata: { authMode: 'demo_session' },
        });
        setLoading(false);
        return { success: true };
      }

      // If user not found, create a new standard 'user' role profile (NEVER admin)
      const newUser: UserProfile = {
        id: `usr_${Date.now().toString(36)}`,
        email,
        fullName: email.split('@')[0].replace(/[._]/g, ' '),
        role: 'user', // Strict least privilege: public registrations are ALWAYS role 'user'
        identityVerified: true,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('privacyguard_users_v1', JSON.stringify(updatedUsers));
      setUser(newUser);
      StorageService.setCurrentUser(newUser);

      StorageService.logAuditEvent({
        eventType: 'USER_LOGIN',
        actorId: newUser.id,
        actorEmail: newUser.email,
        actorRole: newUser.role,
        outcome: 'SUCCESS',
        correlationId: `cor_reg_${newUser.id}_${Date.now()}`,
        ipAddressMasked: '103.***.***.***',
        metadata: { authMode: 'new_registration' },
      });

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Login operation failed' };
    }
  };

  const register = async (email: string, fullName: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && _password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: _password,
          options: { data: { full_name: fullName } },
        });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email,
            fullName,
            role: 'user', // strict role
            identityVerified: false,
            createdAt: new Date().toISOString(),
          };
          setUser(profile);
          StorageService.setCurrentUser(profile);
          setLoading(false);
          return { success: true };
        }
      }

      // Demo registration
      const users = StorageService.getUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setLoading(false);
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const newUser: UserProfile = {
        id: `usr_${Date.now().toString(36)}`,
        email,
        fullName,
        role: 'user', // strictly regular user
        identityVerified: true,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('privacyguard_users_v1', JSON.stringify(updatedUsers));
      setUser(newUser);
      StorageService.setCurrentUser(newUser);

      StorageService.logAuditEvent({
        eventType: 'USER_LOGIN',
        actorId: newUser.id,
        actorEmail: newUser.email,
        actorRole: newUser.role,
        outcome: 'SUCCESS',
        correlationId: `cor_reg_${newUser.id}_${Date.now()}`,
        ipAddressMasked: '103.***.***.***',
        metadata: { authMode: 'registration' },
      });

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  const logout = async (): Promise<void> => {
    if (user) {
      StorageService.logAuditEvent({
        eventType: 'USER_LOGOUT',
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        outcome: 'SUCCESS',
        correlationId: `cor_logout_${user.id}_${Date.now()}`,
        ipAddressMasked: '103.***.***.***',
        metadata: {},
      });
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    StorageService.setCurrentUser(null);
  };

  const switchDemoRole = useCallback((role: UserRole) => {
    let target = SEED_USERS.find((u) => u.role === role);
    if (!target) {
      target = SEED_USERS[0];
    }
    setUser(target);
    StorageService.setCurrentUser(target);
    StorageService.logAuditEvent({
      eventType: 'ADMIN_ROLE_ACCESSED',
      actorId: target.id,
      actorEmail: target.email,
      actorRole: target.role,
      outcome: 'SUCCESS',
      correlationId: `cor_switch_${target.id}_${Date.now()}`,
      ipAddressMasked: '127.0.0.1',
      metadata: { switchedToRole: role },
    });
  }, []);

  const resetDemoData = useCallback(() => {
    StorageService.resetToSeeds();
    const defaultUser = SEED_USERS[0];
    setUser(defaultUser);
    window.location.reload();
  }, []);

  const isAuthenticated = Boolean(user);
  const isDPOAdmin = user?.role === 'dpo_admin';
  const isAuditor = user?.role === 'auditor';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isDPOAdmin,
        isAuditor,
        isDemoMode,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
