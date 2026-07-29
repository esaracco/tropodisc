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
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import processString from 'react-process-string';
import {LazyLoadImage} from 'react-lazy-load-image-component';

import {update as updateReleases} from '../../redux/reducers/releases';
import {getMaster, getRelease} from '../../utils/discogs';

import * as Settings from '../../utils/settings';
import * as Leds from '../../utils/leds';

import './styles/Album.css';
import store from '../../redux/store';

// Queue to fetch missing years progressively in the background (max 1 req / 2s)
const backgroundQueue = {
  queue: [],
  processing: false,
  add(instanceId, fetchFn) {
    if (!this.queue.some((i) => i.instanceId === instanceId)) {
      this.queue.push({instanceId, fetchFn});
      this.process();
    }
  },
  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const {fetchFn} = this.queue.shift();
      try {
        await fetchFn();
      } catch (e) {
        console.error('Background fetch error:', e.message);
      }
      // Wait 1.5 seconds between requests to avoid Discogs API limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    this.processing = false;
  },
};

// COMPONENT Album
const Album = ({
  setModalData,
  cls,
  thumbWidth,
  instanceid,
  img,
  artist,
  year,
  title,
}) => {
  const dispatch = useDispatch();
  const [_] = useTranslation();
  const [loader, setLoader] = useState(false);
  const selectedStyles = useSelector((s) => s.selected.styles);
  const selectedArtists = useSelector((s) => s.selected.artists);

  // EFFECT: Queue fetching missing year in background
  useEffect(() => {
    if (!year || year === 0) {
      backgroundQueue.add(instanceid, async () => {
        // Fetch only if still missing
        const currentAlbum = store.getState().releases.value[instanceid];
        if (currentAlbum && currentAlbum.master === undefined && (!currentAlbum.year || currentAlbum.year === 0)) {
          // Unmount safe state update inside getReleaseData isn't strictly guaranteed,
          // but state updates on unmounted components don't throw warnings in React 18
          // and we only care about the redux dispatch anyway.
          await getReleaseData(instanceid);
        }
      });
    }
  }, [year, instanceid]);

  // METHOD getReleaseData()
  const getReleaseData = async (e) => {
    const instanceId = e && e.currentTarget ? e.currentTarget.dataset.instanceid : e;
    let album = store.getState().releases.value[instanceId];

    // Method _extractYear()
    const _extractYear = (notes) => {
      if (notes) {
        const m = notes.match(/Ⓟ\s*(1\d\d\d)|[^\d](1\d\d\d)[^\d]/s);
        if (m) {
          return Number(m[1] || m[2]);
        }
      }
    };

    // Get remote data if not yet in cache
    if (album.master === undefined) {
      setLoader(true);

      try {
        const master = album.masterid ?
                await getMaster({id: album.masterid}) : null;
        const {
          country,
          notes,
          tracklist,
        } = await getRelease({id: album.releaseid});
        let year = album.year;

        // Guess the year if not in the main release info
        // 1 - Try from the release notes
        if (!year) {
          year = _extractYear(notes);

          // 2 - Try from the master notes
          if (!year && master) {
            year = _extractYear(master.notes);

            // 3 - Finally use the year of the master
            if (!year && master.year) {
              year = master.year;
            }
          }
        }

        // Remove unused extra data from master
        if (master && master.tracklist) {
          master.tracklist.forEach((t) => delete (t.extraartists));
        }

        // Remove unused extra data from release
        if (tracklist) {
          tracklist.forEach((t) => delete (t.extraartists));
        }

        album = {
          ...album,
          year,
          master: master ? {
            notes: master.notes,
            tracklist: master.tracklist,
          } : null,
          country,
          notes,
          tracklist,
        };
        dispatch(updateReleases({instanceId, album}));
      } finally {
        setLoader(false);
      }
    }

    // Return consolidated album data (master + release)
    return album;
  };

  // METHOD getTracks()
  const getTracks = (tracklist) => {
    let tracks;
    tracklist.forEach((item) => {
      switch (item.type_) {
        case 'heading':
          if (item.title !== '') {
            tracks = (
              <>
                {tracks}
                <li className="heading">
                  <b>{item.title}</b>
                </li>
              </>
            );
          }
          break;
        case 'index':
          tracks = (
            <>
              {tracks}
              {getTracks(item.sub_tracks)}
            </>
          );
          break;
        case 'track':
          tracks = (
            <>
              {tracks}
              <li>
                {item.position} - {item.title}
                {item.duration && ` (${item.duration})`}
              </li>
            </>
          );
          break;
        default:
      }
    });

    return tracks;
  };

  // METHOD onClick()
  const onClick = (e) => {
    getReleaseData(e)
        .then((r) => {
          const master = r.master;
          const config = [
            {
              regex: /\[(a|l|m|r)=?([^\]]+)\]/g,
              fn: (k, r) => (
                <a
                  key={k}
                  href={
                    'https://www.discogs.com/' +
                  (r[1] === 'a' ?
                    'artist' :
                    r[1] === 'l' ?
                    'label' :
                    r[1] === 'm' ?
                    'master' :
                    'release') +
                  '/' +
                  r[2]
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {r[2]}
                </a>
              ),
            },
            {
              regex: /\[url=([^\]]+)]([^\]]+)\[\/url]/g,
              fn: (k, r) => (
                <a
                  key={k}
                  href={r[1]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {r[2]}
                </a>
              ),
            },
            {
              regex: /\r\n\r\n|\n\n/g,
              fn: (k) => <p key={k} />,
            },
            {
              regex: /\r\n|\n/g,
              fn: (k) => <br key={k} />,
            },
          ];

          // build notes
          const rNotes = r.notes ? r.notes.trim() : null;
          const mNotes = master && master.notes ? master.notes.trim() : null;
          let notes = null;

          if (rNotes && mNotes) {
            if (rNotes) {
              notes = (
                <>
                  {notes}
                  <div>
                    {_('This copy')} ({r.country}
                    {r.year ? ' ' + r.year : ''}) :
                  </div>
                  <div className="release" style={{whiteSpace: 'pre-wrap'}}>
                    {processString(config)(rNotes)}
                  </div>
                </>
              );
            }
            if (mNotes) {
              notes = (
                <>
                  {notes}
                  <div>{_('General informations')} :</div>
                  <div className="master" style={{whiteSpace: 'pre-wrap'}}>
                    {processString(config)(mNotes)}
                  </div>
                </>
              );
            }
          } else if (rNotes || mNotes) {
            notes = (
              <div style={{whiteSpace: 'pre-wrap'}}>
                {processString(config)(rNotes ? rNotes : mNotes ? mNotes : '')}
              </div>
            );
          }

          // Update modal values and show modal
          setModalData({
            show: true,
            releaseid: r.releaseid,
            instanceid: r.instanceid,
            folderid: r.folderid,
            rating: r.rating,
            tracklist: getTracks(
              r.tracklist.length ? r.tracklist :
                master && master.tracklist.length ? master.tracklist : [],
            ),
            maintitle: (
              <>
                <div className="artist">
                  {r.artist}
                  <br />
                  {r.year ? r.year + ' - ' : ''}
                  {r.title}
                </div>
                {r.lpcount > 1 ? (
                <span>{_('{{count}} discs', {count: r.lpcount})}</span>
              ) : (
                ''
              )}
              </>
            ),
            notes: notes,
            country: r.country,
            artist: r.artist,
            format: r.format,
            thumb: r.thumb,
            cover: r.cover,
            place: r.place,
            price: r.price,
            styles: r.styles,
          });

          // Let there be light!
          if (Settings.setLeds === 'yes') {
            Leds.setLeds({
              place: r.place,
              color: Settings.ledsAlbumColor,
              noreset: !!(selectedStyles.length || selectedArtists.length),
            });
          }
        })
        .catch((e) => {
          console.error(e.message);
          toast.error(
              _(e.message) ||
            _('An error occurred while using the Discogs API!'));
        });
  };

  const onError = () => {
    toast.error(
        <div>
          <b>{_('Image loading error')}</b>
          <br/>
          {_('Either there is a network problem, Discogs is overloaded or the image URLs have changed.')}
          <br/>
          <i>{_('If the problem persists, please re-sync your collection.')}</i>
        </div>,
        {autoClose: false, toastId: 'imageLoadingError'},
    );
  };

  // RENDER
  return <div
    className={`Album ${cls}`}
    onClick={onClick}
    style={{width: thumbWidth}}
    data-instanceid={instanceid}
  >
    <LazyLoadImage
      onError={onError}
      placeholderSrc={'/logo-big.png'}
      src={img}
      height={thumbWidth}
      width={thumbWidth} />
    {loader &&
      <div className="loader">
        <FontAwesomeIcon icon={faSync} spin />
      </div>
    }
    <div
      className="artist text-truncate"
      style={{width: thumbWidth}}
    >
      {artist}
      <br />
      {year ? `${year} - ` : ''}
      {title}
    </div>
  </div>;
};

Album.propTypes = {
  setModalData: PropTypes.func.isRequired,
  cls: PropTypes.string.isRequired,
  thumbWidth: PropTypes.number.isRequired,
  instanceid: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default Album;
