import { parseAddEventPayload } from '@shared/api/events/payloads';
import { MediaTransaction } from '@shared/api/media/transaction';
import { badRequest, ok } from '@shared/responses';
import { Repository } from '@data/repo';
import { parseHtmlToRichText } from '@shared/richText/parser';
import { creatMediaServerParseContext } from '@shared/api/media/richText';
import { ObjectId } from 'mongodb';
import { getImageSize } from '@shared/image/size';
import { authRoute } from '@/authRoute';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/app';

app.get('/events', async (request) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type !== 'short') {
    return badRequest({ message: 'Invalid type' });
  }

  await using repo = await Repository.openConnection();

  const result = await repo
    .events()
    .getAll()
    .project<{ _id: ObjectId; title: string }>({ title: 1 })
    .map(({ _id, title }) => ({ id: _id.toString(), title }))
    .toArray();

  return ok(result);
});

app.post('/events', async (request) => {
  const formData = await request.formData();
  const { title, description, date, image, status } =
    parseAddEventPayload(formData);

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction();

  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext(mediaTransaction)
  );

  const imageBuffer = await image.bytes();
  const imageSize = getImageSize(imageBuffer);

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    return await repo.transaction(async (trepo) => {
      const { insertedId } = await trepo.events().insert({
        date,
        status,
        title,
        description: richTextDescription,
        image: imageSize,
      });

      mediaTransaction.put(`events/${insertedId}`, imageBuffer);

      await mediaTransaction.commit();

      return new Response();
    });
  });
});
