# SC FAM Website

This platform is designed to keep students informed about important news, upcoming events, and council initiatives, ensuring their ideas and concerns are heard. It serves as a vital tool to foster student leadership, encourage participation in uni life, and promote a stronger sense of community. Our goal is to create a more connected, engaged, and vibrant faculty environment for everyone. Engage with us and help shape your uni experience:)

[SC FAM website](https://sc-fam.org/)

## Project notation and ideas

- [Website and DB structures](https://miro.com/welcomeonboard/d2V4b2Z1cDFjMlVKdXNXSkd2WUxBTE1LeDVncGR3ZmRpOGRTTzRuQVlJWFhFU3lUbTVQei9tOE11UHhxckROeUdLTS9IKytyTm40TFlNd015SDR6K3FRNzZxU3JHaUpkWHR2eGpJeERWaWpwWkJtL3A0d1V2aFZKKzEydHdDeUdzVXVvMm53MW9OWFg5bkJoVXZxdFhRPT0hdjE=?share_link_id=503172973970)

- [Design ideas and mockups](https://www.figma.com/design/Vcf6rhZOLasv6mF4tE3M32/site-sc-fam?m=auto&t=yEhCsyhIOVcBc5io-6)

- [Production Storybook](https://sc-fam-storybook.pages.dev/)

## Folder structure

```sh
packages
├── website            # Main website package
├── media              # Media worker used to fetch files
├── data               # Data repository logic
├── schedule-bot       # Telegram bot for notifying about lessons
├── shared             # Shared logic for all packages
├── mail-test          # Used to test forms sent via email
└── telegram-auth-test # Used to test Telegram auth forms
```

## Build

Run website in dev mode:

```sh
yarn dev
```

Build website:

```sh
yarn build
```

Start website server locally:

```sh
yarn start
```

## Lint

Lint and typecheck:

```sh
yarn lint
```

Lint with fixing:

```sh
yarn lint:fix
```

## Storybook

See [docs](/docs/website/storybook.md)

## Testing

The project uses Vitest for unit testing. The test for a file is stored nearby in the same directory.

To run all tests:

```sh
yarn test
```

### Created by

- [Oleh Khmaruk КМ-23](https://github.com/pelmenstar1)
- [Valeriia Baranivska КМ-23](https://github.com/ValeriiaBaranivska)

[To contact us write here ](https://t.me/fpm_sc_bot)
