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
import {
  faInfoCircle,
  faHouse,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import {faSmile} from '@fortawesome/free-regular-svg-icons';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

import {setLeds} from '../utils/settings';

import InfoModal from '../utils/InfoModal';

import packageJson from '../../package.json';

import './styles/About.css';

// COMPONENT About
const About = () => {
  const [showModal, setShowModal] = useState(false);
  const [_] = useTranslation();

  const desc = <Trans i18nKey="keyAboutMessage">
    TropoDisc helps you manage your audio library from your <a href="https://www.discogs.com" rel="noopener noreferrer" target="_blank">Discogs</a> collection. It was developed mainly for the personal use of its author, and made available under the GPL license.
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
          <p>{desc}</p>
          <p className="text-center">
            <a
              href="https://tropodisc.esaracco.fr"
              rel="noopener noreferrer"
              target="_blank"
              className="btn btn-secondary btn-sm"
            >
              <FontAwesomeIcon icon={faHouse} size="xs" fixedWidth />
              {' '+_('Project')}
            </a>
            {' '}
            <a
              href="https://github.com/esaracco/tropodisc"
              rel="noopener noreferrer"
              target="_blank"
              className="btn btn-secondary btn-sm"
            >
              <FontAwesomeIcon icon={faGithub} fixedWidth />
              {' GitHub'}
            </a>
            {' '}
            <a
              href="https://www.esaracco.fr"
              rel="noopener noreferrer"
              target="_blank"
              className="btn btn-secondary btn-sm"
            >
              <FontAwesomeIcon icon={faUserEdit} fixedWidth size="xs" />
              {' '+_('Author')}
            </a>
          </p>
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
