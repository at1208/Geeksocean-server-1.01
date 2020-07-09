const Keyword = require('../models/keyword');
const Blog = require('../models/blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
var randomWords = require('random-words');


exports.createKeyword = async (req, res) => {
    const { name } = req.body;

    let slug = slugify(name + ' ' + randomWords({ exactly: 5, join: ' ' })).toLowerCase();
    let keywords = new Keyword({ name, slug });

  await keywords.save((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};


exports.list = (req, res) => {
    Keyword.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Keyword.findOne({ slug }).exec((err, keyword) => {
        if (err) {
            return res.status(400).json({
                error: 'Keyword not found'
            });
        }
        // res.json(tag);
        Blog.find({ keywords: keyword })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('keywords', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({ keyword: keyword, blogs: data });
            });
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Keyword.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Keyword deleted successfully'
        });
    });
};
