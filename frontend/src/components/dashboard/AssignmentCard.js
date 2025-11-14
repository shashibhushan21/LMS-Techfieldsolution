import Link from 'next/link';
import { FiClock, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function AssignmentCard({ assignment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'text-blue-600 bg-blue-50';
      case 'graded':
        return 'text-green-600 bg-green-50';
      case 'overdue':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return FiCheckCircle;
      case 'graded':
        return FiCheckCircle;
      case 'overdue':
        return FiAlertCircle;
      default:
        return FiFileText;
    }
  };

  const StatusIcon = getStatusIcon(assignment.status);
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && assignment.status !== 'submitted' && assignment.status !== 'graded';

  return (
    <Link href={`/dashboard/assignments/${assignment._id}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{assignment.title}</h4>
            <p className="text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
            <StatusIcon className="inline w-3 h-3 mr-1" />
            {assignment.status || 'pending'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              Due: {dueDate.toLocaleDateString()}
            </span>
          </div>
          {assignment.totalPoints && (
            <div className="flex items-center">
              <span className="font-medium">{assignment.totalPoints} points</span>
            </div>
          )}
        </div>

        {assignment.grade && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Grade:</span>
              <span className="text-lg font-bold text-green-600">
                {assignment.grade}/{assignment.totalPoints}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
