// Polyfill for `bcrypt` using PBKDF2 (WebCrypto)

function arrayBufferToHex(bytes: Uint8Array<ArrayBuffer>): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
}

export async function hashPassword(
  password: string,
  iterations = 100_000,
  saltLength = 16,
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(saltLength));
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );

  const saltHex = arrayBufferToHex(salt);
  const hashHex = arrayBufferToHex(new Uint8Array(derivedBits));

  return `$pbkdf2$${iterations}$${saltHex}$${hashHex}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 5 || parts[1] !== "pbkdf2") {
    throw new Error("Invalid hash format");
  }

  const iterations = parseInt(parts[2], 10);
  const saltHex = parts[3];
  const expectedHash = parts[4];

  const salt = hexToUint8Array(saltHex);
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );

  const hashHex = arrayBufferToHex(new Uint8Array(derivedBits));

  return hashHex === expectedHash;
}
