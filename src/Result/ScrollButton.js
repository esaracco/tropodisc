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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleUp} from '@fortawesome/free-solid-svg-icons';

import './styles/ScrollButton.css';

// COMPONENT ScrollButton
const ScrollButton = () => {
  const [display, setDisplay] = useState(false);

  // METHOD scrollToTop()
  const scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'});

  // EFFECT
  useEffect(() => {
    // Method _onScroll()
    const _onScroll = () => setDisplay(window.scrollY > 300);

    window.addEventListener('scroll', _onScroll);

    return () => window.removeEventListener('scroll', _onScroll);
  }, []);

  // RENDER
  return (
    <div className="ScrollButton" style={{opacity: display ? 1 : 0}}>
      <FontAwesomeIcon icon={faArrowCircleUp} onClick={scrollToTop} />
    </div>
  );
};

export default ScrollButton;
