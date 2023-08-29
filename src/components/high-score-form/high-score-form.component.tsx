import { FormEvent, ChangeEvent, useState } from 'react';
import { MAX_NAME_LENGTH } from '../../constants';

interface Props {
  handleSubmit: (name: string) => void;
  handleCancel: () => void;
}

const HighScoreForm = ({ handleSubmit, handleCancel }: Props) => {
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
        placeholder='Enter Your Name'
        onChange={handleChange}
      />

      <div className='button-container'>
        <button className='eightbit-btn'>Submit</button>
        <button
          onClick={(e) => {
            /** disable button's default 'submit' type, prevent form submitting */
            e.preventDefault();
            handleCancel();
          }}
          className='eightbit-btn eightbit-btn--reset'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HighScoreForm;
