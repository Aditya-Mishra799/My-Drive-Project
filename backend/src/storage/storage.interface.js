class StorageInterface {
    async upload(key, buffer, contentType) {
        throw new Error("upload() must be implemented");
    }

    async download(key) {
        throw new Error("download() must be implemented");
    }

    async delete(key) {
        throw new Error("delete() must be implemented");
    }

    async getSignedUrl(key, expiresIn) {
        throw new Error("getSignedUrl() must be implemented");
    }
}

export default StorageInterface;
