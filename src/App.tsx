import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './view/MainPage';
import { HashRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './store';

function App() {
  return (
    <GlobalProvider>
      <div className="flex flex-col min-h-screen">
        <Router>
          <Header />
          <MainPage />
          <Footer />
        </Router>
      </div>
    </GlobalProvider>
  )
}

export default App
