const chai = require("chai");
const assert = require("chai").assert;
const chaiHttp = require("chai-http");
const app = require("../app.js");
var request = require("request");
var expect = require("chai").expect;

chai.should();
chai.use(chaiHttp);

it("Main page content", function(done) {
  request("http://localhost:5000", function(error, response, body) {
    expect(body).to.equal("Hello World");
    done();
  });
});
