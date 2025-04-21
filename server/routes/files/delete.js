const router = require('koa-router')();
const { BadRequest } = require('+lib/error');
const fs = require('fs');
const rimraf = require('rimraf');
/**
 * @api {delete} /delete Delete a file
 * @apiExample Example usage:
 *
 *     body:
 *     {
 *        filepath: '/Users/nthouch/Desktop/JDownloader/Series/Brooklyn.Nine-Nine.S06E15.MULTi.1080p.WEB.x264-CiELOS.mkv',
 *     }
 * @apiSampleRequest /api/files/delete
 */
router.delete('/delete', async ctx => {
  // Check body params
  const filepath = ctx.checkBody('filepath').notEmpty().value;
  const force = ctx
    .checkBody('force')
    .default(false)
    .in([true, false]).value;
  if (ctx.errors) throw new BadRequest(ctx.errors);

  try {
    if (force) rimraf.sync(filepath, { disableGlob: true });
    else fs.unlinkSync(filepath);

    return ctx.ok();
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
