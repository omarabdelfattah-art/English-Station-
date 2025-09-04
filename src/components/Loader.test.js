/**
 * Loader Component Tests
 *
 * Integration tests for the Loader component to verify
 * rendering, accessibility, and user experience.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  test('renders without crashing', () => {
    render(<Loader />);
    const loaderElement = screen.getByRole('status');
    expect(loaderElement).toBeInTheDocument();
  });

  test('displays loading text', () => {
    render(<Loader />);
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<Loader />);
    const loaderElement = screen.getByRole('status');
    expect(loaderElement).toHaveAttribute('aria-live', 'polite');
  });

  test('contains spinner animation element', () => {
    render(<Loader />);
    // Look for the spinning animation class or element
    const spinnerElement = document.querySelector('.animate-spin');
    expect(spinnerElement).toBeInTheDocument();
  });

  test('is centered on the page', () => {
    render(<Loader />);
    const loaderContainer = screen.getByRole('status').parentElement;
    expect(loaderContainer).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
  });

  test('contains gradient background', () => {
    render(<Loader />);
    const loaderContainer = screen.getByRole('status').parentElement.parentElement;
    expect(loaderContainer).toHaveClass('gradient-bg');
  });
});