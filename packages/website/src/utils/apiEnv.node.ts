import { ApiR2Bucket } from '@shared/cloudflare/r2/api';
import { getEnvChecked } from '@shared/env';

import { getDatabase } from './d1Db';

export function getApiEnv(): Env {
  const bucket = new ApiR2Bucket(
    getEnvChecked('MEDIA_ACCOUNT_ID'),
    getEnvChecked('MEDIA_ACCESS_KEY_ID'),
    getEnvChecked('MEDIA_SECRET_ACCESS_KEY'),
    getEnvChecked('MEDIA_BUCKET_NAME')
  );

  return {
    RESEND_API_KEY: getEnvChecked('RESEND_API_KEY'),
    TURNSTILE_SECRET_KEY: '',
    SCHEDULE_BOT_ACCESS_KEY: getEnvChecked('SCHEDULE_BOT_ACCESS_KEY'),
    ADMIN_BOT_ACCESS_KEY: getEnvChecked('ADMIN_BOT_ACCESS_KEY'),
    MEDIA_BUCKET: bucket,
    DB: getDatabase(),
    IMAGES: {} as ImagesBinding,
  };
}
