const router = require('koa-router')();

const dirTree = require('directory-tree');

/**
 * @api {get} /moving Get all moving files (tree)
 * @apiSampleRequest /api/jdl/moving
 */
router.get('/moving', async ctx => {
  const jdlPath = __config.paths.jdownloader;
  const path = jdlPath.root + jdlPath.moving;

  try {
    const tree = dirTree(path);

    return ctx.ok(tree);
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
