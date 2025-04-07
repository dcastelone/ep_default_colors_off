exports.eejsBlock_scripts = (hookName, args, cb) => {
  args.content += '<script src="../static/plugins/ep_default_colors_off/static/js/index.js"></script>';
  return cb();
};