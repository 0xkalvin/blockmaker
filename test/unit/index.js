const chai = require('chai');
chai.should();


const { createProject } = require('../../src/main');



describe('createProject method', function () {

  it('should work fine', function () {

    createProject({
      skipPrompts: true,
      template: "backend",
      language: "javascript",
      git: false,
      install: false
    })
      .then((resp) => resp.should.be.equal(true))

  });
  
});