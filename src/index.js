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
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from './redux/store';

import i18n from './i18n';
import {toast} from 'react-toastify';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import {clearAllCaches} from './utils/common';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

serviceWorkerRegistration.register({
  onUpdate: (e) => {
    e.waiting.postMessage({type: 'SKIP_WAITING'});
    toast.info(i18n.t('Update available! The app will be reloaded and your local Discogs data will be rebuilt.'), {
      toastId: 'appUpdateAvailable',
      onClose: () => {
        window.stop();
        clearAllCaches();
        window.location.reload();
      },
    });
  },
});
