
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import ImportInvoice from "./pages/ImportInvoice";
import Financial from "./pages/Financial";
import Deliveries from "./pages/Deliveries";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import InvoiceRouting from "./pages/InvoiceRouting";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Index />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/import" element={<ImportInvoice />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/deliveries/completed" element={<Deliveries />} />
          <Route path="/deliveries/issues" element={<Deliveries />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoice-routing" element={<InvoiceRouting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
