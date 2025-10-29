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
import {useTranslation} from 'react-i18next';
import {Form, Button, InputGroup} from 'react-bootstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBroom} from '@fortawesome/free-solid-svg-icons';

// COMPONENT Search
const Search = ({searchStr, setSearchStr}) => {
  const [_] = useTranslation();

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
            placeholder={_('artist, album...')}
            autoFocus
          />
          <Button
            variant="secondary"
            onClick={onReset}
            className="clear"
            disabled={searchStr.trim() === ''}
          >
            <FontAwesomeIcon icon={faBroom} />
          </Button>
        </>
      </InputGroup>
    </div>
  );
};

Search.propTypes = {
  searchStr: PropTypes.string.isRequired,
  setSearchStr: PropTypes.func.isRequired,
};

export default Search;
