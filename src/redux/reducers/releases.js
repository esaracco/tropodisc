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
import {setItem, removeItem} from '../../utils/common';

const initialState = {
  value: {},
};

export const releasesSlice = createSlice({
  name: 'releases',
  initialState,
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
      setItem('releases', state.value);
    },
    reset: (state) => {
      removeItem('releases');
      state.value = {};
    },
    update: (state, action) => {
      state.value[action.payload.instanceId] = action.payload.album;
      setItem('releases', state.value);
    },
  },
});

export const {set, update, reset} = releasesSlice.actions;

export default releasesSlice.reducer;
