const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const moveFile = require('move-file');

const { BadRequest } = require('+lib/error');
const { getInfoListAsync, startCopyMoveAsync, createFolderAsync } = require('+lib/syno_async');

/**
 * @api {post} /move Move file to serie season folder
 * @apiExample Example usage:
 *
 *     body:
 *     {
 *        filepath: '/Users/ifonny/Desktop/JDownloader/Series/Brooklyn.Nine-Nine.S06E15.MULTi.1080p.WEB.x264-CiELOS.mkv',
 *        serie: 'Brooklyn Nine-Nine (2014)',
 *        season: 6,
 *        episode: 15,
 *        lang: 'MULTI',
 *        overwrite: 'false' (optional)
 *     }
 *
 * @apiSampleRequest /api/series/move
 */
router.post('/move', async ctx => {
  // Check body params
  const filepath = ctx.checkBody('filepath').notEmpty().value;
  const serie = ctx
    .checkBody('serie')
    .notEmpty()
    .trim().value;
  const season = ctx.checkBody('season').isInt().value;
  const episode = ctx.checkBody('episode').isInt().value;
  const lang = ctx.checkBody('lang').notEmpty().value;
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
  const seasonString = season.toString().length === 1 ? `S0${season}` : `S${season}`;
  const episodeString = episode.toString().length === 1 ? `E0${episode}` : `E${episode}`;
  const serieWithoutYear = serie.replace(/(\(\d{4}\))/gim, '').trim();
  const seasonName = season === 0 ? 'Specials' : `Saison ${season} (${lang})`;
  const episodeFileName = `${serieWithoutYear} ${seasonString}${episodeString}${extension}`;

  // Relative serie path to episode
  const serieFilePath = `/${serie}/${seasonName}/${episodeFileName}`;

  if (overwrite || (await canMoveSyno(serieFilePath, serie))) {
    let fileCurrentPath = await moveToMovingFolder(filepath, episodeFileName, serieFilePath, overwrite);

    try {
      fileCurrentPath = await moveToSerieFolderSyno(fileCurrentPath, serie, episodeFileName, seasonName, overwrite);

      return ctx.ok(fileCurrentPath);
    } catch (error) {
      console.log(error);
      console.log(`Can't move (error CopyMove Synology)`);

      // If fail, move the file back to the original place
      await moveFile(fileCurrentPath, filepath);

      return ctx.send(500, `Can't move (error CopyMove Synology)`);
    }
  } else {
    console.log(`Can't move (already exist, try overwrite)`);
    return ctx.send(500, `Can't move (already exist, try overwrite)`);
  }
});

async function canMoveSyno(serieFilePath, serie) {
  const jdlPath = __config.paths.jdownloader;
  const movingPath = jdlPath.root + jdlPath.moving + serieFilePath; // Syno path

  try {
    const { files } = await getInfoListAsync({ path: movingPath });
    if (files[0].code != 408) return false;

    // eslint-disable-next-line no-empty
  } catch (e) {}

  const destinationFullPathSyno = getSerieAlphaPathSyno(serie) + serieFilePath;

  try {
    const { files } = await getInfoListAsync({ path: destinationFullPathSyno });
    if (files[0].code != 408) return false;

    // eslint-disable-next-line no-empty
  } catch (e) {}

  return true;
}

// Move to 'Moving' folder
async function moveToMovingFolder(filepath, episodeFileName, serieFilePath, overwrite) {
  const jdlPath = __config.paths.jdownloader;
  const newFilepath = jdlPath.volume + jdlPath.root + jdlPath.moving + serieFilePath;

  await moveFile(filepath, newFilepath, { overwrite });
  console.log(`file '${episodeFileName}' MOVED TO '${newFilepath}' (Moving folder)`);

  return newFilepath;
}

// Move to serie folder in HDD
async function moveToSerieFolderSyno(filepath, serie, episodeFileName, seasonName, overwrite) {
  // Transform to have shared folder as root for synology
  const filepathSyno = filepath.replace(__config.paths.jdownloader.volume, '');

  // Add path to HDD (en fonction de l'ordre alpha)
  const destSerieFolderSyno = `${getSerieAlphaPathSyno(serie)}/${serie}`;
  const destSerieSeasonFolderSyno = `${destSerieFolderSyno}/${seasonName}`;

  // Create folder if doesn't exist
  await createFolderAsync({ folder_path: destSerieFolderSyno, force_parent: true, name: seasonName });

  // Move to film folder in HDD
  const { taskid } = await startCopyMoveAsync({ path: filepathSyno, dest_folder_path: destSerieSeasonFolderSyno, overwrite, remove_src: true });

  const destinationFullPath = `${destSerieSeasonFolderSyno}/${episodeFileName}`;
  console.log(`MOVING '${episodeFileName}' TO '${destinationFullPath}'... (taskid: ${taskid})`);
  return destinationFullPath;
}

// Add path to HDD (alpha)
function getSerieAlphaPathSyno(serie) {
  const seriePath = __config.paths.plex.series;
  const serieFirstChar = serie.charAt(0).toLowerCase();

  if (serieFirstChar.match(/[a-f]/i)) return seriePath['A-F'];
  else if (serieFirstChar.match(/[g-s]/i)) return seriePath['G-S'];
  else return seriePath['T-Z'];
}

module.exports = router;
