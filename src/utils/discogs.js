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

import * as Settings from './settings';

import {normalize, getItem, setItem} from './common';
import {get, post} from './www';

// FUNCTION _normalizeStyle()
const _normalizeStyle = (str) => {
  let r = str;

  switch (r.toLowerCase()) {
    // Folk
    case 'country':
      r = 'Folk';
      break;
    // Hip Hop
    case 'conscious':
      r = 'Hip Hop';
      break;
    // Latin
    case 'samba':
    case 'afro-cuban':
    case 'bossanova':
    case 'bossa nova':
      r = 'Latin';
      break;
    // Chanson
    case 'vocal':
    case 'ballad':
    case 'poetry':
      r = 'Chanson';
      break;
    // Jazz
    case 'fusion':
      r = 'Jazz';
      break;
    // Classical
    case 'romantic':
    case 'opera':
    case 'modern':
    case 'post-modern':
    case 'impressionist':
    case 'musique concrète':
      r = 'Classical';
      break;
    // Pop
    case 'trap':
    case 'indie pop':
    case 'dream pop':
    case 'downtempo':
    case 'disco':
    case 'europop':
    case 'beat':
    case 'synth-pop':
      r = 'Pop';
      break;
    // Electro
    case 'experimental':
    case 'idm':
    case 'leftfield':
    case 'trip hop':
    case 'breakbeat':
    case 'ambient':
    case 'trance':
    case 'techno':
      r = 'Electro';
      break;
    // Rock
    case 'post-punk':
    case 'electric blues':
    case 'aor':
      r = 'Rock';
      break;
    // Metal
    case 'hard rock':
    case 'thrash':
    case 'speed':
      r = 'Metal';
      break;
    default:
  }

  // Metal
  if (r.toLowerCase().indexOf('metal') > -1) {
    r = 'Metal';
  // Punk
  } else if (r.toLowerCase().indexOf('punk') > -1) {
    r = 'Punk';
  // Jazz
  } else if (r.toLowerCase().indexOf('jazz') > -1 ||
             r.toLowerCase().indexOf('bop') > -1) {
    r = 'Jazz';
  // Electro
  } else if (r.toLowerCase().indexOf('electro') > -1 ||
             r.toLowerCase().indexOf('house') > -1) {
    r = 'Electro';
  // Folk
  } else if (r.toLowerCase().indexOf('folk') > -1) {
    r = 'Folk';
  // Rock
  } else if (r.toLowerCase().indexOf('rock') > -1) {
    r = 'Rock';
  }

  return r;
};

// FUNCTION _extractUserData()
const _extractUserData = async (release) => {
  const info = release.basic_information;
  let {place, price, styles} = _getFieldsValue(release.notes);
  let haveFields = false;

  if (place || price || styles) {
    haveFields = true;
    // If the app must control audio library leds, check that album location
    // is a number.
    if (Settings.setLeds && place && Number.isNaN(place)) {
      const msg = `${info.title}, ${info.artists[0].name} - The album place (1st position of Discogs custom user field "${Settings.placeField}") must be numeric. Found: "${place}".`;
      toast.warning(msg, {autoClose: false});
      console.error(msg);
      console.dir(info);
    }
    if (styles) {
      styles = styles.split(',');
    }
  }

  // If no custom user styles, use those from Discogs
  if (!styles || !styles.length) {
    styles = {};
    if (info.styles && info.styles.length) {
      const tmp = info.styles.join(',');
      if (tmp.indexOf('Soundtrack') > -1) {
        styles['Soundtrack'] = true;
      } else if (tmp.indexOf('Hard Rock') > -1) {
        styles['Hard Rock'] = true;
      } else {
        styles[_normalizeStyle(info.styles[0])] = true;
      }
    }
    if (info.genres && info.genres.length) {
      styles[_normalizeStyle(info.genres[0])] = true;
    }
    styles = Object.keys(styles);
  }

  styles.sort();

  return {haveFields, place, price, styles};
};

// FUNCTION getFieldsId()
export const getFieldsId = async () => {
  const {user, placeField, priceField, stylesField} = Settings;

  if (!placeField && !priceField && !stylesField) {
    return {};
  }

  const fields = getItem('discogsFields') || {};

  // Get the id of each user custom discogs fields
  if (!Object.keys(fields).length) {
    const conf = Object.entries({
      'placeId': placeField,
      'priceId': priceField,
      'stylesId': stylesField,
    });
    const r = await get({service: `users/${user}/collection/fields`});

    for (let i = 0; i < r.fields.length; i++) {
      const {id, name} = r.fields[i];
      for (const [k, v] of conf) {
        if (name === v) {
          fields[k] = id;
        }
      }
    }

    setItem('discogsFields', fields);

    // Check Discogs user custom fields existence
    let error = '';
    for (const [k, v] of conf) {
      if (v && !fields[k]) {
        error += i18n.t('The Discogs user custom field "{{field}}" has not been found!', {field: v}) + ' ';
      }
    }
    if (error !== '') {
      throw new Error(error);
    }
  }

  return fields;
};

// FUNCTION _getFieldsValue()
const _getFieldsValue = (data) => {
  const fields = {};

  if (data) {
    const fieldsId = getItem('discogsFields') || {};

    if (Object.keys(fieldsId).length) {
      const {placeId, priceId, stylesId} = fieldsId;

      for (let i = 0; i < data.length; i++) {
        const {field_id: fieldId, value} = data[i];

        if (fieldId === placeId) {
          fields['place'] = value;
        } else if (fieldId === priceId) {
          fields['price'] = value;
        } else if (fieldId === stylesId) {
          fields['styles'] = value;
        }
      }
    }
  }

  return fields;
};

// FUNCTION getMaster()
export const getMaster = ({id}) => get({service: `masters/${id}`});

// FUNCTION getRelease()
export const getRelease = ({id}) => get({service: `releases/${id}`});

// FUNCTION updateUserData()
export const updateUserData = async (
    {folderid, releaseid, instanceid}, changes) => {
  const {rating, place, price, styles} = changes;
  const base = `users/${Settings.user}/collection/folders/${folderid}/releases/${releaseid}/instances/${instanceid}`;
  const {placeId, priceId, stylesId} = getItem('discogsFields') || {};

  // Rating
  if (rating !== undefined) {
    await post({service: base, args: {rating}});
  }
  // Place
  if (place !== undefined) {
    await post({service: `${base}/fields/${placeId}`, args: {value: place}});
  }
  // Price
  if (price !== undefined) {
    await post({service: `${base}/fields/${priceId}`, args: {value: price}});
  }
  // Styles
  if (styles !== undefined) {
    await post({service: `${base}/fields/${stylesId}`,
      args: {value: styles.join(',')}});
  }
};

// FUNCTION getCollection()
export const getCollection = async ({showMessage, setProgress}) => {
  const {formats, user, fieldsRequired, env} = Settings;
  const _formats = formats && formats !== 'all' ?
          formats
              .replace(/(\s*)?,(\s*)?/g, ',')
              .split(',') : null;
  const releases = getItem('releases') || {};
  const styles = getItem('styles') || [];

  // Fetch discogs collection if not alread in browser local cache
  if (!styles.length) {
    let progressVal = 0;

    showMessage();

    progressVal = 5;
    setProgress(progressVal);

    // Get discogs user's collection items and pages
    const stats = await get({
      service: `users/${user}/collection/folders/0/releases`,
      args: `page=1&per_page=1`,
    });

    const pages = Math.ceil(stats.pagination.items / 500);
    // const pages = 1;
    // console.log(stats);

    progressVal += 5;
    setProgress(progressVal);

    const inc = (100 - progressVal) / pages;

    for (let i = 1; i <= pages; i++) {
      const r = await get({
        service: `users/${user}/collection/folders/0/releases`,
        args: `page=${i}&per_page=500`,
        // args: `page=${i}&per_page=25`,
      });

      progressVal += inc;
      setProgress(progressVal);

      // Extract info from discogs result
      for (let j = 0; j < r.releases.length; j++) {
        const release = r.releases[j];
        const info = release.basic_information;
        const format = info.formats[0].name;

        if (!_formats || _formats.indexOf(format.toLowerCase()) > -1) {
          // Get user discogs custom data
          const userData = await _extractUserData(release);

          if (fieldsRequired === 'yes' && !userData.haveFields) {
            continue;
          }

          // Get artist name (we take only the first)
          const artist = info.artists[0].name.replace(/\(.*/, '');
          // Build main class, with artist name variation if available
          const mainCls = `${normalize(artist)} ${normalize(
              info.title,
          )} ${normalize(info.artists[0].anv)}`;

          // - Set default picture if none
          // - Do not stress Discogs API in dev mode
          if (env !== 'production' ||
              info.cover_image.indexOf('spacer.gif') > -1) {
            info.cover_image = '/logo300.png';
            info.thumb = '/logo192.png';
          }

          // Add release
          releases[release.instance_id] = {
            folderid: release.folder_id,
            masterid: info.master_id,
            releaseid: info.id,
            instanceid: release.instance_id,
            format: info.formats[0].name,
            added: release.date_added,
            artist: artist,
            cls: mainCls,
            year: info.year,
            title: info.title,
            cover: info.cover_image,
            thumb: info.thumb,
            place: userData.place,
            price: userData.price,
            styles: userData.styles,
            rating: release.rating,
            lpcount: parseInt(info.formats[0].qty),
          };
        }
      }
    }
  }

  return releases;
};

// FUNCTION extractStyles()
export const extractStyles = (releases = getItem('releases')) => {
  const styles = {};

  Object.values(releases).forEach((r) =>
    r.styles.forEach((s) => (styles[s] = true)));

  return Object.keys(styles).sort();
};

// Initialize Discogs user custom fields ids
getFieldsId().catch(
    (e) => toast.error(i18n.t(e.message), {autoClose: false}));

const discogs = {
  getCollection,
  getFieldsId,
  extractStyles,
  updateUserData,
};

export default discogs;
