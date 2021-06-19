import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../../component/header';
import Main from '../main';
import Footer from '../../component/footer';
import 'github-markdown-css';

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
