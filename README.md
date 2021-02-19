# MeYou.chat

Chat for cats

## About

This is proof-of-concept code to see if you can exchange messages across
networks with IPv6. Surprisingly, this sometimes works.

## Prerequisites

### IPv6

http://www.testipv6.com/

You need some kind of >0 score. I've only seen 10/10 and 0/10 in very limited
spot checking with friends and family. If it says 0, nothing here will work. If
it says 10, it's worth finding a friend with ipv6 to see if this works. If this
*does* work, your computer is available to the internet via ipv6. Maybe this is
great, maybe it's a problem. Maybe it's a little of both. Worth knowing about,
either way.

### One time setup

You need npx, nodejs and npm. Run `npm i` to get dependencies. The code so far
was developed on nodejs 15.6.0.

### Config

To generate a basic config, run:

`npx ts-node ts/index.ts genconfig`

This will output something like:

```
{
  "localHttpPort": 3030,
  "localWebSocketPort": 3030,
  "internetListenPort": 2679,
  "secretKeyBase64": "<will be generated for you>",
  "publicKeyBase64": "<will be generated for you>",
  "friends": [
    {
      "ip": "",
      "port": 2679,
      "displayName": "",
      "publicKeyBase64": "",
    }
  ]
}
```

Make a .data directory and save the file as .data/config.json.

#### Fields

You are free to use any ports for localHttpPort and localWebSocketPort.
Those services explicitely listen on 127.0.0.1.

* localHttpPort

This is the port you will connect to locally to access the web UI.
http://127.0.0.1:3030

* localWebSocketPort

This also listens on 127.0.0.1 and communicates with your browser
when there are new messages. There is no security on your 127.0.0.1
communication.

* internetListenPort

This is the port node.js will listen on for remote connections from the
internet. If you try this and are able to communicate with someone, any device
on your home/LAN network that is using ipv6 is probably also accessible.

* secretKeyBase64

This is your decryption key. Anyone with this key can decrypt and messages
encrypted with the public key. In non-proof-of-concept code this would
probably at least be stored like the keys in ~/.ssh. Writing this key
with crypt and requiring a password are probably reasonable next steps.

* publicKeyBase64

This is you, kitty cat! Give this to friends so they can send you messages.

##### Friends

This section is where you put in the information of your ipv6 friends.

* ip

Likely will be of the form 2601::/64. Do not enter /64.

* port

This is the port your peer has entered for internetListenPort. 2679 by default.

* displayName

The name you want to see in your local UI that is associated with the
publicKey.

* publicKeyBase64

Their public key. When you give them your "publicKeyBase64" this is what
they give back.

###### MeMe

You can add yourself in the friends section for testing.

```
    {
      "ip": "::1",
      "port": 2679,
      "displayName": "me",
      "publicKeyBase64": "<generated public key from genconfig>"
    }
```

## Usage

`npm run start`

## Caveat Emptor

This is an entirely experimental project. All I know about tweetnacl is
what their website says, and what a site says they link to from their
website. I haven't read the nodejs or express source code. I don't know
anyone that has. I don't even know that much about ipv6. This code is
entirely for testing.

## Reference

This project started from 6eer test code.

### Nodejs

https://github.com/TypeStrong/ts-node
https://nodejs.org/dist/latest-v15.x/docs/api/net.html
https://nodejs.org/dist/latest-v15.x/docs/api/http.html
https://expressjs.com/en/starter/basic-routing.html

### Client

https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection

### Crypto

https://github.com/dchest/tweetnacl-js/wiki/Examples

