/**
 * Cloudflare R2 client.
 *
 * R2 is optional: when no credentials are configured, `getR2Client()` returns
 * null and every caller falls back to local `/public` assets. This keeps the
 * app fully functional in development without any cloud storage.
 */
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

let _client: S3Client | null | undefined;

export function getR2Client(): S3Client | null {
  if (_client !== undefined) return _client;
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
    _client = null;
    return null;
  }
  _client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflare.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

export function r2Configured(): boolean {
  return getR2Client() !== null;
}

export function r2Bucket(): string | null {
  return env.R2_BUCKET ?? null;
}

export function r2PublicUrl(): string | null {
  return env.R2_PUBLIC_URL ?? null;
}

/**
 * Upload an object to R2, but only if it isn't already there.
 *
 * Duplicate writes are the main source of pointless R2 spend on a site with
 * static assets: every deploy would re-upload the same image. `headObject`
 * is cheap and makes the upload idempotent.
 */
export async function putObjectIfNew(
  key: string,
  body: Buffer | ReadableStream | string,
  contentType: string,
  cacheControl = "public, max-age=31536000, immutable",
): Promise<"uploaded" | "skipped" | "unavailable"> {
  const client = getR2Client();
  const bucket = r2Bucket();
  if (!client || !bucket) return "unavailable";

  try {
    try {
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      return "skipped";
    } catch (err: any) {
      // 404/NoSuchKey is the expected "not there yet" case — proceed to upload.
      const status = err?.$metadata?.httpStatus ?? err?.name;
      if (status !== 404 && status !== "NotFound" && status !== "NoSuchKey") throw err;
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body as any,
        ContentType: contentType,
        CacheControl: cacheControl,
      }),
    );
    return "uploaded";
  } catch (err) {
    console.error(`[r2] putObjectIfNew failed for ${key}:`, err);
    return "unavailable";
  }
}

export async function headObject(key: string): Promise<boolean> {
  const client = getR2Client();
  const bucket = r2Bucket();
  if (!client || !bucket) return false;
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

export async function presignedGetObject(
  key: string,
  expiresIn = 900,
): Promise<string | null> {
  const client = getR2Client();
  const bucket = r2Bucket();
  if (!client || !bucket) return null;
  try {
    return await getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn },
    );
  } catch (err) {
    console.error(`[r2] presignedGetObject failed for ${key}:`, err);
    return null;
  }
}