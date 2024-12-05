import { FaCalendar, FaClock, FaFlag, FaTrash, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function TaskCard({ task, onEdit, onDelete }) {
  const priorityConfig = {
    low: {
      color: 'bg-brand-success/20 text-brand-success',
      text: 'Düşük'
    },
    medium: {
      color: 'bg-brand-warning/20 text-brand-warning',
      text: 'Orta'
    },
    high: {
      color: 'bg-brand-danger/20 text-brand-danger',
      text: 'Yüksek'
    }
  };

  const statusConfig = {
    todo: {
      color: 'bg-dark-accent text-dark-muted',
      text: 'Yapılacak'
    },
    inprogress: {
      color: 'bg-brand-primary/20 text-brand-primary',
      text: 'Devam Ediyor'
    },
    inreview: {
      color: 'bg-brand-info/20 text-brand-info',
      text: 'İncelemede'
    },
    done: {
      color: 'bg-brand-success/20 text-brand-success',
      text: 'Tamamlandı'
    }
  };

  return (
    <div className="group animate-fade-in">
      <div className="bg-dark-secondary rounded-lg p-4 shadow-card hover:shadow-card-hover border border-dark-border transition-all duration-200 hover:border-brand-primary/50">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-dark-text">
            {task.title}
          </h3>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit?.(task)}
              className="p-2 rounded-lg hover:bg-dark-hover text-dark-muted hover:text-brand-primary transition-colors"
              title="Düzenle"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete?.(task.id)}
              className="p-2 rounded-lg hover:bg-dark-hover text-dark-muted hover:text-brand-danger transition-colors"
              title="Sil"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-dark-muted mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[task.status].color}`}>
            {statusConfig[task.status].text}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${priorityConfig[task.priority].color}`}>
            <FaFlag className="mr-1 w-3 h-3" />
            {priorityConfig[task.priority].text}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-dark-muted">
          <div className="flex items-center space-x-4">
            {task.due_date && (
              <div className="flex items-center space-x-1">
                <FaCalendar className="w-3 h-3" />
                <span>{format(new Date(task.due_date), 'd MMM yyyy', { locale: tr })}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <FaClock className="w-3 h-3" />
              <span>{format(new Date(task.created_at), 'd MMM yyyy', { locale: tr })}</span>
            </div>
          </div>
          {task.image_url && (
            <div className="flex items-center">
              <img 
                src={task.image_url} 
                alt="Görev resmi"
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-dark-border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/32';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TaskCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {}
};

export default TaskCard;
