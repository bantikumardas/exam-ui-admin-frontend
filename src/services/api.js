const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HOST_URL = BASE_URL.replace(/\/api$/, "");

async function request(endpoint, options = {}, baseUrl = BASE_URL) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:expired"));
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: "DELETE", ...options }),
};

export const apiHost = {
  post: (endpoint, body, options) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body), ...options }, HOST_URL),
};
