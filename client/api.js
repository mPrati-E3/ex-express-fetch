// All the API calls are defined here

import Exam from "./exam.js";
import Course from "./course.js";

async function getAllExams() {
    // call REST API : GET /exams
    const response = await fetch('/exams');
    const exams_json = await response.json();
    if (response.ok) {
        return exams_json.map((ex) => Exam.from(ex));
    } else {
        throw 'ERROR in GET /exams';
    }
}

async function insertNewExam(exam) {
    return new Promise((resolve, reject) => {
        fetch('/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exam),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                reject(null);
                // TODO: inspect the response to get the cause of error
            }
        })
    });
    
}

async function getAllCourses() {
    const response = await fetch('/courses');
    const jsoncourses = await response.json();
    const courses = jsoncourses.map((jc) => Course.from(jc));
    return courses;
  }
  

export { getAllExams, insertNewExam, getAllCourses };