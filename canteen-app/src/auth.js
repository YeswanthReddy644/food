// A very basic mock authentication system for demonstration purposes.
// In a real application, you'd integrate with a backend for secure auth.

const users = {
  customer: { username: 'customer', password: 'password', role: 'customer' },
  owner: { username: 'owner', password: 'admin', role: 'owner' },
};

export const login = (username, password, role) => {
  const user = users[role];
  if (user && user.username === username && user.password === password) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

export const isOwner = () => {
  const user = getCurrentUser();
  return user && user.role === 'owner';
};

export const isCustomer = () => {
  const user = getCurrentUser();
  return user && user.role === 'customer';
};