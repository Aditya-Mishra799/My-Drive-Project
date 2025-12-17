import React, { useState, useEffect } from 'react';
import styles from './ActivityLog.module.css';
import Table from '../../components/Table/Table';
import getApiURL from '../../utils/getApiURl';
import { toast } from 'react-toastify';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const fetchActivities = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(getApiURL(`/api/files/activity/me?limit=${limit}&offset=${offset}`), {
        credentials: 'include',
      });
      const json = await response.json();
      if (response.ok) {
        setActivities(json.data.activities);
        setTotalPages(Math.ceil(json.data.total / limit));
      }
    } catch (error) {
      toast.error('Failed to fetch activity log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: 'Filename',
      accessor: 'filename',
      width: '35%',
    },
    {
      header: 'Action',
      accessor: 'action',
      width: '20%',
      render: (row) => {
        const actionLabels = {
          upload: 'Uploaded',
          download: 'Downloaded',
          share: 'Shared',
          create_link: 'Created Link',
          access_via_link: 'Accessed via Link',
        };
        return actionLabels[row.action] || row.action;
      },
    },
    {
      header: 'File Type',
      accessor: 'file_type',
      width: '20%',
    },
    {
      header: 'Date',
      accessor: 'created_at',
      width: '25%',
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Activity Log</h1>
      <p className={styles.description}>Your recent file activity</p>
      <Table
        columns={columns}
        data={activities}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default ActivityLog;
