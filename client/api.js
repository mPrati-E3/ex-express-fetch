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
        throw jsonexams;  // An object with the error coming from the server
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
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                  }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
    
}

async function getAllCourses() {
    const response = await fetch('/courses');
    const jsoncourses = await response.json();
    const courses = jsoncourses.map((jc) => Course.from(jc));
    return courses;
  }
  

export { getAllExams, insertNewExam, getAllCourses };