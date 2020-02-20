const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * @api {get} /moving-list Get all moving files
 * @apiSampleRequest /api/files/moving-list
 */
router.get('/moving-list', async ctx => {
  const jdlPath = __config.paths.jdownloader;
  const movingPath = jdlPath.root + jdlPath.moving;

  try {
    let files = glob.sync(movingPath + '/**/*', { dot: true });

    files = files.map(file => ({
      name: path.basename(file),
      fullPath: file,
      path: file.replace(movingPath, ''),
      size: fs.statSync(file).size,
      extension: path.extname(file),
      type: fs.statSync(file).isDirectory() ? 'directory' : fs.statSync(file).isFile() ? 'file' : 'unknown',
      ctime: fs.statSync(file).ctime,
      numbersOfFiles: fs.statSync(file).isDirectory() ? fs.readdirSync(file).length : 0
    }));

    return ctx.ok(files);
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
