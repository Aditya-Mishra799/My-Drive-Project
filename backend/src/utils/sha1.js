import crypto from "crypto";
export const getSHA1Digest = (data) => {
    return crypto.createHash("sha1").update(data).digest()
}