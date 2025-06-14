import { getEnvChecked } from '@shared/env';
import { ApiR2Bucket } from '@shared/r2/api';

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
  };
}
