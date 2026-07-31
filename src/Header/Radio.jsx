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

import React from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';

import {set as setSort} from '../redux/reducers/sort';

import './styles/Radio.css';

// COMPONENT Radio
const Radio = ({items}) => {
  const dispatch = useDispatch();
  const sort = useSelector((s) => s.sort.value);

  const lastIndex = sort.lastIndexOf('_');
  const sortBy = lastIndex !== -1 ? sort.substring(0, lastIndex) : Object.keys(items)[0];
  const sortDirection = lastIndex !== -1 ? sort.substring(lastIndex + 1) : 'desc';

  const onSortByChange = (newSortBy) => {
    dispatch(setSort(`${newSortBy}_${sortDirection}`));
  };

  const toggleDirection = () => {
    const newDir = sortDirection === 'asc' ? 'desc' : 'asc';
    dispatch(setSort(`${sortBy}_${newDir}`));
  };

  // RENDER
  return (
    <div className="Radio">
      <div className="radio-setting">
        <div className="radio-sort-group">
          <select
            id="sort-select"
            className="radio-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            {Object.keys(items).map((item) => (
              <option key={item} value={item}>
                {items[item]}
              </option>
            ))}
          </select>
          <button
            className="radio-sort-dir"
            onClick={toggleDirection}
            aria-label={sortDirection === 'asc' ? 'Ordre décroissant' : 'Ordre croissant'}
            title={sortDirection === 'asc' ? 'Ordre décroissant' : 'Ordre croissant'}
          >
            {sortDirection === 'asc' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

Radio.propTypes = {
  items: PropTypes.object.isRequired,
};

export default Radio;
