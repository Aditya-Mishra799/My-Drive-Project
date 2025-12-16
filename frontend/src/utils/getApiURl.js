export default function getApiURL(endpoint) {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}${endpoint}`;
}