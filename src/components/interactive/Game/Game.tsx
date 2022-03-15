import clsx from 'clsx';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import shuffle from 'lodash/shuffle';

import styles from './Game.module.css';
import useCards from '../../../loaders/useCards';
import CameraControl from '../../controls/Camera/CameraControl';
import StoryCard, { StoryCardProps } from '../StoryCard/StoryCard';
import StyleGuide from '../../utility/StyleGuide/StyleGuide';
import { outcomeCards } from '../../../gameModel';
import Stack from '../Stack/Stack';
import Button from '../../controls/Button/Button';
import {
  CameraFocusScaleMode,
  useCamera,
} from '../../controls/Camera/CameraContext';

//const { data: cardsData, isPending, error } = useCards();
/* {error && <div>{JSON.stringify(error, null, 2)}</div>}
{isPending && <div>Loading...</div>}
{cardsData &&
  cardsData.map((card, cardIndex) => (
    <StoryCard key={cardIndex} {...card} />
  ))} */

const outcomeCardBack = (
  <div className={styles.outcomeBack}>
    🎲
    <br />
    Outcome
  </div>
);

const initialOutcomeCards: StoryCardProps[] = outcomeCards.map((card) => ({
  ...card,
  faceDown: true,
}));

export default function Game() {
  const [outcomeCards, setOutcomeCards] = useState(initialOutcomeCards);
  const getOnFlip = useCallback(
    (cardIndex) => () => {
      setOutcomeCards((cards) => {
        const newCards = [...cards];
        newCards[cardIndex] = {
          ...cards[cardIndex],
          faceDown: !cards[cardIndex].faceDown,
        };
        return newCards;
      });
    },
    []
  );

  const outcomeCardElements = useMemo(
    () =>
      outcomeCards.map((card, cardIndex) => (
        <StoryCard
          key={cardIndex}
          {...card}
          backFace={outcomeCardBack}
          controls={
            <div className={styles.controls}>
              <Button className={styles.flip} onClick={getOnFlip(cardIndex)}>
                ⮏
              </Button>
            </div>
          }
        />
      )),
    [outcomeCards]
  );

  return (
    <div className={styles.base}>
      <CameraControl className={styles.camera}>
        <div className={styles.content}>
          <Stack cards={outcomeCardElements} />
          <StyleGuide />
        </div>
      </CameraControl>
    </div>
  );
}
