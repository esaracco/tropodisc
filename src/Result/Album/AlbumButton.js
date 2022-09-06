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

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Button} from 'react-bootstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCompactDisc} from '@fortawesome/free-solid-svg-icons';

import {set as setSelected} from '../../redux/reducers/selected';
import {normalize} from '../../utils/common.js';

import './styles/AlbumButton.css';

// COMPONENT AlbumButton
const AlbumButton = ({artist, closeModal}) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [_] = useTranslation();

  // METHOD onClick()
  const onClick = () => {
    dispatch(setSelected({key: 'artists', value: [artist]}));
    closeModal();
  };

  // EFFECT
  useEffect(() => {
    setCount(document.querySelectorAll(`.Album.${normalize(artist)}`).length);
  }, [artist]);

  // RENDER
  return (
    count > 1 &&
      <div className="AlbumButton">
        <Button
          size="sm"
          variant="primary"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faCompactDisc} /> <b>{count}</b> <span>{_('Albums')}</span>
        </Button>
      </div>
  );
};

AlbumButton.propTypes = {
  artist: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AlbumButton;
