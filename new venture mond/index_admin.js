import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    SquaresFour, Users, ChartLineUp, Receipt, Gear, SignOut,
    Bell, CurrencyDollar, Hourglass, CaretUp
} from '@phosphor-icons/react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const router = useRouter();
    const [stats, setStats] = useState({ clients: 0, revenue: 0, pending: 0 });
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch('/api/admin/stats');
                const clientsRes = await fetch('/api/admin/clients');

                if (statsRes.ok && clientsRes.ok) {
                    setStats(await statsRes.json());
                    setClients(await clientsRes.json());
                } else {
                    throw new Error('API Error');
                }
            } catch (error) {
                console.warn('Backend unreachable, using mock data');
                setStats({ clients: 142, revenue: 45.2, pending: 18 });
                setClients([
                    { name: 'Stark Industries', project: 'Arc Reactor UI', status: 'Active', budget: '$500k', avatar: 'S' },
                    { name: 'Wayne Enterprises', project: 'Batcave Security', status: 'Pending', budget: '$850k', avatar: 'W' },
                    { name: 'Cyberdyne', project: 'Skynet Protocol', status: 'Delayed', budget: '$1.2M', avatar: 'C' },
                    { name: 'Umbrella Corp', project: 'Viral Marketing', status: 'Active', budget: '$200k', avatar: 'U' },
                ]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('user_session'));
        if (!session || session.role !== 'admin') {
            router.push('/');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_session');
        router.push('/');
    };

    return (
        <>
            <Head><title>Admin | Flowmondo</title></Head>

            {/* Sidebar */}
            <aside className="sidebar slide-in">
                <div className="brand">
                    <SquaresFour weight="fill" />
                    Flow<span>mondo</span>
                </div>

                <nav>
                    <NavItem icon={<SquaresFour />} label="Dashboard" id="dashboard" active={activeTab} set={setActiveTab} />
                    <NavItem icon={<Users />} label="Clients" id="clients" active={activeTab} set={setActiveTab} />
                    <NavItem icon={<ChartLineUp />} label="Analytics" id="analytics" active={activeTab} set={setActiveTab} />
                    <NavItem icon={<Receipt />} label="Invoices" id="invoices" active={activeTab} set={setActiveTab} />
                    <div style={{ flexGrow: 1 }}></div>
                    <NavItem icon={<Gear />} label="Settings" id="settings" active={activeTab} set={setActiveTab} />
                    <div className="nav-link" onClick={handleLogout}>
                        <SignOut /> Logout
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header slide-in delay-1">
                    <div>
                        <h1 className="page-title">Admin Overview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Administrator</p>
                    </div>
                    <div className="user-profile">
                        <button className="btn btn-outline" style={{ border: 'none', padding: '8px' }}>
                            <Bell size={24} />
                        </button>
                        <div className="avatar">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=5271ff&color=fff" alt="Admin" />
                        </div>
                    </div>
                </header>

                {/* Pages */}
                {activeTab === 'dashboard' && (
                    <div className="app-section fade-in" style={{ display: 'block' }}>
                        <section className="stats-grid slide-in delay-2">
                            <StatCard
                                label="Total Clients" value={stats.clients} icon={<Users color="var(--primary)" />}
                                sub="12% vs last month" onClick={() => setActiveTab('clients')}
                            />
                            <StatCard
                                label="Monthly Revenue" value={`$${stats.revenue}k`} icon={<CurrencyDollar color="var(--accent)" />}
                                sub="8% vs last month" onClick={() => setActiveTab('analytics')}
                            />
                            <StatCard
                                label="Pending Projects" value={stats.pending} icon={<Hourglass color="var(--warning)" />}
                                sub="Requires attention" onClick={() => setActiveTab('clients')}
                            />
                        </section>

                        <div className="grid slide-in delay-3" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
                            <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('clients')}>
                                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
                                    <h3>Recent Clients</h3>
                                    <button className="btn btn-primary" onClick={() => setActiveTab('clients')}>View All</button>
                                </div>
                                <div className="table-container">
                                    <ClientTable limit={5} data={clients} />
                                </div>
                            </div>

                            <div className="card flex flex-col" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('analytics')}>
                                <h3 style={{ marginBottom: 'var(--space-md)' }}>Revenue Trend</h3>
                                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                                    {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
                                        <div key={i} className="visual-bar" style={{
                                            flex: 1, background: 'var(--bg-hover)', borderRadius: '4px', height: '100%', position: 'relative'
                                        }}>
                                            <div style={{
                                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                                height: `${h}%`, background: 'var(--primary)', borderRadius: '4px', opacity: 0.8
                                            }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'clients' && (
                    <div className="app-section slide-in">
                        <div className="card">
                            <div className="flex justify-between items-center mb-4">
                                <h2>Client Database</h2>
                                <button className="btn btn-primary">Add Client</button>
                            </div>
                            <ClientTable data={clients} />
                        </div>
                    </div>
                )}

                {/* Other tabs placeholders */}
                {activeTab === 'analytics' && <div className="card slide-in"><h2>Analytics Dashboard</h2><p>Charts would go here.</p></div>}
                {activeTab === 'invoices' && <div className="card slide-in"><h2>Invoices</h2><p>Invoice list would go here.</p></div>}
                {activeTab === 'settings' && <div className="card slide-in"><h2>System Settings</h2><p>Configuration form.</p></div>}

            </main>
        </>
    );
}

function NavItem({ icon, label, id, active, set }) {
    return (
        <div className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => set(id)}>
            {icon} {label}
        </div>
    );
}

function StatCard({ label, value, icon, sub, onClick }) {
    return (
        <div className="card stat-card" onClick={onClick}>
            <div className="flex justify-between items-center">
                <span className="stat-label">{label}</span>
                {icon}
            </div>
            <div className="stat-value">{value}</div>
            <div style={{ color: 'var(--success)', fontSize: '0.8rem' }}>
                <CaretUp weight="fill" /> {sub}
            </div>
        </div>
    );
}

function ClientTable({ limit, data = [] }) {
    const display = limit ? data.slice(0, limit) : data;

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th><th>Project</th><th>Status</th><th>Budget</th>
                </tr>
            </thead>
            <tbody>
                {display.map((c, i) => (
                    <tr key={i}>
                        <td>{c.name}</td>
                        <td>{c.project}</td>
                        <td><span className={`badge badge-${c.status === 'Active' ? 'success' : 'warning'}`}>{c.status}</span></td>
                        <td>{c.budget}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
