const Campground = require('../models/campground')
const Comment = require('../models/comment')

const middlewareObj = {
  checkCampgroundOwnership: function (req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
          req.flash('error', 'Campground not found!')
          res.redirect('back')
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next()
          } else {
            req.flash('error', 'You don\'t have permission to do that')
            res.redirect('back')
          }
        }
      })
    } else {
      res.redirect('back')
    }
  },
  checkCommentOwnership: function (req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err || !comment) {
          req.flash('error', 'Comment not found!')
          res.redirect('back')
        } else {
          if (comment.author.id.equals(req.user._id)) {
            next()
          } else {
            req.flash('error', 'You don\'t have permission to do that')
            res.redirect('back')
          }
        }
      })
    } else {
      res.redirect('back')
    }
  },
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('/login')
  }
}
module.exports = middlewareObj