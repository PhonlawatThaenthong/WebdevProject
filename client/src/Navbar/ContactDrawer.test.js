import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Contact from './Contact';

describe('Contact Drawer component Testing', () => {
  test('Drawer opens when button is clicked', () => {
    const { getByText, getByRole } = render(<Contact />);
    const button = getByRole('button', { name: /ติดต่อเรา/i });
    fireEvent.click(button);
    const drawerTitle = getByText(/ช่องทางการติดต่อ/i);
    expect(drawerTitle).toBeInTheDocument();
  });

 
 
});
