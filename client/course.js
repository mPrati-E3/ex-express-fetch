'use strict';

/**
 * Object describing a course
 */
class Course {
  /**
   * Create a new Course
   * @param {*} code unique code for the course
   * @param {*} name full name of the course
   * @param {*} CFU number of CFU credits
   */
  constructor(code, name, CFU) {
    this.code = code;
    this.name = name;
    this.CFU = CFU;
  }

  /**
   * Creates a new Course from plain (JSON) objects
   * @param {*} json a plain object (coming form JSON deserialization)
   * with the right properties
   * @return {Course} the newly created object
   */
  static from(json) {
    return Object.assign(new Course(), json);
  }

}

export default Course;

