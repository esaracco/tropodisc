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

import i18n from '../i18n';
import {toast} from 'react-toastify';
import {get} from './www';

// FUNCTION setLeds()
export const setLeds = (props = {}) => {
  const {place, color, noreset = false} = props;
  get({
    provider: '',
    service: 'api/setLeds',
    args: (place && color) ?
      `leds=${Array.isArray(place) ?
        place.join(',') :
          place}&color=${color}&noreset=${Number(noreset)}` : undefined,
  }).catch((e) => {
    console.error(e.message);
    toast.warning(i18n.t('Unable to reach the audio library web server!'));
  });
};

const leds = {
  setLeds,
};

export default leds;
