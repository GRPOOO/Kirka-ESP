// ==UserScript==
// @name Kirka.IO RGB WALLS
// @version 4.2.0
// @description Wallhack, Kikra
// @author Jaguar
// @match *://kirka.io/*
// ==/UserScript==

(function() {
  let walls = false;
  let rainbow = false;
  let players = [];
  let intervalId;

  const toggleKey = 'F';
  const rainbowKey = 'R';

  function visible(el) {
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
  }

  function invisible(el) {
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
  }

  function toggle(el) {
    if (el.style.opacity === '0') {
      return visible(el);
    }
    invisible(el);
  }

  function visibleWalls(e) {
    e.alphaTest = 0.99;
    e.fog = false;
    e.depthTest = false;
    if (rainbow) {
      intervalId = setInterval(() => {
        e.color.setHex(Math.random() * 0xffffff);
      }, 50);
    }
  }

  function invisibleWalls(e) {
    clearInterval(intervalId);
    e.alphaTest = 1;
    e.fog = true;
    e.depthTest = true;
  }

  function setRainbowColor(e) {
    if (rainbow) {
      if (!e.colorBackup) {
        e.colorBackup = e.color.getHex();
      }
      intervalId = setInterval(() => {
        e.color.setHex(Math.random() * 0xffffff);
      }, 100);
    }
  }

  function resetColor(e) {
    clearInterval(intervalId);
    if (e.colorBackup) {
      e.color.setHex(e.colorBackup);
      delete e.colorBackup;
    }
  }

  function initKeyBindings() {
    window.addEventListener('keydown', (r) => {
      const focusedElem = document.querySelector(':focus') || document.activeElement;

      if (focusedElem.matches('.chat .input')) {
        return;
      }

      if (r.code === 'Key' + toggleKey.toUpperCase()) {
        r.preventDefault();
        walls = !walls;

        if (walls) {
          players.forEach(visibleWalls);
        } else {
          players.forEach(invisibleWalls);
        }
        console.log(`Walls ${walls ? 'enabled' : 'disabled'}.`);
      } else if (r.code === 'Key' + rainbowKey.toUpperCase()) {
        r.preventDefault();
        rainbow = !rainbow;

        if (rainbow) {
          players.forEach(setRainbowColor);
        } else {
          players.forEach(resetColor);
        }
        console.log(`Rainbow ${rainbow ? 'enabled' : 'disabled'}.`);
      }
    });
  }

  function initMaterial() {
    Object.defineProperty(Object.prototype, 'material', {
      set(value) {
        this._material = value;

        if (this._material && this._material.name && this._material.name.indexOf('player') !== -1) {
          players.push(value);

          if (walls) {
            visibleWalls(value);
          }
        }
      },

      get() {
        return this._material;
      }
    });
  }

  function init() {
    initKeyBindings();
    initMaterial();
  }

  init();
})();
