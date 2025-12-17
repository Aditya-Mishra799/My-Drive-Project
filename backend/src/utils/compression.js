import pako from "pako";

const shouldCompress = (mimeType) => {
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

const compressFile = (buffer) => {
    try {
        return pako.gzip(buffer);
    } catch (error) {
        throw new Error(`Compression failed: ${error.message}`);
    }
};

const decompressFile = (buffer) => {
    try {
        return pako.ungzip(buffer);
    } catch (error) {
        throw new Error(`Decompression failed: ${error.message}`);
    }
};

export {
    shouldCompress,
    compressFile,
    decompressFile
};
