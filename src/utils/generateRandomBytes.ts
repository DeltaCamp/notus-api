const crypto = require('crypto');

export const generateRandomBytes = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(256, function (ex, buffer) {
      if (ex) {
        reject("error generating token");
      }

      const token = crypto
        .createHash("sha1")
        .update(buffer)
        .digest("hex");

      resolve(token);
    });
  });
}
