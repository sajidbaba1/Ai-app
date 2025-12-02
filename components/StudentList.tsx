import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Plus, Filter, X, Pencil, Trash2 } from 'lucide-react';
import { MAJORS } from '../constants';

interface StudentListProps {
  students: Student[];
  onAdd: (student: Omit<Student, 'id'>) => void;
  onEdit: (id: number, student: Partial<Student>) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    status: 'Active',
    major: 'Computer Science',
    gpa: 4.0
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

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

  const handleEditClick = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(id);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
        onEdit(editingStudent.id, {
            first_name: editingStudent.first_name,
            last_name: editingStudent.last_name,
            email: editingStudent.email,
            major: editingStudent.major,
            gpa: editingStudent.gpa,
            status: editingStudent.status
        });
        setIsEditModalOpen(false);
        setEditingStudent(null);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium">
            <Filter size={16} /> <span className="hidden sm:inline">Filter</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm shadow-indigo-200"
          >
            <Plus size={16} /> <span className="whitespace-nowrap">Add Student</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-4 md:px-6 py-4">Student</th>
                <th className="px-4 md:px-6 py-4">Major</th>
                <th className="px-4 md:px-6 py-4">GPA</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4">Enrollment</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition group">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                        {student.first_name[0]}{student.last_name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate">{student.first_name} {student.last_name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[120px]">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-600">{student.major}</td>
                  <td className="px-4 md:px-6 py-4 text-sm font-medium text-slate-900">{student.gpa.toFixed(2)}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                      ${student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                        student.status === 'Probation' ? 'bg-amber-100 text-amber-800' :
                        student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{student.enrollment_date}</td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition" 
                            onClick={(e) => handleEditClick(student, e)}
                            title="Edit Student"
                        >
                        <Pencil size={16} />
                        </button>
                        <button 
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition" 
                            onClick={(e) => handleDeleteClick(student.id, e)}
                            title="Delete Student"
                        >
                        <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-800">Add New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 md:p-6 space-y-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <input type="number" step="0.01" min="0" max="4.0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
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

      {/* Edit Student Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-800">Edit Student</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 md:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={editingStudent.first_name}
                    onChange={e => setEditingStudent({...editingStudent, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={editingStudent.last_name}
                    onChange={e => setEditingStudent({...editingStudent, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                   value={editingStudent.email}
                   onChange={e => setEditingStudent({...editingStudent, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Major</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setEditingStudent({...editingStudent, major: e.target.value})}
                    value={editingStudent.major}
                  >
                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Current GPA</label>
                  <input type="number" step="0.01" min="0" max="4.0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={editingStudent.gpa}
                    onChange={e => setEditingStudent({...editingStudent, gpa: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})}
                    value={editingStudent.status}
                  >
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Dropped">Dropped</option>
                  </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
                Update Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;