import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = { session: null };

const sessionSlice = createSlice({
  name: "localSession",
  initialState,
  reducers: {
    updateSession: (state, action) => {
      state.session = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      state = action.payload;
    },
  },
});

export const sessionReducer = sessionSlice.reducer;

export const { updateSession } = sessionSlice.actions;
