import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Error from './pages/Error';

// Páginas públicas
import LandingPage from './pages/LandingPage';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';

// Páginas privadas
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TasksByCategory from './pages/TasksByCategory';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories/:id" element={<TasksByCategory />} />
            <Route path="/task/new" element={<NewTask />} />
            <Route path="/task/:id" element={<EditTask />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/unauthorized" />} />
        <Route path="/unauthorized" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;