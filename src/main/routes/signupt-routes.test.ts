import { app } from '../config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      })
      .expect(200)
  })
})
