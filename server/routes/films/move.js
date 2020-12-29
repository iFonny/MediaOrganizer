const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const moveFile = require('move-file');

const { BadRequest } = require('+lib/error');
const { getInfoListAsync, startCopyMoveAsync } = require('+lib/syno_async');

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
  const moveToHR = ctx.checkBody('moveToHR').in([true, false]).value;
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

  if (overwrite || (await canMoveSyno(filmFileName, moveToHR))) {
    let fileCurrentPath = await moveToMovingFolder(filepath, filmFileName, overwrite);

    try {
      fileCurrentPath = await moveToFilmFolderSyno(fileCurrentPath, filmFileName, overwrite, moveToHR);

      return ctx.ok(fileCurrentPath);
    } catch (error) {
      console.log(error);
      console.log(`Can't move (error CopyMove Synology)`);
      return ctx.send(500, `Can't move (error CopyMove Synology)`);
    }
  } else {
    console.log(`Can't move (already exist, try overwrite)`);
    return ctx.send(500, `Can't move (already exist, try overwrite)`);
  }
});

async function canMoveSyno(filmFileName, moveToHR) {
  const jdlPath = __config.syno.paths.jdownloader;
  const movingPath = jdlPath.root + jdlPath.moving + '/' + filmFileName; // Syno path

  try {
    const { files } = await getInfoListAsync({ path: movingPath });
    if (files[0].code != 408) return false;

    // eslint-disable-next-line no-empty
  } catch (e) {}

  const destinationFullPath = (moveToHR ? __config.syno.paths.plex.filmsHR : __config.syno.paths.plex.films) + '/' + filmFileName;

  try {
    const { files } = await getInfoListAsync({ path: destinationFullPath });
    if (files[0].code != 408) return false;

    // eslint-disable-next-line no-empty
  } catch (e) {}

  return true;
}

// Move to 'Moving' folder
async function moveToMovingFolder(filepath, filmFileName, overwrite) {
  const jdlPath = __config.syno.paths.jdownloader;
  const newFilepath = jdlPath.volume + jdlPath.root + jdlPath.moving + '/' + filmFileName;

  await moveFile(filepath, newFilepath, { overwrite });
  console.log(`file '${filmFileName}' MOVED TO '${newFilepath}' (Moving folder)`);

  return newFilepath;
}

// Move to film folder in HDD
async function moveToFilmFolderSyno(filepath, filmFileName, overwrite, moveToHR) {
  // Transform to have sharesd folder as root for synology
  const filepathSyno = filepath.replace(__config.syno.paths.jdownloader.volume, '');
  const filmsPath = moveToHR ? __config.syno.paths.plex.filmsHR : __config.syno.paths.plex.films;

  // Move to film folder in HDD
  const { taskid } = await startCopyMoveAsync({ path: filepathSyno, dest_folder_path: filmsPath, overwrite, remove_src: true });

  const destinationFullPath = filmsPath + '/' + filmFileName;
  console.log(`MOVING '${filmFileName}' TO '${destinationFullPath}'... (taskid: ${taskid})`);
  return destinationFullPath;
}

module.exports = router;
