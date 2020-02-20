const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const moveFile = require('move-file');

const { BadRequest } = require('+lib/error');

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
  const seasonName = `Saison ${season} (${lang})`;
  const episodeFileName = `${serieWithoutYear} ${seasonString}${episodeString}${extension}`;

  // Relative serie path to episode
  const serieFilePath = `${serie}/${seasonName}/${episodeFileName}`;

  if (overwrite || canMove(serieFilePath, serie)) {
    let fileCurrentPath = await moveToMovingFolder(filepath, episodeFileName, serieFilePath, overwrite);
    fileCurrentPath = await moveToSerieFolder(fileCurrentPath, serie, episodeFileName, serieFilePath, overwrite);

    ctx.ok(fileCurrentPath);
  } else {
    console.log(`Can't move (already exist, try overwrite)`);
    return ctx.send(500, `Can't move (already exist, try overwrite)`);
  }
});

function canMove(serieFilePath, serie) {
  const jdlPath = __config.paths.jdownloader;
  const movingPath = jdlPath.root + jdlPath.moving + serieFilePath;

  try {
    if (fs.existsSync(movingPath)) return false;
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const destinationFullPath = getSerieAlphaPath(serieFilePath, serie);

  try {
    if (fs.existsSync(destinationFullPath)) return false;
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return true;
}

// Move to 'Moving' folder
async function moveToMovingFolder(filepath, episodeFileName, serieFilePath, overwrite) {
  const jdlPath = __config.paths.jdownloader;
  const newFilepath = jdlPath.root + jdlPath.moving + serieFilePath;

  await moveFile(filepath, newFilepath, { overwrite });
  console.log(`file '${episodeFileName}' MOVED TO '${newFilepath}' (Moving folder)`);

  return newFilepath;
}

// Move to serie folder in HDD
async function moveToSerieFolder(filepath, serie, episodeFileName, serieFilePath, overwrite) {
  // Add path to HDD (en fonction de l'ordre alpha)
  const destinationFullPath = getSerieAlphaPath(serieFilePath, serie);

  // Move to serie folder in HDD
  moveFile(filepath, destinationFullPath, { overwrite });
  console.log(`MOVING '${episodeFileName}' TO '${destinationFullPath}'...`);

  return destinationFullPath;
}

// Add path to HDD (alpha)
function getSerieAlphaPath(serieFilePath, serie) {
  const seriePath = __config.paths.plex.series;
  const serieFirstChar = serie.charAt(0).toLowerCase();

  if (serieFirstChar.match(/[p-z]/i)) return `${seriePath['P-Z']}${serieFilePath}`;
  else return `${seriePath['A-O']}${serieFilePath}`;
}

module.exports = router;
