Environment variables required for starting the website:

- `MONGO_CONNECTION_STRING` - Connection string to the Mongo DB
- `RESEND_API_KEY` - API key for Resend services (sending emails)
- `MEDIA_AUTH_KEY` - API key for the `media` worker to authenticate mutating requests (not required for `GET`, `HEAD` operations)
 