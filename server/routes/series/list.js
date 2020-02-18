const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

const dirTree = require('directory-tree');

/**
 * @api {get} /list Get list of all series on plex media HDD
 * @apiParam (query string) {string} format - csv or json
 * @apiSampleRequest /api/series/list
 */
router.get('/list', async ctx => {
  const seriePaths = __config.paths.plex.series;

  try {
    let series = [];

    for (const seriePath of seriePaths) {
      const files = fs
        .readdirSync(seriePath)
        .filter(file => fs.statSync(path.join(seriePath, file)).isDirectory());

      series = [...series, ...files];
    }

    return ctx.ok(series.sort());
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
