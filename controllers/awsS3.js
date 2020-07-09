// const AWS = require('aws-sdk')
// const fs = require('fs');
//
// const spacesEndpoint = new AWS.Endpoint(process.env.SPACE_ENDPOINT);
// const s3 = new AWS.S3({
//     endpoint: spacesEndpoint,
//     accessKeyId: process.env.SPACE_ACCESS_KEY,
//     secretAccessKey: process.env.SPACE_SECRET_KEY
// });
//
//
// module.exports.upload = (req,res) => {
//     var params = {
//     ACL: 'public-read',
//     Bucket: process.env.SPACE_BUCKET_NAME,
//     Body: fs.createReadStream(req.file.path),
//     Key: `data/${req.file.originalname}`
//   };
//
//    s3.putObject(params, (err, data) => {
//     if(err){
//       console.log(err, err.stack);
//     }else{
//      const url= `https://${process.env.SPACE_BUCKET_NAME}.${process.env.SPACE_ENDPOINT}/data/${req.file.originalname}`
//       res.json({
//         data,
//         url
//       })
//     }
//   })
// }
