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
import {useSelector, useDispatch} from 'react-redux';
import {Button} from 'react-bootstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBroom} from '@fortawesome/free-solid-svg-icons';

import {reset as resetSelected} from '../redux/reducers/selected';

import './styles/ResetButton.css';

// COMPONENT ResetButton
const ResetButton = () => {
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const selected = useSelector((s) => s.selected);

  // EFFECT
  useEffect(() => {
    setDisplay(!!(selected.styles.length ||
                  selected.artists.length ||
                  selected.formats.length));
  }, [selected]);

  // RENDER
  return (
    display &&
      <Button
        variant="secondary"
        size="sm"
        className="HeaderButton"
        onClick={() => dispatch(resetSelected())}
      >
        <FontAwesomeIcon icon={faBroom} />
      </Button>
  );
};

export default ResetButton;
