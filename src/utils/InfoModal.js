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

// COMPONENT InfoModal
const InfoModal = ({title, children, show, setShow}) => {
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
    >
      <Modal.Header closeButton>
        <Modal.Title>{title || _('Information')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-justify">
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>{_('Close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

InfoModal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default InfoModal;
