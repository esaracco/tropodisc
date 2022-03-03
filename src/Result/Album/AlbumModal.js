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

import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Modal, Button, Table, Tab, Tabs, Form} from 'react-bootstrap';
import {toast} from 'react-toastify';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import ImageGallery from 'react-image-gallery';
import {Rating} from 'react-simple-star-rating';

import {set as setReleases} from '../../redux/reducers/releases';
import {set as setStyles} from '../../redux/reducers/styles';
import {set as setSelected} from '../../redux/reducers/selected';

import {
  currency,
  setLeds as confSetLeds,
  ledsStylesColor,
  ledsArtistsColor,
} from '../../utils/settings';

import discogsLogo from '../../assets/discogsLogo.png';

import ConfirmModal from '../../utils/ConfirmModal';
import AlbumStyleButtons from './AlbumStyleButtons';
import AlbumButton from './AlbumButton';

import {getItem} from '../../utils/common';
import {updateUserData, extractStyles} from '../../utils/discogs';
import {setLeds} from '../../utils/leds';

import 'react-image-gallery/styles/css/image-gallery.css';
import './styles/AlbumModal.css';

// COMPONENT AlbumModal
const AlbumModal = (props) => {
  const {modalData, setModalData} = props;
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const selectedStyles = useSelector((s) => s.selected.styles);
  const selectedArtists = useSelector((s) => s.selected.artists);
  const {
    show,
    maintitle,
    rating,
    cover,
    thumb,
    format,
    artist,
    place,
    country,
    price,
    styles,
    releaseid,
    instanceid,
    notes,
    tracklist,
  } = modalData;
  const [_] = useTranslation();
  const refIG = useRef(null);
  const fieldsId = getItem('discogsFields') || {};
  let discogsFieldsCount = 0;

  if (fieldsId.placeId) {
    ++discogsFieldsCount;
  }
  if (fieldsId.priceId) {
    ++discogsFieldsCount;
  }

  // METHOD handleIGClick()
  const handleIGClick = () => refIG.current.fullScreen();

  // METHOD getSaveActionInfo()
  const getSaveActionInfo = () => {
    modalData.styles = (() => {
      const r = [];
      document.querySelectorAll('.AlbumStyleButtons tag')
          .forEach((t) => r.push(t.getAttribute('value')));
      return r;
    })();
    const releases = getItem('releases');
    const release = releases[instanceid];
    const changes = {};

    if (rating !== release.rating) {
      changes.rating = rating;
    }
    if (place !== release.place) {
      changes.place = place;
    }
    if (price !== release.price) {
      changes.price = price;
    }
    if (fieldsId.stylesId &&
        modalData.styles.join(',') !== release.styles.join(',')) {
      changes.styles = modalData.styles;
    }

    return {releases, release, changes};
  };

  // METHOD onSave()
  const onSave = async () => {
    const {releases, release, changes} = getSaveActionInfo();

    onHideConfirm();

    try {
      await updateUserData(modalData, changes);
      if (changes.styles) {
        releases[instanceid].styles = changes.styles;
      }
      releases[instanceid] = {...release, place, price, rating};
      dispatch(setReleases(releases));

      if (changes.styles) {
        // Rebuild global styles list
        const allStyles = extractStyles(releases);
        dispatch(setStyles(allStyles));
        // Remove non-existent styles if previously selected
        dispatch(setSelected({
          key: 'styles',
          value: selectedStyles.filter((s) => allStyles.indexOf(s) > -1),
        }));
      }
    } catch (e) {
      console.error(e.message);
      toast.error(
          _(e.message) || _('An error occurred while using the Discogs API!'),
          {autoClose: false},
      );
    }
  };

  // METHOD onHideConfirm()
  const onHideConfirm = () => {
    turnOffLed();
    setShowConfirm(false);
    setModalData({...modalData, show: false});
  };

  // METHOD turnOffLed()
  const turnOffLed = () => {
    if (confSetLeds === 'yes') {
      const sStylesLen = selectedStyles.length;
      const sArtistsLen = selectedArtists.length;

      // Turn off the lights
      setLeds({
        place,
        noreset: !!(sStylesLen || sArtistsLen),
        color: sStylesLen ?
                 ledsStylesColor :
                 sArtistsLen ? ledsArtistsColor : '0,0,0'});
    }
  };

  // METHOD onHide()
  const onHide = () => {
    const {changes} = getSaveActionInfo();

    // If no changes, just close modal
    if (!Object.keys(changes).length) {
      turnOffLed();
      setModalData({...modalData, show: false});
      return;
    }

    // If changes, ask for confirmation before saving
    setShowConfirm(true);
  };

  // METHOD onRatingClick()
  const onRatingClick = (value) =>
    setModalData({...modalData, rating: value / 20});

  // METHOD onChange()
  const onChange = (e) => {
    const el = e.target;
    setModalData({...modalData, [el.dataset.field]: el.value});
  };

  // METHOD onReset()
  const onReset = () => setModalData({...modalData, rating: 0});

  // RENDER
  return (
    <>
      <ConfirmModal
        action={onSave}
        show={showConfirm}
        setShow={onHideConfirm}
      >
        {_('Save changes?')}
      </ConfirmModal>
      <Modal
        show={show}
        onHide={onHide}
        scrollable
        className="AlbumModal"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{maintitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered size="sm">
            <tbody>
              <tr>
                <th>
                  {_('Note')}{' '}
                  {rating ? (
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    className="reset"
                    onClick={onReset}
                  />
                ) : (
                  ''
                )}
                </th>
                <td className="rating">
                  <Rating
                    size="20"
                    onClick={onRatingClick}
                    ratingValue={rating * 20}
                  />{' '}
                </td>
                <td rowSpan={4 + discogsFieldsCount} className="modal-icon">
                  <ImageGallery
                    ref={refIG}
                    onClick={handleIGClick}
                    showPlayButton={false}
                    showThumbnails={false}
                    items={[{original: cover, thumbnail: thumb}]}
                  />
                  <AlbumButton closeModal={onHide} artist={artist} />
                </td>
              </tr>
              {fieldsId.placeId ?
                <tr>
                  <th>{_('Location')}</th>
                  <td className="place">
                    <Form.Control
                      type="text"
                      size="xs"
                      defaultValue={place}
                      placeholder={_('storage place')}
                      data-field="place"
                      onChange={onChange}
                    />
                  </td>
                </tr> : null
              }
              {fieldsId.priceId ?
                <tr>
                  <th>{_('Purchasing price')}</th>
                  <td>
                    <Form.Control
                      type="text"
                      className="price"
                      size="xs"
                      defaultValue={price}
                      placeholder={_('price')}
                      data-field="price"
                      onChange={onChange}
                    />{' '}
                    {currency || '€'}
                  </td>
                </tr> : null
              }
              <tr>
                <th>{_('Origine')}</th>
                <td>{country}</td>
              </tr>
              <tr>
                <th>{_('Style')}</th>
                <td>
                  <AlbumStyleButtons closeModal={onHide} items={styles} />
                </td>
              </tr>
              <tr>
                <th>{_('Format')}</th>
                <td>{format}</td>
              </tr>
              <tr>
                <td colSpan="3" align="center">
                  <a
                    href={`https://www.discogs.com/release/${releaseid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img alt="" src={discogsLogo} />
                  </a>
                </td>
              </tr>
            </tbody>
          </Table>
          {(notes || tracklist) &&
            <Tabs
              defaultActiveKey={
              tracklist ? 'album-tracks' : notes ? 'album-infos' : ''
              }
            >
              {notes &&
                <Tab
                  eventKey="album-infos"
                  title={_('Info')}
                  className="album-infos"
                >
                  {notes}
                </Tab>
              }
              {tracklist &&
                <Tab
                  eventKey="album-tracks"
                  title={_('Tracks')}
                  className="album-tracks"
                >
                  <ul>{tracklist}</ul>
                </Tab>
              }
            </Tabs>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>{_('Close')}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AlbumModal.propTypes = {
  modalData: PropTypes.object.isRequired,
  setModalData: PropTypes.func.isRequired,
};

export default AlbumModal;
