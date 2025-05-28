
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ClockIcon, CalendarIcon, 
  ClipboardCheckIcon, UserCheckIcon,
  AlertCircleIcon, CheckCircleIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data - in a real app this would come from your API
const mockAttendanceData = {
  checkedIn: true,
  lastCheckin: new Date('2023-05-23T08:05:32'),
  lastCheckout: new Date('2023-05-22T17:15:10'),
  weeklyHours: 38.5,
  monthlyHours: 146,
  pendingLeaves: 2,
  upcomingLeaves: [
    { id: 1, startDate: '2023-06-15', endDate: '2023-06-20', type: 'Vacation', status: 'Approved' }
  ],
  recentAttendance: [
    { date: '2023-05-22', checkin: '08:10', checkout: '17:15', status: 'On Time' },
    { date: '2023-05-21', checkin: '08:30', checkout: '17:00', status: 'Late' },
    { date: '2023-05-20', checkin: '08:05', checkout: '17:10', status: 'On Time' },
    { date: '2023-05-19', checkin: '08:00', checkout: '16:45', status: 'On Time' },
    { date: '2023-05-18', checkin: '08:20', checkout: '17:05', status: 'Late' }
  ]
};

// Mock data for admin dashboard
const mockAdminData = {
  totalEmployees: 42,
  presentToday: 38,
  absentToday: 4,
  onLeave: 3,
  pendingLeaveRequests: 5,
  departmentAttendance: [
    { department: 'Engineering', present: 12, absent: 1, percentage: 92 },
    { department: 'Marketing', present: 8, absent: 0, percentage: 100 },
    { department: 'HR', present: 4, absent: 1, percentage: 80 },
    { department: 'Finance', present: 7, absent: 0, percentage: 100 },
    { department: 'Operations', present: 7, absent: 2, percentage: 78 }
  ]
};

const AttendanceButton = ({ checkedIn, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
        checkedIn
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-brand-green-100 text-brand-green-600 hover:bg-brand-green-200'
      }`}
    >
      <ClockIcon className="w-5 h-5" />
      {checkedIn ? 'Clock Out' : 'Clock In'}
    </button>
  );
};

const DashboardCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [adminData, setAdminData] = useState(mockAdminData);
  
  const handleAttendanceToggle = () => {
    setAttendanceData(prev => ({
      ...prev,
      checkedIn: !prev.checkedIn,
      lastCheckin: !prev.checkedIn ? new Date() : prev.lastCheckin,
      lastCheckout: prev.checkedIn ? new Date() : prev.lastCheckout
    }));
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        {!isAdmin() && (
          <AttendanceButton 
            checkedIn={attendanceData.checkedIn} 
            onClick={handleAttendanceToggle} 
          />
        )}
      </div>
      
      {isAdmin() ? (
        // Admin Dashboard
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
              title="Total Employees" 
              value={adminData.totalEmployees} 
              icon={UserCheckIcon}
              color="bg-blue-100 text-blue-600" 
            />
            <DashboardCard 
              title="Present Today" 
              value={adminData.presentToday} 
              icon={CheckCircleIcon}
              color="bg-brand-green-100 text-brand-green-600" 
            />
            <DashboardCard 
              title="Absent Today" 
              value={adminData.absentToday} 
              icon={AlertCircleIcon}
              color="bg-amber-100 text-amber-600" 
            />
            <DashboardCard 
              title="Pending Leaves" 
              value={adminData.pendingLeaveRequests} 
              icon={CalendarIcon}
              color="bg-purple-100 text-purple-600" 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Department Attendance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminData.departmentAttendance.map((dept, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.present}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.absent}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-brand-green-500 h-2.5 rounded-full" 
                                style={{ width: `${dept.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">{dept.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>
              <div className="space-y-4">
                {adminData.pendingLeaveRequests > 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">John Smith</p>
                          <p className="text-sm text-gray-600">Vacation Leave</p>
                          <p className="text-xs text-gray-500 mt-1">Jun 10 - Jun 15, 2023</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-brand-green-100 text-brand-green-600 rounded hover:bg-brand-green-200">
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200">
                            <AlertCircleIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No pending leave requests</p>
                )}
                <button className="mt-2 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  View All Requests
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Employee Dashboard
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
              title="Status" 
              value={attendanceData.checkedIn ? "Checked In" : "Checked Out"} 
              icon={UserCheckIcon}
              color={attendanceData.checkedIn ? "bg-brand-green-100 text-brand-green-600" : "bg-gray-100 text-gray-600"} 
            />
            <DashboardCard 
              title="Last Check In" 
              value={formatDistanceToNow(attendanceData.lastCheckin, { addSuffix: true })} 
              icon={ClockIcon}
              color="bg-blue-100 text-blue-600" 
            />
            <DashboardCard 
              title="Weekly Hours" 
              value={`${attendanceData.weeklyHours}h`} 
              icon={ClockIcon}
              color="bg-purple-100 text-purple-600" 
            />
            <DashboardCard 
              title="Pending Leaves" 
              value={attendanceData.pendingLeaves} 
              icon={CalendarIcon}
              color="bg-amber-100 text-amber-600" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceData.recentAttendance.map((day, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.checkin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.checkout}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            day.status === 'On Time'
                              ? 'bg-brand-green-100 text-brand-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {day.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Upcoming Leaves</h2>
              {attendanceData.upcomingLeaves.length > 0 ? (
                <div className="space-y-4">
                  {attendanceData.upcomingLeaves.map((leave) => (
                    <div key={leave.id} className="border-l-4 border-brand-green-500 bg-brand-green-50 p-4 rounded-r-lg">
                      <p className="font-medium">{leave.type}</p>
                      <p className="text-sm text-gray-600">{leave.startDate} - {leave.endDate}</p>
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-brand-green-100 text-brand-green-800 text-xs rounded-full">
                          {leave.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming leaves</p>
              )}
              <button className="mt-4 w-full py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors">
                Request Leave
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
