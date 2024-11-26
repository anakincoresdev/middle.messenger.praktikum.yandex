const enum METHODS {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/* eslint-disable-next-line no-undef */
type XMLHTTPBody = Record<string, unknown>;

type Options = {
  headers?: Record<string, string>;
  timeout?: number;
  data?: XMLHTTPBody;
};

function queryStringify(data: XMLHTTPBody) {
  if (typeof data !== 'object') {
    throw new Error('Error: Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce(
    (result, key, index) =>
      `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`,
    '?',
  );
}

class HTTPTransport {
  baseURL: string;

  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }

  get = (url: string, options: Options = {}) =>
    this.request(this.baseURL + url, { ...options, method: METHODS.GET });

  post = (url: string, options: Options = {}) =>
    this.request(this.baseURL + url, { ...options, method: METHODS.POST });

  put = (url: string, options: Options = {}) =>
    this.request(this.baseURL + url, { ...options, method: METHODS.PUT });

  delete = (url: string, options: Options = {}) =>
    this.request(this.baseURL + url, { ...options, method: METHODS.DELETE });

  request = (
    url: string,
    options: {
      headers?: Record<string, string>;
      method: METHODS;
      data?: XMLHTTPBody;
      timeout?: number;
    },
  ) => {
    const {
      headers = { 'Content-Type': 'application/json' },
      method,
      data,
      timeout,
    } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(method, isGet && data ? `${url}${queryStringify(data)}` : url);

      const isFormData = data instanceof FormData;

      if (!isFormData) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout || 5000;
      xhr.ontimeout = reject;
      xhr.withCredentials = true;

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}

export const fetchAPI = new HTTPTransport({
  baseURL: 'https://ya-praktikum.tech/api/v2',
});
