import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  searchValue: "",
  searchData: [],
};
// const initialState = [];

export const searchReducer = createReducer(initialState, {
  setSearchDataShow: (state, action) => {
    return {
      ...state,
      searchData: action.payload,
    };
  },
  setSearchValue: (state, action) => {
    return {
      ...state,
      searchValue: action.payload,
    };
  },
});
