import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { ExpenseList } from './pages/ExpenseList';
import { ExpenseDistribution } from './pages/ExpenseDistribution';
import { BudgetPage } from './pages/BudgetPage';
import { AlertsPage } from './pages/AlertsPage';
import { ExpenseForm } from './components/expenses/ExpenseForm';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Navbar } from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-expense"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <ExpenseForm />
                </div>
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <ExpenseList />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/distribution"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <ExpenseDistribution />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <BudgetPage />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <AlertsPage />
              </>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;