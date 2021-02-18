import fs = require("fs");
import { decodeBase64 } from "tweetnacl-util";

export interface Friend {
  ip: string;
  port: number;
  displayName: string;
  publicKeyBase64: string;
  networkName: String;
  publicKey?: Uint8Array;
}

export interface ConfigFile {
  localHttpPort: number;
  localWebSocketPort: number;
  internetListenPort: number;
  displayName: string;
  publicKeyBase64: string;
  secretKeyBase64: string;
  friends: Friend[];
}

export class Config {
  localHttpPort: number;
  localWebSocketPort: number;
  internetListenPort: number;
  displayName: string;
  friends: Friend[];
  publicKey: Uint8Array;
  secretKey: Uint8Array;

  constructor(configFilePath: string) {
    const file: ConfigFile = JSON.parse(
      fs.readFileSync(configFilePath, { encoding: "utf8" })
    );
    Object.assign(this, file);
    this.secretKey = decodeBase64(file.secretKeyBase64);
    this.publicKey = decodeBase64(file.publicKeyBase64);

    this.friends.forEach((f: Friend) => {
      console.log(f.publicKeyBase64);
      f.publicKey = decodeBase64(f.publicKeyBase64);
    });
  }
}
