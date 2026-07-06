import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home, Users, Target, Bell, Clock, Calendar,
  Users2, User, LogOut, ShieldCheck,
} from 'lucide-react';
import { COLORS } from '../../constants/colors';
import { useAuth, type UserRole } from '../../../contexts/AuthContext';

// ── Navigation ────────────────────────────────────────────────────────────────

type NavItem = {
  path:   string;
  label:  string;
  icon:   React.ReactNode;
  end?:   boolean;
  roles?: UserRole[];
};

const ALL_NAV: NavItem[] = [
  { path: '/',           label: 'Accueil',     icon: <Home size={18} />,       end: true },
  { path: '/clients',    label: 'Clients',     icon: <Users size={18} />,      roles: ['PRODUCTEUR', 'MANAGER', 'ADMIN'] },
  { path: '/pipeline',   label: 'Pipeline',    icon: <Target size={18} />,     roles: ['PRODUCTEUR', 'COMMERCIAL', 'MANAGER', 'ADMIN'] },
  { path: '/relances',   label: 'Relances',    icon: <Bell size={18} />,       roles: ['PRODUCTEUR', 'COMMERCIAL', 'MANAGER', 'ADMIN'] },
  { path: '/echeances',  label: 'Échéances',   icon: <Clock size={18} />,      roles: ['PRODUCTEUR', 'MANAGER', 'ADMIN'] },
  { path: '/calendrier', label: 'Calendrier',  icon: <Calendar size={18} />,   roles: ['COMMERCIAL', 'MANAGER', 'ADMIN'] },
  { path: '/equipe',     label: 'Équipe',      icon: <Users2 size={18} />,     roles: ['MANAGER', 'ADMIN'] },
];

// Mobile tab bar : 4 items métier + Profil (5 max)
const MOBILE_BY_ROLE: Record<UserRole, NavItem[]> = {
  PRODUCTEUR: [
    { path: '/',          label: 'Accueil',    icon: <Home size={22} />,  end: true },
    { path: '/clients',   label: 'Clients',    icon: <Users size={22} /> },
    { path: '/echeances', label: 'Échéances',  icon: <Clock size={22} /> },
    { path: '/relances',  label: 'Relances',   icon: <Bell size={22} /> },
    { path: '/profil',    label: 'Profil',     icon: <User size={22} /> },
  ],
  COMMERCIAL: [
    { path: '/',           label: 'Accueil',    icon: <Home size={22} />,    end: true },
    { path: '/pipeline',   label: 'Pipeline',   icon: <Target size={22} /> },
    { path: '/calendrier', label: 'Calendrier', icon: <Calendar size={22} /> },
    { path: '/relances',   label: 'Relances',   icon: <Bell size={22} /> },
    { path: '/profil',     label: 'Profil',     icon: <User size={22} /> },
  ],
  PROMOTEUR: [
    { path: '/',       label: 'Accueil', icon: <Home size={22} />, end: true },
    { path: '/profil', label: 'Profil',  icon: <User size={22} /> },
  ],
  MANAGER: [
    { path: '/',          label: 'Accueil',  icon: <Home size={22} />,   end: true },
    { path: '/clients',   label: 'Clients',  icon: <Users size={22} /> },
    { path: '/relances',  label: 'Relances', icon: <Bell size={22} /> },
    { path: '/equipe',    label: 'Équipe',   icon: <Users2 size={22} /> },
    { path: '/profil',    label: 'Profil',   icon: <User size={22} /> },
  ],
  ADMIN: [
    { path: '/',          label: 'Accueil',  icon: <Home size={22} />,   end: true },
    { path: '/clients',   label: 'Clients',  icon: <Users size={22} /> },
    { path: '/relances',  label: 'Relances', icon: <Bell size={22} /> },
    { path: '/equipe',    label: 'Équipe',   icon: <Users2 size={22} /> },
    { path: '/profil',    label: 'Profil',   icon: <User size={22} /> },
  ],
};

function navItemsForRole(role: UserRole): NavItem[] {
  return ALL_NAV.filter(item => !item.roles || item.roles.includes(role));
}

// ── Sidebar (desktop md+) ─────────────────────────────────────────────────────

function Sidebar({ user, onLogout }: { user: { nom: string; role: UserRole }; onLogout: () => void }) {
  const items = navItemsForRole(user.role);
  const initial = user.nom.charAt(0).toUpperCase();

  const ROLE_LABEL: Record<UserRole, string> = {
    PRODUCTEUR: 'Producteur',
    COMMERCIAL: 'Commercial',
    PROMOTEUR:  'Promoteur',
    MANAGER:    'Manager',
    ADMIN:      'Administrateur',
  };

  return (
    <aside
      className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:z-30"
      style={{ width: 240, background: '#fff', borderRight: `1px solid ${COLORS.border}` }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: `1px solid ${COLORS.border}` }}
      >
        <svg width="32" height="32" viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
          <path d="M32 4 L60 32 L32 60 L4 32 Z"  fill={`${COLORS.primary}22`} stroke={`${COLORS.primary}55`} strokeWidth="2" />
          <path d="M32 12 L52 32 L32 52 L12 32 Z" fill={`${COLORS.primary}33`} stroke={COLORS.primary} strokeWidth="2" />
          <path d="M32 20 L44 32 L32 44 L20 32 Z" fill={COLORS.primary} />
        </svg>
        <div>
          <div className="font-montserrat font-bold text-base leading-tight" style={{ color: COLORS.primary }}>
            Assurance CRM
          </div>
          <div className="font-inter text-xs" style={{ color: COLORS.muted }}>
            Votre portefeuille
          </div>
        </div>
      </div>

      {/* Nav principale */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-inter text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'hover:bg-gray-50'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: COLORS.primary, color: '#fff' }
                : { color: COLORS.text }
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profil + déconnexion */}
      <div className="px-3 py-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <NavLink
          to="/profil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 mb-1"
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-white font-montserrat font-bold text-sm flex-shrink-0"
            style={{ background: COLORS.secondary }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <div className="font-inter text-sm font-semibold truncate" style={{ color: COLORS.text }}>
              {user.nom}
            </div>
            <div className="font-inter text-xs" style={{ color: COLORS.muted }}>
              {ROLE_LABEL[user.role]}
            </div>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-inter text-sm transition-colors hover:bg-red-50"
          style={{ color: COLORS.muted }}
          onMouseEnter={e => (e.currentTarget.style.color = COLORS.alert)}
          onMouseLeave={e => (e.currentTarget.style.color = COLORS.muted)}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ── Bottom tab (mobile) ───────────────────────────────────────────────────────

function MobileBottomNav({ role }: { role: UserRole }) {
  const items = MOBILE_BY_ROLE[role];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex"
      style={{
        background: '#fff',
        borderTop: `1px solid ${COLORS.border}`,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className="flex-1"
        >
          {({ isActive }) => (
            <div
              className="flex flex-col items-center justify-center py-2 gap-0.5"
              style={{ color: isActive ? COLORS.primary : '#9CA3AF' }}
            >
              {item.icon}
              <span style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                {item.label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: COLORS.primary }}
                />
              )}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

// ── Shell principal ───────────────────────────────────────────────────────────

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-full" style={{ background: COLORS.bg }}>
      {/* Sidebar desktop */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Zone contenu */}
      <div
        className="flex flex-col flex-1 min-h-full overflow-hidden"
        style={{ marginLeft: 0 }}
      >
        {/* Décalage sidebar uniquement sur md+ via classe Tailwind */}
        <div className="flex flex-col flex-1 overflow-hidden md:ml-[240px] h-full">
          <main className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Bottom nav mobile */}
      <MobileBottomNav role={user.role} />
    </div>
  );
}
