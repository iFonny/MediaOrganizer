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
        .readdirSync(seriePaths['A-G'])
        .filter(file => fs.statSync(path.join(seriePaths['A-G'], file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePaths['A-G'], file) })),
      ...fs
        .readdirSync(seriePaths['H-Z'])
        .filter(file => fs.statSync(path.join(seriePaths['H-Z'], file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePaths['H-Z'], file) }))
    ];

    return ctx.ok(series.filter(e => !e.name.startsWith('.')).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
