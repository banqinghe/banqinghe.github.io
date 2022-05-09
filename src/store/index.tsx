import React, { useReducer } from 'react';
import postData from '@/config/post-list.json';

interface PostListInfo {
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

interface GlobalAction {
  type: string;
  payload: any;
}

interface ViewPostAction extends GlobalAction {
  payload: { postIndex: number };
}

const initialState: GlobalState = {
  postList: postData,
  postIndex: 0,
};

export const globalContext = React.createContext({
  state: initialState,
  dispatch: (value: GlobalAction) => {},
});

/** 进入博文页，改变 postIndex */
function viewPostReducer(state: GlobalState, action: ViewPostAction) {
  return {
    ...state,
    postIndex: action.payload.postIndex,
  };
}

function reducer(state: GlobalState, action: GlobalAction) {
  switch (action.type) {
    case 'viewPost':
      return viewPostReducer(state, action);
  }
  return state;
}

export function GlobalProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </globalContext.Provider>
  );
}
