// ============================================================
// App principal
// ============================================================

import React from 'react';
import { Toaster } from 'react-hot-toast';
import KycPage from './pages/KycPage';

const App: React.FC = () => {
  return (
    <>
      <KycPage />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '13px',
            maxWidth: '360px',
          },
          success: {
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
            },
            duration: 5000,
          },
        }}
      />
    </>
  );
};

export default App;
