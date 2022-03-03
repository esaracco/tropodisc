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

// Get constants from .env file
export const {
  NODE_ENV: env,

  REACT_APP_CURRENCY: currency = '€',

  REACT_APP_DISCOGS_USER: user,
  REACT_APP_DISCOGS_TOKEN: token,

  REACT_APP_DISCOGS_FORMATS: formats,
  REACT_APP_DISCOGS_FIELD_PLACE: placeField,
  REACT_APP_DISCOGS_FIELD_PRICE: priceField,
  REACT_APP_DISCOGS_FIELD_STYLES: stylesField,
  REACT_APP_DISCOGS_FIELDS_REQUIRED: fieldsRequired,

  REACT_APP_SET_LEDS: setLeds,
  REACT_APP_LEDS_ARTISTS_COLOR: ledsArtistsColor = '0,0,1',
  REACT_APP_LEDS_STYLES_COLOR: ledsStylesColor = '0,1,0',
  REACT_APP_LEDS_ALBUM_COLOR: ledsAlbumColor = '1,0,0',
} = process.env;

const requiredFields = [];

// Check for required fields
if (!user) {
  requiredFields.push('DISCOGS_USER');
}
if (!token) {
  requiredFields.push('DISCOGS_TOKEN');
}
requiredFields.forEach((f)=>
  toast.error(i18n.t('The {{field}} REACT_APP environment variable is required!', {field: f}), {autoClose: false}));

// Check consistency
if (fieldsRequired === 'yes' && !(placeField && priceField && stylesField)) {
  toast.error(i18n.t('With the REACT_APP {{required}} environment variable set to "yes" you must at least set one of the following variables: {{place}}, {{price}} or {{styles}}!', {
    required: 'DISCOGS_FIELDS_REQUIRED',
    place: 'DISCOGS_FIELD_PLACE',
    price: 'DISCOGS_FIELD_PRICE',
    styles: 'DISCOGS_FIELD_STYLES',
  }), {autoClose: false});
}
