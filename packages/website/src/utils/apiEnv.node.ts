import { getEnvChecked } from '@shared/env';
import { ApiR2Bucket } from '@shared/cloudflare/r2/api';
import { ApiD1Database } from '@shared/cloudflare/d1/api';

export function getDatabase(): D1Database {
  const token = getEnvChecked('CF_D1_TOKEN');
  const accountId = getEnvChecked('CF_D1_ACCOUNT_ID');
  const dbId = getEnvChecked('CF_D1_ID');

  return new ApiD1Database(token, accountId, dbId);
}

export function getApiEnv(): Env {
  const bucket = new ApiR2Bucket(
    getEnvChecked('MEDIA_ACCOUNT_ID'),
    getEnvChecked('MEDIA_ACCESS_KEY_ID'),
    getEnvChecked('MEDIA_SECRET_ACCESS_KEY'),
    getEnvChecked('MEDIA_BUCKET_NAME')
  );

  return {
    MONGO_CONNECTION_STRING: getEnvChecked('MONGO_CONNECTION_STRING'),
    RESEND_API_KEY: getEnvChecked('RESEND_API_KEY'),
    MEDIA_BUCKET: bucket,
    TURNSTILE_SECRET_KEY: '',
    DB: getDatabase(),
    IMAGES: {} as ImagesBinding,
  };
}
