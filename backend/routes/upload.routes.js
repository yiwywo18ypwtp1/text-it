const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');


const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/');
   },
   filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
   },
});

const upload = multer({ storage });

router.post('/', upload.single('audio'), uploadController.uploadFile)
router.get('/my', uploadController.getMyUploads);

module.exports = router;
