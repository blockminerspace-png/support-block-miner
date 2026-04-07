import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ErrorBoundary from '../components/ErrorBoundary';
import { api } from '../store/auth';
import { Menu, X } from 'lucide-react';

export const AdminContext = createContext({ adminLevel: null, adminEmail: null });
export const useAdminCtx = () => useContext(AdminContext);

export default function AdminLayout() {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
    const [adminLevel, setAdminLevel] = useState(null);
    const [adminEmail, setAdminEmail] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Fecha sidebar ao navegar em mobile
    useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                const res = await api.get('/admin/auth/check');
                setIsAdminAuthenticated(res.data.ok);
                setAdminLevel(typeof res.data.level === 'number' ? res.data.level : 2);
                setAdminEmail(res.data.email ?? null);
            } catch (err) {
                setIsAdminAuthenticated(false);
            }
        };
        checkAdminAuth();
    }, []);

    if (isAdminAuthenticated === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isAdminAuthenticated === false) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <AdminContext.Provider value={{ adminLevel, adminEmail }}>
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar desktop — sempre visível em lg+ */}
            <div className="hidden lg:flex shrink-0">
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Sidebar mobile — drawer overlay */}
            <div className={`fixed inset-y-0 left-0 z-40 lg:hidden transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 lg:h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 flex items-center px-4 lg:px-8 sticky top-0 z-10 shrink-0">
                    {/* Hamburger mobile */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden mr-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base lg:text-xl font-black text-white tracking-tight uppercase truncate">Painel de Controle</h1>
                        <p className="text-[9px] lg:text-[10px] text-amber-500/70 font-bold uppercase tracking-widest hidden sm:block">Modo Administrador Ativo</p>
                    </div>
                    {adminLevel !== null && adminLevel <= 1 && (
                        <span className={`ml-3 px-2 lg:px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 ${ adminLevel === 0 ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20' }`}>
                            { adminLevel === 0 ? '⬡ Super' : '★ Full' }
                        </span>
                    )}
                </header>
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <ErrorBoundary resetKey={location.pathname}>
                            <Outlet />
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
        </div>
        </AdminContext.Provider>
    );
}
