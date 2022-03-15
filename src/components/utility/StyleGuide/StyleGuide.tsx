import React, { CSSProperties } from 'react';
import clsx from 'clsx';

import styles from './StyleGuide.module.css';

const variables = `--color-info
--color-best
--color-good
--color-neutral
--color-bad
--color-worst
--color-valuable
--color-info-dark
--color-best-dark
--color-good-dark
--color-neutral-dark
--color-bad-dark
--color-worst-dark
--color-valuable-dark
--color-info-light
--color-best-light
--color-good-light
--color-neutral-light
--color-bad-light
--color-worst-light
--color-valuable-light
--color-paper-info
--color-paper-best
--color-paper-good
--color-paper-neutral
--color-paper-bad
--color-paper-worst
--color-paper-valuable
--color-text
--color-text-inverse`.split('\n');

export default function StyleGuide() {
  return (
    <div className={styles.base}>
      {variables.map((variable) => (
        <div
          className={styles.variable}
          style={{ ['--color']: `var(${variable})` } as CSSProperties}
        >
          {variable}
        </div>
      ))}
    </div>
  );
}
