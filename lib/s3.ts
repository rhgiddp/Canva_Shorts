/**
 * AWS S3 client for file uploads
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { APIError } from './api';
import { v4 as uuidv4 } from 'uuid';

const AWS_REGION = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION;
const AWS_ACCESS_KEY_ID =
  process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY =
  process.env.AWS_SECRET_ACCESS_KEY ||
  process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new APIError('AWS credentials are not configured');
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return s3Client;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  folder?: string;
  filename?: string;
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Upload file to S3
 */
export async function uploadToS3(
  file: File | Blob,
  options: UploadOptions = {}
): Promise<string> {
  try {
    if (!S3_BUCKET_NAME) {
      throw new APIError('S3 bucket name is not configured');
    }

    const client = getS3Client();
    const { folder = 'uploads', filename, onProgress } = options;

    // Generate unique filename
    const ext = file instanceof File ? file.name.split('.').pop() : 'png';
    const key = `${folder}/${filename || uuidv4()}.${ext}`;

    // Convert to buffer for upload
    const buffer = await file.arrayBuffer();

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: file.type || 'application/octet-stream',
    });

    await client.send(command);

    // Simulate progress (S3 SDK doesn't provide upload progress in browser)
    if (onProgress) {
      onProgress({
        loaded: buffer.byteLength,
        total: buffer.byteLength,
        percentage: 100,
      });
    }

    // Return public URL
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    throw new APIError(
      `S3 upload failed: ${(error as Error).message}`,
      undefined,
      error
    );
  }
}

/**
 * Get presigned URL for upload
 */
export async function getUploadUrl(
  filename: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<string> {
  try {
    if (!S3_BUCKET_NAME) {
      throw new APIError('S3 bucket name is not configured');
    }

    const client = getS3Client();
    const key = `${folder}/${uuidv4()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // Generate presigned URL (valid for 1 hour)
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    throw new APIError(
      `Failed to generate upload URL: ${(error as Error).message}`,
      undefined,
      error
    );
  }
}

/**
 * Get presigned URL for download
 */
export async function getDownloadUrl(key: string): Promise<string> {
  try {
    if (!S3_BUCKET_NAME) {
      throw new APIError('S3 bucket name is not configured');
    }

    const client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    // Generate presigned URL (valid for 1 hour)
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    throw new APIError(
      `Failed to generate download URL: ${(error as Error).message}`,
      undefined,
      error
    );
  }
}

/**
 * Upload base64 image to S3
 */
export async function uploadBase64Image(
  base64Data: string,
  options: UploadOptions = {}
): Promise<string> {
  // Remove data:image/...;base64, prefix if present
  const base64 = base64Data.includes(',')
    ? base64Data.split(',')[1]
    : base64Data;

  // Convert base64 to Blob
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  const blob = new Blob(byteArrays, { type: 'image/png' });
  return uploadToS3(blob, options);
}
