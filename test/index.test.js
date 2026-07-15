'use strict';

const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const loadPlugin = (settings) => {
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === 'ep_etherpad-lite/node/utils/Settings') return settings;
    return originalLoad.call(this, request, parent, isMain);
  };
  delete require.cache[require.resolve('../index')];
  const plugin = require('../index');
  Module._load = originalLoad;
  return plugin;
};

test('client variable defaults safely to false', () => {
  const plugin = loadPlugin({});
  plugin.clientVars('', {}, (vars) => assert.equal(vars.ep_default_colors_off.timesliderColorsOn, false));
});

test('only boolean true and exact string true enable timeslider colors', () => {
  for (const [value, expected] of [[true, true], ['true', true], [false, false], ['TRUE', false], [1, false]]) {
    const plugin = loadPlugin({ep_default_colors_off: {timesliderColorsOn: value}});
    plugin.clientVars('', {}, (vars) => assert.equal(vars.ep_default_colors_off.timesliderColorsOn, expected));
  }
});
