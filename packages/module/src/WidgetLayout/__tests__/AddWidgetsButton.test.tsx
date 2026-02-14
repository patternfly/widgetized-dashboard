import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddWidgetsButton from '../AddWidgetsButton';

describe('AddWidgetsButton', () => {
  it('renders with default text', () => {
    render(<AddWidgetsButton onClick={jest.fn()} />);
    expect(screen.getByRole('button', { name: /add widgets/i })).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<AddWidgetsButton onClick={jest.fn()}>Custom Label</AddWidgetsButton>);
    expect(screen.getByRole('button', { name: /custom label/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<AddWidgetsButton onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<AddWidgetsButton onClick={jest.fn()} isDisabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes additional props to the underlying Button', () => {
    render(<AddWidgetsButton onClick={jest.fn()} aria-label="Custom aria" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom aria');
  });
});
