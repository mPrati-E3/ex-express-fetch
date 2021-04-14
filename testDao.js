'use strict';

// Simple js file to test the correct working of the dao and his connection with the database

const dao = require('./dao.js');

dao.listCourses().then((value)=>{
  console.log(value);
});

dao.readCourseByCode('01SQJOV').then((value)=>{
  console.log(value);
});

dao.listExams().then((value)=>{
  console.log(value);
});

dao.createExam({
  coursecode: '01OTWOV',
  score: 29,
  date: '2019-12-31',
}).then(()=>dao.listExams()).then((value)=>{
  console.log(value);
});

