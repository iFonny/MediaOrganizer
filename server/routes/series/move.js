const router = require('koa-router')();
const path = require('path');
const moveFile = require('move-file');

const { BadRequest } = require('+lib/error');

/**
 * @api {get} /move Move file to serie season folder
 * @apiParam (query string) {string} format - csv or json
 *  * @apiExample Example usage:
 *
 *     body:
 *     {
 *        filepath: '/Users/ifonny/Desktop/JDownloader/Series/Brooklyn.Nine-Nine.S06E15.MULTi.1080p.WEB.x264-CiELOS.mkv',
 *        serie: 'Brooklyn Nine-Nine (2014)',
 *        season: 6,
 *        episode: 15,
 *        lang: 'MULTI'
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

  if (ctx.errors) throw new BadRequest(ctx.errors);

  const extension = path.extname(filepath);
  const seasonString = season.toString().length === 1 ? `S0${season}` : `S${season}`;
  const episodeString = episode.toString().length === 1 ? `E0${episode}` : `E${episode}`;
  const serieWithoutYear = serie.replace(/(\(\d{4}\))/gim, '').trim();
  const seasonName = `Saison ${season} (${lang})`;
  const episodeFileName = `${serieWithoutYear} ${seasonString}${episodeString}${extension}`;

  // Relative serie path to episode
  const serieFilePath = `${serie}/${seasonName}/${episodeFileName}`;

  let fileCurrentPath = await moveToMovingFolder(filepath, episodeFileName, serieFilePath);
  fileCurrentPath = await moveToSerieFolder(fileCurrentPath, serie, episodeFileName, serieFilePath);

  ctx.ok(fileCurrentPath);
});

// Move to 'Moving' folder
async function moveToMovingFolder(filepath, episodeFileName, serieFilePath) {
  const jdlPath = __config.paths.jdownloader;
  const newFilepath = jdlPath.root + jdlPath.moving + serieFilePath;
  await moveFile(filepath, newFilepath, { overwrite: false });
  console.log(`file '${episodeFileName}' MOVED TO '${newFilepath}' (Moving folder)`);

  return newFilepath;
}

// Move to serie folder in HDD
async function moveToSerieFolder(filepath, serie, episodeFileName, serieFilePath) {
  // Add path to HDD (en fonction de l'ordre alpha)
  const destinationFullPath = getSerieAlphaPath(serieFilePath, serie);

  // Move to serie folder in HDD
  await moveFile(filepath, destinationFullPath, { overwrite: false });
  console.log(`file '${episodeFileName}' MOVED TO '${destinationFullPath}'`);

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
