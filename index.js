/* eslint-env node */
'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
  name: 'ember-cli-trumbowyg',

  included (app) {
    const trumbowygDirAbs = path.join(path.resolve('node_modules'), 'trumbowyg', 'dist');
    const trumbowygDirRel = path.join('node_modules', 'trumbowyg', 'dist');
    const languagesDirAbs = path.join(trumbowygDirAbs, 'langs');
    const languagesDirRel = path.join(trumbowygDirRel, 'langs');
    const pluginDirAbs = path.join(trumbowygDirAbs, 'plugins');
    const pluginDirRel = path.join(trumbowygDirRel, 'plugins');

    let plugins = fs.readdirSync(pluginDirAbs);
    let languages = fs.readdirSync(languagesDirAbs);

    app.import({
      development: path.join(trumbowygDirRel, 'trumbowyg.js'),
      production: path.join(trumbowygDirRel, 'trumbowyg.min.js')
    });

    app.import({
      development: path.join(trumbowygDirRel, 'ui', 'trumbowyg.css'),
      production: path.join(trumbowygDirRel, 'ui', 'trumbowyg.min.css')
    });

    app.import(path.join(trumbowygDirRel, 'ui', 'icons.svg'), {destDir: 'assets/ui'});

    if (app.options && app.options['ember-cli-trumbowyg']) {
      let trumbowygOptions = app.options['ember-cli-trumbowyg'];
      let pluginOptions = trumbowygOptions['plugins'];
      let langOptions = trumbowygOptions['langs'];

      if (pluginOptions) {
        plugins = pluginOptions;
      }

      if (langOptions) {
        languages = langOptions;
      }
    }

    plugins.forEach((plugin) => {
      const dirAbs = path.join(pluginDirAbs, plugin);
      const dirRel = path.join(pluginDirRel, plugin);

      const pluginName = `trumbowyg.${plugin}`;

      const pluginCssAbs = path.join(dirAbs, plugin, 'ui', `${pluginName}`);
      const pluginCssRel = path.join(dirRel, plugin, 'ui', `${pluginName}`);

      const minCssExits = fs.existsSync(`${pluginCssAbs}.min.css`);

      app.import({
        development: path.join(dirRel, `${pluginName}.js`),
        production: path.join(dirRel, `${pluginName}.min.js`)
      });

      if (fs.existsSync(`${pluginCssAbs}.css`)) {
        if (minCssExits) {
          app.import({
            development: `${pluginCssRel}.css`,
            production: `${pluginCssRel}.min.css`
          });
        } else {
          app.import(`${pluginCssRel}.css`);
        }
      } else if (minCssExits) {
        app.import(`${pluginCssRel}.min.css`);
      }
    });

    languages.forEach((lang) => {
      if (lang.indexOf('.js') === -1) {
        app.import(path.join(languagesDirRel, `${lang}.min.js`));
      } else {
        app.import(path.join(languagesDirRel, lang));
      }
    });
  }
};
