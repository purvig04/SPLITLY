import crypto from "crypto";

const CHECKSUM_SECRET = process.env.SHARE_CODE_SECRET;
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateChecksum(payload) {
  return crypto
    .createHmac("sha256", CHECKSUM_SECRET)
    .update(payload)
    .digest("base64url")
    .charAt(0)
    .toUpperCase();
}

export const generateShareCode = () => {
  const letters = [...Array(3)]
    .map(() => LETTERS[crypto.randomInt(0, LETTERS.length)])
    .join("");
  const digits = [...Array(5)].map(() => crypto.randomInt(0, 10)).join("");
  const body = `SPLIT-${letters}-${digits}`;

  const checksum = generateChecksum(body);

  return `${body}-${checksum}`;
};

export const verifyShareCode = (code) => {
  const parts = code.split("-");

  if (parts.length !== 4) return false;

  const body = parts.slice(0, 3).join("-");
  const checksum = parts[3];

  return generateChecksum(body) === checksum;
};
