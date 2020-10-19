const express = require('express');
const multer =  require('multer');
const uploadRouter =  express.Router();
const fs = require('fs')

const upload = multer({
    dest:'public/', 
});

uploadRouter.post('/img', upload.array('image', 2), (req, res)=>{
    console.log(req.files);
    // validate: file type + file size
    const fileTypeRegex = /\.(jpg|jpeg|png|svg)$/i;
    const maxFileSize =  4000000;
    for(let i=0; i<req.files.length; i++){
         if(!fileTypeRegex.test(req.files[i].originalname)){
                res.status(400).json({
                    success: false,
                    message: 'only allowed JPG, JPEG, PNG and SVG file!',
                });
                fs.unlinkSync(req.files[i].path);
        }else if(req.files[i].size > maxFileSize) {
            res.status(400).json({
                success: false,
                message: 'File must be less than 4MB!',
            });
            fs.unlinkSync(req.files[i].path);
        }else {
            //rename file
            const fileNameParts = req.files[i].originalname.split('.');
            const fileType = fileNameParts[fileNameParts.length - 1];
            const filename1 = `${req.files[0].filename}.${fileType}`;
            const filename2 = `${req.files[1].filename}.${fileType}`;
            fs.renameSync(req.files[0].path, `public/${filename1}`);
            fs.renameSync(req.files[1].path, `public/${filename2}`);

    
            res.status(201).json({
                success: true,
                data: {
                    imageUrl1: `/${filename1}`,
                    imageUrl2: `/${filename2}`,
                }
            });
        }
}
    // if(!fileTypeRegex.test(req.file.originalname)){
    //     res.status(400).json({
    //         success: false,
    //         message: 'only allowed JPG, JPEG, PNG and SVG file!',
    //     });
    //     fs.unlinkSync(req.file.path);
    // } else if(req.file.size > maxFileSize) {
    //     res.status(400).json({
    //         success: false,
    //         message: 'File must be less than 4MB!',
    //     });
    //     fs.unlinkSync(req.file.path);
    // }
    //else {
        // rename file
        // const fileNameParts = req.file.originalname.split('.');
        // const fileType = fileNameParts[fileNameParts.length - 1];
        // const filename = `${req.file.filename}.${fileType}`;
        // fs.renameSync(req.file.path, `public/${filename}`);

        // res.status(201).json({
        //     success: true,
        //     data: {
        //         imageUrl: `/${filename}`,
        //     }
        // });
    //}
    
});
module.exports = uploadRouter;