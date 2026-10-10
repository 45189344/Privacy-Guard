import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BorderBeamSearch } from '@/components/ui/BorderBeamSearch';

describe('UI Components Testing', () => {
  it('renders StatusBadge with appropriate text and styles', () => {
    const { rerender } = render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText(/completed/i)).toBeInTheDocument();

    rerender(<StatusBadge status="UNDER_REVIEW" />);
    expect(screen.getByText(/under review/i)).toBeInTheDocument();

    rerender(<StatusBadge status="REJECTED" />);
    expect(screen.getByText(/rejected/i)).toBeInTheDocument();

    rerender(<StatusBadge status="DELETION_IN_PROGRESS" />);
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  it('renders BorderBeamSearch and responds to user typing and clear', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <BorderBeamSearch
        value=""
        onChange={handleChange}
        placeholder="Search requests..."
      />
    );

    const input = screen.getByPlaceholderText('Search requests...') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'PG-2026' } });
    expect(handleChange).toHaveBeenCalledWith('PG-2026');

    // Test clear button when value is present
    rerender(
      <BorderBeamSearch
        value="PG-2026"
        onChange={handleChange}
        placeholder="Search requests..."
      />
    );

    const clearBtn = screen.getByLabelText(/clear search input/i);
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
