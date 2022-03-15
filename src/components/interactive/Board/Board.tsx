import clsx from 'clsx';
import React, { forwardRef, PropsWithChildren } from 'react';
import useBoard, {
  BoardComponentType,
  BoardComponentTypeEnum,
} from '../../../boardModel';
import StoryCard from '../StoryCard/StoryCard';

import styles from './Board.module.css';

export type BoardProps = {
  className?: string;
};

const componentTypeMap: {
  [key in BoardComponentTypeEnum]: React.ComponentType<
    BoardComponentType['props']
  >;
} = {
  [BoardComponentTypeEnum.Card]: StoryCard,
};

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ className }: BoardProps, ref) => {
    const { board } = useBoard();

    const content = Object.values(board.components).map((component) => {
      const Component = componentTypeMap[component.type];
      return <Component key={component.id} {...component.props} />;
    });

    return (
      <div className={clsx(styles.base, className)} ref={ref}>
        {content}
      </div>
    );
  }
);
export default Board;
