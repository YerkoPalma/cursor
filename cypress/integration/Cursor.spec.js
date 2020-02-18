/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000')
  })

  it('Should render cursor', () => {
    cy.get('.cursor-wrapper').should('exist')
  })
})
