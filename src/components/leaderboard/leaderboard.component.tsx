import { LOADING_LEADERBOARD_MESSAGE } from '../../constants';
import { HighScore } from '../../types';

const tableHeaders = ['Username', 'Score', 'Date'];

interface Props {
  highScores?: HighScore[];
}

const LeaderBoard = ({ highScores }: Props) => (
  <div className='side-box'>
    <div className='high-scores'>
      <h1>High Scores</h1>

      <table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <td>{header}</td>
            ))}
          </tr>
        </thead>

        <tbody>
          {highScores ? (
            highScores.map(({ username, score, date }) => (
              <tr>
                <td>
                  <h2>{username}</h2>
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
