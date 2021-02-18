import net = require("net");
import { box } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import crypt = require("./crypt");
import fs = require("fs");
import express = require("express");

if (process.argv[2] == "server") {
  /*
  const sharedB = box.before(clientPublicKey, serverSecretKey);
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
  }*/
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
  } */
} else if (process.argv[2] == "genconfig") {
  const keys = crypt.generateKeyPair();
  let conf = {
    port: 2679,
    name: "yournamehere",
    secretKey: encodeBase64(keys.secretKey),
    publicKey: encodeBase64(keys.publicKey),
  };
  console.log(conf);
} else {
  let configFilePath = "./.data/config.json";
  console.log("reading config file at ", configFilePath);
  let config = JSON.parse(
    fs.readFileSync(configFilePath, { encoding: "utf8" })
  );
  console.log("starting http server on ", config.port);
  const secretKey = decodeBase64(config.secretKey);
  const publicKey = decodeBase64(config.publicKey);

  const app = express();

  app.get("/", (req, res) => {
    res.send(`<html><body>hello ${config.name}</body></html>`);
  });

  app.listen(config.port, () => {
    console.log(`listening at http://localhost:${config.port}`);
  });
}
