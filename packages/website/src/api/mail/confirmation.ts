import { sendMail } from '.';
import mail from './mail-pattern.html?t';

function text(activationLink: string): string {
  return `Скористайтеся посиланням, щоб активувати свій обліковий запис

${activationLink}

Цей лист було відправлено автоматично, тому що хтось спробував створити обліковий запис на SC FAM використовуючи цю електронну адресу`;
}

function html(activationLink: string): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return mail({ activationLink });
}

export async function sendConfirmationMail(
  apiKey: string,
  recepient: string,
  activationLink: string
) {
  await sendMail(apiKey, recepient, 'Активація облікового запису SC FAM', {
    text: text(activationLink),
    html: html(activationLink),
  });
}
