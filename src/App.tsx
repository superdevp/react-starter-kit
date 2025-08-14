import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './layout/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <DashboardPage />
                    </>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/project/:id"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <ProjectDetailsPage />
                    </>
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
