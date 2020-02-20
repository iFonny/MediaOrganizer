const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const moveFile = require('move-file');

const { BadRequest } = require('+lib/error');

/**
 * @api {post} /move Move file to plex film folder
 * @apiExample Example usage:
 *
 *     body:
 *     {
 *        filepath: '/Users/ifonny/Desktop/JDownloader/Films/Jojo.Rabbit.2019.MULTi.2160p.UHD.BluRay.x265-OohLaLa.mkv',
 *        name: 'Jojo Rabbit',
 *        year: 2019,
 *        lang: 'MULTI',
 *        UHD: true,
 *        overwrite: false (optional)
 *     }
 *
 * @apiSampleRequest /api/films/move
 */
router.post('/move', async ctx => {
  // Check body params
  const filepath = ctx.checkBody('filepath').notEmpty().value;
  const name = ctx
    .checkBody('name')
    .notEmpty()
    .trim().value;
  const year = ctx.checkBody('year').isInt().value;
  const lang = ctx
    .checkBody('lang')
    .notEmpty()
    .toUp().value;
  const UHD = ctx.checkBody('UHD').in([true, false]).value;
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

  const extension = path.extname(filepath);
  const filmFileName = `${name} (${year}) (${lang})${UHD ? ` (UHD)` : ''}${extension}`;

  if (overwrite || canMove(filmFileName)) {
    let fileCurrentPath = await moveToMovingFolder(filepath, filmFileName, overwrite);
    fileCurrentPath = await moveToFilmFolder(fileCurrentPath, filmFileName, overwrite);

    ctx.ok(fileCurrentPath);
  } else {
    console.log(`Can't move (already exist, try overwrite)`);
    return ctx.send(500, `Can't move (already exist, try overwrite)`);
  }
});

function canMove(filmFileName) {
  const jdlPath = __config.paths.jdownloader;
  const movingPath = jdlPath.root + jdlPath.moving + filmFileName;

  try {
    if (fs.existsSync(movingPath)) return false;
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const destinationFullPath = __config.paths.plex.films + filmFileName;

  try {
    if (fs.existsSync(destinationFullPath)) return false;
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return true;
}

// Move to 'Moving' folder
async function moveToMovingFolder(filepath, filmFileName, overwrite) {
  const jdlPath = __config.paths.jdownloader;
  const newFilepath = jdlPath.root + jdlPath.moving + filmFileName;

  await moveFile(filepath, newFilepath, { overwrite });
  console.log(`file '${filmFileName}' MOVED TO '${newFilepath}' (Moving folder)`);

  return newFilepath;
}

// Move to film folder in HDD
async function moveToFilmFolder(filepath, filmFileName, overwrite) {
  const destinationFullPath = __config.paths.plex.films + filmFileName;

  // Move to film folder in HDD
  moveFile(filepath, destinationFullPath, { overwrite });
  console.log(`MOVING '${filmFileName}' TO '${destinationFullPath}'...`);

  return destinationFullPath;
}

module.exports = router;
