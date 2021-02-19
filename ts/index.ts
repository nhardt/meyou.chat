import { box } from "tweetnacl";
import crypt = require("./crypt");
import express = require("express");
import WebSocket = require("ws");
import http = require("http");
import { genConfig, Config, Friend } from "./Config";

if (process.argv[2] == "genconfig") {
  genConfig();
  process.exit(0);
}

let config = new Config("./.data/config.json");
let localWebSocket: WebSocket;

const ui = express();
ui.use(express.static("public"));
ui.listen(config.localHttpPort, "127.0.0.1", () => {
  console.log(
    `ui listening locally at http://127.0.0.1:${config.localHttpPort}`
  );
});

const ws = new WebSocket.Server({
  host: "127.0.0.1",
  port: config.localWebSocketPort,
});
ws.on("connection", function connection(conn) {
  localWebSocket = conn;
  conn.on("message", function incoming(data: any) {
    // v0 - forward request directly peer.
    let message = JSON.parse(data);
    if (message.type == "message") {
      config.friends.forEach((f: Friend) => {
        if (f.publicKeyBase64 == message.to) {
          console.log(
            `encrypting "${message.text}" for "${message.to}" at ${f.ip} ${f.port}`
          );
          const sharedB = box.before(f.publicKey, config.secretKey);
          const encrypted = crypt.encrypt(sharedB, {
            text: message.text,
            date: message.date,
          });
          let req = http.request(
            {
              host: f.ip,
              port: f.port,
              family: 6,
              method: "POST",
              path: "/message",
              timeout: 5000,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(encrypted),
              },
            },
            (res: http.IncomingMessage) => {
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
              res.on("data", (_chunk) => {});
            }
          );
          req.on("error", (e) => {
            console.error(`message could not be delivered: ${e.message}`);
          });
          req.write(encrypted);
          req.end();
        }
      });
    } else if (message.type == "friends") {
      conn.send(
        `{"message":"friendsResponse","friends":${JSON.stringify(
          config.friends
        )}}`
      );
    }
  });
});

const transport = express();
transport.listen(config.internetListenPort, "::0", () => {
  transport.post("/message", (req, _res) => {
    let rawData = "";
    req.on("data", (chunk) => {
      rawData += chunk;
    });
    req.on("end", () => {
      // just cheating here for now and try all friend's public keys.
      // there probably needs to be a way to send this.
      for (let f of config.friends) {
        try {
          const sharedA = box.before(f.publicKey, config.secretKey);
          let decrypted: any;
          try {
            decrypted = crypt.decrypt(sharedA, rawData);
          } catch (_e) {
            // not this friend
            continue;
          }
          console.log(`received ${decrypted.text} from ${f.displayName}`);
          f.messages.push(decrypted.text);
          localWebSocket.send(
            `{"message":"friendsResponse","friends":${JSON.stringify(
              config.friends
            )}}`
          );
          break;
        } catch (e) {
          console.log("could not send message to localWebSocket:", e);
        }
      }
    });
  });
  console.log(
    `listening to on all ip6 interface http://[::0]:${config.internetListenPort}`
  );
});
