# API boilerplate

Simple `MongoDB` based API boilerplate with authentication. Made with `express` and `mongoose`.

## Installation

- Run `npm install`
- Run `cp .env.example .env`
- Fill in `.env` variables
  - `DB_CONNECT` - connection string to your MongoDB cluster
  - `JWT_SECRET` - long, strong, unguessable secret string
- Adjust routes and schemas to your needs

## Usage

- Run `npm run dev` to use in dev mode (with `nodemon`)
- Run `npm run start` to start
