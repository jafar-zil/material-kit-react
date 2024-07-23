import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import { useAuth } from 'src/context/AuthContext';

export const IndexPage = lazy(() => import('src/pages/app'));
export const ItemPage = lazy(() => import('src/pages/item'));
export const IncomePage = lazy(() => import('src/pages/income'));
export const ExpensePage = lazy(() => import('src/pages/expense'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const { authenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/',
      element: authenticated ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'item', element: <ItemPage /> },
        { path: 'income', element: <IncomePage /> },
        { path: 'expense', element: <ExpensePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
