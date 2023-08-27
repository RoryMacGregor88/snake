import { vi, it, expect, describe } from 'vitest';

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import HighScoreForm from './high-score-form.component';
import { MAX_NAME_LENGTH } from '../../constants';

describe('HighScoreForm', () => {
  it('should render', () => {
    render(<HighScoreForm />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should prevent spaces in name', async () => {
    const handleSubmit = vi.fn();
    render(<HighScoreForm handleSubmit={handleSubmit} />);

    await userEvent.type(
      screen.getByPlaceholderText('Enter Your Name'),
      'Test Name'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledWith('TestName');
  });

  it('should prevent letters past max character langth', async () => {
    const handleSubmit = vi.fn(),
      testName = 'abcdefghijklmnop',
      slicedTestName = testName.slice(0, MAX_NAME_LENGTH);

    render(<HighScoreForm handleSubmit={handleSubmit} />);

    await userEvent.type(
      screen.getByPlaceholderText('Enter Your Name'),
      testName
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledWith(slicedTestName);
  });

  it('should call cancel handler when button clicked', async () => {
    const handleCancel = vi.fn();
    render(<HighScoreForm handleCancel={handleCancel} />);

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCancel).toHaveBeenCalled();
  });

  it('should call submit handler when form is valid and button clicked', async () => {
    const handleSubmit = vi.fn(),
      testName = 'TestName';

    render(<HighScoreForm handleSubmit={handleSubmit} />);

    await userEvent.type(
      screen.getByPlaceholderText('Enter Your Name'),
      testName
    );
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledWith(testName);
  });
});
