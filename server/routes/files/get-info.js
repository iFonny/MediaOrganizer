const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

const { BadRequest } = require('+lib/error');

/**
 * @api {get} /get-info Get file/directory info
 * @apiParam (query string) {string} filepath - ex: '/Users/nthouch/Desktop/JDownloader/Series/Brooklyn.Nine-Nine.S06E15.MULTi.1080p.WEB.x264-CiELOS.mkv'
 * @apiSampleRequest /api/files/get-info
 */
router.get('/get-info', async ctx => {
  const filepath = ctx.checkQuery('filepath').notEmpty().value;
  if (ctx.errors) throw new BadRequest(ctx.errors);

  try {
    return ctx.ok({
      name: path.basename(filepath),
      fullPath: filepath,
      size: fs.statSync(filepath).size,
      extension: path.extname(filepath),
      type: fs.statSync(filepath).isDirectory() ? 'directory' : fs.statSync(filepath).isFile() ? 'file' : 'unknown',
      ctime: fs.statSync(filepath).ctime,
      numbersOfFiles: fs.statSync(filepath).isDirectory() ? fs.readdirSync(filepath).length : 0
    });
  } catch (error) {
    return ctx.send(400, `filepath doesn't exit`);
  }
});

module.exports = router;
