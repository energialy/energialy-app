'use client';

import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider({ children }) {
  const [ToastContainer, setToastContainer] = useState(null);

  useEffect(() => {
    // Only import on client side
    import('react-toastify').then((module) => {
      setToastContainer(() => module.ToastContainer);
    });
  }, []);

  return (
    <>
      {children}
      {ToastContainer && (
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      )}
    </>
  );
}
