import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import data from "~/data";

const initialState = { settingsData: data.settings };

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.settingsData = action.payload
        ? action.payload
        : initialState.settingsData;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      state.settingsData = action.payload;
    },
  },
});

export const settingsReducer = settingsSlice.reducer;

export const { updateSettings } = settingsSlice.actions;
