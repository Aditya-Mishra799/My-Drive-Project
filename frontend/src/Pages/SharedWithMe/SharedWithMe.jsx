import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import styles from './SharedWithMe.module.css';
import Table from '../../components/Table/Table';
import getApiURL from '../../utils/getApiURl';
import { toast } from 'react-toastify';

const SharedWithMe = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const fetchSharedFiles = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(getApiURL(`/api/files/shared-with-me?limit=${limit}&offset=${offset}`), {
        credentials: 'include',
      });
      const json = await response.json();
      if (response.ok) {
        setFiles(json.data.files);
        setTotalPages(Math.ceil(json.data.total / limit));
      }
    } catch (error) {
      toast.error('Failed to fetch shared files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedFiles(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const downloadFile = async (fileId, filename) => {
    try {
      const response = await fetch(getApiURL(`/api/files/${fileId}/download`), {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const columns = [
    {
      header: 'Filename',
      accessor: 'filename',
      width: '35%',
    },
    {
      header: 'Owner',
      accessor: 'owner_name',
      width: '20%',
    },
    {
      header: 'Type',
      accessor: 'file_type',
      width: '15%',
    },
    {
      header: 'Size',
      accessor: 'file_size',
      render: (row) => formatFileSize(row.file_size),
      width: '15%',
    },
    {
      header: 'Actions',
      width: '15%',
      render: (row) => (
        <div className={styles.actions}>
          <button
            onClick={() => downloadFile(row.id, row.filename)}
            className={styles.actionButton}
            title="Download"
          >
            <Download size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Shared With Me</h1>
      <p className={styles.description}>Files that other users have shared with you</p>
      <Table
        columns={columns}
        data={files}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default SharedWithMe;
