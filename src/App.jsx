import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ApiTest from "./pages/ApiTest";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Header, Footer, Sidebar } from "./components";
import { ThemeProvider } from "./context/ThemeProvider";

import { useState } from "react";
import { SMHI_CITY_MODELS } from "./models/cityModel";

function App() {
  const [selectedCity, setSelectedCity] = useState("Malmö");
  return (
    <ThemeProvider>
      <div className="app-root">
        <Header
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cityOptions={SMHI_CITY_MODELS.map((c) => c.city)}
        />
        <div className="app-layout">
          <Sidebar />
          <div className="content">
            <main>
              <Routes>
                <Route path="/" element={<Home selectedCity={selectedCity} setSelectedCity={setSelectedCity} />} />
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
    </ThemeProvider>
  );
}

export default App;
