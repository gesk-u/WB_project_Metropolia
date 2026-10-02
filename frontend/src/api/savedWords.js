const API_URL = import.meta.env.VITE_API_URL ?? '';

async function request(path = '', options = {}) {
    const res = await fetch(`${API_URL}/api/saved-words${path}`, {
        credentials: 'include', // sends the guest/login cookie
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
}

export const getSavedWords = (options) => request('', options);
export const saveWord = (clip) => request('', { method: 'POST', body: JSON.stringify(clip) });
export const removeSavedWord = (id) => request(`/${id}`, { method: 'DELETE' });