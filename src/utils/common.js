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

// FUNCTION setItem()
export const setItem = (name, value) =>
  localStorage.setItem(name, JSON.stringify(value));

// FUNCTION getItem()
export const getItem = (name) =>
  JSON.parse(localStorage.getItem(name));

// FUNCTION removeItem()
export const removeItem = (name) =>
  localStorage.removeItem(name);

// FUNCTION wakeLazyLoad()
export const wakeLazyLoad = () =>
  window.requestAnimationFrame(() =>
    window.dispatchEvent(new CustomEvent('scroll')));

// FUNCTION normalize()
export const normalize = (str) => {
  return str
      .replace(/[\s,\-"'()<>./?!+*=\\&]+/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
};

const common = {
  setItem,
  getItem,
  removeItem,
  wakeLazyLoad,
  normalize,
};

export default common;
