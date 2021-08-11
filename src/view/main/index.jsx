import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './post-list';
import PostPage from './post-page';
import About from './about';
import NotFound from '../not-found';
import styles from './index.module.css';

function Main() {
  return (
    <main className={styles["main-content"]}>
      <Switch>
        <Route exact path="/post/:title">
          <PostPage />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/404" component={NotFound} />
        <Redirect to="/404" />
      </Switch>
    </main>
  );
}

export default Main;
