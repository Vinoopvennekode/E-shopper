const multer=require('multer')
//Configuration for Multer
let count=0
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/bannerimage");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `/admin-${file.fieldname,count++}-${Date.now()}.${ext}`);
    },
  });


const uploadbanner=multer({
    storage:multerStorage,
})

  module.exports=uploadbanner