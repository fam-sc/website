import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectOutput,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import {
  R2Bucket,
  R2Checksums,
  R2ListOptions,
  R2Object,
  R2ObjectBody,
  R2Objects,
  R2PutOptions,
} from './types.js';

function notImplemented(): never {
  throw new Error('Method not implemented.');
}

function emptyChecksums(): R2Checksums {
  return { toJSON: () => ({}) };
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
      region: 'auto',
      requestStreamBufferSize: 0,
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
      checksums: emptyChecksums(),
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
          bodyUsed: false,
          get body() {
            return body.transformToWebStream();
          },

          arrayBuffer: notImplemented,
          bytes() {
            return body.transformToByteArray();
          },
          text() {
            return body.transformToString('utf8');
          },
          async json() {
            const result = await body.transformToString('utf8');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(result);
          },
          async blob() {
            const result = await body.transformToByteArray();

            return new Blob([result]);
          },
          ...this.getR2Object(key, result),
        }
      : null;
  }

  async put(
    key: string,
    value:
      | ReadableStream
      | ArrayBuffer
      | ArrayBufferView
      | string
      | Blob
      | null,
    options?: R2PutOptions
  ): Promise<R2Object> {
    if (value !== null) {
      let body: unknown = value;

      if (!(value instanceof Uint8Array)) {
        if (ArrayBuffer.isView(value)) {
          body = value.buffer.slice(
            value.byteOffset,
            value.byteOffset + value.byteLength
          );
        }

        if (value instanceof ArrayBuffer) {
          body = new Uint8Array(value);
        }
      }

      const metadata = options?.httpMetadata;
      let contentType: string | undefined;
      if (metadata) {
        if ('contentType' in metadata) {
          contentType = metadata.contentType;
        } else if (metadata instanceof Headers) {
          contentType = metadata.get('Content-Type') ?? undefined;
        }
      }

      const result = await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: body as string | ReadableStream | Uint8Array,
          ChecksumAlgorithm: 'CRC32',
          ContentType: contentType,
        })
      );

      return {
        key,
        checksums: emptyChecksums(),
        etag: result.ETag ?? '',
        httpEtag: result.ETag ?? '',
        size: result.Size ?? 0,
        storageClass: '',
        uploaded: new Date(),
        version: '',
        writeHttpMetadata: () => {},
      };
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

  async list(options?: R2ListOptions): Promise<R2Objects> {
    const result = await this.client.send(
      new ListObjectsCommand({
        Bucket: this.bucketName,
        Prefix: options?.prefix,
        Delimiter: options?.delimiter,
      })
    );

    return {
      objects:
        result.Contents?.map((content) => ({
          key: content.Key ?? '',
          checksums: { toJSON: () => ({}) },
          etag: content.ETag ?? '',
          size: content.Size ?? 0,
          httpEtag: content.ETag ?? '',
          storageClass: content.StorageClass ?? '',
          uploaded: new Date(),
          version: '',
          writeHttpMetadata: () => {},
        })) ?? [],
      delimitedPrefixes: [],
      truncated: false,
    };
  }

  createMultipartUpload = notImplemented;
  resumeMultipartUpload = notImplemented;
}
