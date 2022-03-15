import camelcase from 'camelcase';
import clsx from 'clsx';
import Image from 'next/image';
import React, { forwardRef, memo } from 'react';
import { CardResponse } from '../../../types';

import RichContent from '../../RichContent/RichContent';
import Card, { CardProps } from '../Card/Card';

import styles from './StoryCard.module.css';

export type StoryCardProps = CardResponse & Partial<CardProps>;

const defaultBackFace = <div className={styles.backFace} />;

const StoryCard = (props: StoryCardProps, ref) => {
  const {
    title,
    image,
    type,
    description,
    controls,
    backFace = defaultBackFace,
    ...cardProps
  } = props;
  const imageUrl = image?.fields?.file?.url;
  return (
    <Card
      className={clsx(
        styles.base,
        type?.map((tag) => styles['base__' + camelcase(tag)])
      )}
      backFace={backFace}
      {...cardProps}
      ref={ref}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.imageWrapper}>
          {imageUrl && (
            <Image
              src={'https:' + imageUrl}
              className={styles.image}
              layout="fill"
            />
          )}
        </div>
        {description && (
          <RichContent
            className={styles.description}
            content={description?.content}
          />
        )}
      </div>
    </Card>
  );
};

export default memo(forwardRef<HTMLDivElement, StoryCardProps>(StoryCard));
