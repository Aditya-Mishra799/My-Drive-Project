import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import StorageInterface from "./storage.interface.js";
import ApiError from "../utils/ApiError.js";
import dotenv from "dotenv";

dotenv.config();

class S3Storage extends StorageInterface {
    constructor() {
        super();
        this.client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.bucket = process.env.S3_BUCKET_NAME;
    }

    async upload(key, buffer, contentType) {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            });
            await this.client.send(command);
            return key;
        } catch (error) {
            throw new ApiError(500, "Failed to upload file to storage", "STORAGE_UPLOAD_ERROR", { originalError: error.message });
        }
    }

    async download(key) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            const response = await this.client.send(command);
            const chunks = [];
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            throw new ApiError(500, "Failed to download file from storage", "STORAGE_DOWNLOAD_ERROR", { originalError: error.message });
        }
    }

    async delete(key) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.client.send(command);
        } catch (error) {
            throw new ApiError(500, "Failed to delete file from storage", "STORAGE_DELETE_ERROR", { originalError: error.message });
        }
    }

    async getSignedUrl(key, expiresIn = 3600) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            const url = await getSignedUrl(this.client, command, { expiresIn });
            return url;
        } catch (error) {
            throw new ApiError(500, "Failed to generate signed URL", "STORAGE_SIGNED_URL_ERROR", { originalError: error.message });
        }
    }
}

export default S3Storage;
