// import net = require("net");
import { box } from "tweetnacl";
import crypt = require("./crypt");
import fs = require("fs");
import express = require("express");
import WebSocket = require("ws");
import { genConfig, Config, Friend } from "./Config";

if (process.argv[2] == "genconfig") {
  genConfig();
  process.exit(0);
}

let config = new Config("./.data/config.json");

const ui = express();
ui.use(express.static("public"));
ui.listen(config.localHttpPort, "127.0.0.1", () => {
  console.log(
    `ui listening locally at http://127.0.0.1:${config.localHttpPort}`
  );
});

const ws = new WebSocket.Server({ host: "127.0.0.1", port: 3001 });
ws.on("connection", function connection(ws) {
  console.log("websocket connection");
  ws.on("message", function incoming(data: any) {
    let message = JSON.parse(data);
    console.log(`recieved ${message}`);
    console.log(`encrypting ${message.text} for ${message.to}`);
    config.friends.forEach((f: Friend) => {
      if (f.publicKeyBase64 == message.to) {
        const sharedB = box.before(f.publicKey, config.secretKey);
        const encrypted = crypt.encrypt(sharedB, {
          text: message.text,
          date: message.date,
        });

        fs.writeFileSync(".data/outbox/message", encrypted);
      }
    });
  });
});

const transport = express();
transport.listen(config.internetListenPort, "::0", () => {
  console.log(
    `listening to on all ip6 interface http://[::0]:${config.internetListenPort}`
  );
});

/*
if (process.argv[2] == "server") {
  console.log("starting server");
  const server = net.createServer((c: net.Socket) => {
    console.log("client connected");
    c.setEncoding("utf8");
    c.on("data", (buf: Buffer) => {
      const decrypted = crypt.decrypt(sharedB, buf.toString());
      console.log("received: ", decrypted);
      const encrypted = crypt.encrypt(sharedB, {
        key: "hello",
        value: "from nate's server",
      });
      c.write(encrypted);
    });
    c.on("end", () => {
      console.log("client disconnected");
    });
  });
  server.on("error", (err) => {
    throw err;
  });

  if (process.argv.length > 3) {
    server.listen(2679, process.argv[3], () => {
      console.log(`server listening on ${process.argv[3]}`);
    });
  } else {
    server.listen(2679, "::0", () => {
      console.log("server listening on ::0");
    });
  }
} else if (process.argv[2] == "client") {
  /*
  const serverPublicKey = decodeBase64(
    "cW3T6xW6D128PkrTgP3Os6owHZlRI4eygwaRjbnI4l8="
  );
  const clientSecretKey = decodeBase64(
    "MJFEvM2H8zJisKVPNt6giHvuXBgJPZsGkaginZUFX28="
  );
  const sharedA = box.before(serverPublicKey, clientSecretKey);

  console.log("starting client");
  var client = new net.Socket();

  client.on("connect", function () {
    console.log("Client: connection established with server");
    const encrypted = crypt.encrypt(sharedA, {
      key: "hello",
      value: "from nate's client",
    });
    client.write(encrypted);
  });

  client.on("data", (buf: Buffer) => {
    const decrypted = crypt.decrypt(sharedA, buf.toString());
    console.log("received: ", decrypted);
  });

  setTimeout(function () {
    client.end("");
  }, 5000);

  if (process.argv.length > 3) {
    client.connect({ host: process.argv[3], port: 2679 });
  } else {
    client.connect({ host: "::1", port: 2679 });
  }
}
*/
