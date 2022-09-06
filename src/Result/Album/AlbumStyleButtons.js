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

import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import Tagify from '@yaireo/tagify';

import {set as setSelected} from '../../redux/reducers/selected';

import {getItem} from '../../utils/common';

import '@yaireo/tagify/dist/tagify.css';
import './styles/AlbumStyleButtons.css';

// COMPONENT AlbumStyleButtons
const AlbumStyleButtons = ({items, closeModal}) => {
  const dispatch = useDispatch();
  const styles = useSelector((s) => s.styles.value);
  const [_] = useTranslation();
  const tags = useRef(null);
  const discogsFields = getItem('discogsFields') || {};

  // EFFECT
  useEffect(() => {
    if (!tags.current) {
      tags.current =
        new Tagify(document.querySelector('.AlbumStyleButtons'), {
          whitelist: styles,
          callbacks: {
            click: (e) => {
              dispatch(setSelected({key: 'artists', value: []}));
              dispatch(setSelected({
                key: 'styles',
                value: [e.detail.tag.textContent],
              }));
              closeModal();
            },
          },
        });
    }
  });

  // RENDER
  return (
    <>
      <input
        className="AlbumStyleButtons"
        readOnly={discogsFields.stylesId === undefined}
        placeholder={_('New style...')}
        defaultValue={JSON.stringify(items.map((item) => {
          return {value: item};
        }))} />
    </>
  );
};

AlbumStyleButtons.propTypes = {
  items: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AlbumStyleButtons;
