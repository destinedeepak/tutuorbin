var express = require('express');
// var User = require('../models/Users');
var Todo = require('../models/todos');
var auth = require('../middlewares/auth');
var router = express.Router();

// create Article 
router.post('/', auth.verifyToken, async (req, res, next) => {
  req.body.author = req.user.userId;
  try {
      var todo = await Todo.create(req.body);
      res.json({todo});
  } catch (error) {
      next(error);
  }
});

// get single article
router.get('/:slug',  auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
      let todo = await Todo.findOne({slug}).populate('author').exec();
      return res.send({todo})
  } catch (error) {
      next(error);
  }
});

// get all articles
router.get('/', auth.verifyToken, async (req, res, next) => {
  try {
      let todos = await Todo.find().populate('author').exec();
      return res.send({todos})
  } catch (error) {
      next(error);
  }
});

// update article
router.put('/:title', auth.verifyToken, async (req, res, next) => {
  let title = req.params.title;
  try {
    let todos = await Todo.findOneAndUpdate({title}, req.body, {new: true});
    return res.send({todos})
  } catch (error) {
      next(error);
  }
});

//delete article
router.delete('/:title', auth.verifyToken, async (req, res, next) => {
  let title = req.params.title;
  try {
    let todos = await Todo.findOneAndDelete({title});
    return res.send({todos})
  } catch (error) {
      next(error);
  }
});


module.exports = router;
