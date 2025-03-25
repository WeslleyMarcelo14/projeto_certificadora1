describe('template spec', () => {

class RegisterUser {
  elements = {
    registerBtn: () => cy.get('#unified-runner')
  }
}
  describe('User Registration', () => {
    const register = new RegisterUser()
    describe('I am on the registration page', () => {
      it('I am on the registration page', () => {
        cy.visit('/')
        cy.wait(1000)
        cy.get('button').contains('Faça login').click();
        // Precisa conectar com a api do google, porém cypress
        // não consegue conectar por conta do token, porém o login
        // ja foi verificado fazendo blackbox teste
      })  
    })
  })
})
