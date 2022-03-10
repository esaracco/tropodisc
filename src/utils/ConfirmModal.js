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
import {Modal, Button} from 'react-bootstrap';

import './styles/ConfirmModal.css';

// COMPONENT ConfirmModal
const ConfirmModal = (props) => {
  const {children, action, show, setShow} = props;
  const [_] = useTranslation();

  // METHOD onHide()
  const onHide = () => setShow(false);

  // RENDER
  return (
    <Modal
      show={show}
      onHide={onHide}
      scrollable
      size="lg"
      centered
      contentClassName="ConfirmModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{_('Confirmation')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={action} variant="success">{_('Confirm')}</Button>
        <Button onClick={onHide} variant="secondary">{_('Cancel')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  action: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default ConfirmModal;
