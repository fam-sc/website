Environment variables required for the schedule-bot:

- `BOT_KEY` - Telegram bot key. Only used in src/setup/ in (un)setting webhooks.
- `BOT_SECRET_KEY` - Telegram bot secret key. Used to authenticate requests to the worker (to check if it's really Telegram that sent them).

  > [CAUTION!]
  > The key should be the same as one stored in Cloudflare secrets.
