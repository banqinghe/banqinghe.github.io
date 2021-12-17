import React, { useReducer } from 'react';
import postData from '../config/post-list.json';
import * as urls from '../config/adapter';

const postUrls: {[key: string]: string} = {};

Object.entries(urls).forEach(([key, value]) => {
  postUrls[key] = value;
});

export interface GlobalState {
  /**
   * 文章列表信息
   */
  postList: any[];
  
  /**
   * 当前文章序列数, 最近的博文序号为 0
   */
  currentIndex: number;
  
  /**
   * 博文链接合集
   */
  postUrls: {[key: string]: string};
}

export interface GlobalAction {
  type: string;
  payload: any;
}

const initialState = {
  postList: postData,
  postUrls,
  currentIndex: 0,
};

export const globalContext = React.createContext({state: initialState, dispatch: (value: GlobalAction) => {}});

function reducer(state: GlobalState, action: GlobalAction) {
  switch (action.type) {}
  return state;
}

export function GlobalProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <globalContext.Provider value={{state, dispatch}}>
      {props.children}
    </globalContext.Provider>
  );
}
