import React from 'react';
import { ContentResponseItem } from '../../types';
import RichContentItem, {
  defaultComponentMap,
} from '../RichContent/RichContentItem';

export type RichContentProps = {
  className?: string;
  content: ContentResponseItem[];
  TagName?: keyof JSX.IntrinsicElements;
  componentMap?: typeof defaultComponentMap;
};

export default function RichContent(props: RichContentProps) {
  const { content, className, TagName = 'div' } = props;
  const children = content.map((contentItem, contentItemIndex) => (
    <RichContentItem key={contentItemIndex} {...contentItem} />
  ));
  if (TagName) {
    return <TagName className={className}>{children}</TagName>;
  }
  return <>{children}</>;
}
