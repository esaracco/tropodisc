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
import {Form, InputGroup} from 'react-bootstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';

import './styles/Search.css';

// COMPONENT Search
const Search = ({placeholder, searchStr, setSearchStr, style}) => {
  // METHOD onChange()
  const onChange = (e) => setSearchStr(e.target.value);

  // METHOD onReset()
  const onReset = (e) => {
    setSearchStr('');
    e.currentTarget.parentNode.querySelector('input').focus();
  };

  // RENDER
  return (
    <div className="Search">
      <InputGroup>
        <>
          <Form.Control
            type="text"
            onChange={onChange}
            value={searchStr}
            placeholder={placeholder}
            autoFocus
            style={{borderRadius: '5px'}}
          />
          <FontAwesomeIcon icon={faClose} size="sm" onClick={onReset}
            style={{
              ...style,
              marginTop: '11px',
              zIndex: 5,
              cursor: 'pointer',
              visibility: searchStr !== '' ? 'visible' : 'hidden'}}
          />
        </>
      </InputGroup>
    </div>
  );
};

Search.propTypes = {
  placeholder: PropTypes.string,
  searchStr: PropTypes.string.isRequired,
  setSearchStr: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default Search;
