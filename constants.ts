import { Student } from './types';

export const NEON_CONNECTION_STRING = "postgresql://neondb_owner:npg_sy3awVU4TGcf@ep-plain-feather-ad49lltc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const INITIAL_STUDENTS: Student[] = [
  { id: 1001, first_name: "Alice", last_name: "Johnson", email: "alice.j@university.edu", major: "Computer Science", gpa: 3.8, status: "Active", enrollment_date: "2023-09-01" },
  { id: 1002, first_name: "Bob", last_name: "Smith", email: "bob.smith@university.edu", major: "Mathematics", gpa: 2.9, status: "Probation", enrollment_date: "2022-09-01" },
  { id: 1003, first_name: "Charlie", last_name: "Brown", email: "c.brown@university.edu", major: "Physics", gpa: 3.5, status: "Active", enrollment_date: "2023-01-15" },
  { id: 1004, first_name: "Diana", last_name: "Prince", email: "diana.p@university.edu", major: "Computer Science", gpa: 4.0, status: "Active", enrollment_date: "2021-09-01" },
  { id: 1005, first_name: "Evan", last_name: "Wright", email: "evan.w@university.edu", major: "History", gpa: 3.2, status: "Active", enrollment_date: "2023-09-01" },
  { id: 1006, first_name: "Fiona", last_name: "Gallagher", email: "fiona.g@university.edu", major: "Biology", gpa: 3.9, status: "Graduated", enrollment_date: "2020-09-01" },
  { id: 1007, first_name: "George", last_name: "Miller", email: "george.m@university.edu", major: "Chemistry", gpa: 2.4, status: "Probation", enrollment_date: "2022-09-01" },
  { id: 1008, first_name: "Hannah", last_name: "Abbott", email: "h.abbott@university.edu", major: "Psychology", gpa: 3.6, status: "Active", enrollment_date: "2023-09-01" },
  { id: 1009, first_name: "Ian", last_name: "Somerhalder", email: "ian.s@university.edu", major: "Drama", gpa: 3.1, status: "Active", enrollment_date: "2021-09-01" },
  { id: 1010, first_name: "Julia", last_name: "Roberts", email: "j.roberts@university.edu", major: "Economics", gpa: 3.75, status: "Active", enrollment_date: "2022-01-20" },
  { id: 1011, first_name: "Kevin", last_name: "Hart", email: "k.hart@university.edu", major: "Computer Science", gpa: 2.8, status: "Active", enrollment_date: "2023-09-01" },
  { id: 1012, first_name: "Luna", last_name: "Lovegood", email: "luna.l@university.edu", major: "Astronomy", gpa: 3.95, status: "Active", enrollment_date: "2022-09-01" },
];

export const MAJORS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Biology",
  "Chemistry",
  "History",
  "Psychology",
  "Economics",
  "Drama",
  "Astronomy"
];