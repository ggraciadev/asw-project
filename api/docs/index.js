const routes = require('./routes');
const basicInfo = require('./basicInfo');
const components = require('./components');
const tags = require('./tags');

module.exports = {
    ...basicInfo,
    ...components,
    ...tags,
    ...routes,
}