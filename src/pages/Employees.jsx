
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, MoreVertical,
  Mail, Phone, MapPin, User, Calendar, Clock, ChevronRight
} from 'lucide-react';
import { toast } from "sonner";

// Mock data for employees
const mockEmployees = [
  {
    id: 1,
    name: 'John Employee',
    email: 'employee@example.com',
    department: 'Engineering',
    position: 'Software Developer',
    phone: '+1 (123) 456-7890',
    location: 'New York, USA',
    status: 'Active',
    joinDate: '2022-03-15',
    avatar: null
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jsmith@example.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    phone: '+1 (234) 567-8901',
    location: 'San Francisco, USA',
    status: 'Active',
    joinDate: '2021-08-22',
    avatar: null
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    phone: '+1 (345) 678-9012',
    location: 'Chicago, USA',
    status: 'Active',
    joinDate: '2023-01-10',
    avatar: null
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    email: 'sjohnson@example.com',
    department: 'HR',
    position: 'HR Specialist',
    phone: '+1 (456) 789-0123',
    location: 'Miami, USA',
    status: 'On Leave',
    joinDate: '2022-05-18',
    avatar: null
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'dwilson@example.com',
    department: 'Engineering',
    position: 'UI/UX Designer',
    phone: '+1 (567) 890-1234',
    location: 'Seattle, USA',
    status: 'Active',
    joinDate: '2021-11-03',
    avatar: null
  }
];

const EmployeeCard = ({ employee, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-brand-green-100 text-brand-green-800';
      case 'On Leave':
        return 'bg-amber-100 text-amber-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(employee)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 font-semibold text-lg">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              getInitials(employee.name)
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.position}</p>
          </div>
        </div>
        <div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
            {employee.status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-600">{employee.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-600">{employee.department}</span>
        </div>
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-600">{employee.phone}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-600">Joined {employee.joinDate}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <button className="text-sm text-brand-green-600 font-medium flex items-center">
          View Profile
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const EmployeeTable = ({ employees, onViewDetails }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-green-100 text-brand-green-800">
          Active
        </span>;
      case 'On Leave':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          On Leave
        </span>;
      case 'Inactive':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Inactive
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-brand-green-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-brand-green-700">{employee.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(employee.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(employee)}
                    className="text-brand-green-600 hover:text-brand-green-900"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-brand-green-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">Employee Details</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <div className="h-24 w-24 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 font-semibold text-2xl">
              {employee.name.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
              <p className="text-gray-600">{employee.department}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  employee.status === 'Active'
                    ? 'bg-brand-green-100 text-brand-green-800'
                    : employee.status === 'On Leave'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">{employee.email}</p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">{employee.phone}</p>
                    <p className="text-xs text-gray-500">Phone</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">{employee.location}</p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Employment Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">{employee.joinDate}</p>
                    <p className="text-xs text-gray-500">Join Date</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">{employee.department}</p>
                    <p className="text-xs text-gray-500">Department</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-800">09:00 - 17:00</p>
                    <p className="text-xs text-gray-500">Working Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Attendance Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Present</span>
                  <span className="text-sm font-medium text-gray-800">18 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Absent</span>
                  <span className="text-sm font-medium text-gray-800">2 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Late</span>
                  <span className="text-sm font-medium text-gray-800">3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leave</span>
                  <span className="text-sm font-medium text-gray-800">1 day</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-sm text-gray-800">Attendance rate</span>
                    <span className="text-sm text-brand-green-600">90%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Leave Balance</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Annual Leave</span>
                  <span className="text-sm font-medium text-gray-800">14 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sick Leave</span>
                  <span className="text-sm font-medium text-gray-800">7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Used Leave</span>
                  <span className="text-sm font-medium text-gray-800">9 days</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-sm text-gray-800">Available Leave</span>
                    <span className="text-sm text-brand-green-600">12 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Employees = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('table'); // 'table' or 'grid'
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Redirect if user is not admin
  if (!isAdmin()) {
    navigate('/');
    return null;
  }
  
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        
        <button
          className="px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors flex items-center gap-2"
          onClick={() => toast.info("Add employee feature coming soon!")}
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees by name, email or department..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Filter className="w-5 h-5" />
            </button>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => setView('table')} 
                className={`px-3 py-2 ${view === 'table' ? 'bg-brand-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                onClick={() => setView('grid')} 
                className={`px-3 py-2 ${view === 'grid' ? 'bg-brand-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredEmployees.length > 0 ? (
        view === 'table' ? (
          <EmployeeTable
            employees={filteredEmployees}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onClick={handleViewDetails}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <User className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 max-w-sm">
              We couldn't find any employees matching your search criteria. Try adjusting your search or add a new employee.
            </p>
          </div>
        </div>
      )}
      
      <EmployeeModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Employees;
