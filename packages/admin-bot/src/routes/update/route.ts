import { bootstrapHandleUpdate } from '@shared/api/telegram/bot/update';

import { handleUpdate } from '@/controller';

import { app } from '../app';

app.post('/update', bootstrapHandleUpdate(handleUpdate));
