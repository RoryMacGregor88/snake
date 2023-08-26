import { FormEvent, ChangeEvent, useState } from 'react';
import { MAX_NAME_LENGTH } from '../../constants';

interface Props {
  handleSubmit: (name: string) => void;
  cancel: () => void;
}

const HighScoreForm = ({ handleSubmit, cancel }: Props) => {
  const [name, setName] = useState('');

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    /** limit character length */
    if (name.length === MAX_NAME_LENGTH) return;

    /** Prevent spaces */
    const noSpaceName = value.trim();
    setName(noSpaceName);
  };

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    handleSubmit(name);
  };

  return (
    <form className='high-score-form' onSubmit={onSubmit}>
      <input
        value={name}
        placeholder='Enter your name'
        onChange={handleChange}
      />

      <div className='button-container'>
        <button className='eightbit-btn'>Submit</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            cancel();
          }}
          className='eightbit-btn eightbit-btn--reset'
        >
          cancel
        </button>
      </div>
    </form>
  );
};

export default HighScoreForm;
