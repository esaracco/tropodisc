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

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

import ButtonModal from './ButtonModal';

import './styles/HeaderButton.css';

// COMPONENT HeaderButton
const HeaderButton = (props) => {
  const {label, selected = [], mark = true} = props;
  const [modalShow, setModalShow] = useState(false);

  // RENDER
  return (
    <>
      <Button
        variant="warning"
        className="HeaderButton"
        onClick={() => setModalShow(true)}
      >
        {label}
        {mark && selected.length > 0 && <div className="selected-mark"></div>}
      </Button>
      <ButtonModal
        {...props}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

HeaderButton.propTypes = {
  label: PropTypes.string.isRequired,
  mark: PropTypes.bool,
  selected: PropTypes.array,
};

export default HeaderButton;
