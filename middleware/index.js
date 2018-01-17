const Campground = require('../models/campground')
const Comment = require('../models/comment')

const middlewareObj = {
  checkCampgroundOwnership: function (req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, campground) => {
        if (err) {
          res.redirect('back')
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next()
          } else {
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
        if (err) {
          res.redirect('back')
        } else {
          if (comment.author.id.equals(req.user._id)) {
            next()
          } else {
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
    req.flash('error', 'Please login first!')
    res.redirect('/login')
  }
}
module.exports = middlewareObj