import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './view/MainPage';
import { HashRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <MainPage />
        <Footer />
      </Router>
    </div>
  )
}

export default App
