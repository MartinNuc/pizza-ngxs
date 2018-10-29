const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const app = new Koa();

let ingredients = [
  { id: 1, name: 'Garlic', price: 5 },
  { id: 2, name: 'Salt', price: 3 },
  { id: 3, name: 'Tomato', price: 8 },
  { id: 4, name: 'Ham', price: 12 }
];
let recipes = [];

const router = new Router();
router.get('/ingredients', async ctx => {
  ctx.body = ingredients;
});
router.put('/ingredients/:id', KoaBody(), async ctx => {
  const id = +ctx.params.id;
  const updatedItem = ctx.request.body;
  const index = ingredients.findIndex(i => i.id === id);
  if (index === -1) {
    ctx.status = 404;
  } else {
    ingredients[index] = updatedItem;
    ctx.body = updatedItem;
  }
});
router.post('/ingredients', KoaBody(), async ctx => {
  const newItem = ctx.request.body;
  newItem.id = Math.round(Math.random() * 10000 + 1);
  ingredients.push(newItem);
  ctx.body = newItem;
  ctx.status = 201;
});
router.delete('/ingredients/:id', async ctx => {
  const id = +ctx.params.id;
  ingredients = [...ingredients.filter(i => i.id !== id)];
  ctx.status = 202;
  ctx.body = {};
});

router.get('/recipes', async ctx => {
  ctx.body = recipes;
});
router.put('/recipes/:id', KoaBody(), async ctx => {
  const id = +ctx.params.id;
  const updatedItem = ctx.request.body;
  const index = recipes.findIndex(i => i.id === id);
  if (index === -1) {
    ctx.status = 404;
  } else {
    recipes[index] = updatedItem;
    ctx.body = updatedItem;
  }
});
router.post('/recipes', KoaBody(), async ctx => {
  const newItem = ctx.request.body;
  newItem.id = Math.round(Math.random() * 10000 + 1);
  recipes.push(newItem);
  ctx.body = newItem;
  ctx.status = 201;
});
router.delete('/recipes/:id', async ctx => {
  const id = +ctx.params.id;
  recipes = [...recipes.filter(i => i.id !== id)];
  ctx.status = 202;
  ctx.body = {};
});
app.use(router.routes());

app.listen(3000);
