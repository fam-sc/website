import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { R2Bucket, R2Object, R2ObjectBody } from './types';

function notImplemented(): never {
  throw new Error('Method not implemented.');
}

export class ApiR2Bucket implements R2Bucket, Disposable {
  private client: S3Client;
  private bucketName: string;

  constructor(
    accountId: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string
  ) {
    this.bucketName = bucketName;

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  [Symbol.dispose]() {
    this.client.destroy();
  }

  private getR2Object(
    key: string,
    result: Pick<
      HeadObjectOutput,
      `Checksum${'SHA1' | 'SHA256'}` | 'ETag' | 'StorageClass' | 'VersionId'
    >
  ) {
    return {
      checksums: { toJSON: () => ({}) },
      etag: result.ETag ?? '',
      httpEtag: result.ETag ?? '',
      key,
      size: 0,
      storageClass: result.StorageClass ?? '',
      uploaded: new Date(),
      version: result.VersionId ?? '',
      writeHttpMetadata: () => {},
    };
  }

  async head(Key: string): Promise<R2Object | null> {
    const result = await this.client.send(
      new HeadObjectCommand({ Key, Bucket: this.bucketName })
    );

    return this.getR2Object(Key, result);
  }

  async get(key: string): Promise<R2ObjectBody | null> {
    const result = await this.client.send(
      new GetObjectCommand({ Key: key, Bucket: this.bucketName })
    );

    const { Body: body } = result;

    return body
      ? {
          body: body.transformToWebStream(),
          bodyUsed: false,
          arrayBuffer: notImplemented,
          bytes: notImplemented,
          text: notImplemented,
          json: notImplemented,
          blob: notImplemented,
          ...this.getR2Object(key, result),
        }
      : null;
  }

  async put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob
  ): Promise<R2Object> {
    if (value !== null) {
      if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
        notImplemented();
      }

      const result = await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: value,
        })
      );

      return this.getR2Object(key, result);
    }

    throw new Error('value is null');
  }

  async delete(keys: string | string[]): Promise<void> {
    await (Array.isArray(keys)
      ? this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: { Objects: keys.map((key) => ({ Key: key })) },
          })
        )
      : this.client.send(
          new DeleteObjectCommand({ Bucket: this.bucketName, Key: keys })
        ));
  }

  createMultipartUpload = notImplemented;
  resumeMultipartUpload = notImplemented;
  list = notImplemented;
}
