import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ReportAIManager from '../pages/reportAIManager';
import GenerateReport from '../pages/GenerateReport';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'reports',
        element: <ReportAIManager />,
      },
      {
        path: 'generate',
        element: <GenerateReport />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
