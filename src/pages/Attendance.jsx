
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, Clock, Check, X, User, 
  AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

// Mock data for calendar view
const mockAttendanceData = {
  currentMonth: 'May 2023',
  days: Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    status: Math.random() > 0.15
      ? (Math.random() > 0.2 ? 'present' : 'late')
      : (Math.random() > 0.5 ? 'absent' : 'leave')
  }))
};

// Mock data for recent records
const mockRecords = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  let status, checkIn, checkOut;
  
  const random = Math.random();
  if (random > 0.15) {
    status = random > 0.2 ? 'Present' : 'Late';
    checkIn = status === 'Present' 
      ? `08:${Math.floor(Math.random() * 15).toString().padStart(2, '0')}`
      : `08:${(Math.floor(Math.random() * 30) + 15).toString().padStart(2, '0')}`;
    checkOut = `17:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`;
  } else {
    status = random > 0.5 ? 'Absent' : 'Leave';
    checkIn = '---';
    checkOut = '---';
  }
  
  return {
    id: i + 1,
    date: date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }),
    checkIn,
    checkOut,
    status,
    workHours: status === 'Absent' || status === 'Leave' ? '0h 00m' : `8h ${Math.floor(Math.random() * 60).toString().padStart(2, '0')}m`,
    note: status === 'Leave' ? 'Annual Leave' : (status === 'Absent' ? 'Sick Leave' : '')
  };
});

const CalendarView = ({ data }) => {
  const getDayClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-brand-green-100 text-brand-green-800 hover:bg-brand-green-200';
      case 'late':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'absent':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'leave':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{data.currentMonth}</h2>
        <div className="flex gap-2">
          <button className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {/* Empty spaces for days before the 1st of the month */}
        {Array.from({ length: 1 }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {data.days.map((day) => (
          <div 
            key={day.day}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${getDayClass(day.status)}`}
          >
            <span className="text-sm font-medium">{day.day}</span>
            <span className="text-xs mt-1 capitalize">{day.status}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-brand-green-500"></div>
          <span className="text-xs text-gray-500">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-500">Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-500">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-500">Leave</span>
        </div>
      </div>
    </div>
  );
};

const RecordsTable = ({ records }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-green-100 text-brand-green-800">
          <Check className="w-3 h-3 mr-1" /> Present
        </span>;
      case 'Late':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          <Clock className="w-3 h-3 mr-1" /> Late
        </span>;
      case 'Absent':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" /> Absent
        </span>;
      case 'Leave':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          <Calendar className="w-3 h-3 mr-1" /> Leave
        </span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.workHours}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AttendanceSummary = () => {
  const summaryData = [
    { title: 'Total Working Days', value: 22, icon: Calendar, color: 'bg-brand-green-100 text-brand-green-600' },
    { title: 'Present', value: 18, icon: Check, color: 'bg-brand-green-100 text-brand-green-600' },
    { title: 'Late', value: 2, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { title: 'Absent', value: 1, icon: AlertCircle, color: 'bg-red-100 text-red-600' },
    { title: 'Leave', value: 1, icon: User, color: 'bg-blue-100 text-blue-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {summaryData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className={`rounded-full p-2 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Attendance = () => {
  const { isAdmin } = useAuth();
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('calendar')} 
            className={`px-4 py-1.5 rounded-lg flex items-center gap-2 ${
              view === 'calendar' 
                ? 'bg-brand-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button 
            onClick={() => setView('list')} 
            className={`px-4 py-1.5 rounded-lg flex items-center gap-2 ${
              view === 'list' 
                ? 'bg-brand-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Records
          </button>
        </div>
      </div>
      
      <AttendanceSummary />
      
      {view === 'calendar' ? (
        <CalendarView data={mockAttendanceData} />
      ) : (
        <RecordsTable records={mockRecords} />
      )}
    </div>
  );
};

export default Attendance;
