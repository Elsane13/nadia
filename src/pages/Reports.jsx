
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Download,
  Filter,
  BarChart,
  PieChart,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { 
  BarChart as ReChartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  PieChart as ReChartsPieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';

// Mock data for attendance overview
const mockAttendanceData = [
  { name: 'Week 1', present: 95, late: 3, absent: 2 },
  { name: 'Week 2', present: 92, late: 5, absent: 3 },
  { name: 'Week 3', present: 88, late: 7, absent: 5 },
  { name: 'Week 4', present: 90, late: 6, absent: 4 }
];

// Mock data for leave distribution
const mockLeaveData = [
  { name: 'Vacation', value: 45 },
  { name: 'Sick Leave', value: 25 },
  { name: 'Personal', value: 15 },
  { name: 'Other', value: 15 }
];

// Mock data for monthly overview
const mockMonthlyData = [
  { name: 'Jan', attendance: 95, target: 98 },
  { name: 'Feb', attendance: 94, target: 98 },
  { name: 'Mar', attendance: 92, target: 98 },
  { name: 'Apr', attendance: 96, target: 98 },
  { name: 'May', attendance: 93, target: 98 }
];

// Mock data for department attendance
const mockDepartmentData = [
  { name: 'Engineering', attendance: 96 },
  { name: 'Marketing', attendance: 94 },
  { name: 'Finance', attendance: 98 },
  { name: 'HR', attendance: 97 },
  { name: 'Operations', attendance: 92 }
];

const COLORS = ['#22c55e', '#f97316', '#3b82f6', '#8b5cf6', '#06b6d4'];

const ReportCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      {children}
    </div>
  );
};

const Reports = () => {
  const { isAdmin } = useAuth();
  const [reportPeriod, setReportPeriod] = useState('month');
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button 
              onClick={() => setReportPeriod('week')} 
              className={`px-3 py-1.5 text-sm ${reportPeriod === 'week' ? 'bg-brand-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setReportPeriod('month')} 
              className={`px-3 py-1.5 text-sm ${reportPeriod === 'month' ? 'bg-brand-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setReportPeriod('quarter')} 
              className={`px-3 py-1.5 text-sm ${reportPeriod === 'quarter' ? 'bg-brand-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Quarter
            </button>
            <button 
              onClick={() => setReportPeriod('year')} 
              className={`px-3 py-1.5 text-sm ${reportPeriod === 'year' ? 'bg-brand-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Year
            </button>
          </div>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
              <p className="text-2xl font-bold mt-1">92%</p>
              <p className="text-xs text-brand-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.5% from last month
              </p>
            </div>
            <div className="rounded-full p-3 bg-brand-green-100 text-brand-green-600 h-fit">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average Check-in Time</p>
              <p className="text-2xl font-bold mt-1">08:45 AM</p>
              <p className="text-xs text-amber-600 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" /> 15 min later than target
              </p>
            </div>
            <div className="rounded-full p-3 bg-amber-100 text-amber-600 h-fit">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Leave Requests</p>
              <p className="text-2xl font-bold mt-1">{isAdmin() ? '5' : '1'}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" /> Need review
              </p>
            </div>
            <div className="rounded-full p-3 bg-blue-100 text-blue-600 h-fit">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Overtime Hours</p>
              <p className="text-2xl font-bold mt-1">24h</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +3h from last month
              </p>
            </div>
            <div className="rounded-full p-3 bg-purple-100 text-purple-600 h-fit">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportCard title="Attendance Overview" icon={BarChart}>
            <ResponsiveContainer width="100%" height={300}>
              <ReChartsBarChart
                data={mockAttendanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present" fill="#22c55e" />
                <Bar dataKey="late" name="Late" fill="#f97316" />
                <Bar dataKey="absent" name="Absent" fill="#ef4444" />
              </ReChartsBarChart>
            </ResponsiveContainer>
          </ReportCard>
        </div>
        
        <div>
          <ReportCard title="Leave Distribution" icon={PieChart}>
            <ResponsiveContainer width="100%" height={300}>
              <ReChartsPieChart>
                <Pie
                  data={mockLeaveData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockLeaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </ReChartsPieChart>
            </ResponsiveContainer>
          </ReportCard>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ReportCard title="Monthly Attendance Trend" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockMonthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="#22c55e"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="target" name="Target %" stroke="#9ca3af" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>
        
        <ReportCard title="Department Attendance Rate" icon={BarChart}>
          <ResponsiveContainer width="100%" height={300}>
            <ReChartsBarChart
              data={mockDepartmentData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[85, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="attendance" name="Attendance %" fill="#22c55e" />
            </ReChartsBarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </div>
  );
};

export default Reports;
