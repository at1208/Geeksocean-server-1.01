// const multer = require('multer');
//
// const multerConf = {
//   storage: multer.diskStorage({
//       destination: function(req,file,next){
//          next(null, 'public/images')
//       },
//       filename: function(req,file,next){
//          const ext = file.mimetype.split('/')[1]
//          next(null,file.fieldname + '-' + Date.now() + '.' + ext)
//       }
//   })
// };
//
// module.exports = multer(multerConf).single('photo');
