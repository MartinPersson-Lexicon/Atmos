import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import WeatherCard from './components/WeatherCard/WeatherCard'
import './App.css'

function App() {
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      
      <main className="main-content">
        <Header 
          theme={theme} 
          setTheme={setTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <div className="content-grid">
          <div className="left-column">
            <WeatherCard />
          </div>
          
          <div className="right-column">
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
