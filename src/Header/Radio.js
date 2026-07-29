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

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';

import {set as setSort} from '../redux/reducers/sort';

import './styles/Radio.css';

// COMPONENT Radio
const Radio = ({items}) => {
  const dispatch = useDispatch();
  const sort = useSelector((s) => s.sort.value);

  // METHOD onClick()
  const onClick = (val) => dispatch(setSort(val));

  // RENDER
  return (
    <div className="Radio">
      {Object.keys(items).map((item) =>
        <div key={item} style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '15px', gap: '2px'}}>
            <FontAwesomeIcon
              icon={faChevronUp}
              style={{
                cursor: 'pointer',
                opacity: sort === `${item}_asc` ? 1 : 0.3,
                color: sort === `${item}_asc` ? 'var(--bs-warning)' : 'inherit',
              }}
              onClick={() => onClick(`${item}_asc`)}
            />
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{
                cursor: 'pointer',
                opacity: sort === `${item}_desc` ? 1 : 0.3,
                color: sort === `${item}_desc` ? 'var(--bs-warning)' : 'inherit',
              }}
              onClick={() => onClick(`${item}_desc`)}
            />
          </div>
          <span
            style={{
              cursor: 'pointer',
              fontWeight: sort.startsWith(item) ? 'bold' : 'normal',
            }}
            onClick={() => onClick(sort.startsWith(item) ? sort : `${item}_desc`)}
          >
            {items[item]}
          </span>
        </div>,
      )}
    </div>
  );
};

Radio.propTypes = {
  items: PropTypes.object.isRequired,
};

export default Radio;
