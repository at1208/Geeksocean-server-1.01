// const requestIp = require('request-ip');
// const Blog = require('../models/blog');
// const { errorHandler } = require('../helpers/dbErrorHandler');
//
// const IP = async (req, res, next)  => {
//     const clientIp = requestIp.getClientIp(req);
//     const slug = req.params.slug
//     const blog = await  Blog.findOne({ slug }).exec((err,data) => {
//       data.views.push(clientIp)
//       data.save()
//     })
//     next();
// };
//
// module.exports.IP= IP;
