const request = require('supertest');
const app = require('../server');

describe('Teste de Login', () => {
  test('Deve realizar login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'teste@email.com',
        password: '123456'
      });

    expect(response.statusCode).toBe(200);
  });
});