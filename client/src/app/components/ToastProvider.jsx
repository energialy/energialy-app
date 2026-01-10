'use client';

import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && (
        <div>
          {typeof window !== 'undefined' && (() => {
            const { ToastContainer } = require('react-toastify');
            return (
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
            );
          })()}
        </div>
      )}
    </>
  );
}
