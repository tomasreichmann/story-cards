import React from 'react';
import { ContentResponseItem } from '../../types';
import RichContent from '../RichContent/RichContent';
import SimpleComponent from '../RichContent/SimpleComponent';

export type RichContentItemComponentProps = ContentResponseItem & {
  children: React.ReactNode;
};

export type RichContentItemProps = ContentResponseItem & {
  className?: string;
  componentMap?: {
    [key: string]: React.ComponentType<Partial<RichContentItemComponentProps>>;
  };
};

export const defaultComponentMap = {
  blockquote: (props) => <SimpleComponent {...props} Component="blockquote" />,
  document: (props) => <SimpleComponent {...props} Component="article" />,
  'heading-1': (props) => <SimpleComponent {...props} Component="h1" />,
  'heading-2': (props) => <SimpleComponent {...props} Component="h2" />,
  'heading-3': (props) => <SimpleComponent {...props} Component="h3" />,
  'heading-4': (props) => <SimpleComponent {...props} Component="h4" />,
  'heading-5': (props) => <SimpleComponent {...props} Component="h5" />,
  'heading-6': (props) => <SimpleComponent {...props} Component="h6" />,
  'list-item': (props) => <SimpleComponent {...props} Component="li" />,
  paragraph: (props) => <SimpleComponent {...props} Component="p" />,
  text: (props) => <SimpleComponent {...props} Component="span" />,
  'unordered-list': (props) => <SimpleComponent {...props} Component="ul" />,
  'ordered-list': (props) => <SimpleComponent {...props} Component="ol" />,
  unknown: ({ value, nodeType, ...props }) => (
    <SimpleComponent
      value={`Unknown tag ${nodeType} with value: ${JSON.stringify(
        value,
        null,
        2
      )}`}
      {...props}
      Component="pre"
    />
  ),
};

const spanTagName = ['paragraph'];
const nullTagName = ['text', 'unordered-list', 'ordered-list'];

const getTagName = (nodeType: string) => {
  if (nullTagName.includes(nodeType)) {
    return null;
  }
  if (spanTagName.includes(nodeType)) {
    return 'span';
  }
  return 'div';
};

export default function RichContentItem(props: RichContentItemProps) {
  const {
    componentMap = defaultComponentMap,
    content,
    ...componentProps
  } = props;
  const nodeType = props.nodeType;
  const Component =
    (nodeType in componentMap && componentMap[nodeType]) ||
    componentMap.unknown;

  const children = content ? (
    <RichContent content={content} TagName={getTagName(nodeType)} />
  ) : undefined;
  return <Component {...componentProps}>{children}</Component>;
}
