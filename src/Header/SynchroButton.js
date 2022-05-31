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
import {useTranslation} from 'react-i18next';
import {Button} from 'react-bootstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync} from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from '../utils/ConfirmModal';

import {clearAllCaches} from '../utils/common';

import './styles/SynchroButton.css';

// COMPONENT SynchroButton
const SynchroButton = (props) => {
  const {loading, isOnline} = props;
  const [showModal, setShowModal] = useState(false);
  const [_] = useTranslation();

  // METHOD onConfirm()
  const onConfirm = () => {
    clearAllCaches();
    window.location.reload();
  };

  // RENDER
  return (
    <>
      <ConfirmModal
        action={onConfirm}
        show={showModal}
        setShow={setShowModal}
      >
        {_('The full synchronization of your Discogs collection can take several minutes.')}
      </ConfirmModal>
      <Button
        className="HeaderButton"
        variant="secondary"
        onClick={() => setShowModal(true)}
        disabled={loading || !isOnline}
      >
        <FontAwesomeIcon icon={faSync} size="lg" spin={loading} />
      </Button>
    </>
  );
};

SynchroButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  isOnline: PropTypes.bool,
};

export default SynchroButton;
