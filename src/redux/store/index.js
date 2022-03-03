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

import {configureStore} from '@reduxjs/toolkit';
import sortReducer from '../reducers/sort';
import releasesReducer from '../reducers/releases';
import stylesReducer from '../reducers/styles';
import artistsReducer from '../reducers/artists';
import formatsReducer from '../reducers/formats';
import selectedReducer from '../reducers/selected';

const store = configureStore({
  reducer: {
    sort: sortReducer,
    releases: releasesReducer,
    styles: stylesReducer,
    artists: artistsReducer,
    formats: formatsReducer,
    selected: selectedReducer,
  },
});

export default store;
