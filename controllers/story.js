const Story = require('../models/story');
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

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, body, categories, tags, keywords,faqs } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (title.length>60) {
            return res.status(400).json({
                error: 'title length must be less than 60 characters'
            });
        }

        if (!body || body.length < 60) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }


        let story = new Story();
        story.title = title;
        story.body = body;
        story.excerpt = smartTrim(body,body.length - 50, ' ', ' ...');
        story.slug = slugify(title).toLowerCase();
        story.mtitle = `${title} | ${process.env.APP_NAME}`;
        story.mdesc = stripHtml(body.substring(0, 160));
        story.postedBy = req.user._id;
        // categories and tags
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');
        let arrayOfKeywords = keywords && keywords.split(',');



        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            story.photo.data = fs.readFileSync(files.photo.path);
            story.photo.contentType = files.photo.type;
        }

        story.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
            Story.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        Story.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                            (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err)
                                    });
                                } else {
                                    res.json(result)
                                }
                            }
                        );
                    }
                }
            );
        });
    });
};



exports.list = (req, res) => {
    Story.find({})
        .populate('categories', '_id name slug')
        .sort({ updatedAt: -1 })
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listAllStoriesCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 5;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let stories;
    let categories;
    let tags;

    Story.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt views')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            stories = data;
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c;
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    tags = t;

                    res.json({ stories, categories, tags, size: stories.length });
                });
            });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Story.findOne({ slug })
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

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Story.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Story deleted successfully'
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Story.findOne({ slug }).exec((err, oldStory) => {
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

            let slugBeforeMerge = oldStory.slug;
            oldStory = _.merge(oldStory, fields);
            oldStory.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

            if (body) {
                oldStory.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldStory.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldStory.categories = categories.split(',');
            }

            if (tags) {
                oldStory.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldStory.photo.data = fs.readFileSync(files.photo.path);
                oldStory.photo.contentType = files.photo.type;
            }

            oldStory.save((err, result) => {
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

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Story.findOne({ slug })
        .select('photo')
        .exec((err, story) => {
            if (err || !story) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', story.photo.contentType);
            return res.send(story.photo.data);
        });
};

exports.listRelated = (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body.story;

    Story.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('postedBy', '_id name username profile')
        .select('title slug excerpt postedBy createdAt updatedAt')
        .exec((err, stories) => {
            if (err) {
                return res.status(400).json({
                    error: 'Stories not found'
                });
            }
            res.json(stories);
        });
};


exports.listByUser = (req, res) => {
    User.findOne({ username: req.params.username }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let userId = user._id;
        Story.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .sort({ updatedAt: -1 })
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy createdAt updatedAt excerpt')
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
