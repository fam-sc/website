import { getEnvChecked } from '@shared/env';
import { checkedFetch } from '@shared/fetch';

type ResendBody = {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};

export async function sendMail(
  recepient: string,
  subject: string,
  content: { text?: string; html?: string }
) {
  const apiKey = getEnvChecked('RESEND_API_KEY');

  const body: ResendBody = {
    from: 'registration@sc-fam.org',
    to: recepient,
    subject,
    html: content.html,
    text: content.text,
  };

  await checkedFetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    json: true,
    body,
  });
}
