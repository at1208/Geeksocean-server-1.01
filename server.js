const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');
const draftRoutes = require('./routes/draft');
const faqRoutes = require('./routes/faq');
const viewRoutes = require('./routes/view');
const storyRoutes = require('./routes/story');
// const blogByCategoryRoutes = require('./routes/blogByCategory');
// const popularRoutes = require('./routes/popular');
// const awsS3Routes = require('./routes/awsS3');


// app
const app = express();



// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(err => {
        console.log(err);
    });

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
} else{
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}
// routes middleware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);
app.use('/api', draftRoutes);
app.use('/api', faqRoutes);
app.use('/api', viewRoutes);
app.use('/api', storyRoutes);
// app.use('/api', blogByCategoryRoutes);
// app.use('/api', popularRoutes);
// app.use('/api', awsS3Routes);

//
// if (process.env.NODE_ENV === 'production') {
//     app.get('*', (req, res, next) => {
//         let hostname = req.hostname;
//         if (hostname.includes('geeksocean.com')) {
//             console.log('yes includes my domain name in ', hostname);
//             next();
//         } else {
//             res.redirect(301, 'https://geeksocean.com/');
//             console.log('no dont includes domain_name in ', hostname);
//         }
//     });


// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
