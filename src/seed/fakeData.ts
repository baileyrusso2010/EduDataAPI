import { faker } from "@faker-js/faker";
import { School } from "../models/school.model";
import { Teacher } from "../models/teacher.model";
import { Courses } from "../models/associations";
import { CourseSection } from "../models/associations";
import { Enrollment } from "../models/associations";
import { Student } from "../models/associations";
import { School_year } from "../models/school_year.model";
import sequelize from "../database";

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to generate random school years
async function generateSchoolYears(): Promise<School_year[]> {
  const schoolYears: School_year[] = [];
  console.log("Generating School Years...");
  const startYears = [2024, 2025, 2026]; // Example start years for school years

  for (const startYear of startYears) {
    const endYear = startYear + 1;
    const schoolYear = await School_year.create({
      start_date: new Date(`${startYear}-08-01`), // August 1st of start year
      end_date: new Date(`${endYear}-05-31`), // May 31st of end year
      year_name: `${startYear}-${endYear}`,
    });
    schoolYears.push(schoolYear);
  }

  console.log(`Generated ${schoolYears.length} School Years.`);
  return schoolYears;
}

async function generateTeachers(schools: School[]): Promise<Teacher[]> {
  const teachers: Teacher[] = [];
  console.log("Generating Teachers...");
  for (const school of schools) {
    // Teachers are generated per school for quantity, but not directly linked here
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const teacher = await Teacher.create({
        person_id: faker.string.numeric(8), // Generate an 8-digit number
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({
          firstName,
          lastName,
          provider: "school.edu",
        }),
      });
      teachers.push(teacher);
    }
  }
  console.log(`Generated ${teachers.length} Teachers.`);
  return teachers;
}

async function generateCourses(): Promise<Courses[]> {
  const courses: Courses[] = [];
  console.log("Generating Courses...");
  const departments: string[] = [
    "Math",
    "Science",
    "English",
    "History",
    "Art",
    "PE",
    "Music",
    "Foreign Language",
  ];
  for (let i = 0; i < 5; i++) {
    const course = await Courses.create({
      course_name: faker.hacker.adjective() + " " + faker.hacker.noun(), // e.g., 'Awesome Algorithm'
      course_dept: getRandomItem(departments),
    });
    courses.push(course);
  }
  console.log(`Generated ${courses.length} Courses.`);
  return courses;
}

async function generateCourseSections(
  courses: Courses[],
  teachers: Teacher[]
): Promise<CourseSection[]> {
  const sections: CourseSection[] = [];
  console.log("Generating Course Sections...");
  const periods: string[] = [
    "1st Period",
    "2nd Period",
    "3rd Period",
    "4th Period",
    "5th Period",
    "6th Period",
    "7th Period",
  ];
  const terms: string[] = ["Fall 2024", "Spring 2025", "Summer 2025"];
  const schoolYears: string[] = ["2024-2025", "2025-2026"];

  if (teachers.length === 0) {
    console.warn(
      "No teachers available to assign to course sections. Skipping section generation."
    );
    return sections;
  }

  for (const course of courses) {
    for (let i = 0; i < 3; i++) {
      const section = await CourseSection.create({
        courseID: course.id,
        teacher_id: getRandomItem(teachers).id, // Assign a random teacher
        section: `Section ${faker.string.alphanumeric(1).toUpperCase()}`,
        period: getRandomItem(periods),
        term: getRandomItem(terms),
        school_year: getRandomItem(schoolYears),
      });
      sections.push(section);
    }
  }
  console.log(`Generated ${sections.length} Course Sections.`);
  return sections;
}

async function generateEnrollments(
  students: Student[],
  courseSections: CourseSection[]
): Promise<Enrollment[]> {
  const enrollments: Enrollment[] = [];
  console.log("Generating Enrollments...");

  if (courseSections.length === 0) {
    console.warn(
      "No course sections available for enrollment. Skipping enrollment generation."
    );
    return enrollments;
  }

  for (const student of students) {
    const numEnrollments = faker.number.int({ min: 1, max: 7 });
    const assignedSectionIds = new Set<number>(); // To prevent duplicate enrollments in the same section for one student

    for (let i = 0; i < numEnrollments; i++) {
      let randomSection: CourseSection | undefined;
      let attempts = 0;
      // Try to find a unique section
      do {
        randomSection = getRandomItem(courseSections);
        attempts++;
        if (attempts > courseSections.length * 2) {
          // Prevent infinite loops if too few unique sections
          console.warn(
            `Could not find enough unique sections for student ${student.id}. Skipping further enrollments for this student.`
          );
          randomSection = undefined; // Break out of inner loop
          break;
        }
      } while (
        randomSection &&
        assignedSectionIds.has(randomSection.sectionID)
      );

      if (randomSection && !assignedSectionIds.has(randomSection.sectionID)) {
        try {
          const enrollment = await Enrollment.create({
            studentID: student.id,
            sectionID: randomSection.sectionID,
            school_year_id: 1, // Add school year ID from the section
          });
          enrollments.push(enrollment);
          assignedSectionIds.add(randomSection.sectionID);
        } catch (error: any) {
          // This can happen if unique constraints are hit (e.g., student enrolls in same section twice)
          // The 'Set' logic above should largely prevent this for this script's generated data,
          // but good to keep for robustness.
          console.error(
            `Error creating enrollment for student ${student.id} in section ${randomSection.sectionID}:`,
            error.message
          );
        }
      }
    }
  }
  console.log(`Generated ${enrollments.length} Enrollments.`);
  return enrollments;
}

async function generateStudents(schools: School[]): Promise<Student[]> {
  const students: Student[] = [];
  console.log("Generating Students...");
  for (const school of schools) {
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const student = await Student.create({
        student_number: faker.string.numeric(8), // Unique student number
        first_name: firstName,
        last_name: lastName,
        grade: faker.helpers.arrayElement(["9", "10", "11", "12"]), // High school grades
        email: faker.internet.email({
          firstName,
          lastName,
          provider: "student.edu",
        }),
        ethnicity: faker.helpers.arrayElement([
          "White",
          "Black",
          "Asian",
          "Hispanic",
          "Mixed",
          "Other",
        ]),
        school_id: school.id,
      });
      students.push(student);
    }
  }
  console.log(`Generated ${students.length} Students.`);
  return students;
}

async function generateSchools(): Promise<School[]> {
  const schools: School[] = [];
  console.log("Generating Schools...");
  for (let i = 0; i < 3; i++) {
    const school = await School.create({
      id: i,
      name: faker.company.name() + " High School",
    });
    schools.push(school);
  }
  console.log(`Generated ${schools.length} Schools.`);
  return schools;
}

async function generateAttendance(
  students: Student[],
  courseSections: CourseSection[]
): Promise<void> {
  console.log("Generating Attendance Records...");

  if (courseSections.length === 0 || students.length === 0) {
    console.warn(
      "No students or course sections available for attendance generation. Skipping attendance generation."
    );
    return;
  }

  const attendanceStatuses = ["present", "absent", "tardy"]; // Removed "Excused" to match valid enum values
  const attendanceRecords: any[] = []; // Replace `any` with your Attendance model type if available

  for (const section of courseSections) {
    for (const student of students) {
      // Generate random attendance records for each student in each section
      const numRecords = faker.number.int({ min: 5, max: 15 }); // Number of attendance records per student per section
      for (let i = 0; i < numRecords; i++) {
        const attendanceDate = faker.date.between({
          from: new Date("2024-08-01"),
          to: new Date("2025-05-31"),
        });

        const attendance = {
          student_id: student.id,
          sectionID: section.sectionID,
          date: attendanceDate,
          status: getRandomItem(attendanceStatuses),
          school_year_id: 1, // Add school year ID from the section
        };

        attendanceRecords.push(attendance);
      }
    }
  }

  try {
    // Bulk insert attendance records into the database
    await sequelize.models.Attendance.bulkCreate(attendanceRecords);
    console.log(`Generated ${attendanceRecords.length} Attendance Records.`);
  } catch (error: any) {
    console.error("Error generating attendance records:", error.message);
  }
}

export async function generateFakeData() {
  const schools = await generateSchools();
  await generateSchoolYears();
  const teachers = await generateTeachers(schools); // Teachers are linked to sections, not directly to schools
  const students = await generateStudents(schools);
  const courses = await generateCourses();
  const courseSections = await generateCourseSections(courses, teachers);
  await generateEnrollments(students, courseSections);
  await generateAttendance(students, courseSections);
}
