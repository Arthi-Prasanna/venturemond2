import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('user_session', JSON.stringify({ role: data.role }));
                router.push(data.redirect);
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.warn('Backend unreachable, failing over to local auth');
            // Fallback for demo purposes if backend is down
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('user_session', JSON.stringify({ role: 'admin' }));
                router.push('/admin');
            } else if (username === 'client' && password === 'client123') {
                localStorage.setItem('user_session', JSON.stringify({ role: 'client' }));
                router.push('/client');
            } else {
                setError('Login failed. Check backend or credentials.');
            }
        }
    };

    return (
        <>
            <Head>
                <title>Login | Flowmondo</title>
            </Head>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'radial-gradient(circle at top right, #1f232e, #0f1014)' }}>
                <div className="card slide-in" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="brand" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                        Flow<span>mondo</span>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-lg">
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Sign In
                        </button>
                    </form>

                    {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '1rem' }}>{error}</div>}

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '2rem' }}>
                        <p className="mb-4">Quick Access (Dev Mode):</p>
                        <div className="flex gap-md justify-center">
                            <button
                                className="btn btn-outline"
                                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                onClick={() => {
                                    localStorage.setItem('user_session', JSON.stringify({ role: 'admin' }));
                                    router.push('/admin');
                                }}
                            >
                                Open Admin Dashboard
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                onClick={() => {
                                    localStorage.setItem('user_session', JSON.stringify({ role: 'client' }));
                                    router.push('/client');
                                }}
                            >
                                Open Client Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
