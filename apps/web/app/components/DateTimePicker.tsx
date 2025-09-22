'use client';

import { ChangeEvent } from 'react';
import { Input } from './ui/input';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return <Input type="datetime-local" value={value} onChange={handleChange} />;
}
