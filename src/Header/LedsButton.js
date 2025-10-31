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
import {Button, Container, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {reset as resetSelected} from '../redux/reducers/selected';
import {ruler} from '../utils/leds';

// COMPONENT LedsButton
const LedsButton = () => {
  const [modalShow, setModalShow] = useState(false);
  const [rulerShown, setRulerShown] = useState(false);
  const [_] = useTranslation();
  const dispatch = useDispatch();

  const handleRuler = () => {
    dispatch(resetSelected());
    ruler({show: !rulerShown});
    setRulerShown(!rulerShown);
  };

  const handleReset = () => {
    if (rulerShown) {
      ruler({show: false});
      setRulerShown(false);
    } else {
      dispatch(resetSelected());
    }
  };

  // RENDER
  return (
    <>
      <Button
        variant="success"
        className="HeaderButton"
        onClick={() => setModalShow(true)}
      >
        {_('Leds')}
      </Button>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        scrollable
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{_('Leds control')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="d-flex justify-content-center">
            <Button variant="success" onClick={handleRuler}>
              {rulerShown ? _('Turn off the ruler') : _('Turn on the ruler')}
            </Button>
            &nbsp;
            <Button variant="success" onClick={handleReset}>
              {_('Reset')}
            </Button>
            {/* <Button variant="danger">{_("Disable leds")}</Button> */}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>{_('Close')}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LedsButton;
