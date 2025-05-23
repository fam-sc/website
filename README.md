# SC FAM Website

## Project structure

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

## Testing

The project uses Vitest for unit testing. The test for a file is stored nearby in the same directory. 

To run all tests:

```sh
yarn test 
```