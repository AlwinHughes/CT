const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Solve = mongoose.model('Solve');
const config = require('../../config');
const isAuthed = require('../middleware/isauthed.js');

const router = new express.Router();

router.get('/dashboard', function(req, res) {

  isAuthed(req, res, function(req, res) {
    req.status(401).end();
  }, function(req, res, id) {
    res.status(200).json({
      message: "You're authorized to see this secret message."
    });
  });
});

router.post('/addsolve', function(req, res) {
  isAuthed(req, res, function(req, res) {
    res.status(401).end();
  }, function(req, res, id) {

    var s = new Solve({
      user_id: id,
      solve_time: parseFloat(req.body.solve_time),
      time: req.body.time,
      scramble: req.body.scramble,
    })
    s.save(function(err) {
      if(err) {
        console.log('err: ', err);
        res.status(500).end();
      } else {
        res.status(200).end();
      }
    });
  });
});

router.post('/getallsolves', function(req, res) {

  isAuthed(req,res,function(req, res) {
    res.status(401).end()
  }, function(req, res, id) {
    Solve.find({'user_id': id}, function(err, docs) {
      if(err) {
        res.status(500).end();
      } else {
        res.json(docs);
      }
    })
  });
});

router.post('/addPenalty', function(req, res) {
  isAuthed(req, res, function(req, res) {
    res.status(401).end();
  }, function(req, res, id) {
    console.log(req.body);
    for(var i = 0; i < req.body.penlties.length; i++) {
      console.log((req.body.length - req.body.penlties[i]));
      Solve.findOne({user_id:id}).sort({time:-1}).skip(req.body.length - req.body.penlties[i] -1).limit(1).exec(function(err, data) {
       console.log(data);
      // Solve.find({_id:data._id}).exec(function(err, res) {
      //  console.log(res);
      // })
       data.penalty = req.body.type;
       console.log(data);
       Solve.update({_id:data._id}, data, {upsert: true}, function(err, res) {
        if(err)
          console.log(err);
        console.log(res);
       })
      });
//      console.log(req.body.penlties[i].index - length + 1);
    }
  })
  
});


module.exports = router;
