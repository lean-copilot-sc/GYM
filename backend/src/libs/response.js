export function ok(body = {}, statusCode = 200) {
  return buildResponse(statusCode, { success: true, ...body });
}

export function created(body = {}) {
  return buildResponse(201, { success: true, ...body });
}

export function badRequest(message = 'Invalid request', details) {
  return buildResponse(400, { success: false, message, details });
}

export function unauthorized(message = 'Unauthorized') {
  return buildResponse(401, { success: false, message });
}

export function forbidden(message = 'Forbidden') {
  return buildResponse(403, { success: false, message });
}

export function notFound(message = 'Not found') {
  return buildResponse(404, { success: false, message });
}

export function serverError(error) {
  const message = typeof error === 'string' ? error : error.message;
  return buildResponse(500, { success: false, message: message || 'Internal server error' });
}

function buildResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
}
