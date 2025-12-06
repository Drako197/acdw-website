import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { HomeownerHomePage } from './pages/HomeownerHomePage'
import { PropertyManagerPage } from './pages/PropertyManagerPage'
import { PromoPage } from './pages/PromoPage'
import { CustomerSelectionPage } from './pages/CustomerSelectionPage'
import { ProductsPage } from './pages/ProductsPage'
import { ContactPage } from './pages/ContactPage'
import { AboutPage } from './pages/AboutPage'
import { SupportPage } from './pages/SupportPage'
import { CompliancePage } from './pages/CompliancePage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { DashboardPage } from './pages/DashboardPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { ReturnRefundPolicyPage } from './pages/ReturnRefundPolicyPage'
import { ShippingPolicyPage } from './pages/ShippingPolicyPage'
import { WarrantyPolicyPage } from './pages/WarrantyPolicyPage'
import { EmailPreferencesPage } from './pages/EmailPreferencesPage'
import { UnsubscribePage } from './pages/UnsubscribePage'
import { HVACProCatalogPage } from './pages/HVACProCatalogPage'
import { PropertyManagerCatalogPage } from './pages/PropertyManagerCatalogPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'
import { ProfilePage } from './pages/ProfilePage'
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage'
import { CheckoutCancelPage } from './pages/CheckoutCancelPage'
import { MiniProductPage } from './pages/MiniProductPage'
import { CheckoutPage } from './pages/CheckoutPage'

function AppContent() {
  const location = useLocation()
  
  // Hide header/footer on checkout page for cleaner Stripe-like experience
  const hideHeaderFooter = location.pathname === '/checkout'
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/homeowner" element={<HomeownerHomePage />} />
              <Route path="/property-manager" element={<PropertyManagerPage />} />
              <Route path="/promo" element={<PromoPage />} />
              <Route path="/customer-selection" element={<CustomerSelectionPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/solutions" element={<ProductsPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/compliance" element={<CompliancePage />} />
                    <Route path="/auth/signin" element={<SignInPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/business/pro/catalog" element={<HVACProCatalogPage />} />
              <Route path="/business/property-manager/catalog" element={<PropertyManagerCatalogPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/return-refund-policy" element={<ReturnRefundPolicyPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="/warranty-policy" element={<WarrantyPolicyPage />} />
              <Route path="/email-preferences" element={<EmailPreferencesPage />} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
              <Route path="/products/mini" element={<MiniProductPage />} />
            </Routes>
          </main>
          {!hideHeaderFooter && <Footer />}
        </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App