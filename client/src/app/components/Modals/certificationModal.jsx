import React from "react";

const ModalFile = ({ filesUrl, onClose }) => {
  const isPDF = filesUrl.endsWith('.pdf');

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="max-w-lg w-full bg-white p-4 rounded-md shadow-lg">
        {isPDF ? (
          <div className="text-center">
            <p className="mb-4">Este archivo es un PDF. Haga clic en el botón para abrir en una nueva pestaña.</p>
            <a 
              href={filesUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
            >
              Abrir PDF
            </a>
          </div>
        ) : (
          <img src={filesUrl} alt="Expanded" className="w-full h-auto max-h-[80vh] object-contain" />
        )}
        <button
          onClick={onClose}
          className="mt-4 mx-auto block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalFile;