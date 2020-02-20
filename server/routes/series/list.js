const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
/**
 * @api {get} /list Get list of all series on plex media HDD
 * @apiSampleRequest /api/series/list
 */
router.get('/list', async ctx => {
  const seriePaths = __config.paths.plex.series;

  try {
    let series = [
      ...fs
        .readdirSync(seriePaths['A-O'])
        .filter(file => fs.statSync(path.join(seriePaths['A-O'], file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePaths['A-O'], file) })),
      ...fs
        .readdirSync(seriePaths['P-Z'])
        .filter(file => fs.statSync(path.join(seriePaths['P-Z'], file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePaths['P-Z'], file) }))
    ];

    return ctx.ok(series.sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
