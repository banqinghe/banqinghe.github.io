export type PostInfo = {
  title: string;
  filename: string;
  date: string;
  pathname: string;
  tags: string[];
  description?: string;
};

export type PostList = PostInfo[];
