import { FaExclamationTriangle } from 'react-icons/fa';

function DeleteModal({ isOpen, onClose, onConfirm, taskTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-dark-primary bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block p-4 overflow-hidden text-left align-bottom transition-all transform bg-dark-secondary rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-brand-danger/20 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <FaExclamationTriangle className="w-6 h-6 text-brand-danger" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-dark-text">
                Görevi Sil
              </h3>
              <div className="mt-2">
                <p className="text-sm text-dark-muted">
                  "{taskTitle}" görevini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-brand-danger border border-transparent rounded-md shadow-sm hover:opacity-90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onConfirm}
            >
              Sil
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium border rounded-md shadow-sm text-dark-text bg-dark-accent hover:bg-dark-hover focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
