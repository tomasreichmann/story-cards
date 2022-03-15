import clsx from 'clsx';
import React from 'react';
import { Post } from '../../../types';

import styles from './PostCard.module.css';

export type PostCardProps = Omit<Post, 'count'> & {};

export default function PostCard(props: PostCardProps) {
  const { iconUrl1, name, tags } = props;
  return (
    <>
      <div
        className={clsx(
          styles.base,
          tags.map((tag) => styles['base__' + tag])
        )}
      >
        <div className={styles.content}>
          <img src={iconUrl1} alt={name} className={styles.icon} />
        </div>
      </div>
      {false && <pre>{JSON.stringify(props, null, 2)}</pre>}
    </>
  );
}
