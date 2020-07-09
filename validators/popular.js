const { check } = require('express-validator');

exports.popularCreateValidator = [
    check('articleId')
        .not()
        .isEmpty()
        .withMessage('Article id is required'),

    check('articleRank')
        .not()
        .isEmpty()
        .withMessage('Rank is required')
];
