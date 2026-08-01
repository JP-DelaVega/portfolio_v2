import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getInitialTheme, THEMES } from "./theme";

const themeSlice = createSlice({
  name: "theme",
  initialState: { value: getInitialTheme() },
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    },
    setTheme: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
  },
});
