import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import Dashboard from './components/layout/Dashboard';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import InventoryPage from './pages/InventoryPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Error handling and utilities
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProviderWrapper } from './utils/ThemeContext';
import { logger } from './utils/logger';

// Global styles
import './styles/global.css';

/**
 * Main App component
 * Handles routing and authentication state
 * @returns {JSX.Element} App component
 */
function App() {
  // Skip login by default
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  // Log application start
  React.useEffect(() => {
    logger.info('Inventory Management System initialized');
  }, []);

  // Authentication handlers
  const login = () => {
    logger.info('User logged in');
    setIsAuthenticated(true);
  };

  const logout = () => {
    logger.info('User logged out');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          {!isAuthenticated ? (
            <Routes>
              <Route path="*" element={<LoginPage onLogin={login} />} />
            </Routes>
          ) : (
            <div className="app-container">
              <Navbar onLogout={logout} />
              <div className="content-container">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </main>
              </div>
            </div>
          )}
        </Router>
      </ErrorBoundary>
    </ThemeProviderWrapper>
  );
}

export default App;