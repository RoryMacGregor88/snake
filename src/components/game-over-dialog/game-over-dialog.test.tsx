import { vi, it, expect, describe } from 'vitest';

import { render, screen } from '@testing-library/react';

import { default as userEvent } from '@testing-library/user-event';

import GameOverDialog from './game-over-dialog.component';

describe('GameOverDialog', () => {
  it('should display score', () => {
    render(<GameOverDialog score={12} />);
    expect(
      screen.getByRole('heading', { name: 'Your Score: 12' })
    ).toBeInTheDocument();
  });

  it('should show high score message is isHighScore is true', () => {
    render(<GameOverDialog score={23} isHighScore={true} />);

    expect(screen.getByRole('heading', { name: 'New High Score: 23' }));
  });

  it('should show HighScoreForm/hide Try Again button if showHighScoreForm is true', async () => {
    render(<GameOverDialog isHighScore={true} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Save High Score' })
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Try Again' })
    ).not.toBeInTheDocument();
  });

  it('should fire onResetClick when button clicked', async () => {
    const onResetClick = vi.fn();
    render(<GameOverDialog onResetClick={onResetClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(onResetClick).toHaveBeenCalled();
  });

  it('should call handleSaveHighScore and onResetClick when form is valid and button clicked', async () => {
    const handleSaveHighScore = vi.fn(),
      onResetClick = vi.fn(),
      testName = 'TestName';

    render(
      <GameOverDialog
        score={35}
        isHighScore={true}
        handleSaveHighScore={handleSaveHighScore}
        onResetClick={onResetClick}
      />
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Save High Score' })
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter Your Name'),
      testName
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSaveHighScore).toHaveBeenCalledWith(testName);
    expect(onResetClick).toHaveBeenCalled();
  });
});
