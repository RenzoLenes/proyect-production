'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isDateType = ['date', 'datetime-local', 'time', 'month'].includes(type || '');

    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            isDateType && `
              /* Estilos específicos para inputs de fecha */
              [&::-webkit-calendar-picker-indicator]:absolute
              [&::-webkit-calendar-picker-indicator]:right-0
              [&::-webkit-calendar-picker-indicator]:w-[1.6rem]
              [&::-webkit-calendar-picker-indicator]:bg-transparent
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
            `,
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };