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
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {formats} from '../utils/settings';

import ResetButton from './ResetButton';
import HeaderButton from './HeaderButton';
import Search from './Search';
import SynchroButton from './SynchroButton';
import InfoBar from './InfoBar';

import './styles/Header.css';

const _displayFormats = !formats || (formats && formats.indexOf(',') > -1);

// COMPONENT Header
const Header = (props) => {
  const styles = useSelector((s) => s.styles.value);
  const artists = useSelector((s) => s.artists.value);
  const formats= useSelector((s) => s.formats.value);
  const selected = useSelector((s) => s.selected);
  const [_] = useTranslation();

  // RENDER
  return (
    <>
      <div className="Header">
        <div>
          <ResetButton />
          <HeaderButton
            label={_('Styles')}
            type="checkbox"
            stype="styles"
            selected={selected.styles}
            content={styles}
          />
          <HeaderButton
            label={_('Artists')}
            type="checkbox"
            stype="artists"
            selected={selected.artists}
            content={artists}
          />
          {_displayFormats &&
            <HeaderButton
              label={_('Formats')}
              type="checkbox"
              stype="formats"
              selected={selected.formats}
              content={formats}
            />
          }
          <HeaderButton
            label={_('Sort')}
            type="radio"
            mark={false}
            content={{
              added: _('Date added'),
              artist: _('Artist'),
              rating: _('Note'),
              year: _('Year'),
            }}
          />
        </div>
        <div>
          <Search {...props} />
          <SynchroButton {...props} />
        </div>
      </div>
      <InfoBar {...props} />
    </>
  );
};

Header.propTypes = {
  searchStr: PropTypes.string.isRequired,
  setSearchStr: PropTypes.func.isRequired,
};

export default Header;
