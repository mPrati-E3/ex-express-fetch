const express = require('express');
const morgan = require('morgan'); // logging middleware

const sqlite = require('sqlite3');
const db = new sqlite.Database('exams.sqlite', (err)=>{ console.error(err); }) ;

const app = express();
const port = 3000;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Set-up the 'client' component as a static website
app.use(express.static('client'));
app.get('/', (req, res) => res.redirect('/index.html'));

// REST API endpoints

// Resources: Course, Exam

// GET /courses
// Request body: empty
// Response body: Array of objects, each describing a Course
// ALTERNATIVE:: Response body: Array of Course codes
// Errors: none
app.get('/courses', (req, res) => {
  // read from database all the courses
  const sql = 'SELECT * FROM course';
  db.all(sql, (err, rows)=> {
    if(err) {
      throw err;
    }
    console.log(rows);
    const courses = rows.map((row)=> ({
      code: row.code,
      name: row.name,
      CFU : row.CFU,
    }) ) ;
    // ALTERNATIVE:: const courses = rows.map((row)=>(row.code));
    res.json(courses);
  }) ;
});

// GET /courses/<course_code>
// Parameter: course code
// Response body: object describing a Course
// Error: if the course does not exist, returns {}
app.get('/courses/:code', (req, res) => {
  const course_code = req.params.code ;
  sql = "SELECT * FROM course WHERE code=?" ;
  db.get(sql, [course_code], (err, row)=> {
    if(err) {
      throw err ;
    }
    if(row) {
      // course exists
      res.json({code: row.code, name: row.name, CFU: row.CFU});
    } else {
      // course doesn't exist
      res.json({});
    }
  });
});

// GET /exams

// GET /exams/<exam_id>

// POST /exams


// Activate web server
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
