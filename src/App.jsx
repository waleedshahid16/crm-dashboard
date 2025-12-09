import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage"));
const DealsPage = lazy(() => import("./pages/DealsPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const HelpSupportPage = lazy(() => import("./pages/HelpSupportPage"));
const ClientDetailPage = lazy(() => import("./components/detail-pages/ClientDetailPage"));
const CompanyDetailPage = lazy(() => import("./components/detail-pages/CompanyDetailPage"));
const SignInPage = lazy(() => import("./auth/SignInPage"));
const RegisterPage = lazy(() => import("./auth/RegisterPage"));

// Suspense wrapper component
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner size="lg" text="Loading page..." />}>
    {children}
  </Suspense>
);

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SuspenseWrapper><SignInPage /></SuspenseWrapper>} />
            <Route path="/register" element={<SuspenseWrapper><RegisterPage /></SuspenseWrapper>} />
            <Route path="/" element={<Layout />}>
              <Route index element={<SuspenseWrapper><Dashboard /></SuspenseWrapper>} />
              <Route path="clients" element={<SuspenseWrapper><ClientsPage /></SuspenseWrapper>} />
              <Route path="clients/:id" element={<SuspenseWrapper><ClientDetailPage /></SuspenseWrapper>} />
              <Route path="companies" element={<SuspenseWrapper><CompaniesPage /></SuspenseWrapper>} />
              <Route path="companies/:id" element={<SuspenseWrapper><CompanyDetailPage /></SuspenseWrapper>} />
              <Route path="deals" element={<SuspenseWrapper><DealsPage /></SuspenseWrapper>} />
              <Route path="tasks" element={<SuspenseWrapper><TasksPage /></SuspenseWrapper>} />
              <Route path="analytics" element={<SuspenseWrapper><AnalyticsPage /></SuspenseWrapper>} />
              <Route path="reports" element={<SuspenseWrapper><ReportsPage /></SuspenseWrapper>} />
              <Route path="settings" element={<SuspenseWrapper><SettingsPage /></SuspenseWrapper>} />
              <Route path="help" element={<SuspenseWrapper><HelpSupportPage /></SuspenseWrapper>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
