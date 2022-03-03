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

import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {ProgressBar} from 'react-bootstrap';

import {
  set as setArtists,
  setV as setVArtists,
} from '../redux/reducers/artists';
import {
  set as setFormats,
  setV as setVFormats,
} from '../redux/reducers/formats';

import * as Settings from '../utils/settings';

import Album from './Album';
import AlbumModal from './Album/AlbumModal';
import {normalize, wakeLazyLoad} from '../utils/common';
import {setLeds} from '../utils/leds';

import './styles/Result.css';

const _setLeds = Settings.setLeds === 'yes';

// COMPONENT Result
const Result = (props) => {
  const {searchStr, loading, progress, setDisplayCount} = props;
  const dispatch = useDispatch();
  const [result, setResult] = useState([]);
  const [modalData, setModalData] = useState({
    show: false,
    releaseid: 0,
    instanceid: 0,
    folderid: 0,
    rating: null,
    tracklist: null,
    maintitle: null,
    notes: null,
    country: null,
    artist: null,
    format: null,
    thumb: null,
    cover: null,
    place: null,
    price: null,
    styles: [],
  });
  const selected = useSelector((s) => s.selected);
  const releases = useSelector((s) => s.releases.value);
  const sort = useSelector((s) => s.sort.value);
  const turnOffLeds = useRef(false);

  // METHOD calculateThumbWidth()
  const calculateThumbWidth = () => {
    const wW = window.innerWidth;
    // FIXME
    // const scrollbarWidth = window.innerWidth -
    //                        document.documentElement.clientWidth;
    const scrollbarWidth = 20;
    let itemsByCol = 8;

    if (wW < 300) {
      itemsByCol = 2;
    } else if (wW < 400) {
      itemsByCol = 3;
    } else if (wW < 600) {
      itemsByCol = 4;
    } else if (wW < 800) {
      itemsByCol = 5;
    } else if (wW < 1000) {
      itemsByCol = 6;
    } else if (wW < 1200) {
      itemsByCol = 7;
    }

    return (wW - scrollbarWidth - 1) / itemsByCol;
  };

  // EFFECT
  useEffect(() => {
    const keys = Object.keys(releases);
    const res = [];
    const artists = {};
    const fartists = {};
    const formats = {};
    const fformats = {};
    const search = normalize(searchStr);
    const places = [];
    const sStylesLen = selected.styles.length;
    const sArtistsLen = selected.artists.length;
    const sFormatsLen = selected.formats.length;

    // sort
    switch (sort) {
      case 'added':
        keys.sort((a, b) =>
          releases[a].added > releases[b].added ?
            -1 :
            releases[a].added < releases[b].added ?
            1 :
            0,
        );
        break;
      case 'rating':
        keys.sort((a, b) => releases[b].rating - releases[a].rating);
        break;
      case 'artist':
        keys.sort((a, b) =>
          releases[a].artist.localeCompare(releases[b].artist),
        );
        break;
      case 'year':
        keys.sort((a, b) => releases[a].year - releases[b].year);
        break;
      default:
    }

    keys
        .map((key) => releases[key])
        .forEach((r) => {
          artists[r.artist] = true;
          formats[r.format] = true;

          // Style
          if (sStylesLen &&
              !selected.styles.find((item) => r.styles.indexOf(item) > -1)) {
            return;
          }

          fartists[r.artist] = true;
          fformats[r.format] = true;

          // Artist
          if (sArtistsLen && selected.artists.indexOf(r.artist) === -1) {
            return;
          }

          // Format
          if (sFormatsLen && selected.formats.indexOf(r.format) === -1) {
            return;
          }

          // user search
          if (search !== '' && r.cls.indexOf(search) === -1) {
            return;
          }

          if (_setLeds && r.place && r.place.match(/^\d+$/)) {
            places.push(r.place);
          }

          res.push(r);
        });

    dispatch((sStylesLen || sArtistsLen) ?
      setVFormats(Object.keys(fformats).sort()) :
      setFormats(Object.keys(formats).sort()));
    dispatch(sStylesLen ?
      setVArtists(Object.keys(fartists).sort()) :
      setArtists(Object.keys(artists).sort()));

    setResult(res);
    setDisplayCount(res.length);

    if (_setLeds) {
      // Let there be light!
      if (sStylesLen || sArtistsLen || sFormatsLen) {
        turnOffLeds.current = true;
        setLeds({
          place: places,
          color: sStylesLen ?
                   Settings.ledsStylesColor :
                   sArtistsLen ? Settings.ledsArtistsColor : null,
        });
      // Turn off the light...
      } else if (turnOffLeds.current) {
        turnOffLeds.current = false;
        setLeds();
      }
    }

    // FIXME Needed to load album image after searching or filtering
    wakeLazyLoad();
  }, [
    searchStr,
    releases,
    selected,
    sort,
    dispatch,
    setDisplayCount,
  ]);

  const thumbWidth = calculateThumbWidth();
  const img = thumbWidth <= 150 ? 'thumb' : 'cover';

  // RENDER
  return (
    <>
      {modalData.artist &&
         <AlbumModal modalData={modalData} setModalData={setModalData} />}
      <div className="Result">
        <ProgressBar
          animated
          variant="danger"
          now={progress}
          style={{opacity: loading && !result.length ? 1 : 0}}
        />
        {result.map((item) => {
          return (
            <Album
              key={item.instanceid}
              setModalData={setModalData}
              instanceid={item.instanceid}
              cls={item.cls}
              img={item[img]}
              thumbWidth={thumbWidth}
              artist={item.artist}
              year={item.year}
              title={item.title} />
          );
        })}
      </div>
    </>
  );
};

Result.propTypes = {
  searchStr: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  setDisplayCount: PropTypes.func.isRequired,
};

export default Result;
