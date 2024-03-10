import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tour from './getTour';

describe('Tour Component', () => {
  test('increments numberOfPeople when input changes', () => {
    const { getByLabelText } = render(<Tour data={/number/} filterData={[]} />);
    
    const numberOfPeopleInput = getByLabelText('จำนวนคน');
    fireEvent.change(numberOfPeopleInput, { target: { value: '2' } });

    expect(numberOfPeopleInput.value).toBe('2');
  });
});