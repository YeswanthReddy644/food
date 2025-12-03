import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfirmProvider } from './contexts/ConfirmContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import HomePage from './pages/HomePage';
import CustomerLogin from './pages/CustomerLogin';
import OwnerLogin from './pages/OwnerLogin';
import OwnerSignup from './pages/OwnerSignup';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import MenuManagement from './pages/MenuManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ConfirmProvider>
      <Router>
        <Header />
      <main
        style={{
          minHeight: 'calc(100vh - 120px)',
          backgroundColor: '#fffaf4',
          padding: '20px',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/owner-signup" element={<OwnerSignup />} />

          {/* Customer Protected Route */}
          <Route element={<ProtectedRoute roles={['customer']} />}>
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          </Route>

          {/* Owner Protected Route */}
          <Route element={<ProtectedRoute roles={['owner']} />}>
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route
              path="/owner-dashboard/menu-management"
              element={<MenuManagement />}
            />
          </Route>

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <h1
                style={{
                  textAlign: 'center',
                  marginTop: '50px',
                  color: '#ff7043',
                }}
              >
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>
        <Footer />
        <WhatsAppWidget message={"Hi, I want to order. Please help me."} />
      </Router>
    </ConfirmProvider>
  );
}

export default App;
