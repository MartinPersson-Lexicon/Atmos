import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ApiTest from "./pages/ApiTest";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Header, Footer, Sidebar } from "./components";

import { useState } from 'react';
function App() {
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  // const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <div className="app-root">
      <Header />

      <div className="app-layout">
        <Sidebar />

        <div className="content">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/api-test" element={<ApiTest />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
