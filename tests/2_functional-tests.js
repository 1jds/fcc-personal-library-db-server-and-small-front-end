/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done) {
    chai.request(server)
      .keepOpen()
      .get('/api/books')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ 
            title: 'test book title', 
            _id: '6505979fd75654f842df9c4d'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', 'Response should be json')
            assert.isObject(res.body, 'response should be an object');
            assert.exists(res.body._id, 'Books in array should contain _id');
            assert.exists(res.body.title, 'Books in array should contain title');
            assert.equal(res.body.title, "test book title", "book title should be the string test book title")
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: "" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html', 'Response should be text/html')
            assert.equal(res.text, "missing required field title")
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });

      });


      suite('GET /api/books/[id] => book object with [id]', function() {

        test('Test GET /api/books/[id] with id not in db', function(done) {
          chai.request(server)
            .keepOpen()
            .get('/api/books/65043e1427a2cc6c83f12345')
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type, 'text/html', 'Response should be text/html')
              assert.equal(res.text, "no book exists")
              done();
            })
        });

      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .keepOpen()
          .get('/api/books/6505979fd75654f842df9c4d')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', 'Response should be json')
            assert.isObject(res.body, 'response should be an object');
            assert.exists(res.body.title, 'Books in array should contain title');
            assert.exists(res.body._id, 'db document should contain an _id');
            assert.exists(res.body.comments, 'db documents should contain a comments property')
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
        .keepOpen()
        .post('/api/books/6505979fd75654f842df9c4d')
        .send({ 
          id: '6505979fd75654f842df9c4d', 
          comment: 'kawabunga, dude' 
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', 'Response should be in json format')
          assert.isObject(res.body, "response should be an object")
          assert.exists(res.body.comments, "testing comments array so needs to exist")
          assert.exists(res.body._id, "needs to have an id")
          assert.equal(res.body.title, "test book title", "db document needs a title")
            done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
        .keepOpen()
        .post('/api/books/6505979fd75654f842df9c4d')
        .send({ 
          id: '6505979fd75654f842df9c4d', 
          comment: '' 
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html', 'Response should be in json format')
          assert.equal(res.text, "missing required field comment", "correct response should be the string missing required field comment")
            done();
      });
    });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
        .keepOpen()
        .post('/api/books/65043e1427a2cc6c81234567')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html', "no book exists")
            done();
      });

    });

    });
    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
        .keepOpen()
        .delete('/api/books/6505979fd75654f842df9c4d')
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "delete successful")
          assert.equal(res.text, "delete successful", "response message indicates that the delete was successful")
        })
        done();
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai.request(server)
        .keepOpen()
        .delete('/api/books/1234561427a2cc6c83f97356')
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "delete attempt no book exists")
          assert.equal(res.text, "no book exists", "response message indicates that the delete was unsuccessful because no such book exists")
        })
        done();
      });

    });

  });

});
