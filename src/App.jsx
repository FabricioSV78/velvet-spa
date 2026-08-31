import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import PromotionsPage from './pages/PromotionsPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import VelvetPage from './pages/VelvetPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="servicios" element={<Navigate to="/servicios/cabello" replace />} />
        <Route path="servicios/:categoryId" element={<ServicesPage />} />
        <Route path="promociones" element={<PromotionsPage />} />
        <Route path="velvet" element={<VelvetPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
