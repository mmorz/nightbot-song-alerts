describe('channel listing', () => {
  it('allows user to add and delete channels', () => {
    cy.visit('http://localhost:8080');
    cy.contains('Get notified when');

    cy.get('#username-field').type('bob_the_test_user_123');
    cy.get('#add-channel').type('channel_name{enter}').should('have.value', '');

    cy.contains('channel_name');
    cy.contains('delete').click();

    cy.contains('delete').should('not.exist');
  });
})
