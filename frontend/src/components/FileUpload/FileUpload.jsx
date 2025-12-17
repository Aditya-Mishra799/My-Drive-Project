import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import pako from 'pako';
import styles from './FileUpload.module.css';
import getApiURL from '../../utils/getApiURl';
import { toast } from 'react-toastify';

const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [compress, setCompress] = useState(true);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const shouldCompressFile = (mimeType) => {
        const compressibleTypes = [
            'text/',
            'application/json',
            'application/javascript',
            'application/xml',
            'application/csv',
            'image/svg+xml'
        ];
        return compressibleTypes.some(type => mimeType.startsWith(type));
    };

    const compressFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const compressed = pako.gzip(new Uint8Array(e.target.result));
                    const blob = new Blob([compressed], { type: file.type });
                    resolve(new File([blob], file.name, { type: file.type }));
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one file");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();

            for (const file of selectedFiles) {
                let fileToUpload = file;
                if (compress && shouldCompressFile(file.type)) {
                    fileToUpload = await compressFile(file);
                }
                formData.append('files', fileToUpload);
            }

            formData.append('compressed', compress.toString());

            const response = await fetch(getApiURL('/api/files/upload/multiple'), {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.error?.message || 'Upload failed');
            }

            toast.success(`${selectedFiles.length} file(s) uploaded successfully`);
            setSelectedFiles([]);
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to upload files');
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className={styles.uploadContainer}>
            <div className={styles.uploadBox}>
                <label htmlFor="fileInput" className={styles.uploadLabel}>
                    <Upload size={32} />
                    <span>Click to select files or drag and drop</span>
                    <input
                        id="fileInput"
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className={styles.fileInput}
                    />
                </label>
            </div>

            {selectedFiles.length > 0 && (
                <div className={styles.fileList}>
                    <h3>Selected Files ({selectedFiles.length})</h3>
                    {selectedFiles.map((file, index) => (
                        <div key={index} className={styles.fileItem}>
                            <div className={styles.fileInfo}>
                                <span className={styles.fileName}>{file.name}</span>
                                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className={styles.removeButton}
                                type="button"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.options}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={compress}
                        onChange={(e) => setCompress(e.target.checked)}
                    />
                    <span>Enable compression for text files</span>
                </label>
            </div>

            {selectedFiles.length > 0 && (
                <button
                    onClick={uploadFiles}
                    disabled={uploading}
                    className={styles.uploadButton}
                >
                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
                </button>
            )}
        </div>
    );
};

export default FileUpload;
