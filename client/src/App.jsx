import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import AddCompanyPage from './pages/AddCompanyPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies/new" element={<AddCompanyPage />} />
        <Route path="/companies/:id" element={<CompanyDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
