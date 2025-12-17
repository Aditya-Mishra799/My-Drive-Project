import React, { useState, useEffect } from 'react';
import { X, Share2, Link2, Trash2 } from 'lucide-react';
import styles from './FileShare.module.css';
import getApiURL from '../../utils/getApiURl';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import Input from '../Input/Input';

const FileShare = ({ file, onClose }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [userEmail, setUserEmail] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [shares, setShares] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchShares();
        } else {
            fetchLinks();
        }
    }, [activeTab, file.id]);

    const fetchShares = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiURL(`/api/files/${file.id}/shares`), {
                credentials: 'include',
            });
            const json = await response.json();
            if (response.ok) {
                setShares(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch shares:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiURL(`/api/files/${file.id}/share/links`), {
                credentials: 'include',
            });
            const json = await response.json();
            if (response.ok) {
                setLinks(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch links:', error);
        } finally {
            setLoading(false);
        }
    };

    const shareWithUser = async (e) => {
        e.preventDefault();
        if (!userEmail) {
            toast.error('Please enter an email');
            return;
        }

        try {
            const response = await fetch(getApiURL(`/api/files/${file.id}/share/user`), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail,
                    expiresAt: expiresAt || null,
                }),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.error?.message || 'Failed to share');
            }

            toast.success('File shared successfully');
            setUserEmail('');
            setExpiresAt('');
            fetchShares();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const unshareWithUser = async (userId) => {
        try {
            const response = await fetch(getApiURL(`/api/files/${file.id}/share/user`), {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove share');
            }

            toast.success('Share removed successfully');
            fetchShares();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const generateLink = async () => {
        try {
            const response = await fetch(getApiURL(`/api/files/${file.id}/share/link`), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expiresAt: expiresAt || null,
                }),
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.error?.message || 'Failed to generate link');
            }

            toast.success('Link generated successfully');
            setExpiresAt('');
            fetchLinks();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteLink = async (linkId) => {
        try {
            const response = await fetch(getApiURL(`/api/files/share/link/${linkId}`), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete link');
            }

            toast.success('Link deleted successfully');
            fetchLinks();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const copyLink = (token) => {
        const link = `${window.location.origin}/share/${token}`;
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard');
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <h2>Share: {file.filename}</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Share2 size={18} />
                        Share with Users
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'links' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('links')}
                    >
                        <Link2 size={18} />
                        Shareable Links
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'users' ? (
                        <div>
                            <form onSubmit={shareWithUser} className={styles.shareForm}>
                                <Input
                                    type="email"
                                    label="User Email"
                                    placeholder="Enter user email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    id="userEmail"
                                />
                                <Input
                                    type="datetime-local"
                                    label="Expires At (Optional)"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    id="expiresAt"
                                />
                                <Button type="submit">Share</Button>
                            </form>

                            <div className={styles.list}>
                                <h3>Shared With</h3>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : shares.length === 0 ? (
                                    <p className={styles.empty}>Not shared with anyone yet</p>
                                ) : (
                                    shares.map((share) => (
                                        <div key={share.id} className={styles.shareItem}>
                                            <div>
                                                <p className={styles.shareName}>{share.user_name}</p>
                                                <p className={styles.shareEmail}>{share.user_email}</p>
                                                {share.expires_at && (
                                                    <p className={styles.shareExpiry}>
                                                        Expires: {new Date(share.expires_at).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => unshareWithUser(share.shared_with_user_id)}
                                                className={styles.deleteButton}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className={styles.linkForm}>
                                <Input
                                    type="datetime-local"
                                    label="Expires At (Optional)"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    id="linkExpiresAt"
                                />
                                <Button onClick={generateLink}>Generate Link</Button>
                            </div>

                            <div className={styles.list}>
                                <h3>Generated Links</h3>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : links.length === 0 ? (
                                    <p className={styles.empty}>No links generated yet</p>
                                ) : (
                                    links.map((link) => (
                                        <div key={link.id} className={styles.linkItem}>
                                            <div className={styles.linkInfo}>
                                                <p className={styles.linkToken}>
                                                    {window.location.origin}/share/{link.token}
                                                </p>
                                                {link.expires_at && (
                                                    <p className={styles.shareExpiry}>
                                                        Expires: {new Date(link.expires_at).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={styles.linkActions}>
                                                <button
                                                    onClick={() => copyLink(link.token)}
                                                    className={styles.copyButton}
                                                >
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={() => deleteLink(link.id)}
                                                    className={styles.deleteButton}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileShare;
