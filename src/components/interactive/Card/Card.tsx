import clsx from 'clsx';
import React, { forwardRef, HTMLAttributes } from 'react';

import styles from './Card.module.css';

export type CardProps = {
  controls?: React.ReactNode;
  backFace?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  faceDown?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const defaultBackFace = <div className={styles.backFace} />;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      controls,
      backFace = defaultBackFace,
      faceDown,
      children,
      onClick,
      ...otherProps
    }: CardProps,
    ref
  ) => {
    return (
      <div
        {...otherProps}
        className={clsx(
          styles.base,
          className,
          faceDown && styles.base__faceDown
        )}
        ref={ref}
      >
        {controls}
        <div
          className={clsx(styles.front, onClick && styles.front__interactive)}
          onClick={onClick}
        >
          {children}
        </div>
        <div
          className={clsx(styles.back, onClick && styles.back__interactive)}
          onClick={onClick}
        >
          {backFace}
        </div>
      </div>
    );
  }
);
export default Card;
