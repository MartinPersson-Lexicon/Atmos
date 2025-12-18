import "../App.css";

// import { useState } from "react";
// import SidebarWidget from "../components/sidebar/SidebarWidget";
import CardOneWidget from "../components/card-one/CardOneWidget";

export default function Home() {
  // const [theme, setTheme] = useState("dark");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div>
      {/* <SidebarWidget activeNav={activeNav} setActiveNav={setActiveNav} /> */}

      {/* <main className="main-content"> */}
        {/* <CordOneHeader
          theme={theme}
          setTheme={setTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        /> */}

        <div className="content-grid">
          <div className="left-column">
            <CardOneWidget />
          </div>
          <div className="right-column"></div>
        </div>
      {/* </main> */}
    </div>
  );
}
