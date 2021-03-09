import React from 'react';
import { format as formatDate, parseISO } from 'date-fns';

interface Props {
  value?: string | Date;
  format: string;
}

function DateFormat({ value, format }: Props) {
  if (!value) {
    return null;
  }

  const date = typeof value === 'string' ? parseISO(value) : value;

  return <>{formatDate(date, format)}</>
}

export default DateFormat;
