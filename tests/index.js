var Fireplug = require('..');

var Promise = require('bluebird');
var expect = require('chai').expect;

describe("Fireplug's", function() {
  describe('constructor', function() {
    it('creates multiple instances', function() {
      var plugins1 = new Fireplug();
      plugins1.use({
        method: function() { return 1; }
      });

      var plugins2 = new Fireplug();
      plugins2.use({
        method: function() { return 2; }
      });

      return Promise.join(plugins1.method(), plugins2.method(), function(a, b) {
        expect(a).to.equal(1);
        expect(b).to.equal(2);
      })
    });
  });

  describe('instances', function() {
    describe('have a use method which', function() {
      it('supports singular plugin arguments', function() {
        var plugins = new Fireplug();
        plugins.use({ method: function() { return 1; } });
        return plugins
          .method()
          .then(function(result) {
            expect(result).to.equal(1);
          });
      });

      it('supports an array of plugins', function() {
        var plugins = new Fireplug();
        plugins.use([
          { method: function() { return 1; } },
          { method: function() { return 2; } }
        ]);
        return plugins
          .method()
          .then(function(result) {
            expect(result).to.equal(2);
          });
      });
    });

    describe('supports plugin hooks that', function() {
      it('synchronously return a result', function() {
        var plugins = new Fireplug();
        plugins.use({ method: function() { return 1; }});

        return plugins
          .method()
          .then(function(result) {
            expect(result).to.equal(1);
          })
      });

      it('synchronously throws an error', function(done) {
        var error = new Error();
        var plugins = new Fireplug();
        plugins.use({ method: function() { throw error; }});

        plugins
          .method()
          .catch(function(ex) {
            expect(ex).to.equal(error);
            done();
          });
      });

      it('asynchronously return a result through a promise', function() {
        var plugins = new Fireplug();
        plugins.use({ method: function(prev, cb) { return Promise.resolve(1); }});

        return plugins
          .method()
          .then(function(result) {
            expect(result).to.equal(1);
          })
      });

      it('asynchronously yield an error through a promise', function(done) {
        var error = new Error();
        var plugins = new Fireplug();
        plugins.use({ method: function(prev, cb) { return Promise.reject(error); }});

        return plugins
          .method()
          .catch(function(err) {
            expect(err).to.equal(error);
            done();
          })
      });

      it('asynchronously return a result through a callback', function() {
        var plugins = new Fireplug();
        plugins.use({ method: function(prev, cb) { cb(null, 1); }});

        return plugins
          .method()
          .then(function(result) {
            expect(result).to.equal(1);
          })
      });

      it('asynchronously yield an error through a callback', function(done) {
        var error = new Error();
        var plugins = new Fireplug();
        plugins.use({ method: function(prev, cb) { cb(error); }});

        return plugins
          .method()
          .catch(function(err) {
            expect(err).to.equal(error);
            done();
          })
      });
    });
  })
});
