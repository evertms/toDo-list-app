import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import { describe, expect, it, vi } from 'vitest';

// Mock Sidebar para simplificar
vi.mock('../components/SideBar', () => ({
  default: () => <div data-testid="sidebar">Mock Sidebar</div>,
}));

describe('Layout', () => {
  it('renderiza el layout con sidebar y outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div data-testid="child-content">Contenido hijo</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
