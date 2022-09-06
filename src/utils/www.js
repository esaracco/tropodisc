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

import {token} from './settings';

// FUNCTION _request()
const _request = async ({
  method = 'GET',
  provider = 'https://api.discogs.com',
  service,
  args,
}) => {
  const options = {
    method,
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'Authorization': `Discogs token=${token}`,
    },
  };
  let url = `${provider}/${service}`;

  switch (method) {
    case 'GET': url += args ? `?${args}`: ''; break;
    case 'POST': options.body = args ? JSON.stringify(args) : null; break;
    default:
  }

  const r = await fetch(url, options);

  if (r.ok) {
    const type = r.headers.get('content-type');
    return type && type.indexOf('application/json') > -1 ? r.json() : r;
  }

  throw new Error();
};

// FUNCTION get()
export const get = (props) => _request({...props, method: 'GET'});

// FUNCTION post()
export const post = (props) => _request({...props, method: 'POST'});

const www = {
  get,
  post,
};

export default www;
