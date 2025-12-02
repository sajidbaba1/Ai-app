import { neon } from '@neondatabase/serverless';
import { Student } from '../types';
import { NEON_CONNECTION_STRING, INITIAL_STUDENTS } from '../constants';

class DataService {
  private sql: ReturnType<typeof neon>;
  private tableChecked: boolean = false;

  constructor() {
    // We use the 'neon' HTTP driver which is more robust for serverless/browser environments
    // than the standard Pool which relies on WebSocket shims.
    this.sql = neon(NEON_CONNECTION_STRING);
  }

  // Helper to normalize database rows into the strict Student interface
  // Specifically handling Date objects returned by the driver and decimal strings
  private normalizeStudent(r: any): Student {
    return {
        ...r,
        // Ensure ID is a number (drivers sometimes return it as string)
        id: Number(r.id),
        // Convert Postgres numeric/decimal (returned as string) to number
        gpa: typeof r.gpa === 'string' ? parseFloat(r.gpa) : r.gpa,
        // Convert Date objects to ISO string YYYY-MM-DD
        enrollment_date: r.enrollment_date instanceof Date 
            ? r.enrollment_date.toISOString().split('T')[0] 
            : String(r.enrollment_date)
    };
  }

  private async ensureTableExists() {
    if (this.tableChecked) return;

    try {
        // Create table if it doesn't exist
        await this.sql(`
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
        // The neon http driver returns rows array directly
        const countRes = await this.sql('SELECT COUNT(*) FROM students');
        const count = parseInt(countRes[0].count);

        // Seed if empty
        if (count === 0) {
            console.log("Seeding database with initial data...");
            for (const s of INITIAL_STUDENTS) {
                 await this.sql(
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
        const rows = await this.sql('SELECT * FROM students ORDER BY id ASC');
        return rows.map(r => this.normalizeStudent(r));
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
    const rows = await this.sql(query, values);
    return this.normalizeStudent(rows[0]);
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<Student> {
    await this.ensureTableExists();
    
    // Helper to construct dynamic update query safely
    const updatesObj = updates as any;
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const values = [id];
    const setClause = fields.map((key, idx) => {
        values.push(updatesObj[key]);
        return `${key} = $${idx + 2}`;
    }).join(', ');

    if (fields.length === 0) return (await this.getStudents()).find(s => s.id === id)!;
    
    const query = `UPDATE students SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const rows = await this.sql(query, values);
    if (rows.length === 0) throw new Error("Student not found");
    return this.normalizeStudent(rows[0]);
  }

  async deleteStudent(id: number): Promise<void> {
    const safeId = Number(id);
    if (!safeId || isNaN(safeId)) {
        console.error("Invalid ID provided for deletion:", id);
        return;
    }

    await this.ensureTableExists();
    console.log(`Sending DELETE command for student ID: ${safeId}`);
    
    try {
        // We use explicit casting to integer to ensure PG treats it correctly
        const result = await this.sql('DELETE FROM students WHERE id = $1 RETURNING id', [safeId]);
        
        if (result && result.length > 0) {
            console.log(`Database confirmed deletion of student ID: ${result[0].id}`);
        } else {
            console.warn(`DELETE command executed, but no row was returned. ID ${safeId} might not exist.`);
        }
    } catch (err) {
        console.error("CRITICAL ERROR executing delete query:", err);
        throw err;
    }
  }

  async executeRawQuery(sqlQuery: string): Promise<any[]> {
    await this.ensureTableExists();
    // Safety check for dangerous operations in this demo
    const lowerSql = sqlQuery.toLowerCase();
    if (lowerSql.includes('drop') || lowerSql.includes('alter') || lowerSql.includes('truncate')) {
        throw new Error("DDL and unsafe operations are restricted in this demo.");
    }
    
    try {
        const rows = await this.sql(sqlQuery);
        // We also normalize dates in raw queries for display purposes
        return rows.map(row => {
            const newRow: any = { ...row };
            for (const key in newRow) {
                if (newRow[key] instanceof Date) {
                    newRow[key] = newRow[key].toISOString().split('T')[0];
                }
            }
            return newRow;
        });
    } catch (err: any) {
        console.error("Raw Query Error:", err);
        throw new Error(err.message || "Failed to execute query");
    }
  }
}

export const dataService = new DataService();