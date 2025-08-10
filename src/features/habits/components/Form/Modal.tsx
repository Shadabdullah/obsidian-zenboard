interface ModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, description, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {description}
      </p>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
        >
          Okay
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
