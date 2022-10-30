"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSdkInterface = void 0;
exports.defaultSdkInterface = `
export async function request(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  uri: string,
  body: unknown,
  query: Record<string, string>
): Promise<any> {
  const url = new URL('http://localhost:3000' + uri)
  url.search = new URLSearchParams(query).toString()

  const params: RequestInit = {
    method,
    // Required for content to be correctly parsed by NestJS
    headers: { 'Content-Type': 'application/json' },
  }

  // Setting a body is forbidden on GET requests
  if (method !== 'GET') {
    params.body = JSON.stringify(body)
  }

  return fetch(url.toString(), params).then((res) => {
    // Handle failed requests
    if (!res.ok) {
      throw Error(res.statusText)
    }

    return res.json()
  })
}

`.trim();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2RrLWludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nZW5lcmF0b3Ivc2RrLWludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLG1CQUFtQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBK0JsQyxDQUFDLElBQUksRUFBRSxDQUFBIn0=