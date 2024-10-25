const express = require('express');
const multer = require('multer');
const { createJob, getJobs, getJobsByCategory } = require('../controllers/jobController');

const router = express.Router();  

const upload = multer({ storage: multer.memoryStorage() }); // Temporary storage for files


//Route to create job
router.post('/jobs', upload.array('images'), createJob); // 'images' is the key for files in form-data

// Route to get all jobs
router.get('/', getJobs);

//Route to get jobs by category
router.get('/category/:categoryId', getJobsByCategory);


module.exports = router;