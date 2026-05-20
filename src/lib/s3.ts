import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

const requiredConfig = {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
  bucketName: env.AWS_BUCKET_NAME,
};

function assertS3Config() {
  if (
    !requiredConfig.accessKeyId ||
    !requiredConfig.secretAccessKey ||
    !requiredConfig.region ||
    !requiredConfig.bucketName
  ) {
    throw new Error("Missing AWS S3 configuration");
  }
}

let s3Client: S3Client | null = null;

export function getS3Client() {
  assertS3Config();
  if (!s3Client) {
    s3Client = new S3Client({
      region: requiredConfig.region,
      credentials: {
        accessKeyId: requiredConfig.accessKeyId!,
        secretAccessKey: requiredConfig.secretAccessKey!,
      },
    });
  }
  return s3Client;
}

function sanitizeSegment(value: string) {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/\/{2,}/g, "/");
}

function sanitizeFileName(value: string) {
  const clean = value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
  return clean.length > 0 ? clean : "upload";
}

function buildBaseFolder() {
  return sanitizeSegment(env.AWS_FOLDER ?? "");
}

export function buildS3ObjectKey(folder: string, fileName: string) {
  const baseFolder = buildBaseFolder();
  const scopedFolder = sanitizeSegment(folder);
  const cleanName = sanitizeFileName(fileName);
  const uniquePrefix = `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID()}`;

  return [baseFolder, scopedFolder, `${uniquePrefix}-${cleanName}`].filter(Boolean).join("/");
}

export function buildS3AssetUrl(key: string) {
  assertS3Config();

  if (requiredConfig.region === "ap-south-1") {
    return `https://${requiredConfig.bucketName}.s3.amazonaws.com/${key}`;
  }

  return `https://${requiredConfig.bucketName}.s3.${requiredConfig.region}.amazonaws.com/${key}`;
}

export async function createPresignedUpload(params: {
  key: string;
  contentType: string;
}) {
  assertS3Config();

  const command = new PutObjectCommand({
    Bucket: requiredConfig.bucketName,
    Key: params.key,
    ContentType: params.contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn: 300 });

  return {
    uploadUrl,
    assetUrl: buildS3AssetUrl(params.key),
  };
}
