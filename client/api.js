// All the API calls are defined here

import Exam from "./exam.js";
import Course from "./course.js";

async function getAllExams() {
    // call fetch of the /exams (GET) defined in the server and wait for response
    const response = await fetch('/exams');
    const exams_json = await response.json();
    // if all is ok, I'll transform the json output of the server into a list of exams
    if (response.ok) {
        return exams_json.map((ex) => Exam.from(ex));
    } else {
        throw exams_json;  // An object with the error coming from the server
    }
}

async function insertNewExam(exam) {
    // call fetch of the /exams (POST) defined in the server
    // my fetch method must be create manually and inserted into a Promise because this is a POST not a GET
    return new Promise((resolve, reject) => {
        fetch('/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // I'll get the body returned by the server in json format and stringify it to my exam format
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
    // call fetch of the /courses (GET) defined in the server and wait for response
    const response = await fetch('/courses');
    const jsoncourses = await response.json();
    // I'll transform the json output of the server into a list of exams
    const courses = jsoncourses.map((jc) => Course.from(jc));
    return courses;
  }
  

export { getAllExams, insertNewExam, getAllCourses };