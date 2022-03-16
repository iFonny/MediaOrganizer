const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
/**
 * @api {get} /list Get list of all series on plex media HDD
 * @apiSampleRequest /api/series/list
 */
router.get('/list', async ctx => {
  const seriePaths = __config.paths.plex.series;
  const seriePath_1 = seriePaths['volumeA-L'] + seriePaths['A-L'];
  const seriePath_2 = seriePaths['volumeM-S'] + seriePaths['M-S'];
  const seriePath_3 = seriePaths['volumeT-Z'] + seriePaths['T-Z'];

  try {
    let series = [
      ...fs
        .readdirSync(seriePath_1)
        .filter(file => fs.statSync(path.join(seriePath_1, file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePath_1, file) })),
      ...fs
        .readdirSync(seriePath_2)
        .filter(file => fs.statSync(path.join(seriePath_2, file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePath_2, file) })),
      ...fs
        .readdirSync(seriePath_3)
        .filter(file => fs.statSync(path.join(seriePath_3, file)).isDirectory())
        .map(file => ({ name: file, fullPath: path.join(seriePath_3, file) }))
    ];

    return ctx.ok(series.filter(e => !e.name.startsWith('.')).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
