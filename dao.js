'use strict';

// DAO module for accessing courses and exams
// Data Access Object

// Call sqlite3 to open the database and save it in db
const sqlite = require('sqlite3');
const db = new sqlite.Database('exams.sqlite', (err) => {
  if (err) throw err;
});

// I'll export a function that return a Promise that call a query on the database to get all courses
exports.listCourses = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((e) => ({code: e.code, name: e.name, CFU: e.CFU}));
      resolve(courses);
    });
  });
};

// I'll export a function that return a Promise that call a query on the database to get all courses with a determined code
exports.readCourseByCode = function(code) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE code=?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({});
      } else {
        const course = {code: row.code, name: row.name, CFU: row.CFU};
        resolve(course);
      }
    });
  });
};

// I'll export a function that return a Promise that call a query on the database to get all exams
exports.listExams = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT course_code, score, date, name FROM exam, course WHERE course_code=code';

    // execute query and get all results into `rows`
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // transform 'rows' of query results into an array of objects
      const exams = rows.map((e) => (
        {
          coursecode: e.course_code,
          score: e.score,
          date: e.date,
          coursename: e.name,
        }));

      resolve(exams);
    });
  });
};

// I'll export a function that return a Promise that call a query on the database to insert a new exam
exports.createExam = function(exam) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO exam(course_code, date, score) VALUES(?, DATE(?), ?)';
    db.run(sql, [exam.coursecode, exam.date, exam.score], function (err) {
      if (err) {
        reject(err);
        return;
      }
      // returning lastID is not mandatory, it's a convention to know how many records I have in the table
      resolve(this.lastID);
    });
  });
};
