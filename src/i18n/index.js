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

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import FR from './fr.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        fr: {translations: FR},
      },
      fallbackLng: 'en',
      debug: false,

      // Have a common namespace used around the full app
      ns: ['translations'],
      defaultNS: 'translations',

      // We use content as keys
      keySeparator: false,
    });

export default i18n;
