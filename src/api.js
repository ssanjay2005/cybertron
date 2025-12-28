const API_BASE = process.env.REACT_APP_API_BASE_URL;

// JSON POST
export async function postJSON(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function postForm(endpoint, formData) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    // backend intentionally rejected
    throw new Error(data.error || "Submission conflict");
  }

  return data;
}



