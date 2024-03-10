import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ProfileForm from './Profile.js';

describe('ProfileForm component', () => {
  test('handlesavechange function work correctly', async () => {
    const { getByText, getByLabelText } = render(<ProfileForm />);

    fireEvent.change(getByLabelText('ชื่อผู้ใช้'), { target: { value: 'test' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(getByLabelText('หมายเลขโทรศัพท์'), { target: { value: '0000000000' } });
    fireEvent.click(getByText('ยืนยันการแก้ไขข้อมูล'));

    await waitFor(() => {
      expect(getByText('Changes saved successfully!')).toBeInTheDocument();
    });
  });
});
