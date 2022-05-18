import { atom } from 'recoil';
import { localStorageEffect } from './effect';
import { PostList } from '@/types';

const postListState = atom<PostList>({
  key: 'PostList',
  default: [],
  effects: [localStorageEffect<PostList>('postList')],
});

export { postListState };
