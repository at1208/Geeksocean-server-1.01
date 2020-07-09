const Draft = require('../models/draft');
const Category = require('../models/category');
const Tag = require('../models/tag');
const User = require('../models/user');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

exports.createDraft = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
      if (err) {
          return res.status(400).json({
              error: 'Image could not upload'
          });
      }

      const { title, body, categories, tags } = fields;

      if (!title || !title.length) {
          return res.status(400).json({
              error: 'title is required'
          });
      }

      if (!body || body.length < 1) {
          return res.status(400).json({
              error: 'minimum one letter character is required to save in a draft'
          });
      }
      //
      // if (!categories || categories.length === 0) {
      //     return res.status(400).json({
      //         error: 'At least one category is required'
      //     });
      // }
      //
      // if (!tags || tags.length === 0) {
      //     return res.status(400).json({
      //         error: 'At least one tag is required'
      //     });
      // }

      let blog = new Draft();
      blog.title = title;
      blog.body = body;
      blog.excerpt = smartTrim(body, 320, ' ', ' ...');
      blog.slug = slugify(title).toLowerCase();
      blog.mtitle = `${title} | ${process.env.APP_NAME}`;
      blog.mdesc = stripHtml(body.substring(0, 160));
      blog.postedBy = req.user._id;
      // categories and tags
      let arrayOfCategories = categories && categories.split(',');
      let arrayOfTags = tags && tags.split(',');
      // let arrayOfKeywords = keywords && keywords.split(',');

      if (files.photo) {
          if (files.photo.size > 10000000) {
              return res.status(400).json({
                  error: 'Image should be less then 1mb in size'
              });
          }
          blog.photo.data = fs.readFileSync(files.photo.path);
          blog.photo.contentType = files.photo.type;
      }

      blog.save((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: errorHandler(err)
              });
          }
          // res.json(result);
          Draft.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
              (err, result) => {
                  if (err) {
                      return res.status(400).json({
                          error: errorHandler(err)
                      });
                  } else {
                      Draft.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                          (err, result) => {
                              if (err) {
                                  return res.status(400).json({
                                      error: errorHandler(err)
                                  });
                              } else {
                                  res.json(result);
                              }
                          }
                      );
                  }
              }
          );
      });
  });
};


// Edit Draft
exports.updateDraft = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Draft.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldBlog.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path);
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};


exports.removeDraft = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Draft.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Draft deleted successfully'
        });
    });
};

exports.readDraft = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Draft.findOne({ slug })
        // .select("-photo")
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};


exports.listOfDraftByUser = (req, res) => {
    User.findOne({ username: req.params.username }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let userId = user._id;
        Draft.find({ postedBy: userId })
            .sort({ createdAt: -1 })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(data);
            });
    });
};
