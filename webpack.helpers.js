const handlebarsLayouts = require('handlebars-layouts');

const handlebarsContext = {};
function _handlebarsEqualHelper(name, value, options) {
  return handlebarsContext[name] === value ? options.fn(this) : options.inverse(this);
}

function _handlebarsVariablesHelper(name, options) {
  const content = options.fn(this);
  handlebarsContext[name] = content;
}

function registerHandlersHelpers(Handlebars) {
  Handlebars.registerHelper('equal', _handlebarsEqualHelper);
  Handlebars.registerHelper('set', _handlebarsVariablesHelper);
  handlebarsLayouts.register(Handlebars);
}

function _escapeForRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function makeDataReplacements(originalData) {
  const { replacements, ...data } = originalData;
  let dataAsString = JSON.stringify(data);
  Object.keys(replacements).map(key => {
    dataAsString = dataAsString.replace(new RegExp(_escapeForRegex(key), 'g'), replacements[key]);
  });
  return JSON.parse(dataAsString);
}

module.exports = {
  makeDataReplacements,
  registerHandlersHelpers,
};
