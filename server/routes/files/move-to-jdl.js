const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const moveFile = require('move-file');

const { BadRequest } = require('+lib/error');

/**
 * @api {post} /move-to-jdl Move file to jdl films or series
 * @apiExample Example usage:
 *
 *     body:
 *     {
 *        filepath: '/Users/ifonny/Desktop/JDownloader/Moving/Jojo.Rabbit.2019.MULTi.2160p.UHD.BluRay.x265-OohLaLa.mkv',
 *        destination: 'films',
 *        overwrite: false (optional)
 *     }
 *
 * @apiSampleRequest /api/files/move-to-jdl
 */
router.post('/move-to-jdl', async ctx => {
  // Check body params
  const filepath = ctx.checkBody('filepath').notEmpty().value;
  const destination = ctx.checkBody('destination').in(['series', 'films']).value;
  const overwrite = ctx
    .checkBody('overwrite')
    .default(false)
    .in([true, false]).value;
  if (ctx.errors) throw new BadRequest(ctx.errors);

  try {
    if (!fs.statSync(filepath).isFile()) return ctx.send(400, 'filepath is not a file');
  } catch (error) {
    return ctx.send(400, `filepath doesn't exit`);
  }

  const filename = path.basename(filepath);

  const jdlPath = __config.paths.jdownloader;
  const jdlSeriePath = jdlPath.root + jdlPath.series + filename;
  const jdlFilmsPath = jdlPath.root + jdlPath.films + filename;
  const jdlDestinationPath = destination === 'series' ? jdlSeriePath : destination === 'films' ? jdlFilmsPath : null;

  if (jdlDestinationPath && (overwrite || canMove(jdlDestinationPath))) {
    await moveFile(filepath, jdlDestinationPath, { overwrite });
    console.log(`file '${filename}' MOVED TO '${jdlDestinationPath}' (Moving folder)`);

    ctx.ok(jdlDestinationPath);
  } else {
    console.log(`Can't move (already exist, try overwrite)`);
    return ctx.send(500, `Can't move (already exist, try overwrite)`);
  }
});

function canMove(destinationFullPath) {
  try {
    if (fs.existsSync(destinationFullPath)) return false;
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return true;
}

module.exports = router;
