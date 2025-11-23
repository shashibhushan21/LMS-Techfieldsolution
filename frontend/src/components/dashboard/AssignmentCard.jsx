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
      <div className="group bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
                {assignment.title}
              </h4>
              <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                {assignment.description || 'No description provided.'}
              </p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
              <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
              <span className="capitalize">{assignment.status || 'pending'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center ${isOverdue ? 'text-red-600 font-medium' : 'text-neutral-500'}`}>
                <FiClock className="w-4 h-4 mr-1.5" />
                <span>
                  {isOverdue ? 'Overdue: ' : 'Due: '}
                  {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {assignment.totalPoints && (
                <div className="flex items-center text-neutral-500">
                  <span className="w-1 h-1 rounded-full bg-neutral-300 mr-4" />
                  <span>{assignment.totalPoints} pts</span>
                </div>
              )}
            </div>

            {assignment.grade ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-500 uppercase font-medium tracking-wide">Score</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                  {assignment.grade}/{assignment.totalPoints}
                </span>
              </div>
            ) : (
              <span className="text-xs font-medium text-primary-600 group-hover:translate-x-1 transition-transform">
                View Details &rarr;
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
