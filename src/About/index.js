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
import {Trans, useTranslation} from 'react-i18next';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {faSmile} from '@fortawesome/free-regular-svg-icons';

import {setLeds} from '../utils/settings';

import InfoModal from '../utils/InfoModal';

import packageJson from '../../package.json';

import './styles/About.css';

// COMPONENT About
const About = () => {
  const [showModal, setShowModal] = useState(false);
  const [_] = useTranslation();

  const desc = <Trans i18nKey="keyAboutMessage">
    <p>TropoDisc helps you manage your audio library from your <a href="https://www.discogs.com" rel="external">Discogs</a> collection. It is developed mainly for his personal use by <a href="https://www.esaracco.fr" rel="external">Emmanuel Saracco</a>, and made available under the GPL license.</p>
  </Trans>;
  const addon = <Trans i18nKey="keyAboutMessageAddon">
    <p style={{color: 'grey', fontStyle: 'italic', fontSize: '.9rem', lineHeight: '1rem'}}>It can also be used to highlight the location of albums via LED strips... but that&apos;s another story <FontAwesomeIcon icon={faSmile} /></p>
  </Trans>;

  // RENDER
  return (
    <>
      <InfoModal
        title={
          _('About TropoDisc v{{version}}', {version: packageJson.version})
        }
        show={showModal}
        setShow={setShowModal}
      >
        <>
          {desc}
          {setLeds !== 'yes' && addon}
        </>
      </InfoModal>
      <div
        className="About"
        onClick={() => setShowModal(true)}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </div>
    </>
  );
};

export default About;
