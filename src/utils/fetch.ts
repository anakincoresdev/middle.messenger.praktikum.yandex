const enum METHODS {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/* eslint-disable-next-line no-undef */
type XMLHTTPBody = Record<string, unknown>;

type Options = {
  headers: Record<string, string>;
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

export class HTTPTransport {
  get = (url: string, options: Options) =>
    this.request(url, { ...options, method: METHODS.GET });

  post = (url: string, options: Options) =>
    this.request(url, { ...options, method: METHODS.POST });

  put = (url: string, options: Options) =>
    this.request(url, { ...options, method: METHODS.PUT });

  delete = (url: string, options: Options) =>
    this.request(url, { ...options, method: METHODS.DELETE });

  request = (url: string, options: {
    headers: Record<string, string>,
    method: METHODS,
    data?: XMLHTTPBody,
    timeout?: number,
  }) => {
    const {
      headers,
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

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout || 5000;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}
