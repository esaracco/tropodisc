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

// FUNCTION clearAllCaches()
export const clearAllCaches = () => {
  // Clear service worker caches
  ['album-covers'].forEach((cname) => {
    caches.open(cname).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((request, index, array) => cache.delete(request));
      });
    });
  });
  // Clear local cache
  localStorage.clear();
};

// HOOK useScrollbarWidth()
export const useScrollbarWidth = () => {
  const didCompute = React.useRef(false);
  const widthRef = React.useRef(0);

  if (didCompute.current) {
    return widthRef.current;
  }

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  didCompute.current = true;
  widthRef.current = scrollbarWidth;

  return scrollbarWidth;
};

const common = {
  setItem,
  getItem,
  removeItem,
  wakeLazyLoad,
  normalize,
  clearAllCaches,
  useScrollbarWidth,
};

export default common;
