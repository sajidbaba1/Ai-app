import React, { useMemo } from 'react';
import { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  students: Student[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const probation = students.filter(s => s.status === 'Probation').length;
    const avgGpa = total > 0 ? (students.reduce((acc, s) => acc + s.gpa, 0) / total).toFixed(2) : "0.00";
    return { total, active, probation, avgGpa };
  }, [students]);

  const majorData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      counts[s.major] = (counts[s.major] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [students]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  const StatCard = ({ icon: Icon, colorClass, title, value }: any) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            icon={Users} 
            colorClass="bg-indigo-100 text-indigo-600" 
            title="Total Students" 
            value={stats.total} 
        />
        <StatCard 
            icon={TrendingUp} 
            colorClass="bg-emerald-100 text-emerald-600" 
            title="Average GPA" 
            value={stats.avgGpa} 
        />
        <StatCard 
            icon={GraduationCap} 
            colorClass="bg-blue-100 text-blue-600" 
            title="Active Enrolled" 
            value={stats.active} 
        />
        <StatCard 
            icon={AlertTriangle} 
            colorClass="bg-amber-100 text-amber-600" 
            title="Probation Risk" 
            value={stats.probation} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[300px] md:min-h-[350px]">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Top Majors</h4>
          <div className="flex-1 w-full h-56 md:h-64 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={majorData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 11}} interval={0} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[300px] md:min-h-[350px]">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h4>
          <div className="flex-1 w-full h-56 md:h-64 min-h-[200px]">
             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-2 flex-wrap">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs">
                  <span className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;