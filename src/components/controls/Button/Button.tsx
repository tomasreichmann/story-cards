import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className,
  children,
  ...buttonProps
}: ButtonProps) {
  return (
    <button className={clsx(styles.base, className)} {...buttonProps}>
      {children}
    </button>
  );
}
