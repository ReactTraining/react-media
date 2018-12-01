'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-media.min.js');
} else {
  module.exports = require('./cjs/react-media.js');
}
