import multer from "multer";
// import { upload } from   "../middlewares/multer.middlewares.js";
 import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
  
      cb(null, file.originalname)
    
  }
})

    export const upload = multer({ 
        storage,
         })