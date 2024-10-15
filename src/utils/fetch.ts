const enum METHOD {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type Options = {
  method: METHOD;
  timeout: number;
  data?: any;
};

export function request<TResponse>(
  url: string,
  options: Options = { method: METHOD.GET, timeout: 5000 },
): Promise<TResponse> {
  const { method, data } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'text/plain');

    xhr.timeout = options.timeout;

    xhr.onload = () => {
      resolve(xhr.response);
    };

    xhr.onabort = reject;
    xhr.onerror = reject;
    xhr.ontimeout = reject;

    let payload;

    if (method !== METHOD.GET && data) {
      payload = JSON.stringify(data);
    }

    xhr.send(payload);
  });
}

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// Самая простая версия. Реализовать штучку со всеми проверками им предстоит в конце спринта
// Необязательный метод
function queryStringify(data) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  // Здесь достаточно и [object Object] для объекта
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}
//
// class HTTPTransport {
//   get = (url, options = {}) => {
//
//     return this.request(url, {...options, method: METHODS.GET}, options.timeout);
//   };
//
//   post = (url, options = {}) => {
//     return this.request(url, {...options, method: METHODS.POST}, options.timeout);
//   };
//
//   put = (url, options = {}) => {
//     return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
//   };
//
//   delete = (url, options = {}) => {
//     return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
//   };
//
//   request = (url, options = {}, timeout = 5000) => {
//     const {headers = {}, method, data} = options;
//
//     return new Promise(function(resolve, reject) {
//       if (!method) {
//         reject('No method');
//         return;
//       }
//
//       const xhr = new XMLHttpRequest();
//       const isGet = method === METHODS.GET;
//
//       xhr.open(
//         method,
//         isGet && !!data
//           ? `${url}${queryStringify(data)}`
//           : url,
//       );
//
//       Object.keys(headers).forEach(key => {
//         xhr.setRequestHeader(key, headers[key]);
//       });
//
//       xhr.onload = function() {
//         resolve(xhr);
//       };
//
//       xhr.onabort = reject;
//       xhr.onerror = reject;
//
//       xhr.timeout = timeout;
//       xhr.ontimeout = reject;
//
//       if (isGet || !data) {
//         xhr.send();
//       } else {
//         xhr.send(data);
//       }
//     });
//   };
// }
