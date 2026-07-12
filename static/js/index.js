const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

const timesliderColorsOn = () =>
  !!(clientVars.ep_default_colors_off && clientVars.ep_default_colors_off.timesliderColorsOn);

const enableTimesliderColors = (iframe) => {
  if (iframe.dataset.defaultColorsOffBound === 'true') return;
  iframe.dataset.defaultColorsOffBound = 'true';

  const bind = () => {
    let doc;
    try {
      doc = iframe.contentDocument;
    } catch (_err) {
      return;
    }
    if (!doc) return;

    const inner = doc.getElementById('innerdocbody');
    const side = doc.getElementById('sidedivinner');
    if (!inner || !side) {
      if (iframe.isConnected) iframe.contentWindow.requestAnimationFrame(bind);
      return;
    }

    const apply = () => {
      if (!inner.classList.contains('authorColors')) inner.classList.add('authorColors');
      if (!side.classList.contains('authorColors')) side.classList.add('authorColors');
    };
    apply();
    new MutationObserver(apply).observe(inner, {attributes: true, attributeFilter: ['class']});
    new MutationObserver(apply).observe(side, {attributes: true, attributeFilter: ['class']});
  };

  iframe.addEventListener('load', bind);
  bind();
};

const findTimeslider = () => {
  if (!timesliderColorsOn()) return;
  const iframe = document.querySelector('#history-frame-mount iframe');
  if (iframe) enableTimesliderColors(iframe);
};

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

  if (timesliderColorsOn()) {
    findTimeslider();
    const mount = document.getElementById('history-frame-mount');
    if (mount) new MutationObserver(findTimeslider).observe(mount, {childList: true});
  }

  return cb();
};
