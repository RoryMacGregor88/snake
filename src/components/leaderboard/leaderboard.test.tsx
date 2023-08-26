import { it, expect, describe } from 'vitest';

import { render, screen } from '@testing-library/react';

import LeaderBoard from './leaderboard.component';

import { LOADING_LEADERBOARD_MESSAGE } from '../../constants';

const TEST_HIGH_SCORES = new Array(3).fill(undefined).map((_, i) => ({
  username: `Username-${i + 1}`,
  score: i + 1,
  date: '21/07/2023',
}));

describe('Leaderboard', () => {
  it('should display leaderboard if high scores present', () => {
    render(<LeaderBoard highScores={TEST_HIGH_SCORES} />);
    expect(
      screen.getByRole('header', { name: 'Username-1' })
    ).toBeInTheDocument();
  });

  it('should render loading message if high scores not present', () => {
    render(<LeaderBoard highScores={undefined} />);
    expect(
      screen.getByRole('header', { name: LOADING_LEADERBOARD_MESSAGE })
    ).toBeInTheDocument();
  });
});
