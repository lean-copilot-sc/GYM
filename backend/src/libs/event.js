export function parseBody(event) {
  if (!event?.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (error) {
    console.warn('Unable to parse request body', error);
    return {};
  }
}
