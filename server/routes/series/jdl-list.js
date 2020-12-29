const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * @api {get} /jdl-list Get all files in jdownloader series folder
 * @apiSampleRequest /api/series/jdl-list
 */
router.get('/jdl-list', async ctx => {
  const jdlPath = __config.paths.jdownloader;
  const seriesPath = jdlPath.volume + jdlPath.root + jdlPath.series;

  try {
    let files = glob.sync(seriesPath + '/**/*', { dot: true });

    files = files.map(file => ({
      name: path.basename(file),
      fullPath: file,
      path: file.replace(seriesPath, ''),
      size: fs.statSync(file).size,
      extension: path.extname(file),
      type: fs.statSync(file).isDirectory() ? 'directory' : fs.statSync(file).isFile() ? 'file' : 'unknown',
      ctime: fs.statSync(file).ctime,
      numbersOfFiles: fs.statSync(file).isDirectory() ? fs.readdirSync(file).length : 0
    }));

    return ctx.ok(files.filter(e => !e.name.startsWith('.')).sort((a, b) => a.path.localeCompare(b.path)));
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
