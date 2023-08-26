import { vi, it, expect, describe } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';

import { default as userEvent } from '@testing-library/user-event';

import GameOverDialog from './game-over-dialog.component';

describe('GameOverDialog', () => {
  it('should display score', () => {
    render(<GameOverDialog score={12} />);
    expect(
      screen.getByRole('heading', { name: 'Your Score: 12' })
    ).toBeInTheDocument();
  });

  it('should fire onClick when button clicked', async () => {
    const reset = vi.fn();
    render(<GameOverDialog reset={reset} />);

    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }));

    waitFor(() => expect(reset).toHaveBeenCalled());
  });
});
