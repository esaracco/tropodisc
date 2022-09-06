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
import {useDispatch} from 'react-redux';

import {add, remove} from '../redux/reducers/selected';

import './styles/Checkbox.css';

// COMPONENT CheckBox
const Checkbox = ({stype, items, selected}) => {
  const dispatch = useDispatch();

  // METHOD onChange()
  const onChange = (e) => {
    const payload = {key: stype, value: e.target.value};

    dispatch(e.target.checked ? add(payload) : remove(payload));
  };

  // RENDER
  return (
    <div className="Checkbox">
      {items.map((item) => {
        return (
          <div key={item}>
            <label>
              <input
                type="checkbox"
                defaultChecked={selected.indexOf(item) > -1}
                value={item}
                onChange={onChange}
              />
              {item}
            </label>
          </div>
        );
      })}
    </div>
  );
};

Checkbox.propTypes = {
  stype: PropTypes.oneOf(['artists', 'formats', 'styles']).isRequired,
  items: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
};

export default Checkbox;
