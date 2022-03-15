// Cards need to float independently
// Stacks, Hand, Piles and other form of card layout must provide updates to card positions without grouping them in

import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { createContext } from 'vm';
import { StoryCardProps } from './components/interactive/StoryCard/StoryCard';
import { outcomeCards } from './gameModel';

export enum BoardComponentTypeEnum {
  Card = 'Card',
}

export enum StackTypeEnum {
  Deck = 'Deck',
}

const cardWidth = 212;
const cardHeight = 363;
const gap = 20;

export type PositionType = [number, number, number];

export type BoardComponentType<T extends {} = any> = {
  id: string;
  position: PositionType;
  type: BoardComponentTypeEnum;
  props: T;
};

export type StackType = {
  id: string;
  position: PositionType;
  componentIds: string[];
  type: StackTypeEnum;
};

const thicknessByComponentTypeMap: {
  [key in BoardComponentTypeEnum]: number;
} = {
  [BoardComponentTypeEnum.Card]: 10,
};

const initialOutcomeCardComponents: BoardComponentType<StoryCardProps>[] =
  outcomeCards.map((card) => ({
    id: card.sys.id,
    faceDown: true,
    type: BoardComponentTypeEnum.Card,
    position: [0, 0, 0],
    props: {
      ...card,
      id: card.sys.id,
    },
  }));

export type BoardType = {
  components: {
    [key: string]: BoardComponentType;
  };
  stacks: {
    [key: string]: StackType;
  };
};

const toIdMap = <T extends { id: string }>(items: T[]): { [key: string]: T } =>
  items.reduce((previousValue, currentValue) => {
    previousValue[currentValue.id] = currentValue;
    return previousValue;
  }, {});

const initialBoard: BoardType = {
  components: toIdMap(initialOutcomeCardComponents),
  stacks: {
    outcome1: {
      id: 'outcome1',
      position: [cardWidth + gap, 0, 0],
      componentIds: initialOutcomeCardComponents.map(
        (component) => component.id
      ),
      type: StackTypeEnum.Deck,
    },
  },
};

export const BoardContext = createContext({
  board: initialBoard,
});

const updateDeckComponents = (
  stack: StackType,
  components: BoardType['components']
): BoardType['components'] => {
  const newComponents = { ...components };
  const [stackX, stackY, stackZ] = stack.position;
  stack.componentIds.forEach((componentId, componentIndex) => {
    const newComponent = { ...components[componentId] };
    newComponent.position = [
      stackX,
      stackY,
      stackZ + componentIndex * thicknessByComponentTypeMap[newComponent.type],
    ];
  });
  return newComponents;
};

const resolveSetStateAction = <V>(
  setStateAction: SetStateAction<V>,
  previousValue: V
) => {
  if (typeof setStateAction === 'function') {
    return (setStateAction as (V) => V)(previousValue);
  }
  return setStateAction;
};

const updateComponentsByTypeMap: {
  [key in StackTypeEnum]: (
    stack: StackType,
    components: BoardType['components']
  ) => BoardType['components'];
} = {
  [StackTypeEnum.Deck]: updateDeckComponents,
};

export default function useBoard() {
  const [board, setBoard] = useState(initialBoard);

  const createStack = useCallback((newStack: StackType) => {
    setBoard((board) => {
      return {
        ...board,
        stacks: {
          ...board.stacks,
          newStack,
        },
      };
    });
  }, []);

  const updateComponent = useCallback(
    (id: string, setComponentAction: SetStateAction<BoardComponentType>) => {
      setBoard((board) => {
        const components = { ...board.components };
        components[id] = resolveSetStateAction<BoardComponentType>(
          setComponentAction,
          components[id]
        );
        return {
          ...board,
          components,
        };
      });
    },
    []
  );

  // Recalculate stacks
  useEffect(() => {
    setBoard((board) => {
      let newComponents = { ...board.components };
      Object.values(board.stacks).forEach((stack) => {
        newComponents = updateComponentsByTypeMap[stack.type](
          stack,
          newComponents
        );
      });
      return {
        ...board,
        components: newComponents,
      };
    });
  }, []);

  return {
    board,
    createStack,
    updateComponent,
  };
}
