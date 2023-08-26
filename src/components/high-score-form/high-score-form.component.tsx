import { useState } from 'react';

interface Props {
  handleSubmit: (values: { name: string }) => void;
  cancel: () => void;
}

const HighScoreForm = ({ handleSubmit, cancel }: Props) => {
  const [name, setName] = useState('');

  const handleChange = ({ target: { value } }) => setName(value);

  return (
    <form
      className='high-score-form'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
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
