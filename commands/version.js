module.exports = function versionCommand() {
    const { version } = require('../package.json');
    console.log('Flux v' + version);
};
