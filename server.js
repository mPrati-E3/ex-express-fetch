const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation library
const dao = require('./dao.js');

const app = express();
const port = 3000;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Set-up the 'client' component as a static website
app.use(express.static('client'));
app.get('/', (req, res) => res.redirect('/index.html'));

// DB error
const dbErrorObj = { errors: [{'param': 'Server', 'msg': 'Database error'}] };


// REST API endpoints

// Resources: Course, Exam

// GET /courses
// Request body: empty
// Response body: Array of objects, each describing a Course
// Errors: none
app.get('/courses', (req, res) => {
  dao.listCourses()
    .then((courses) => res.json(courses) )
    .catch((err)=>res.status(503).json(dbErrorObj));
});


// GET /courses/<course_code>
// Parameter: course code
// Response body: object describing a Course
// Error: if the course does not exist, returns {}
app.get('/courses/:code', (req, res) => {
  dao.readCourseByCode(req.params.code)
    .then((course) => res.json(course) )
    .catch((err)=>res.status(503).json(dbErrorObj));
});



// GET /exams
app.get('/exams', (req, res) => {
  dao.listExams()
  .then((exams) => res.json(exams))
  .catch((err)=>res.status(503).json(dbErrorObj));
});


// GET /exams/<exam_id>

// POST /exams
// Request body: object describing an Exam { coursecode, score, date }
// Response body: empty (ALTERNATIVE: new 'id' for the inserted course)
//    (ALTERNATIVE: return a full copy of the Exam)
app.post('/exams', [
  // I'll control the input 
  check('score').isInt({min: 18, max: 30}),
  check('coursecode').isLength({min: 7, max: 7}),
], (req, res) => {
  const errors = validationResult(req);
  // if I find an error, return with an error code
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  // calling the dao to create an exam in the database (this is async so I have to wait for a response)
  dao.createExam({
    coursecode: req.body.coursecode,
    score: req.body.score,
    date: req.body.date
  }).then((result) => res.end())
  .catch((err) => res.status(503).json(dbErrorObj));
});


// Activate web server
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
