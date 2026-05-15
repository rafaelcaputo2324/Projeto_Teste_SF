/**
 * @jest-environment node
 */

const express = require('express');
const request = require('supertest');

const db = require('../../db');
const authRoutes = require('../../routes/authRoutes');
const productRoutes = require('../../routes/productRoutes');

function buildTestApp() {
  const app = express();

  app.use(express.json());
  app.use('/auth', authRoutes);
  app.use('/products', productRoutes);

  return app;
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(this);
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

describe('Integração de autenticação e cadastro de produtos', () => {
  const app = buildTestApp();
  const testId = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  const user = {
    name: 'Usuario Integracao',
    email: `usuario.integracao.${testId}@teste.com`,
    password: '123456',
  };
  const product = {
    name: `Produto Integracao ${testId}`,
    price: 199.9,
  };

  beforeAll(async () => {
    await runQuery('DELETE FROM users WHERE email = ?', [user.email]);
    await runQuery('DELETE FROM products WHERE name = ?', [product.name]);
  });

  afterAll(async () => {
    await runQuery('DELETE FROM users WHERE email = ?', [user.email]);
    await runQuery('DELETE FROM products WHERE name = ?', [product.name]);
    await closeDatabase();
  });

  it('faz login, pega o token e usa esse token para registrar um produto no banco', async () => {
    await request(app)
      .post('/auth/register')
      .send(user)
      .expect(200);

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    const { token } = loginResponse.body;

    expect(token).toEqual(expect.any(String));

    const createProductResponse = await request(app)
      .post('/products')
      .set('Authorization', token)
      .send(product)
      .expect(200);

    expect(createProductResponse.body).toEqual({
      message: 'Produto cadastrado',
    });

    const productListResponse = await request(app)
      .get('/products')
      .set('Authorization', token)
      .expect(200);

    expect(productListResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: product.name,
          price: product.price,
        }),
      ])
    );

    const storedProducts = await allQuery(
      'SELECT name, price FROM products WHERE name = ?',
      [product.name]
    );

    expect(storedProducts).toHaveLength(1);
    expect(storedProducts[0]).toEqual(product);
  });
});
