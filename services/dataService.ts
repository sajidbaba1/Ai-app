import { Pool } from '@neondatabase/serverless';
import { Student } from '../types';
import { NEON_CONNECTION_STRING, INITIAL_STUDENTS } from '../constants';

class DataService {
  private pool: Pool;
  private tableChecked: boolean = false;

  constructor() {
    this.pool = new Pool({ connectionString: NEON_CONNECTION_STRING });
  }

  private async ensureTableExists() {
    if (this.tableChecked) return;

    try {
        // Create table if it doesn't exist
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(150),
                major VARCHAR(100),
                gpa DECIMAL(3,2),
                status VARCHAR(50),
                enrollment_date DATE
            );
        `);

        // Check if table is empty
        const countRes = await this.pool.query('SELECT COUNT(*) FROM students');
        const count = parseInt(countRes.rows[0].count);

        // Seed if empty
        if (count === 0) {
            console.log("Seeding database with initial data...");
            for (const s of INITIAL_STUDENTS) {
                 await this.pool.query(
                     `INSERT INTO students (first_name, last_name, email, major, gpa, status, enrollment_date) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                     [s.first_name, s.last_name, s.email, s.major, s.gpa, s.status, s.enrollment_date]
                 );
            }
        }
        
        this.tableChecked = true;
    } catch (err) {
        console.error("Failed to initialize database:", err);
        throw err;
    }
  }

  async getStudents(): Promise<Student[]> {
    await this.ensureTableExists();
    try {
        const { rows } = await this.pool.query('SELECT * FROM students ORDER BY id ASC');
        // Convert GPA from string (Postgres numeric/decimal returns string) to number
        return rows.map(r => ({...r, gpa: parseFloat(r.gpa)}));
    } catch (err) {
        console.error("Error fetching students:", err);
        throw err;
    }
  }

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    await this.ensureTableExists();
    const query = `
        INSERT INTO students (first_name, last_name, email, major, gpa, status, enrollment_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [student.first_name, student.last_name, student.email, student.major, student.gpa, student.status, student.enrollment_date];
    const { rows } = await this.pool.query(query, values);
    return { ...rows[0], gpa: parseFloat(rows[0].gpa) };
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<Student> {
    await this.ensureTableExists();
    // Helper to construct dynamic update query
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const setClause = fields.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [id, ...fields.map(key => (updates as any)[key])];
    
    const query = `UPDATE students SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const { rows } = await this.pool.query(query, values);
    if (rows.length === 0) throw new Error("Student not found");
    return { ...rows[0], gpa: parseFloat(rows[0].gpa) };
  }

  async deleteStudent(id: number): Promise<void> {
    await this.ensureTableExists();
    await this.pool.query('DELETE FROM students WHERE id = $1', [id]);
  }

  async executeRawQuery(sql: string): Promise<any[]> {
    await this.ensureTableExists();
    // Safety check for dangerous operations in this demo
    const lowerSql = sql.toLowerCase();
    if (lowerSql.includes('drop') || lowerSql.includes('alter') || lowerSql.includes('truncate')) {
        throw new Error("DDL and unsafe operations are restricted in this demo.");
    }
    
    try {
        const { rows } = await this.pool.query(sql);
        return rows;
    } catch (err: any) {
        console.error("Raw Query Error:", err);
        throw new Error(err.message || "Failed to execute query");
    }
  }
}

export const dataService = new DataService();