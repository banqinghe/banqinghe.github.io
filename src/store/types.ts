export interface PostListInfo {
  title: string;
  filename: string;
  date: string;
  pathname: string;
  tags: string[];
  description?: string;
}

export interface GlobalState {
  /**
   * 文章列表信息
   */
  postList: PostListInfo[];

  /**
   * 当前文章序列数, 最近的博文序号为 0
   */
  postIndex: number;
}

export type ViewPostAction = {
  type: 'viewPost';
  payload: { postIndex: number };
};

export type UpdatePostListAction = {
  type: 'updatePostList';
  payload: { postList: PostListInfo[] };
};

export type GlobalAction = ViewPostAction | UpdatePostListAction;
