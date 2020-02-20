const router = require('koa-router')();
/**
 * @api {get} / Delete a file
 * @apiSampleRequest /api/config
 */
router.get('/', async ctx => {
  ctx.ok(__config);
});

module.exports = router;
