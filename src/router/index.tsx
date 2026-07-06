import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import LoginScreen from '../features/auth/pages/LoginScreen';
import { AppShell } from '../shared/components/layout/AppShell';

// ── Code splitting par feature ────────────────────────────────────────────────

const ProducerDashboard   = lazy(() => import('../features/dashboard/pages/ProducerDashboard'));
const CommercialDashboard = lazy(() => import('../features/dashboard/pages/CommercialDashboard'));
const PromoterDashboard   = lazy(() => import('../features/dashboard/pages/PromoterDashboard'));
const ClientsList         = lazy(() => import('../features/clients/pages/ClientsList'));
const ClientDetail        = lazy(() => import('../features/clients/pages/ClientDetail'));
const ClientForm          = lazy(() => import('../features/clients/pages/ClientForm'));
const PipelineScreen      = lazy(() => import('../features/prospects/pages/PipelineScreen'));
const ProspectDetail      = lazy(() => import('../features/prospects/pages/ProspectDetail'));
const ProspectForm        = lazy(() => import('../features/prospects/pages/ProspectForm'));
const RelancesScreen      = lazy(() => import('../features/relances/pages/RelancesScreen'));
const EcheancesScreen     = lazy(() => import('../features/contracts/pages/EcheancesScreen'));
const CalendrierScreen    = lazy(() => import('../features/calendrier/pages/CalendrierScreen'));
const EquipeScreen        = lazy(() => import('../features/equipe/pages/EquipeScreen'));
const ProfilScreen        = lazy(() => import('../features/profil/pages/ProfilScreen'));

// ── Composants de garde ───────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center font-inter text-sm text-gray-400">
      Chargement…
    </div>
  );
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequireRole({ roles }: { roles: UserRole[] }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const Dashboard = {
    PRODUCTEUR: ProducerDashboard,
    COMMERCIAL: CommercialDashboard,
    PROMOTEUR:  PromoterDashboard,
    MANAGER:    ProducerDashboard,
    ADMIN:      ProducerDashboard,
  }[user.role] ?? ProducerDashboard;

  return <S><Dashboard /></S>;
}

// ── Routeur ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  { path: '/login', element: <LoginScreen /> },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <RoleDashboard /> },

          // Clients (PRODUCTEUR + MANAGER + ADMIN)
          {
            element: <RequireRole roles={['PRODUCTEUR', 'MANAGER', 'ADMIN']} />,
            children: [
              {
                path: 'clients',
                children: [
                  { index: true,      element: <S><ClientsList /></S> },
                  { path: 'nouveau',  element: <S><ClientForm /></S> },
                  { path: ':id',      element: <S><ClientDetail /></S> },
                  { path: ':id/edit', element: <S><ClientForm /></S> },
                ],
              },
            ],
          },

          // Pipeline prospects (PRODUCTEUR + COMMERCIAL + MANAGER + ADMIN)
          {
            element: <RequireRole roles={['PRODUCTEUR', 'COMMERCIAL', 'MANAGER', 'ADMIN']} />,
            children: [
              {
                path: 'pipeline',
                children: [
                  { index: true,       element: <S><PipelineScreen /></S> },
                  { path: ':id',       element: <S><ProspectDetail /></S> },
                  { path: 'nouveau',   element: <S><ProspectForm /></S> },
                ],
              },
            ],
          },

          // Tous les rôles
          { path: 'relances',   element: <S><RelancesScreen /></S> },
          { path: 'echeances',  element: <S><EcheancesScreen /></S> },
          { path: 'calendrier', element: <S><CalendrierScreen /></S> },
          { path: 'profil',     element: <S><ProfilScreen /></S> },

          // Équipe (MANAGER + ADMIN)
          {
            element: <RequireRole roles={['MANAGER', 'ADMIN']} />,
            children: [
              { path: 'equipe', element: <S><EquipeScreen /></S> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
