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

require('dotenv').config();
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const {unless} = require('express-unless');

const front = express.static(path.resolve(__dirname+'/../build'));
front.unless = unless;

const app = express();
const port = process.env.REACT_APP_LEDS_API_PORT || 10000;

// Serve all files as static, except for for "/api/*"
app.use('/', front.unless((req) => req.originalUrl.indexOf('/api/') > -1));

// ROUTE /setLeds
app.get('/api/setLeds', (req, res) => {
  const url = process.env.REACT_APP_AUDIOLIBRARY_URL +
                req.originalUrl.substr(4);

  (url.indexOf('https') > -1 ? https : http).get(url, () =>
    res.status(200).send())
      .on('socket', (s) => s.setTimeout(2000, () => s.destroy()))
      .on('error', (e) => {
        let code = 500;

        switch (e.code) {
          case 'EHOSTUNREACH':
          case 'ECONNRESET':
            code = 503;
            break;
          default:
        }
        console.log(`ERROR|${url}|${e.message}`);
        res.status(code).send(`ERROR|${url}|${e.message}`);
      });
});

app.listen(port, 'localhost', () => console.log(`Listening on port ${port}`));
