import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    House, Kanban, Files, ChatCircleDots, SignOut,
    WarningCircle, FilePdf, FileImage, Receipt
} from '@phosphor-icons/react';

export default function ClientDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/client/dashboard');
                if (res.ok) {
                    setData(await res.json());
                } else {
                    throw new Error('API Error');
                }
            } catch (error) {
                console.warn('Backend unreachable, using mock data');
                setData({
                    projectName: 'Quantum Website Redesign',
                    clientName: 'Alex Morgan',
                    balance: 2450.00,
                    documents: [
                        { name: 'Project_Proposal_v2.pdf', size: '2.4 MB', date: '2 days ago', type: 'pdf' },
                        { name: 'Homepage_Mockup_v1.png', size: '5.1 MB', date: '5 days ago', type: 'image' }
                    ],
                    timeline: [
                        { status: 'completed', title: 'Discovery', date: 'Sep 15' },
                        { status: 'completed', title: 'Wireframing', date: 'Sep 30' },
                        { status: 'active', title: 'UI Design', date: 'In Progress' },
                        { status: 'pending', title: 'Development', date: 'Nov 1' },
                    ]
                });
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('user_session'));
        if (!session || session.role !== 'client') {
            router.push('/');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_session');
        router.push('/');
    };

    return (
        <>
            <Head><title>Client | Flowmondo</title></Head>

            <aside className="sidebar slide-in">
                <div className="brand">
                    <House weight="fill" />
                    Flow<span>mondo</span>
                </div>

                <nav>
                    <NavItem icon={<House />} label="Overview" id="overview" active={activeTab} set={setActiveTab} />
                    <NavItem icon={<Kanban />} label="My Project" id="projects" active={activeTab} set={setActiveTab} />
                    <NavItem icon={<Files />} label="Documents" id="documents" active={activeTab} set={setActiveTab} />
                    <NavItem icon={<ChatCircleDots />} label="Support" id="support" active={activeTab} set={setActiveTab} />

                    <div style={{ flexGrow: 1 }}></div>

                    <div className="card" style={{ padding: 'var(--space-md)', fontSize: '0.8rem', borderColor: 'var(--warning)', marginBottom: '1rem' }}>
                        <div className="flex items-center gap-sm mb-2" style={{ color: 'var(--warning)' }}>
                            <WarningCircle weight="fill" /> Action Needed
                        </div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Invoice #9902 is pending.</p>
                        <button className="btn btn-primary w-full" style={{ fontSize: '0.8rem', padding: '6px' }} onClick={() => setShowPaymentModal(true)}>
                            Pay Now
                        </button>
                    </div>

                    <div className="nav-link" onClick={handleLogout}>
                        <SignOut /> Logout
                    </div>
                </nav>
            </aside>

            <main className="main-content">
                <header className="header slide-in delay-1">
                    <div>
                        <h1 className="page-title">Project Overview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Project: <strong>{data?.projectName || 'Loading...'}</strong></p>
                    </div>
                    <div className="user-profile">
                        <div className="flex flex-col" style={{ alignItems: 'flex-end', marginRight: 'var(--space-md)' }}>
                            <span style={{ fontWeight: 600 }}>{data?.clientName || 'Client'}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Client</span>
                        </div>
                        <div className="avatar">
                            <img src="https://ui-avatars.com/api/?name=Alex+Morgan&background=00cca3&color=fff" alt="Alex" />
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="grid slide-in delay-2" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
                        <div className="flex flex-col gap-lg">
                            <div className="card" onClick={() => setActiveTab('projects')} style={{ cursor: 'pointer' }}>
                                <h3>Project Progress</h3>
                                <Timeline items={data?.timeline} />
                            </div>

                            <div className="card">
                                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                                    <h3>Recent Documents</h3>
                                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '4px 8px' }} onClick={() => setActiveTab('documents')}>View All</button>
                                </div>
                                {data?.documents?.slice(0, 2).map((doc, i) => (
                                    <DocItem key={i} {...doc} />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-lg">
                            <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', position: 'relative', overflow: 'hidden' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Outstanding Balance</p>
                                        <h2 style={{ fontSize: '2rem', margin: '4px 0' }}>${data?.balance?.toLocaleString() || '0.00'}</h2>
                                        <span className="badge badge-warning">Due in 3 days</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                                        <Receipt size={24} />
                                    </div>
                                </div>
                                <button className="btn btn-primary w-full" style={{ marginTop: 'var(--space-lg)' }} onClick={() => setShowPaymentModal(true)}>
                                    Pay Invoice
                                </button>
                            </div>

                            <div className="card">
                                <h3>Project Team</h3>
                                <button className="btn btn-outline w-full mt-4" onClick={() => setActiveTab('support')}>Contact Team</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="card slide-in">
                        <h2>Detailed Project Timeline</h2>
                        <Timeline items={data?.timeline} full />
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="card slide-in">
                        <h2>All Documents</h2>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            <div className="card flex-col items-center justify-center p-4">
                                <FilePdf size={48} color="var(--primary)" />
                                <span className="mt-2">Brief.pdf</span>
                            </div>
                            <div className="card flex-col items-center justify-center p-4">
                                <FileImage size={48} color="var(--accent)" />
                                <span className="mt-2">Asset.png</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'support' && (
                    <div className="card slide-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2>Support</h2>
                        <textarea className="form-control mt-4" rows="5" placeholder="How can we help?"></textarea>
                        <button className="btn btn-primary mt-4">Send Message</button>
                    </div>
                )}

            </main>

            {showPaymentModal && <PaymentModal close={() => setShowPaymentModal(false)} />}
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

function Timeline({ items, full }) {
    if (!items) return <div>Loading...</div>;
    return (
        <div className="timeline" style={{ position: 'relative', paddingLeft: '20px', marginTop: '1rem', borderLeft: '2px solid var(--border)' }}>
            {items.map((item, i) => (
                <TimelineItem key={i} {...item} />
            ))}
        </div>
    );
}

function TimelineItem({ status, title, date }) {
    const color = status === 'completed' ? 'var(--primary)' : (status === 'active' ? 'var(--accent)' : 'var(--bg-card)');
    const borderColor = status === 'completed' ? 'var(--primary)' : (status === 'active' ? 'var(--accent)' : 'var(--text-muted)');

    return (
        <div style={{ position: 'relative', paddingLeft: '20px', marginBottom: '1.5rem' }}>
            <div style={{
                position: 'absolute', left: '-27px', width: '12px', height: '12px', borderRadius: '50%',
                background: color, border: `2px solid ${borderColor}`, boxShadow: status === 'active' ? '0 0 10px var(--accent)' : 'none'
            }}></div>
            <h4>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{date}</p>
        </div>
    );
}

function DocItem({ name, size, date, type }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', marginBottom: '8px' }}>
            {type === 'pdf' ? <FilePdf size={24} color="var(--primary)" style={{ marginRight: '10px' }} /> : <FileImage size={24} color="var(--accent)" style={{ marginRight: '10px' }} />}
            <div className="flex flex-col">
                <span>{name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{size} • {date}</span>
            </div>
        </div>
    );
}

function PaymentModal({ close }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="mb-4">Select Payment</h2>
                {['UPI', 'Card', 'Net Banking'].map(m => (
                    <div key={m} style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer' }}>{m}</div>
                ))}
                <button className="btn btn-primary w-full mt-4" onClick={() => { alert('Paid!'); close(); }}>Proceed</button>
                <button className="btn btn-outline w-full mt-2" onClick={close}>Cancel</button>
            </div>
        </div>
    );
}
