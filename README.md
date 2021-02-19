# MeYou.chat

Chat for cats

## About

The idea here is to be able to chat with cats directly over ipv6, using
tweetnacl to encrypt the messages. Meow.

## Prerequisites

You need nodejs and npm. Run `npm i` to get dependencies. The code so
far was developed on nodejs 15.6.0

### Config

To generate a basic config, run:

`ts-node ts/index.ts genconfig`

## Usage

`npm run start`

## Caveat Emptor

This is an entirely experimental project.

## Reference

This project started from 6eer test code.

### Nodejs

https://nodejs.org/dist/latest-v15.x/docs/api/net.html
https://nodejs.org/dist/latest-v15.x/docs/api/http.html
https://expressjs.com/en/starter/basic-routing.html

### Client Side

#### JS

https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection

### Crypto

https://github.com/dchest/tweetnacl-js/wiki/Examples

