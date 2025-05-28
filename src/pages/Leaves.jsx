
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar,
  Plus,
  Check,
  X,
  Filter,
  Download,
  CalendarDays,
  Search,
  ChevronDown
} from 'lucide-react';
import { toast } from "sonner";

// Mock data for leave requests
const mockLeaveRequests = [
  {
    id: 1,
    employeeName: 'John Employee',
    employeeId: 'EMP001',
    type: 'Vacation',
    startDate: '2023-06-15',
    endDate: '2023-06-20',
    days: 6,
    reason: 'Family vacation',
    status: 'Approved',
    appliedOn: '2023-05-10',
    approvedBy: 'Admin User'
  },
  {
    id: 2,
    employeeName: 'John Employee',
    employeeId: 'EMP001',
    type: 'Sick Leave',
    startDate: '2023-05-03',
    endDate: '2023-05-04',
    days: 2,
    reason: 'Fever and cold',
    status: 'Approved',
    appliedOn: '2023-05-02',
    approvedBy: 'Admin User'
  },
  {
    id: 3,
    employeeName: 'John Employee',
    employeeId: 'EMP001',
    type: 'Personal',
    startDate: '2023-07-10',
    endDate: '2023-07-10',
    days: 1,
    reason: 'Personal errands',
    status: 'Pending',
    appliedOn: '2023-05-20'
  }
];

// Mock data for admin view
const mockAdminLeaveRequests = [
  ...mockLeaveRequests,
  {
    id: 4,
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    type: 'Vacation',
    startDate: '2023-06-25',
    endDate: '2023-07-05',
    days: 11,
    reason: 'Summer vacation',
    status: 'Pending',
    appliedOn: '2023-05-15'
  },
  {
    id: 5,
    employeeName: 'Michael Brown',
    employeeId: 'EMP003',
    type: 'Sick Leave',
    startDate: '2023-05-22',
    endDate: '2023-05-23',
    days: 2,
    reason: 'Doctor appointment',
    status: 'Pending',
    appliedOn: '2023-05-21'
  }
];

const LeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'Vacation',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-brand-green-600 text-white px-6 py-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Request Leave</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                required
              >
                <option value="Vacation">Vacation</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal">Personal</option>
                <option value="Bereavement">Bereavement</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="halfDay"
                name="halfDay"
                type="checkbox"
                checked={formData.halfDay}
                onChange={handleChange}
                className="h-4 w-4 text-brand-green-600 focus:ring-brand-green-500 border-gray-300 rounded"
              />
              <label htmlFor="halfDay" className="ml-2 block text-sm text-gray-700">
                Half Day Leave
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LeaveDetailsModal = ({ leave, isOpen, onClose, isAdmin, onApprove, onReject }) => {
  if (!isOpen || !leave) return null;
  
  const getStatusBadge = () => {
    switch (leave.status) {
      case 'Approved':
        return <span className="px-2 py-1 bg-brand-green-100 text-brand-green-800 text-xs rounded-full">
          <Check className="w-3 h-3 inline mr-1" /> Approved
        </span>;
      case 'Rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          <X className="w-3 h-3 inline mr-1" /> Rejected
        </span>;
      default:
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
          <Calendar className="w-3 h-3 inline mr-1" /> Pending
        </span>;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-brand-green-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">Leave Details</h3>
          <div>
            {getStatusBadge()}
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {isAdmin && (
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Employee</h4>
                <p className="font-medium">{leave.employeeName}</p>
                <p className="text-sm text-gray-600">{leave.employeeId}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Leave Type</h4>
                <p>{leave.type}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Days</h4>
                <p>{leave.days} day{leave.days > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500 font-medium">From</h4>
                <p>{leave.startDate}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 font-medium">To</h4>
                <p>{leave.endDate}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500 font-medium">Reason</h4>
              <p>{leave.reason}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Applied On</h4>
                <p>{leave.appliedOn}</p>
              </div>
              {leave.approvedBy && (
                <div>
                  <h4 className="text-sm text-gray-500 font-medium">Approved By</h4>
                  <p>{leave.approvedBy}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            {isAdmin && leave.status === 'Pending' && (
              <>
                <button
                  onClick={() => onReject(leave.id)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 flex items-center"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(leave.id)}
                  className="px-4 py-2 bg-brand-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 flex items-center"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </button>
              </>
            )}
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

const Leaves = () => {
  const { isAdmin, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLeave, setCurrentLeave] = useState(null);
  const [isLeaveDetailOpen, setIsLeaveDetailOpen] = useState(false);
  const [leaves, setLeaves] = useState(isAdmin() ? mockAdminLeaveRequests : mockLeaveRequests);
  const [filterStatus, setFilterStatus] = useState('All');
  
  const filteredLeaves = filterStatus === 'All' 
    ? leaves 
    : leaves.filter(leave => leave.status === filterStatus);
  
  const handleLeaveSubmit = (formData) => {
    const newLeave = {
      id: leaves.length + 1,
      employeeName: user.name,
      employeeId: user.id,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: calculateDays(formData.startDate, formData.endDate, formData.halfDay),
      reason: formData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    
    setLeaves([newLeave, ...leaves]);
    toast.success("Leave request submitted successfully");
  };
  
  const calculateDays = (start, end, isHalfDay) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isHalfDay && diffDays === 1 ? 0.5 : diffDays;
  };
  
  const openLeaveDetail = (leave) => {
    setCurrentLeave(leave);
    setIsLeaveDetailOpen(true);
  };
  
  const handleApprove = (leaveId) => {
    setLeaves(leaves.map(leave => 
      leave.id === leaveId 
        ? { ...leave, status: 'Approved', approvedBy: user.name } 
        : leave
    ));
    setIsLeaveDetailOpen(false);
    toast.success("Leave request approved");
  };
  
  const handleReject = (leaveId) => {
    setLeaves(leaves.map(leave => 
      leave.id === leaveId 
        ? { ...leave, status: 'Rejected', approvedBy: user.name } 
        : leave
    ));
    setIsLeaveDetailOpen(false);
    toast.success("Leave request rejected");
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-green-100 text-brand-green-800">
          <Check className="w-3 h-3 mr-1" /> Approved
        </span>;
      case 'Rejected':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" /> Rejected
        </span>;
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          <Calendar className="w-3 h-3 mr-1" /> Pending
        </span>;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        
        {!isAdmin() && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Request Leave
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filterStatus === 'All'
                  ? 'bg-brand-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('Pending')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filterStatus === 'Pending'
                  ? 'bg-brand-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('Approved')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filterStatus === 'Approved'
                  ? 'bg-brand-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('Rejected')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filterStatus === 'Rejected'
                  ? 'bg-brand-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              />
            </div>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin() && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openLeaveDetail(leave)}>
                    {isAdmin() && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-brand-green-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-brand-green-700">{leave.employeeName.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                            <div className="text-xs text-gray-500">{leave.employeeId}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.startDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.endDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.days} day{leave.days > 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{leave.appliedOn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-brand-green-600 hover:text-brand-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLeaveDetail(leave);
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin() ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <LeaveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleLeaveSubmit} 
      />
      
      <LeaveDetailsModal 
        leave={currentLeave} 
        isOpen={isLeaveDetailOpen} 
        onClose={() => setIsLeaveDetailOpen(false)} 
        isAdmin={isAdmin()}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Leaves;
