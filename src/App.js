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

import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';
import {ToastContainer, toast} from 'react-toastify';

import {set as setReleases} from './redux/reducers/releases';
import {set as setStyles} from './redux/reducers/styles';

import Header from './Header';
import About from './About';
import Result from './Result';
import ScrollButton from './Result/ScrollButton';
import InfoModal from './utils/InfoModal';

import {getItem, setItem, wakeLazyLoad} from './utils/common';
import {getCollection, extractStyles} from './utils/discogs';

import packageJson from '../package.json';

import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

// COMPONENT App
const App = () => {
  const dispatch = useDispatch();
  const [_] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [progress, setProgress] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [showNewRelease, setShowNewRelease] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  // METHOD reloadApp()
  const reloadApp = () => {
    localStorage.clear();
    setItem('version', packageJson.version);
    window.location.reload();
  };

  // EFFECT 1
  useEffect(() => {
    const version = getItem('version');
    const meta = document.querySelector('meta[name="description"]');

    // Reload app if version has changed
    if (version && version !== packageJson.version) {
      setShowNewRelease(true);
    } else if (!version) {
      setItem('version', packageJson.version);
    }

    // Not for test mode
    if (process.env.NODE_ENV !== 'test') {
      // Update html tag lang attribute
      document.documentElement.lang = i18n.language;
      // Update meta content tag
      meta.setAttribute('content', _(meta.getAttribute('content')));
      // Update document title
      document.title = `TropoDisc - ${_('A Discogs audio library manager')}`;
    }
  }, [_]);

  // EFFECT 2
  useEffect(() => {
    let resizeTimeout = 0;

    // Method _resize()
    const _resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        forceUpdate();

        // FIXME Needed to load album image after resizing screen
        wakeLazyLoad();
      }, 250);
    };

    window.addEventListener('resize', _resize);

    return () => window.removeEventListener('resize', _resize);
  }, [forceUpdate]);

  // EFFECT 3
  useEffect(() => {
    toast.dismiss();
    setLoading(true);
    // Get user collection from Discogs
    getCollection({
      setProgress,
      showMessage: () =>
        toast.info(_('Full synchronization of Discogs data may take several minutes...')),
    })
        .then((releases) => {
          dispatch(setReleases(releases));
          dispatch(setStyles(extractStyles(releases)));
        })
        .catch((e) => {
          console.error(e.message);
          toast.error(_(e.message) || _('An error occurred while using the Discogs API!'), {autoClose: false});
        })
        .finally(() => {
          setLoading(false);
        });
  }, [_, dispatch]);

  // RENDER
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Header
        searchStr={searchStr}
        setSearchStr={setSearchStr}
        loading={loading}
        displayCount={displayCount} />
      <About />
      <Result
        searchStr={searchStr}
        loading={loading}
        progress={progress}
        setDisplayCount={setDisplayCount} />
      <ScrollButton />
      <InfoModal
        title={_('A new release available!')}
        show={showNewRelease}
        setShow={reloadApp}
      >
        {_('The app will be reloaded and your local Discogs data will be rebuilt.')}
      </InfoModal>
    </>
  );
};

export default App;
