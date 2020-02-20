const router = require('koa-router')();
const path = require('path');
const fs = require('fs');

const { BadRequest } = require('+lib/error');

/**
 * @api {post} /rename Rename file or directory
 * @apiExample Example usage:
 *
 *     body:
 *     {
 *        filepath: '/Users/ifonny/Desktop/JDownloader/Moving/Jojo.Rabbit.2019.MULTi.2160p.UHD.BluRay.x265-OohLaLa.mkv',
 *        newName: 'Jojo.Rabbit',
 *     }
 *
 * @apiSampleRequest /api/files/rename
 */
router.post('/rename', async ctx => {
  // Check body params
  const filepath = ctx.checkBody('filepath').notEmpty().value;
  const newName = ctx.checkBody('newName').notEmpty().value;
  if (ctx.errors) throw new BadRequest(ctx.errors);

  try {
    if (fs.existsSync(filepath)) {
      const directoryPath = path.parse(filepath).dir;
      const newFullPath = path.join(directoryPath, newName);

      fs.renameSync(filepath, newFullPath);

      ctx.ok(newFullPath);
    } else return ctx.send(400, `filepath doesn't exit`);
  } catch (e) {
    return ctx.send(400, `filepath doesn't exit`);
  }
});

module.exports = router;
