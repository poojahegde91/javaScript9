// Test Case for Assignment9.
const expect = require("chai").expect;
const should = require('should');
const sinon = require("sinon");
const fs = require("fs");
const readline = require("readline");

const index = require("../index");

describe("Test the ", function() {

  it("fs should be call stat", function(done) {
    let stub = sinon.spy(fs, "stat");
    index.exec();
    setTimeout(function() {
      sinon.assert.called(stub);
    }, 10000);
    done();
  });

  it("createInterface method of readline should be called only once", function() {
    let spyCreateInterface = sinon.spy(readline, "createInterface");
    index.exec();
    readline.createInterface.restore();
    setTimeout(function() {
      sinon.assert.calledOnce(spyCreateInterface);
    }, 10000);    
  });
  
});

describe("Test Case - ", function() {
  
  it("should be called on() method of readline interface for line event", function() {
    let stub = sinon.stub(readline.Interface.prototype, "on");
    index.readFile();
    sinon.assert.called(stub);
    readline.Interface.prototype.on.restore();
    sinon.assert.calledWith(stub, "line");
  });

  it("should be called close() method of readline interface for close event", function() {
    let stub = sinon.stub(readline.Interface.prototype, "on");
    index.readFile();
    readline.Interface.prototype.on.restore();
    sinon.assert.calledWith(stub, "close");
  });

  it.skip("JSON.stringify() should be used atleast once", function() {
    let stringifySpy = sinon.spy(JSON, "stringify");
    index.exec();
    sinon.assert.called(stringifySpy);
  });

});

describe("Testing for existence of Synchronous writeFileSync methods", function() {
  let sandbox = "";
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  })

  it("should not be called writeFileSync", function() {
    let stub = sandbox.stub(fs, "writeFileSync");
    index.readFile();
    sinon.assert.callCount(stub, 0);
  });
  afterEach(function() {
    sandbox.restore();
  });
});

describe("Testing for existence of Asynchronous writeFile methods", function() {
  let sandbox = "";
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  })

  it("should be called writeFile", function(done) {
    let stub = sandbox.stub(fs, "writeFile");
    index.readFile();
    setTimeout(function() {
      sinon.assert.called(stub);
    }, 10000);
    done();
  });

  afterEach(function() {
    sandbox.restore();
  });
});

/* Test cases for log4js starts here*/

describe("Test cases for log4js", function() {
  it("Configure should be called only once", function() {
    let spygetLogger = sinon.spy(index.log4js,"configure");
    index.exec();
    index.log4js.configure.restore();
    sinon.assert.calledOnce(spygetLogger);
  });

  it("getLogger should be called only once", function(done) {
    let spygetLogger = sinon.spy(index.log4js,"getLogger");
    index.exec();
    index.log4js.getLogger.restore();
    sinon.assert.calledOnce(spygetLogger);
    done();
  });

  it("should be called logger.debug() once", function() {
    let debugLogger = sinon.spy(index.logger, "debug");
    index.readFile();
    setTimeout(function() {
      sinon.assert.called(debugLogger);
    }, 10000);
  });

  it("should be called logger.info()", function() {
    let infoLogger = sinon.spy(index.logger, "info");
    index.readFile();
    setTimeout(function() {
    sinon.assert.called(infoLogger);
    },10000);
  });

});

/* Test cases for log4js ends here*/

describe("Assignment9 - Test code for correct output", function(){
  it ("Matches the desired output of object values as per given input test case", function(done){
    index.exec();
    expect(index.countries[0]).to.have.property("countryname", "Argentina");
    done();
  });
});