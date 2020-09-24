const User = require('../models/user');
const Blog = require('../models/blog');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
    let username = req.params.username;
    let user;
    let blogs;

    User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user = userFromDB;
        let userId = user._id;
        Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username createdAt updatedAt')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                user.photo = undefined;
                user.salt = undefined;
                user.hashed_password = undefined;
                res.json({
                    user,
                    blogs: data
                });
            });
    });
};

exports.update = (req, res) => {
    const {name,username,about,password} = req.body

    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }


        let user = req.profile;
        // user's existing role before update
        let existingRole = user.role;
        let existingEmail = user.email;

        if (fields && fields.username && fields.username.length > 12) {
            return res.status(400).json({
                error: 'Username should be less than 12 characters long'
            });
        }

        if (fields.username) {
            fields.username = slugify(fields.username).toLowerCase();
        }

        if (fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password should be min 6 characters long'
            });
        }

        user = _.extend(user, fields);
        // user's existing role - dont update - keep it same
        user.role = existingRole;
        user.email = existingEmail;

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                console.log('profile udpate error', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });
};

exports.photo = (req, res) => {
    const username = req.params.username;
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data);
        }
    });
};

exports.users = async (req,res) => {
  await User.find()
  .select('username name email createdAt role')
  .exec((err,userss) => {
    if(err){
      res.status(400).json({
        error:err
      })
    }
    res.status(200).json({
      users: userss
    })
  })
}

exports.userById = async (req,res) => {
  const _id = req.params.id
  const user = await User.findById(_id)
  .select('username')
  .exec((err, user) => {
     if(err){
       res.status(200).json({
         error: err
       })
     }
     res.status(200).json({
       user
     })
  })

}
