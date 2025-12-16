import S3Storage from "./s3.storage.js";

class StorageFactory {
    static createStorage(type = "s3") {
        switch (type) {
            case "s3":
                return new S3Storage();
            default:
                throw new Error(`Unsupported storage type: ${type}`);
        }
    }
}

export default StorageFactory;
