import React from 'react';
import clsx from 'clsx';

import styles from './Stack.module.css';

export type StackProps = {
  className?: string;
  cards: React.ReactNode[];
};

export default function Stack({ className, cards }: StackProps) {
  return (
    <div className={clsx(styles.base, className)}>
      {cards[0]}
      <div className={styles.moreCards}>
        {cards.slice(1).map((card, cardIndex) => (
          <div
            key={cardIndex}
            className={clsx(
              styles.card,
              cardIndex === 0 ? styles.card__first : styles.card__other
            )}
          >
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
