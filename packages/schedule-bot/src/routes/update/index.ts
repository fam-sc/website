import { bootstrapHandleUpdate } from '@sc-fam/shared/api/telegram/bot/update.js';

import { handleUpdate } from '@/controller';

import { app } from '../app';

app.post('/update', bootstrapHandleUpdate(handleUpdate));
