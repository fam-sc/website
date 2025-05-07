import { minifyHTML } from '@shared/html/minify';
import { sendMail } from '.';

function text(activationLink: string): string {
  return `Скористайтеся посиланням, щоб активувати свій обліковий запис

${activationLink}

Цей лист було відправлено автоматично, тому що хтось спробував створити обліковий запис на SC FAM використовуючи цю електронну адресу`;
}

function html(activationLink: string): string {
  let result = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
  </head>

  <body bgcolor="#151641" style="background-color: #151641; padding: 1em; font-family: 'MursGothic', 'Arial'; font-weight: 700; margin: 0; padding: 1em;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <img style="width: 4em; height: 4em; object-fit: contain;" src="https://media.sc-fam.org/logo.png" alt="Logo" />
        </td>
      </tr>
      <tr>
        <td style="display: block; width: 80%; margin: 1em auto !important;">
          <p style="color: #ffffff;">Скористайтеся посиланням, щоб активувати свій обліковий запис</p>
      
          <a style="margin: 16px 0; color: white; display: block;" href="${activationLink}">${activationLink}</a>
      
          <p style="color: #ffffff;">Цей лист було відправлено автоматично, тому що хтось спробував створити обліковий запис на SC FAM використовуючи цю електронну адресу</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  result = minifyHTML(result);

  return result;
}

export async function sendConfirmationMail(
  recepient: string,
  activationLink: string
) {
  await sendMail(recepient, 'Активація облікового запису SC FAM', {
    text: text(activationLink),
    html: html(activationLink),
  });
}
