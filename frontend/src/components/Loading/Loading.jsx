import {Loader2} from 'lucide-react';
import styles from './Loading.module.css';

const Loading = ({ label = 'Loading...', size = 'medium' }) => {
    return (
        <div className={`${styles.loadingContainer} page`}>
            <Loader2 className={`${styles.loader} ${styles[size]}`} />
            <span className={styles.label}>{label}</span>
        </div>
    );
}

export default Loading;