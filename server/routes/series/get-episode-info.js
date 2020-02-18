const router = require('koa-router')();

const { BadRequest } = require('+lib/error');
const { getEpisodeInfo } = require('+lib/index');

/**
 * @api {get} /get-episode-info Get episode info (season/episode number, lang)
 * @apiParam (query string) {string} filename - ex: "Brooklyn.Nine-Nine.S06E15.MULTi.1080p.WEB.x264-CiELOS"
 * @apiSampleRequest /api/series/get-episode-info
 */
router.get('/get-episode-info', async ctx => {
  const filename = ctx
    .checkQuery('filename')
    .notEmpty()
    .trim()
    .toUp().value;

  if (ctx.errors) throw new BadRequest(ctx.errors);

  return ctx.ok(getEpisodeInfo(filename));
});

module.exports = router;
