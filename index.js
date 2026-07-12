'use strict';

const settingsModule = require('ep_etherpad-lite/node/utils/Settings');
const settings = settingsModule.default || settingsModule;

const isEnabled = (value) => value === true || value === 'true';

exports.clientVars = (_hookName, _args, cb) => cb({
  ep_default_colors_off: {
    timesliderColorsOn: isEnabled(
        settings.ep_default_colors_off && settings.ep_default_colors_off.timesliderColorsOn),
  },
});
