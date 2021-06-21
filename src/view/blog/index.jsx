import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../../component/header';
import Main from '../main';
import Footer from '../../component/footer';

function Blog() {
  return (
    <Router>
      <Header />
      <Main />
      <Footer />
    </Router>
  )
}

export default Blog;
