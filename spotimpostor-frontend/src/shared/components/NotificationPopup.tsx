import React from 'react';

interface NotificationPopupProps {
  message: string;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-green-400 rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center font-chakra-petch">
        <p className="text-white text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          style={{ boxShadow: '0 0 10px rgba(52, 211, 153, 0.7)' }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
