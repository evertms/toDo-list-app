import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../components/Button';

describe('Button', () => {
  it('debe mostrar el texto del botón', () => {
    render(<Button text="Login" />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('debe aplicar estilo de color para "Hecha"', () => {
    render(<Button text="Hecha" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-500');
  });

  it('debe deshabilitar el botón si isLoading es true', () => {
    const handleClick = vi.fn();
    render(<Button text="Login" isLoading={true} onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});