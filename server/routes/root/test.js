const router = require('koa-router')();

const { BadRequest } = require('@lib/error');

router.get('/test', async ctx => {
  console.log('aloo');

  /*   const format = ctx
    .checkQuery('format')
    .default('json')
    .toLow()
    .in(['json', 'csv'], 'Only json and csv formats are accepted.').value;
 */
  if (ctx.errors) throw new BadRequest(ctx.errors);

  return ctx.ok('coucou');

  /* const products = await Product.find()
    .lean()
    .select(['-_id', '-__v']);

  switch (format) {
    case 'json':
      return ctx.ok(products);

    case 'csv':
      const csv = await json2csv.json2csvAsync(products);
      ctx.set({
        'Content-Type': 'text/csv',
        'Content-disposition': 'attachment; filename=crawled.csv'
      });
      ctx.statusCode = 200;
      return (ctx.body = csv);

    default:
      return ctx.ok(products);
  } */
});

module.exports = router;
