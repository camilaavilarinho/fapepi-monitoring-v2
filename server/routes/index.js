(function() {

  'use strict';
  var express = require('express');
  var router = express.Router();
  var mongojs = require('mongojs');
  var db = mongojs('bolsasFapepi', ['bolsas']);

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/api/bolsas', function(req, res) {
    db.bolsas.find(function(err, data) {
      res.json(data);
    });
  });

  router.post('/api/bolsas', function(req, res) {
    db.bolsas.insert(req.body, function(err, data) {
      res.json(data);
    });

  });

  router.put('/api/bolsas', function(req, res) {

    db.bolsas.update({
      _id: mongojs.ObjectId(req.body._id)
    }, {
      isCompleted: req.body.isCompleted,
      todo: req.body.todo
    }, {}, function(err, data) {
      res.json(data);
    });

  });

  router.delete('/api/bolsas/:_id', function(req, res) {
    db.bolsas.remove({
      _id: mongojs.ObjectId(req.params._id)
    }, '', function(err, data) {
      res.json(data);
    });

  });

  module.exports = router;

}());
