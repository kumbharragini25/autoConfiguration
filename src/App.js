import React, { useState, useEffect, useRef } from 'react'; // ⬅️ Added useRef
import { Tabs, Tab } from 'react-bootstrap';
import CategorySelector from './components/CategorySelector';
import ModelSelector from './components/ModelSelector';
import ConfiguratorTabs from './components/ConfiguratorTabs.jsx';
import AppHeader from './components/AppHeader.jsx';
import AppFooter from './components/AppFooter.jsx';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [category, setCategory] = useState('');
  const [model, setModel] = useState('');
  const [key, setKey] = useState('category');
  const [loadConfigurator, setLoadConfigurator] = useState(false);
  const [hasModelFetched, setHasModelFetched] = useState(false);

  // 🕒 Session timeout refs
  const logoutTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 mins
  const WARNING_TIME = 14 * 60 * 1000;     // Warn at 14 mins

  // ✅ Check localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setIsLoggedIn(true);
      setLoggedInUser(savedUser);
    }
  }, []);

  // ✅ Reset model and configurator when category changes
  useEffect(() => {
    setModel('');
    setLoadConfigurator(false);
    setHasModelFetched(false);
  }, [category]);

  // ✅ Auto logout on inactivity
  useEffect(() => {
    if (!isLoggedIn) return;

    const resetTimers = () => {
      clearTimeout(logoutTimeoutRef.current);
      clearTimeout(warningTimeoutRef.current);

      warningTimeoutRef.current = setTimeout(() => {
        alert('⚠️ You will be logged out in 1 minute due to inactivity.');
      }, WARNING_TIME);

      logoutTimeoutRef.current = setTimeout(() => {
        alert('⏰ Session expired due to inactivity.');
        handleLogout();
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimers));

    resetTimers(); // start timers on mount

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, resetTimers));
      clearTimeout(logoutTimeoutRef.current);
      clearTimeout(warningTimeoutRef.current);
    };
  }, [isLoggedIn]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setLoggedInUser('');
    setCategory('');
    setModel('');
    setKey('category');
  };

  // ✅ Show login if not logged in
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={(name) => {
          setIsLoggedIn(true);
          setLoggedInUser(name);
          localStorage.setItem('loggedInUser', name);
        }}
      />
    );
  }

  // ✅ Main app UI
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppHeader onLogout={handleLogout} loggedInUser={loggedInUser} />
      <div className="flex-grow-1 overflow-auto px-3" style={{ paddingBottom: '70px' }}>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="category" title={`Category${category ? `: ${category}` : ''}`}>
            <CategorySelector
              selected={category}
              onSelect={(val) => setCategory(val)}
              onNext={() => {
                setHasModelFetched(true);
                setKey('model');
              }}
            />
          </Tab>

          <Tab eventKey="model" title={`Model${model ? `: ${model}` : ''}`}>
            {key === 'model' && (
              <ModelSelector
                selectedCategory={category}
                selectedModel={model}
                shouldLoad={hasModelFetched}
                onSelect={(val) => setModel(val)}
                onNext={() => {
                  setLoadConfigurator(true);
                  setKey('configurator');
                }}
              />
            )}
          </Tab>

          <Tab eventKey="configurator" title="Configurator">
            {loadConfigurator && key === 'configurator' && (
              <ConfiguratorTabs selectedCategory={category} />
            )}
          </Tab>
        </Tabs>
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
