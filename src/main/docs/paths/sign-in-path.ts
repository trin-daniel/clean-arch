export const signinPath = {
  post: {
    tags: ['SignIn'],
    summary: 'API de autenticação de úsuario',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signin'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      }
    }
  }
}
