import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../supabaseClient';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import { toast } from 'react-toastify';
import { FaPlus, FaTasks } from 'react-icons/fa';

const columns = {
  'Yapılacak': { 
    id: 'todo', 
    title: 'Yapılacak',
    bgColor: 'bg-dark-secondary',
    borderColor: 'border-dark-border',
    textColor: 'text-dark-text'
  },
  'Devam Ediyor': { 
    id: 'inprogress', 
    title: 'Devam Ediyor',
    bgColor: 'bg-dark-secondary',
    borderColor: 'border-dark-border',
    textColor: 'text-dark-text'
  },
  'İncelemede': { 
    id: 'inreview', 
    title: 'İncelemede',
    bgColor: 'bg-dark-secondary',
    borderColor: 'border-dark-border',
    textColor: 'text-dark-text'
  },
  'Tamamlandı': { 
    id: 'done', 
    title: 'Tamamlandı',
    bgColor: 'bg-dark-secondary',
    borderColor: 'border-dark-border',
    textColor: 'text-dark-text'
  }
};

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Lütfen giriş yapın');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast.error('Görevler yüklenirken hata: ' + error.message);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: destination.droppableId })
        .eq('id', draggableId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === draggableId 
          ? { ...task, status: destination.droppableId }
          : task
      ));
    } catch (error) {
      toast.error('Görev durumu güncellenirken hata oluştu');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Görev başarıyla silindi');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error('Görev silinirken hata oluştu');
    }
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text">
      <div className="flex justify-between items-center mb-8 bg-dark-secondary p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3">
          <FaTasks className="w-6 h-6 text-brand-primary" />
          <h1 className="text-2xl font-bold">Görevlerim</h1>
        </div>
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="w-4 h-4" />
          <span>Yeni Görev</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(columns).map(column => (
            <div 
              key={column.id} 
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <span>{column.title}</span>
                  <span className="text-sm bg-dark-accent px-2 py-0.5 rounded-full ml-2">
                    {tasks.filter(task => task.status === column.id).length}
                  </span>
                </h2>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 rounded-lg border ${column.borderColor} ${column.bgColor} 
                      ${snapshot.isDraggingOver ? 'border-brand-primary/50 bg-dark-accent' : ''} 
                      transition-colors duration-200 min-h-[500px]`}
                  >
                    <div className="space-y-4">
                      {tasks
                        .filter(task => task.status === column.id)
                        .map((task, index) => (
                          <Draggable 
                            key={task.id} 
                            draggableId={task.id.toString()} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                              >
                                <TaskCard 
                                  task={task} 
                                  onEdit={() => handleTaskClick(task)}
                                  onDelete={() => openDeleteModal(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onTaskUpdate={fetchTasks}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={() => handleDeleteTask(taskToDelete.id)}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}

export default Dashboard;
