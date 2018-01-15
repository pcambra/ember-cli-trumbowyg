import Ember from 'ember';
const { get, set, getProperties } = Ember;
import DynamicAttributeBindings from '../-private/dynamic-attribute-bindings';

export default Ember.Component.extend(DynamicAttributeBindings, {
  attributeBindings: [],
  tagName: 'textarea',
  html: null,
  placeholder: null,
  disabled: null,
  options: null,
  change: null,
  init() {
    this.optionNames = [
      'prefix',
      'lang',
      'btns',
      'btnsDef',
      'semantic',
      'resetCss',
      'removeformatPasted',
      'autogrow',
      'svgPath'
    ];
    this._super(...arguments);
  },
  _updateDisabled(){
    if (typeof get(this, "disabled") === "boolean") {
      this.$().trumbowyg(get(this, 'disabled') ? 'disable' : 'enable');
    }
  },

  _renderTrumbowyg(){
    const options = get(this, 'optionNames')
      .filter(optionName => get(this, optionName) !== undefined )
      .reduce((options, optionName) => {
        options[optionName] = get(this, optionName);
        return options;
      }, {});

    this.$().attr("placeholder", get(this, "placeholder"));
    this.$().trumbowyg(options);
    this.$().trumbowyg('html', get(this, 'html'));

    set(this, 'options', options);

    this._updateDisabled();

    this.$().on('tbwchange', () => {
      if (get(this, 'change')) {
        get(this, 'change')(this.$().trumbowyg('html'));
      }
    });
  },

  _destroyTrumbowyg(){
    this.$().off('tbwchange');
    this.$().trumbowyg('destroy');
  },

  _isAttrChanged(attrName){
    return get(this, attrName) !== get(this, attrName);
  },

  didInsertElement(){
    this._renderTrumbowyg();
  },

  didUpdateAttrs() {
    const options = getProperties(this, get(this, 'optionNames').concat(['disabled', 'placeholder']));
    const optionsUpdated = get(this, 'optionNames').some(optionName => this._isAttrChanged(optionName));

    const disabledUpdated = this._isAttrChanged('disabled');
    const placeholderUpdated = this._isAttrChanged('placeholder');

    if (optionsUpdated || placeholderUpdated) {
      this._destroyTrumbowyg();
      this._renderTrumbowyg();
    }

    if (disabledUpdated) {
      this._updateDisabled();
    }

    set(this, 'options', options);
  },

  willDestroyElement(){
    this._destroyTrumbowyg();
  }
});
