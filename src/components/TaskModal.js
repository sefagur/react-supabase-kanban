import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FaImage, FaTimes, FaCalendarAlt, FaFlag, FaList, FaUpload, FaSpinner } from 'react-icons/fa';

function TaskModal({ task, onClose, onTaskUpdate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.due_date?.split('T')[0] || '');
      setStatus(task.status);
      setPreview(task.image_url);
    }
  }, [task]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setImage(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Lütfen giriş yapın');
        return;
      }

      let image_url = task?.image_url;

      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('task-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('task-images')
          .getPublicUrl(fileName);
          
        image_url = publicUrl;
      }

      const taskData = {
        title,
        description,
        priority,
        due_date: dueDate,
        status,
        image_url,
        user_id: session.user.id
      };

      if (task) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id);

        if (error) throw error;
        toast.success('Görev güncellendi');
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);

        if (error) throw error;
        toast.success('Görev oluşturuldu');
      }

      onTaskUpdate();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-secondary rounded-xl w-full max-w-lg shadow-modal animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-dark-text">
              {task ? 'Görevi Düzenle' : 'Yeni Görev'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-hover text-dark-muted hover:text-brand-danger transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-accent text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                placeholder="Görev başlığı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-accent text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                placeholder="Görev açıklaması"
                rows="4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  <FaFlag className="inline mr-2 text-brand-warning" />
                  Öncelik
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-accent text-dark-text focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                >
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  <FaList className="inline mr-2 text-brand-primary" />
                  Durum
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-accent text-dark-text focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                >
                  <option value="todo">Yapılacak</option>
                  <option value="inprogress">Devam Ediyor</option>
                  <option value="inreview">İncelemede</option>
                  <option value="done">Tamamlandı</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                <FaCalendarAlt className="inline mr-2 text-brand-info" />
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-accent text-dark-text focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                <FaImage className="inline mr-2 text-brand-success" />
                Resim
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? 'border-brand-primary bg-brand-primary/5' 
                    : 'border-dark-border hover:border-brand-primary/50'}`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Önizleme"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setImage(null);
                      }}
                      className="absolute top-0 right-0 bg-brand-danger text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-opacity-90 transition-opacity"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-dark-muted">
                    <FaUpload className="mx-auto w-8 h-8" />
                    <p>
                      {isDragActive
                        ? 'Resmi buraya bırakın'
                        : 'Resim yüklemek için tıklayın veya sürükleyin'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-dark-border text-dark-text hover:bg-dark-hover transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand-primary text-dark-text hover:bg-brand-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <span>{task ? 'Güncelle' : 'Oluştur'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
