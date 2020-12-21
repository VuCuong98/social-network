const express = require("express");
const multer = require("multer");
const uploadRouter = express.Router();
const fs = require("fs");

const upload = multer({
  dest: "public/",
});

uploadRouter.post("/img", upload.array("image", 10), (req, res) => {
  // validate: file type + file size
  const fileTypeRegex = /\.(jpg|jpeg|png|svg)$/i;
  const maxFileSize = 4000000;
  const imageUrl = [];
  for (let i = 0; i < req.files.length; i++) {
    if (!fileTypeRegex.test(req.files[i].originalname)) {
      fs.unlinkSync(req.files[i].path);
      res.status(400).json({
        success: false,
        message: "only allowed JPG, JPEG, PNG and SVG file!",
      });
    } else if (req.files[i].size > maxFileSize) {
      console.log(req.files);
      fs.unlinkSync(req.files[i].path);
      res.status(400).json({
        success: false,
        message: "File must be less than 4MB!",
      });
    } else {
      //rename file
      console.log(req.files[i]);
      const fileNameParts = req.files[i].originalname.split(".");
      const fileType = fileNameParts[fileNameParts.length - 1];
      const filename = `${req.files[i].filename}.${fileType}`;
      fs.renameSync(req.files[i].path, `public/${filename}`);
      imageUrl.push(`/${filename}`);
    }
  }

  res.status(201).json({
    success: true,
    data: {
      imageUrl: imageUrl,
    },
  });
});

// Upload avatar/background

uploadRouter.post('/avt-bg', upload.single('image') ,(req, res) => {
     // validate: file type, file size
     const fileTypeRegex = /\.(gif|jpg|jpeg|tiff|png)$/i;
     const maxfileSize = 4000000
     if(!fileTypeRegex.test(req.file.originalname)){
         res.status(400).json({
             success: false,
             message:'only allowed jpg, jeg, png'
         });
         fs.unlinkSync(req.file.path);
     } else if(req.file.size>maxfileSize) {
         res.status(400).json({
             success: false,
             message: 'file must be less than 2MB'
         })
         fs.unlinkSync(req.file.path);
     } else{
              // rename file
         const filenameParts = req.file.originalname.split('.');
         const fileType = filenameParts[filenameParts.length-1];
         const filename =`${req.file.filename}.${fileType}`;
         fs.renameSync(req.file.path, `public/${filename}`);
 
         res.status(201).json({
            success: true,
            data:{
             imageUrl: `/${filename}`,
           }
         })
     }
});
module.exports = uploadRouter;
