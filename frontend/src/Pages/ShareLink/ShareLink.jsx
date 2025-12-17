import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import styles from './ShareLink.module.css';
import getApiURL from '../../utils/getApiURl';
import { toast } from 'react-toastify';

const ShareLink = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    validateLink();
  }, [token]);

  const validateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiURL(`/api/files/share/link/${token}`), {
        credentials: 'include',
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error?.message || 'Invalid or expired link');
      }
      setFileInfo(json.data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await fetch(getApiURL(`/api/files/${fileInfo.fileId}/download`), {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Invalid Link</h1>
          <p className={styles.error}>{error}</p>
          <p>This link may have expired or been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <FileText size={64} />
        </div>
        <h1>Shared File</h1>
        <div className={styles.fileInfo}>
          <p className={styles.filename}>{fileInfo.filename}</p>
          <p className={styles.filetype}>{fileInfo.fileType}</p>
        </div>
        <button onClick={downloadFile} className={styles.downloadButton}>
          <Download size={20} />
          Download File
        </button>
      </div>
    </div>
  );
};

export default ShareLink;
