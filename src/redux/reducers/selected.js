/*
  Copyright (C) 2022 Emmanuel Saracco
  This file is part of TropoDisc <https://github.com/esaracco/tropodisc>.

  TropoDisc is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  TropoDisc is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with TropoDisc.  If not, see <http://www.gnu.org/licenses/>.
*/

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  styles: [],
  artists: [],
  formats: [],
};

export const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    add: (state, action) => {
      state[action.payload.key] = state[action.payload.key].concat(
          action.payload.value,
      );
    },
    remove: (state, action) => {
      state[action.payload.key] = state[action.payload.key].filter(
          (item) => item !== action.payload.value,
      );
    },
    set: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    reset: (state, action) => {
      if (action.payload) {
        state[action.payload.key] = [];
      } else {
        state.styles = [];
        state.artists = [];
        state.formats = [];
      }
    },
  },
});

export const {add, remove, set, reset} = selectedSlice.actions;

export default selectedSlice.reducer;
