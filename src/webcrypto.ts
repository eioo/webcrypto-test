// Functions to generate, import, export, encrypt and decrypt with WebCrypto API (AES-GCM)

const algorithm = 'AES-GCM';
const algoLength = 256;
const initVector = crypto.getRandomValues(new Int8Array(12));

export async function generateKey() {
  try {
    const key = await crypto.subtle.generateKey(
      {
        name: algorithm,
        length: algoLength,
      },
      true,
      ['encrypt', 'decrypt']
    );

    return key;
  } catch {
    throw new Error('Error while generating crypto key.');
  }
}

export async function importKey(keydata: JsonWebKey) {
  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      keydata,
      {
        name: algorithm,
        length: algoLength,
      },
      false,
      ['encrypt', 'decrypt']
    );
    return key;
  } catch {
    throw new Error('Error while importing crypto key.');
  }
}

export async function exportKey(key: CryptoKey) {
  try {
    const keydata = await crypto.subtle.exportKey('jwk', key);
    return keydata;
  } catch {
    throw new Error('Error while exporting crypto key.');
  }
}

export async function encrypt(key: CryptoKey, data: ArrayBuffer) {
  try {
    const encrypted = await crypto.subtle.encrypt(
      {
        name: algorithm,
        iv: initVector,
      },
      key,
      data
    );

    return encrypted;
  } catch {
    throw new Error('Error while encrypting data.');
  }
}

export async function decrypt(key: CryptoKey, data: ArrayBuffer) {
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: algorithm,
        iv: initVector,
      },
      key,
      data
    );
    return decrypted;
  } catch (e) {
    throw new Error('Error while decrypting data.');
  }
}
