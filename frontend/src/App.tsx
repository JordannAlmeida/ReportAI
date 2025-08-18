import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './i18n/i18n';

export function App() {
  return <RouterProvider router={router} />;
}
