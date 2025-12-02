import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Plus, MoreHorizontal, Filter, X } from 'lucide-react';
import { MAJORS } from '../constants';

interface StudentListProps {
  students: Student[];
  onAdd: (student: Omit<Student, 'id'>) => void;
  onEdit: (id: number, student: Partial<Student>) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    status: 'Active',
    major: 'Computer Science',
    gpa: 4.0
  });

  const filteredStudents = students.filter(s => 
    s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.first_name && newStudent.last_name && newStudent.email) {
      onAdd({
        first_name: newStudent.first_name,
        last_name: newStudent.last_name,
        email: newStudent.email,
        major: newStudent.major || 'Undeclared',
        gpa: newStudent.gpa || 0,
        status: newStudent.status as any || 'Active',
        enrollment_date: new Date().toISOString().split('T')[0]
      });
      setIsAddModalOpen(false);
      setNewStudent({ status: 'Active', major: 'Computer Science', gpa: 4.0 });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium w-full sm:w-auto">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium w-full sm:w-auto shadow-sm shadow-indigo-200"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Major</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Enrollment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3">
                        {student.first_name[0]}{student.last_name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{student.first_name} {student.last_name}</div>
                        <div className="text-xs text-slate-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{student.major}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.gpa.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                        student.status === 'Probation' ? 'bg-amber-100 text-amber-800' :
                        student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.enrollment_date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 transition" onClick={() => onDelete(student.id)}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setNewStudent({...newStudent, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setNewStudent({...newStudent, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                   onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Major</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setNewStudent({...newStudent, major: e.target.value})}
                    value={newStudent.major}
                  >
                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Initial GPA</label>
                  <input type="number" step="0.1" min="0" max="4.0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={newStudent.gpa}
                    onChange={e => setNewStudent({...newStudent, gpa: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
                Create Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
