import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const styles = {
      primary: 'bg-brand text-white hover:bg-brand-dark',
      secondary: 'bg-white text-brand border border-brand hover:bg-brand/10',
      ghost: 'bg-transparent text-brand hover:bg-brand/10'
    }[variant];

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
          styles,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
