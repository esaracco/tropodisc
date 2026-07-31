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
export const env = import.meta.env.MODE;

export const currency = import.meta.env.VITE_CURRENCY || '€';

export const user = import.meta.env.VITE_DISCOGS_USER;
export const token = import.meta.env.VITE_DISCOGS_TOKEN;

export const itemsPerRequest = import.meta.env.VITE_DISCOGS_API_ITEMS_PER_REQUEST || 250;
export const requestDelay = import.meta.env.VITE_DISCOGS_API_REQUEST_DELAY || 2;

export const formats = import.meta.env.VITE_DISCOGS_FORMATS || 'all';
export const placeField = import.meta.env.VITE_DISCOGS_FIELD_PLACE;
export const priceField = import.meta.env.VITE_DISCOGS_FIELD_PRICE;
export const stylesField = import.meta.env.VITE_DISCOGS_FIELD_STYLES;
export const fieldsRequired = import.meta.env.VITE_DISCOGS_FIELDS_REQUIRED || 'no';

export const setLeds = import.meta.env.VITE_SET_LEDS || 'no';
export const ledsArtistsColor = import.meta.env.VITE_LEDS_ARTISTS_COLOR || '0,0,25';
export const ledsStylesColor = import.meta.env.VITE_LEDS_STYLES_COLOR || '0,25,0';
export const ledsAlbumColor = import.meta.env.VITE_LEDS_ALBUM_COLOR || '25,0,0';

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
