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
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import './styles/InfoBar.css';

// COMPONENT InfoBar
const InfoBar = (props) => {
  const {loading, displayCount} = props;
  const [info, setInfo] = useState('');
  const [noResult, setNoResult] = useState(false);
  const sort = useSelector((s) => s.sort.value);
  const styles = useSelector((s) => s.styles.value);
  const selected = useSelector((s) => s.selected);
  const [_] = useTranslation();

  // EFFECT
  useEffect(() => {
    setNoResult(false);

    // First synchro or fetching album's data for the first time
    if (loading) {
      setInfo(_('Synchronization in progress...'));
      // Search ok
    } else if (styles.length && displayCount) {
      // Method _getSortLabel()
      const _getSortLabel = (s) => {
        switch (s) {
          case 'added': return _('Date added');
          case 'artist': return _('Artist');
          case 'rating': return _('Note');
          case 'year': return _('Year');
          default:
        }
      };

      setInfo(
          <>
            <b>{displayCount}</b>{' '}
            {_(displayCount > 1 ? 'albums' : 'album')}{' '}
            <b>{selected.styles.join(', ')}</b>{' '}
            {selected.artists.length ? (
            <>
              {_('of')} <b>{selected.artists.join(', ')}</b>
            </>
          ) : (
            ''
          )}{' '}
            {_('by')} <b>{_getSortLabel(sort)}</b>
          </>,
      );
      // No result
    } else if (styles.length) {
      setNoResult(true);
      // Synchro failed
    } else if (!loading) {
      setInfo(_('Synchronization failed!'));
    }
  }, [
    loading,
    displayCount,
    selected.artists,
    selected.styles,
    sort,
    styles.length,
    _,
  ]);

  // RENDER
  return (
    !loading &&
      <div className={`InfoBar ${noResult ? 'noresult' : ''}`}>
        {noResult ? _('No result') : info}
      </div>
  );
};

InfoBar.propTypes = {
  loading: PropTypes.bool.isRequired,
  displayCount: PropTypes.number.isRequired,
};

export default InfoBar;
