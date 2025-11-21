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
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {reset as resetSelected} from '../redux/reducers/selected';
import * as Leds from '../utils/leds';

// COMPONENT LedsButton
const LedsButton = ({setFromRuler, ledsTracker, setLedsTracker}) => {
  const [modalShow, setModalShow] = useState(false);
  const [rulerShown, setRulerShown] = useState(false);
  const dispatch = useDispatch();
  const selected = useSelector((s) => s.selected);
  const [_] = useTranslation();

  const setRulerState = (state) => {
    if (state === rulerShown) return;
    if (!rulerShown && (selected.styles.length || selected.artists.length)) {
      setFromRuler(true);
      dispatch(resetSelected());
    }
    Leds.setRuler({show: state});
    setRulerShown(state);
  };

  const handleReset = () => {
    if (!rulerShown && (selected.styles.length || selected.artists.length)) {
      dispatch(resetSelected());
    } else {
      Leds.setRuler({show: false});
      setRulerShown(false);
    }
  };

  const handleTracker = () => {
    Leds.setTracker({disable: ledsTracker});
    setLedsTracker(!ledsTracker);
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
        onExited={() => setRulerState(false)}
        scrollable
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{_('Leds control')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="d-flex justify-content-center">
            <div className="d-grid gap-2">
              <Button variant="success" onClick={() => setRulerState(!rulerShown)}>
                {rulerShown ? _('Turn off the ruler') : _('Turn on the ruler')}
              </Button>
              <Button variant="success" onClick={handleReset}>
                {_('Reset')}
              </Button>
              <Button variant="success" onClick={handleTracker}>
                {ledsTracker ? _('Disable tracker') : _('Enable tracker')}
              </Button>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>{_('Close')}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

LedsButton.propTypes = {
  setFromRuler: PropTypes.func.isRequired,
  ledsTracker: PropTypes.bool.isRequired,
  setLedsTracker: PropTypes.func.isRequired,
};

export default LedsButton;
