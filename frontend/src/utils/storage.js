export function getAuthToken() {
  return localStorage.getItem('token');
}

export function getMemberProfile() {
  const cached = localStorage.getItem('member');
  return cached ? JSON.parse(cached) : null;
}
