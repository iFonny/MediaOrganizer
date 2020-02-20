const router = require('koa-router')();
const path = require('path');
var readdir = require('recursive-readdir');

/**
 * @api {get} /list Get list of all films on plex media HDD
 * @apiSampleRequest /api/films/list
 */
router.get('/list', async ctx => {
  const filmPath = __config.paths.plex.films;

  try {
    let files = await readdir(filmPath);

    files = files.map(filepath => ({ name: path.basename(filepath), fullPath: filepath }));

    return ctx.ok(files.filter(e => !e.name.startsWith('.')).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
