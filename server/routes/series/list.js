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
        .readdirSync(seriePaths['A-M'])
        .filter(file => fs.statSync(path.join(seriePaths['A-M'], file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePaths['A-M'], file) })),
      ...fs
        .readdirSync(seriePaths['N-Z'])
        .filter(file => fs.statSync(path.join(seriePaths['N-Z'], file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePaths['N-Z'], file) }))
    ];

    return ctx.ok(series.filter(e => !e.name.startsWith('.')).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
