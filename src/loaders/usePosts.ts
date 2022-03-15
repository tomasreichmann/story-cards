import { defaultDocId, useSheetObject } from './sheetLoader';
import { Post, Sheet } from '../types';

export default function usePosts() {
  const posts = useSheetObject<Omit<Post, 'tags'> & { tags: string }>(
    defaultDocId,
    Sheet.Posts
  );

  return posts
    ?.filter((post) => post.name !== '')
    ?.map(
      (post) => ({ ...post, tags: (post.tags || '').split(/\s*,\s*/) } as Post)
    );
}
