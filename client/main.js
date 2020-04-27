import * as Api from './api.js';
import Exam from './exam.js';

window.addEventListener('load', () => {
    populateScores(); // fill the table with the actual scores
    initializeForm(); // populate the drop-down menu
});

async function populateScores() {

    // get all exams from the backend (REST API)
    const exams = await Api.getAllExams();

    // update the table the new content
    const table = document.querySelector('#results tbody');
    table.innerHTML = ''; // remove old content
    exams.forEach((ex) => {
        const row = `<tr><td>${ex.coursename}</td><td>${ex.score}</td>` +
            `<td>${ex.date}</td></tr>`;
        table.insertAdjacentHTML('beforeend', row);
    });

}

async function initializeForm() {
    const thisForm = document.forms.actions;

    thisForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
    });

    // by default, hide the form
    document.querySelector("#add-exam-form").classList.add('invisible');

    // make it visible with the + button
    document.querySelector("#add-button").addEventListener('click', () => {
        document.querySelector("#add-exam-form").classList.remove('invisible');
        document.querySelector("#add-button").classList.add('invisible');
    });

    // set event handler for 'Cancel' button
    thisForm.elements.cancelbutton.addEventListener('click', () => {
        document.getElementById('add-exam-form').classList.add('invisible');
        document.getElementById('add-button').classList.remove('invisible');
    });

    // set event handler for 'Save', to submit the new exam to the server
    thisForm.elements.savebutton.addEventListener('click', () => {
        if (thisForm.checkValidity()) {
            // valid
            const exam = new Exam(thisForm.coursecode.value, thisForm.examscore.value, thisForm.examdate.value);
            Api.insertNewExam(exam)
                .then(() => populateScores())
                .catch((errorObj) => {
                    if (errorObj) {
                        const err0 = errorObj.errors[0];
                        const errorString = err0.param + ': ' + err0.msg;
                        // add an alert message in DOM
                        document.getElementById('errorMsg').innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="danger">
              <strong>Error:</strong> <span>${errorString}</span> 
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>`;
                    }
                });

            document.getElementById('add-exam-form').classList.add('invisible');
            document.getElementById('add-button').classList.remove('invisible');
        }
    });
    
    // preload course names in dropdown menu
    const courses = await Api.getAllCourses();
    const select = thisForm.elements.coursecode;
    courses.forEach((c) => {
        select.appendChild(new Option(c.name, c.code));
    });

}