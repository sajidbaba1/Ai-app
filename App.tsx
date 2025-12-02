import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GraduationCap, Bot, Settings, Database, Server, ChevronRight, AlertCircle, RefreshCw, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import AIQueryBuilder from './components/AIQueryBuilder';
import { ViewMode } from './types';
import { NEON_CONNECTION_STRING } from './constants';
import { dataService } from './services/dataService';
import { Student } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getStudents();
      setStudents(data);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to connect to Database");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (student: Omit<Student, 'id'>) => {
    try {
        await dataService.addStudent(student);
        loadData();
    } catch (e) {
        console.error("Error adding student:", e);
        alert("Failed to add student. See console for details.");
    }
  };

  const handleUpdateStudent = async (id: number, updates: Partial<Student>) => {
    try {
        await dataService.updateStudent(id, updates);
        loadData();
    } catch (e) {
        console.error("Error updating student:", e);
        alert("Failed to update student.");
    }
  };

  const handleDeleteStudent = async (id: number) => {
    console.log("UI requesting delete for ID:", id);
    if (window.confirm('Are you sure you want to remove this student?')) {
        const previousStudents = [...students];
        setStudents(prev => prev.filter(s => Number(s.id) !== Number(id)));

        try {
            await dataService.deleteStudent(id);
            console.log("Delete successful for ID:", id);
            setTimeout(() => {
                loadData();
            }, 1000);
            
        } catch (e) {
            console.error("Error deleting student:", e);
            alert("Failed to delete student from database.");
            setStudents(previousStudents);
        }
    }
  };

  const handleNavClick = (mode: ViewMode) => {
    setCurrentView(mode);
    setIsMobileMenuOpen(false);
  };

  const navItemClass = (mode: ViewMode) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
      currentView === mode 
        ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                N
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">NeonFlow</span>
          </div>
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-xs border border-green-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            PostgreSQL Connected
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => handleNavClick(ViewMode.DASHBOARD)} className={navItemClass(ViewMode.DASHBOARD)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button onClick={() => handleNavClick(ViewMode.STUDENTS)} className={navItemClass(ViewMode.STUDENTS)}>
            <GraduationCap size={20} />
            <span>Students</span>
          </button>
          <button onClick={() => handleNavClick(ViewMode.AI_SQL)} className={navItemClass(ViewMode.AI_SQL)}>
            <Bot size={20} />
            <span>AI Data Analyst</span>
          </button>
          <button onClick={() => handleNavClick(ViewMode.SETTINGS)} className={navItemClass(ViewMode.SETTINGS)}>
            <Settings size={20} />
            <span>Config</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-900 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase font-bold">
                    <Server size={12} /> Database
                </div>
                <div className="text-xs font-mono text-slate-300 break-all opacity-80">
                    ep-plain-feather
                </div>
                <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    US-EAST-1 (AWS)
                </div>
            </div>
        </div>
    </>
  );

  if (error) {
      return (
          <div className="h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-red-100">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h2>
                  <p className="text-slate-500 mb-6 text-sm">{error}</p>
                  <p className="text-xs text-slate-400 mb-6 break-all font-mono bg-slate-50 p-2 rounded">
                    {NEON_CONNECTION_STRING.replace(/:[^:@]*@/, ':****@')}
                  </p>
                  <button 
                    onClick={loadData}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                      <RefreshCw size={18} /> Retry Connection
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col shrink-0 z-20 hidden md:flex">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-64 bg-white shadow-xl flex flex-col h-full animate-in slide-in-from-left duration-300">
            <div className="absolute top-2 right-2">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
            </div>
            <NavContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative flex flex-col w-full">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate">
                    {currentView === ViewMode.DASHBOARD && 'Dashboard'}
                    {currentView === ViewMode.STUDENTS && 'Student Directory'}
                    {currentView === ViewMode.AI_SQL && 'AI Data Analyst'}
                    {currentView === ViewMode.SETTINGS && 'Configuration'}
                </h1>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">Admin User</div>
                    <div className="text-xs text-slate-500">Administrator</div>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
                    <img src="https://picsum.photos/200" alt="Admin" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full text-indigo-600 flex-col gap-4 min-h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                    <p className="text-sm text-slate-500">Connecting to Neon DB...</p>
                </div>
            ) : (
                <>
                    {currentView === ViewMode.DASHBOARD && <Dashboard students={students} />}
                    {currentView === ViewMode.STUDENTS && (
                        <StudentList 
                            students={students} 
                            onAdd={handleAddStudent} 
                            onDelete={handleDeleteStudent} 
                            onEdit={handleUpdateStudent} 
                        />
                    )}
                    {currentView === ViewMode.AI_SQL && <AIQueryBuilder />}
                    {currentView === ViewMode.SETTINGS && (
                        <div className="max-w-2xl bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Database size={20} className="text-indigo-600" />
                                Database Configuration
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Connection String (PostgreSQL)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={NEON_CONNECTION_STRING}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none"
                                        />
                                        <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition whitespace-nowrap">
                                            Copy
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        Live Connection Active via @neondatabase/serverless
                                    </p>
                                </div>
                                
                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-2">Schema Information</h4>
                                    <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                                        <code className="text-xs text-green-400 font-mono whitespace-nowrap">
                                            CREATE TABLE IF NOT EXISTS students (<br/>
                                            &nbsp;&nbsp;id SERIAL PRIMARY KEY,<br/>
                                            &nbsp;&nbsp;first_name VARCHAR(100),<br/>
                                            &nbsp;&nbsp;last_name VARCHAR(100),<br/>
                                            &nbsp;&nbsp;email VARCHAR(150),<br/>
                                            &nbsp;&nbsp;major VARCHAR(100),<br/>
                                            &nbsp;&nbsp;gpa DECIMAL(3,2),<br/>
                                            &nbsp;&nbsp;status VARCHAR(50),<br/>
                                            &nbsp;&nbsp;enrollment_date DATE<br/>
                                            );
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
      </main>
    </div>
  );
}

export default App;