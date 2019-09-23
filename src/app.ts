import * as wc from './webcrypto';

const $ = document.querySelector.bind(document);

const $generateKey: HTMLButtonElement = $('#generate-key');
const $importKey: HTMLButtonElement = $('#import-key');
const $key: HTMLTextAreaElement = $('#key');

const $encrypt: HTMLButtonElement = $('#encrypt');
const $decrypt: HTMLButtonElement = $('#decrypt');
const $decryptedData: HTMLTextAreaElement = $('#decrypted-data');
const $encryptedData: HTMLTextAreaElement = $('#encrypted-data');

let key: CryptoKey | undefined;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const encodeStr = (s: string) => textEncoder.encode(s);
const decodeStr = (a: ArrayBuffer) => textDecoder.decode(a);

$generateKey.onclick = async () => {
  key = await wc.generateKey();
  const keydata = await wc.exportKey(key);
  $key.innerHTML = JSON.stringify(keydata, null, 2);
  enableCrypting();
};

$importKey.onclick = async () => {
  try {
    const keydata = JSON.parse($key.value);
    key = await wc.importKey(keydata);
    enableCrypting();
    console.log('Key loaded:', key);
  } catch (e) {
    console.log(e);
  }
};

$encrypt.onclick = async () => {
  if (!key) {
    return;
  }

  const data = encodeStr($decryptedData.value);
  const encrypted = await wc.encrypt(key, data);
  $encryptedData.value = new Uint8Array(encrypted).toString();
};

$decrypt.onclick = async () => {
  if (!key) {
    return;
  }

  const arr = $encryptedData.value.split(',').map(Number);
  const data = new Uint8Array(arr);
  const decrypted = await wc.decrypt(key, data);
  $decryptedData.value = decodeStr(decrypted);
};

function enableCrypting() {
  $encrypt.disabled = false;
  $decrypt.disabled = false;
}
