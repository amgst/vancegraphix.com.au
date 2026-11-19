import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../components/admin/AuthProvider';
import '../../components/admin/admin.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    if (!loading && user) return <Navigate to="/admin/dashboard" replace />;
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault(); setError(''); setIsSubmitting(true);
        try { await signInWithEmailAndPassword(auth, email.trim(), password); navigate('/admin/dashboard', { replace: true }); }
        catch (err: any) {
            if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(err.code)) setError('The email or password is incorrect. Please try again.');
            else if (err.code === 'auth/too-many-requests') setError('Too many attempts. Please wait a moment before trying again.');
            else if (err.code === 'auth/network-request-failed') setError('Unable to connect. Check your internet connection and try again.');
            else setError('We could not sign you in. Please try again.');
        } finally { setIsSubmitting(false); }
    };
    return <main className="admin-login">
        <section className="admin-login-story"><Link to="/" className="admin-brand"><span className="admin-brand-mark">v<span>.</span></span><span>Vance Graphix<small>STUDIO WORKSPACE</small></span></Link><div className="admin-login-message"><span className="admin-welcome-tag"><span />A SPACE FOR YOUR NEXT CHAPTER</span><h1>Good work starts<br />with a clear view<span>.</span></h1><p>Your clients, your projects, your creative business.<br />One thoughtfully organised workspace.</p><div className="admin-login-features"><span><Check size={14} />Build better relationships</span><span><Check size={14} />Keep every project moving</span><span><Check size={14} />Make room for great work</span></div></div><p className="admin-login-story-foot">Vance Graphix & Print<span>Designed to move you forward.</span></p><div className="admin-login-orbit" aria-hidden="true"/></section>
        <section className="admin-login-form-area"><Link to="/" className="admin-login-back"><ArrowLeft size={15} />Back to website</Link><div className="admin-login-form-wrap"><div className="admin-login-lock"><LockKeyhole size={23} strokeWidth={1.5}/></div><p className="admin-eyebrow">WELCOME TO YOUR WORKSPACE</p><h2>Pick up where you left off.</h2><p className="admin-login-subtitle">Sign in to manage your studio.</p><form onSubmit={handleLogin}>
            <label htmlFor="admin-email">Email address</label><div className="admin-login-field"><Mail size={17}/><input id="admin-email" autoComplete="username" type="email" required placeholder="you@yourstudio.com" value={email} onChange={e=>setEmail(e.target.value)} disabled={isSubmitting}/></div>
            <label htmlFor="admin-password">Password</label><div className="admin-login-field"><LockKeyhole size={17}/><input id="admin-password" autoComplete="current-password" type={visible ? 'text':'password'} required placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} disabled={isSubmitting}/><button type="button" aria-label={visible ? 'Hide password':'Show password'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible ? <EyeOff size={17}/>:<Eye size={17}/>}</button></div>
            {error && <p className="admin-login-error" role="alert">{error}</p>}
            <button type="submit" className="admin-login-submit" disabled={isSubmitting || loading}>{isSubmitting ? <><Loader2 size={17} className="animate-spin"/>Signing in...</>:<>Sign in to workspace<ArrowUpRight size={17}/></>}</button>
            <div className="admin-login-security"><ShieldCheck size={14}/>Secure access for authorised team members</div>
        </form></div><footer>Vance Graphix & Print <span>Studio administration</span></footer></section>
    </main>;
}
