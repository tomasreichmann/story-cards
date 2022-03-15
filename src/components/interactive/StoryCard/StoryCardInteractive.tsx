import React, { memo, MouseEventHandler, useCallback, useRef } from 'react';
import Button from '../../controls/Button/Button';
import {
  CameraFocusScaleMode,
  useCamera,
} from '../../controls/Camera/CameraContext';
import StoryCard, { StoryCardProps } from '../StoryCard/StoryCard';

import styles from './StoryCardInteractive.module.css';

export type StoryCardInteractiveProps = StoryCardProps & {
  onClick?: (
    id: StoryCardProps['id'],
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
};

const StoryCardInteractive = (props: StoryCardInteractiveProps) => {
  const { controls, onClick, ...storyCardProps } = props;
  const { focus } = useCamera();
  const onFocusCard = useCallback(() => {
    focus(cardRef.current, {
      scaleMode: CameraFocusScaleMode.Contain,
      scaleMargin: 50,
    });
  }, [focus]);
  const cardRef = useRef<HTMLDivElement>();

  const onCardClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      onClick(props.id, event);
    },
    [focus]
  );

  return (
    <StoryCard
      onClick={onCardClick}
      controls={
        <div className={styles.controls}>
          <Button className={styles.focus} onClick={onFocusCard}>
            👁
          </Button>
          {controls}
        </div>
      }
      {...storyCardProps}
      ref={cardRef}
    />
  );
};

export default memo(StoryCardInteractive);
