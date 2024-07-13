import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/')
    },
    filename: function (req, file, cb) {
     console.log(file);
      cb(null, file.originalname)
    }
  })

  export const upload = multer( {storage , limits : {fileSize : 1024 * 1024 }} )