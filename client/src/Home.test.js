import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import HomeForm from "./Home.js"

test("Render Title Tour", () => {
    render(<HomeForm />);
    const title = screen.getByText(/โปรแกรมทัวร์แนะนำ/i);
    expect(title).toBeInTheDocument();
});