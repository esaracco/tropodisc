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
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Modal, Button} from 'react-bootstrap';

import {reset as resetSelected} from '../redux/reducers/selected';

import Checkbox from './Checkbox';
import Radio from './Radio';

import './styles/ButtonModal.css';

// COMPONENT ButtonModal
const ButtonModal = ({stype, label, type, content, onHide, show}) => {
  const dispatch = useDispatch();
  const [_] = useTranslation();
  const selected = useSelector((s) => s.selected) || [];

  // METHOD uncheckAll()
  const uncheckAll = (e) => {
    e.currentTarget.closest('.modal-body')
        .querySelectorAll(`input[type="checkbox"]`)
        .forEach((cb) => (cb.checked = false));
  };

  // METHOD onResetFormats()
  const onResetFormats = (e) => {
    dispatch(resetSelected({key: 'formats'}));
    if (stype === 'formats') {
      uncheckAll(e);
    }
  };

  // METHOD onResetArtists()
  const onResetArtists = (e) => {
    dispatch(resetSelected({key: 'artists'}));
    if (stype === 'artists') {
      uncheckAll(e);
    }
  };

  // METHOD onResetStyles()
  const onResetStyles = (e) => {
    dispatch(resetSelected({key: 'styles'}));
    if (stype === 'styles') {
      uncheckAll(e);
    }
  };

  // RENDER
  return (
    <Modal
      show={show}
      onHide={onHide}
      scrollable
      size="lg"
      className="ButtonModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{label}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === 'checkbox' && (
          <>
            <div className="cancel-box">
              {selected.formats.length > 0 && (
                <Button
                  variant="warning"
                  onClick={onResetFormats}
                >
                  {_('Formats')}
                  <span>&times;</span>
                </Button>
              )}
              {selected.artists.length > 0 && (
                <Button
                  variant="warning"
                  onClick={onResetArtists}
                >
                  {_('Artists')}
                  <span>&times;</span>
                </Button>
              )}
              {selected.styles.length > 0 && (
                <Button
                  variant="warning"
                  onClick={onResetStyles}
                >
                  {_('Styles')}
                  <span>&times;</span>
                </Button>
              )}
            </div>
            <Checkbox
              stype={stype}
              selected={selected[stype]}
              items={content} />
          </>
        )}
        {type === 'radio' && <Radio items={content} />}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>{_('Close')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

ButtonModal.propTypes = {
  stype: PropTypes.oneOf(['artists', 'formats', 'styles']),
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ButtonModal;
