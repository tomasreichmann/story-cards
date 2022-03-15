import React from 'react';
import { RichContentItemComponentProps } from '../RichContent/RichContentItem';

import styles from './RichContentItem.module.css';

export default function SimpleComponent({
  value,
  children,
  Component = 'pre' as keyof JSX.IntrinsicElements,
}: Partial<RichContentItemComponentProps> & {
  Component: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className={styles[Component]}>{value || children}</Component>
  );
}
