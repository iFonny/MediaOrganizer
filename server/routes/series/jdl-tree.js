const router = require('koa-router')();

const dirTree = require('directory-tree');

/**
 * @api {get} /jdl-tree Get all files in jdownloader series folder (tree)
 * @apiSampleRequest /api/series/jdl-tree
 */
router.get('/jdl-tree', async ctx => {
  const jdlPath = __config.paths.jdownloader;
  const path = jdlPath.root + jdlPath.series;

  try {
    const tree = dirTree(path);

    return ctx.ok(tree);
  } catch (error) {
    console.error(error);
    return ctx.send(500, error);
  }
});

module.exports = router;
