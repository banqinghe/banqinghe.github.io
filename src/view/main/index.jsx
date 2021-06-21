import { Switch, Route } from 'react-router-dom';
import Content from './post-list';
import PostPage from './post-page';
import styles from './index.module.css';

function Main() {
  return (
    <main className={styles["main-content"]}>
      <Switch>
        <Route path="/post">
          <PostPage postIndex={0} />
        </Route>
        <Route path="/">
          <Content />
        </Route>
      </Switch>
    </main>
  );
}

export default Main;
