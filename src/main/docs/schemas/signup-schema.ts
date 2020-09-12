export const signupSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    confirmation: {
      type: 'string',
    },
  },
  required: ['name', 'email', 'password', 'confirmation'],
}
