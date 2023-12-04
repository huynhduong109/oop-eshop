// searchActions.js

export const setSearchDataShow = (data) => async (dispatch) => {
  dispatch({
    type: "setSearchDataShow",
    payload: data,
  });
  return data;
};
export const setSearchValue = (data) => async (dispatch) => {
  dispatch({
    type: "setSearchValue",
    payload: data,
  });
  return data;
};
