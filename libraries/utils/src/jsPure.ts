/**
 * Check if a string is in JSON format.
 *
 * @param str - Input string.
 * @returns A boolean value.
 *
 * @example Checking a JSON string
 *
 * # Contents of the str variable
 * ```json
 * {
 *   "exampleItem": "text"
 * }
 * ```
 *
 * # Usage
 * ```ts
 * const result = isJsonString(str);
 * ```
 *
 * # Result
 * ```ts
 * true
 * ```
 */
export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const encodeStringToHex = (plain: string) =>
  plain
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

export const decodeHexToString = (hex: string) =>
  hex
    .split(/(\w\w)/g)
    .filter((p) => !!p)
    .map((c) => String.fromCharCode(parseInt(c, 16)))
    .join('');

export const getValueByPath = (
  path: string,
  jsonObject: {[key: string]: any},
) => path.split('.').reduce((p: any, c: any) => p?.[c], jsonObject);

export const reverseObject = (obj: any) =>
  Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export const readFileAsync = (file: Blob) => {
  return new Promise((resolve, reject) => {
    var fr = new FileReader();
    fr.onload = (r) => {
      resolve(r?.target?.result);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
};

export const dataUrlFileExtension = (dataUrl: string) =>
  dataUrl.substring(dataUrl.indexOf('/') + 1, dataUrl.indexOf(';'));

export const dataUrlWithoutMetaData = (dataUrl: string) => {
  // Buffer.from(dataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const base64result = dataUrl.split(',')[1];
  return Buffer.from(base64result, 'base64');
};

export const dataUrlMimeType = (dataUrl: string) =>
  dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
