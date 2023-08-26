import { LOADING_LEADERBOARD_MESSAGE } from '../../constants';
import { LeaderboardScore } from '../../types';

const tableHeaders = ['Username', 'Score', 'Date'];

interface Props {
  leaderboardScores?: LeaderboardScore[];
}

const LeaderBoard = ({ leaderboardScores }: Props) => (
  <div className='side-box'>
    <div className='high-scores'>
      <h1>High Scores</h1>

      <table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <td key={header}>{header}</td>
            ))}
          </tr>
        </thead>

        <tbody>
          {!!leaderboardScores ? (
            leaderboardScores.map(({ name, score, date }) => (
              <tr key={name}>
                <td>
                  <h2>{name}</h2>
                </td>
                <td>
                  <h2>{score}</h2>
                </td>
                <td>
                  <h2>{date}</h2>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <h2 className='flash'>{LOADING_LEADERBOARD_MESSAGE}</h2>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default LeaderBoard;
