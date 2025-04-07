const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

exports.postAceInit = (hookName, args, cb) => {

  let updatedPrefs = false;

  // Check if authorship colors preference exists
  if (padcookie.getPref('showAuthorshipColors') === undefined) {
    console.log('*** ep_default_colors_off: Setting showAuthorshipColors to false ***');
    padcookie.setPref('showAuthorshipColors', false);
    updatedPrefs = true;
  }

  // Compatibility check for older Etherpad versions that might use showAuthorColors
  if (padcookie.getPref('showAuthorColors') === undefined) {
     console.log('*** ep_default_colors_off: Setting showAuthorColors to false ***');
     padcookie.setPref('showAuthorColors', false);
     updatedPrefs = true;
  }

  // If we updated the prefs, try to force a UI update
  if (updatedPrefs) {
      console.log('*** ep_default_colors_off: Attempting UI refresh ***');
      try {
          // Get the pad context (assuming this hook runs within the pad iframe)
          const pad = require('ep_etherpad-lite/static/js/pad').pad;
          const padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
          const $ = require('ep_etherpad-lite/static/js/rjquery').$; // Get iframe's jQuery
          
          // Method 1: Call the function that handles view options
          if (pad && pad.changeViewOption) {
              console.log('*** ep_default_colors_off: Calling pad.changeViewOption ***');
              pad.changeViewOption('showAuthorColors', false);
          } else {
              console.warn('*** ep_default_colors_off: pad.changeViewOption not found ***');
          }

          // Method 2: Directly update the checkbox (found ID from pad_editor.ts)
          const checkbox = $('#options-colorscheck');
          if (checkbox.length) {
              console.log('*** ep_default_colors_off: Setting #options-colorscheck checkbox ***');
              checkbox.prop('checked', false);
          } else {
              console.warn('*** ep_default_colors_off: #options-colorscheck not found ***');
          }
          
          // Method 3: Explicitly call the function that updates ACE editor property (from pad_editor.ts)
          if (padeditor && padeditor.ace) {
              console.log('*** ep_default_colors_off: Calling padeditor.ace.setProperty ***');
              padeditor.ace.setProperty('showsauthorcolors', false);
          } else {
               console.warn('*** ep_default_colors_off: padeditor.ace not found ***');
          }

      } catch (e) {
          console.error('*** ep_default_colors_off: Error during UI refresh: ***', e);
      }
  }

  return cb();
}; 