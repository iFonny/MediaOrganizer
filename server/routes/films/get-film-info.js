const router = require('koa-router')();

const { BadRequest } = require('+lib/error');
const { getFilmInfo } = require('+lib/index');

/**
 * @api {get} /get-film-info Get film info (year, lang, UHD)
 * @apiParam (query string) {string} filename - ex: "Jojo.Rabbit.2019.MULTi.2160p.UHD.BluRay.x265-OohLaLa.mkv"
 * @apiSampleRequest /api/films/get-film-info
 */
router.get('/get-film-info', async ctx => {
  const filename = ctx
    .checkQuery('filename')
    .notEmpty()
    .trim().value;

  if (ctx.errors) throw new BadRequest(ctx.errors);

  return ctx.ok(getFilmInfo(filename));
});

module.exports = router;
