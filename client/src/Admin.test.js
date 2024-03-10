import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AdminForm from './Admin.js';

describe('AdminForm component', () => {
  test('handleAddTour function adds a new tour correctly', async () => {
    const { getByText, getByLabelText } = render(<AdminForm />);

    fireEvent.change(getByLabelText('ชื่อทัวร์:'), { target: { value: 'Test Tour' } });
    fireEvent.change(getByLabelText('จำกัดจำนวน:'), { target: { value: '50' } });
    fireEvent.change(getByLabelText('ราคา:'), { target: { value: '1000' } });
    fireEvent.change(getByLabelText('รายละเอียด:'), { target: { value: 'This is a test tour' } });
    fireEvent.change(getByLabelText('วันที่ทัวร์:'), { target: { value: new Date() } });
    fireEvent.change(getByLabelText('ชื่อสถานที่'), { target: { value: 'Test Destination' } });
    fireEvent.change(getByLabelText('00:00-01:00'), { target: { value: '10:00-11:00' } });
    fireEvent.click(getByText('Add'));
    fireEvent.click(getByText('Save'));

    await waitFor(() => {
      expect(getByText('เพิ่มทัวร์ใหม่เรียบร้อย!')).toBeInTheDocument();
    });

    expect(getByText('Add New Tour')).not.toBeInTheDocument();
  });
});
