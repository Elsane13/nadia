
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, Calendar, Check, X, Filter, AlertCircle, Search
} from 'lucide-react';
import { toast } from "sonner";

// Mock data for absences
const mockAbsences = [
  {
    id: 1,
    date: '2023-05-03',
    type: 'Sick Leave',
    reason: 'Fever and cold',
    status: 'Justified',
    document: null
  },
  {
    id: 2,
    date: '2023-04-15',
    type: 'Personal',
    reason: 'Family emergency',
    status: 'Justified',
    document: 'medical-certificate.pdf'
  },
  {
    id: 3,
    date: '2023-03-22',
    type: 'Unplanned',
    reason: 'Car broke down',
    status: 'Pending',
    document: null
  }
];

// Mock data for admin view
const mockAdminAbsences = [
  ...mockAbsences,
  {
    id: 4,
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    date: '2023-05-17',
    type: 'Sick Leave',
    reason: 'Flu symptoms',
    status: 'Pending',
    document: 'medical-note.pdf'
  },
  {
    id: 5,
    employeeName: 'Michael Brown',
    employeeId: 'EMP003',
    date: '2023-05-10',
    type: 'Unplanned',
    reason: 'Personal emergency',
    status: 'Pending',
    document: null
  }
];

const AbsenceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'Sick Leave',
    reason: '',
    document: null
  });
  
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
          <h3 className="text-lg font-semibold">Justify Absence</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Absence Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Absence Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                required
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal">Personal</option>
                <option value="Unplanned">Unplanned</option>
                <option value="Other">Other</option>
              </select>
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
            
            <div>
              <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Document (optional)
              </label>
              <input
                id="document"
                name="document"
                type="file"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Upload medical certificate or other relevant document</p>
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AbsenceDetailsModal = ({ absence, isOpen, onClose, isAdmin, onApprove, onReject }) => {
  if (!isOpen || !absence) return null;
  
  const getStatusBadge = () => {
    switch (absence.status) {
      case 'Justified':
        return <span className="px-2 py-1 bg-brand-green-100 text-brand-green-800 text-xs rounded-full">
          <Check className="w-3 h-3 inline mr-1" /> Justified
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
          <h3 className="text-lg font-semibold">Absence Details</h3>
          <div>
            {getStatusBadge()}
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {isAdmin && absence.employeeName && (
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Employee</h4>
                <p className="font-medium">{absence.employeeName}</p>
                <p className="text-sm text-gray-600">{absence.employeeId}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Date</h4>
                <p>{absence.date}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Type</h4>
                <p>{absence.type}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500 font-medium">Reason</h4>
              <p>{absence.reason}</p>
            </div>
            
            {absence.document && (
              <div>
                <h4 className="text-sm text-gray-500 font-medium">Supporting Document</h4>
                <div className="mt-2 flex items-center">
                  <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <a href="#" className="text-blue-600 hover:underline">{absence.document}</a>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            {isAdmin && absence.status === 'Pending' && (
              <>
                <button
                  onClick={() => onReject(absence.id)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 flex items-center"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(absence.id)}
                  className="px-4 py-2 bg-brand-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500 flex items-center"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Justify
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

const Absences = () => {
  const { isAdmin, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAbsence, setCurrentAbsence] = useState(null);
  const [isAbsenceDetailOpen, setIsAbsenceDetailOpen] = useState(false);
  const [absences, setAbsences] = useState(isAdmin() ? mockAdminAbsences : mockAbsences);
  const [filterStatus, setFilterStatus] = useState('All');
  
  const filteredAbsences = filterStatus === 'All' 
    ? absences 
    : absences.filter(absence => absence.status === filterStatus);
  
  const handleAbsenceSubmit = (formData) => {
    const newAbsence = {
      id: absences.length + 1,
      employeeName: user.name,
      employeeId: user.id,
      date: formData.date,
      type: formData.type,
      reason: formData.reason,
      status: 'Pending',
      document: formData.document ? formData.document.name : null
    };
    
    setAbsences([newAbsence, ...absences]);
    toast.success("Absence justification submitted successfully");
  };
  
  const openAbsenceDetail = (absence) => {
    setCurrentAbsence(absence);
    setIsAbsenceDetailOpen(true);
  };
  
  const handleApprove = (absenceId) => {
    setAbsences(absences.map(absence => 
      absence.id === absenceId 
        ? { ...absence, status: 'Justified' } 
        : absence
    ));
    setIsAbsenceDetailOpen(false);
    toast.success("Absence justified");
  };
  
  const handleReject = (absenceId) => {
    setAbsences(absences.map(absence => 
      absence.id === absenceId 
        ? { ...absence, status: 'Rejected' } 
        : absence
    ));
    setIsAbsenceDetailOpen(false);
    toast.success("Absence justification rejected");
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Justified':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-green-100 text-brand-green-800">
          <Check className="w-3 h-3 mr-1" /> Justified
        </span>;
      case 'Rejected':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" /> Rejected
        </span>;
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Pending
        </span>;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Absences</h1>
        
        {!isAdmin() && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Justify Absence
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
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
              onClick={() => setFilterStatus('Justified')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filterStatus === 'Justified'
                  ? 'bg-brand-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Justified
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
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAbsences.length > 0 ? (
                filteredAbsences.map((absence) => (
                  <tr key={absence.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openAbsenceDetail(absence)}>
                    {isAdmin() && absence.employeeName && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-brand-green-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-brand-green-700">{absence.employeeName.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{absence.employeeName}</div>
                            <div className="text-xs text-gray-500">{absence.employeeId}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{absence.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{absence.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{absence.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(absence.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {absence.document ? (
                        <a href="#" className="text-blue-600 hover:underline text-sm">View</a>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-brand-green-600 hover:text-brand-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          openAbsenceDetail(absence);
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin() ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No absences found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AbsenceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAbsenceSubmit} 
      />
      
      <AbsenceDetailsModal 
        absence={currentAbsence} 
        isOpen={isAbsenceDetailOpen} 
        onClose={() => setIsAbsenceDetailOpen(false)} 
        isAdmin={isAdmin()}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Absences;
