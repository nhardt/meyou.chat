import crypt = require("./crypt");
import { encodeBase64 } from "tweetnacl-util";
import { box } from "tweetnacl";

function crryptTest() {
  console.log("running crypt test\n");
  const obj = { hello: "peer" };
  const pairA = crypt.generateKeyPair();
  const pairB = crypt.generateKeyPair();
  console.log(
    `const secretKeyB = decodeBase64("${encodeBase64(pairB.secretKey)}");`
  );
  console.log(
    `const publicKeyB = decodeBase64("${encodeBase64(pairB.publicKey)}");`
  );
  const sharedA = box.before(pairB.publicKey, pairA.secretKey);
  const sharedB = box.before(pairA.publicKey, pairB.secretKey);
  const encrypted = crypt.encrypt(sharedA, obj);
  const decrypted = crypt.decrypt(sharedB, encrypted);

  if (decrypted.hello == obj.hello) {
    console.log("encrypt/decrypt worked:", decrypted, obj); // should be shallow equal
  } else {
    console.log("encrypt/decrypt failed:", decrypted, obj);
    console.log({ hello: "peer" } == { hello: "peer" });
    console.log({ hello: "peer" });
  }
}
