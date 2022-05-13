import React, { useReducer } from 'react';
import {
  GlobalState,
  GlobalAction,
  ViewPostAction,
  UpdatePostListAction,
} from './types';

const initialState: GlobalState = {
  postList: [],
  postIndex: 0,
};

export const globalContext = React.createContext({
  state: initialState,
  dispatch: (value: GlobalAction) => {},
});

/**
 * 更新博文列表信息
 */
function updatePostListReducer(
  state: GlobalState,
  action: UpdatePostListAction
) {
  return {
    ...state,
    postList: action.payload.postList,
  };
}

/**
 * 进入博文页，改变 postIndex
 */
function viewPostReducer(state: GlobalState, action: ViewPostAction) {
  return {
    ...state,
    postIndex: action.payload.postIndex,
  };
}

function reducer(state: GlobalState, action: GlobalAction) {
  switch (action.type) {
    case 'viewPost':
      console.log(action);
      return viewPostReducer(state, action);
    case 'updatePostList':
      return updatePostListReducer(state, action);
    default:
      return state;
  }
}

export function GlobalProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </globalContext.Provider>
  );
}
