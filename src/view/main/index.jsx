import { Switch, Route } from 'react-router-dom';
import Home from './post-list';
import PostPage from './post-page';
import About from './about';
import styles from './index.module.css';
    
function Main() {
  return (
    <main className={styles["main-content"]}>
      <Switch>
        <Route path="/post">
          <PostPage postIndex={0} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </main>
  );
}

export default Main;
