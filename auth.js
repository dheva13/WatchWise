async function fetchCurrentUser() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    return data.user || null;
  } catch (e) {
    return null;
  }
}

async function renderAuthLinks() {
  const container = document.getElementById('auth-links');
  if (!container) return;
  const user = await fetchCurrentUser();
  if (user) {
    container.innerHTML = `
      <span class="user-email">${user.email}</span>
      <button id="logout-button" class="secondary">Logout</button>
    `;
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = 'index.html';
    });
  } else {
    container.innerHTML = `
      <a href="login.html" class="secondary">Login</a>
      <a href="register.html" class="secondary">Register</a>
    `;
  }
}

window.addEventListener('DOMContentLoaded', renderAuthLinks);