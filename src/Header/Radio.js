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
const Radio = (props) => {
  const {items} = props;
  const dispatch = useDispatch();
  const sort = useSelector((s) => s.sort.value);

  // METHOD onClick()
  const onClick = (e) => dispatch(setSort(e.target.value));

  // RENDER
  return (
    <div className="Radio">
      {Object.keys(items).map((item) => {
        return (
          <div key={item}>
            <label>
              <input
                type="radio"
                name="sort"
                defaultChecked={item === sort}
                value={item}
                onClick={onClick}
              />
              {items[item]}
            </label>
          </div>
        );
      })}
    </div>
  );
};

Radio.propTypes = {
  items: PropTypes.object.isRequired,
};

export default Radio;
