import { vi, it, expect, describe } from 'vitest';

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import StatsPanel from './stats-panel.component';

describe('HighScoreForm', () => {
  it('should render ', () => {
    const score = 10;
    render(<StatsPanel score={score} />);

    expect(
      screen.getByRole('heading', { name: `Score: ${score}` })
    ).toBeInTheDocument();
  });

  it('should display current speed as integer if round number', () => {
    const currentSpeed = 500,
      formattedSpeed = 2;
    render(<StatsPanel currentSpeed={currentSpeed} />);

    expect(
      screen.getByRole('heading', { name: `Speed: ${formattedSpeed} m/s` })
    ).toBeInTheDocument();
  });

  it('should display current speed as decimal if float', () => {
    const currentSpeed = 450,
      formattedSpeed = 2.22;
    render(<StatsPanel currentSpeed={currentSpeed} />);

    expect(
      screen.getByRole('heading', { name: `Speed: ${formattedSpeed} m/s` })
    ).toBeInTheDocument();
  });

  it('should display maximum speed message if max speed reached', () => {
    const currentSpeed = 150;
    render(<StatsPanel currentSpeed={currentSpeed} />);

    expect(
      screen.getByRole('heading', { name: 'MAXIMUM SPEED' })
    ).toBeInTheDocument();
  });

  it('should call reset if button clicked', async () => {
    const onResetClick = vi.fn();
    render(<StatsPanel onResetClick={onResetClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect(onResetClick).toHaveBeenCalled();
  });
});
