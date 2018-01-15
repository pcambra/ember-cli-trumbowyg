'use strict';

const join = require('path').join;
const fs = require('fs');

module.exports = {
  name: 'ember-cli-trumbowyg',

  included (app) {
    const trumbowygDirAbs = join(app.project.nodeModulesPath, 'trumbowyg', 'dist');
    const trumbowygDirRel = join('node_modules', 'trumbowyg', 'dist');
    const languagesDirAbs = join(trumbowygDirAbs, 'langs');
    const languagesDirRel = join(trumbowygDirRel, 'langs');
    const pluginDirAbs = join(trumbowygDirAbs, 'plugins');
    const pluginDirRel = join(trumbowygDirRel, 'plugins');

    let plugins = fs.readdirSync(pluginDirAbs);
    let languages = fs.readdirSync(languagesDirAbs);

    app.import({
      development: join(trumbowygDirRel, 'trumbowyg.js'),
      production: join(trumbowygDirRel, 'trumbowyg.min.js')
    });

    app.import({
      development: join(trumbowygDirRel, 'ui', 'trumbowyg.css'),
      production: join(trumbowygDirRel, 'ui', 'trumbowyg.min.css')
    });

    app.import(join(trumbowygDirRel, 'ui', 'icons.svg'), {destDir: 'assets/ui'});

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
      const dirAbs = join(pluginDirAbs, plugin);
      const dirRel = join(pluginDirRel, plugin);

      const pluginName = `trumbowyg.${plugin}`;

      const pluginCssAbs = join(dirAbs, plugin, 'ui', `${pluginName}`);
      const pluginCssRel = join(dirRel, plugin, 'ui', `${pluginName}`);

      const minCssExits = fs.existsSync(`${pluginCssAbs}.min.css`);

      app.import({
        development: join(dirRel, `${pluginName}.js`),
        production: join(dirRel, `${pluginName}.min.js`)
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
        app.import(join(languagesDirRel, `${lang}.min.js`));
      } else {
        app.import(join(languagesDirRel, lang));
      }
    });
  }
};
