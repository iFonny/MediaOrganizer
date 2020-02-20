const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * @api {get} /jdl-list Get all files in jdownloader films folder
 * @apiSampleRequest /api/films/jdl-list
 */
router.get('/jdl-list', async ctx => {
  const jdlPath = __config.paths.jdownloader;
  const filmsPath = jdlPath.root + jdlPath.films;

  try {
    let files = glob.sync(filmsPath + '/**/*', { dot: true });

    files = files.map(file => ({
      name: path.basename(file),
      fullPath: file,
      path: file.replace(filmsPath, ''),
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
