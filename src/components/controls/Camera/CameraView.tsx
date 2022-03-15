import React, { CSSProperties } from 'react';
import clsx from 'clsx';

import styles from './CameraView.module.css';

export type CameraModel = {
  scale?: number;
  x?: number;
  y?: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  perspective?: number;
};

export type CameraViewProps = React.PropsWithChildren<
  {
    className?: string;
    contentClassName?: string;
    contentRef: React.Ref<HTMLDivElement>;
  } & CameraModel
>;

const CameraView = ({
  className,
  contentClassName,
  scale = 1,
  x = 0,
  y = 0,
  z = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  perspective = 500,
  contentRef,
  children,
}: CameraViewProps) => {
  const transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
  return (
    <div
      className={clsx(styles.base, className)}
      style={
        {
          '--perspective': `${perspective}px`,
        } as CSSProperties & {
          '--perspective': CSSProperties['perspective'];
        }
      }
    >
      <div
        className={clsx(styles.content, contentClassName)}
        ref={contentRef}
        style={{
          transform,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CameraView;
