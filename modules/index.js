/* eslint-env node */
import Media from './Media'
import MediaMock from './MediaMock'

// TODO: Remove in the next major release.
Media.Media = Media
Media.MediaMock = MediaMock

module.exports = Media
