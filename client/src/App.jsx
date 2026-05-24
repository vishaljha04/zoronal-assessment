import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import AddCompanyPage from './pages/AddCompanyPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  const location = useLocation();
  
  // Pages that should NOT have the MainLayout
  const noLayoutPages = ['/login', '/signup'];
  const shouldUseLayout = !noLayoutPages.includes(location.pathname);

  return shouldUseLayout ? (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies/new" element={<AddCompanyPage />} />
        <Route path="/companies/:id" element={<CompanyDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  ) : (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;