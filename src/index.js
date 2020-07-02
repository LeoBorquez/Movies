import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { UserContext } from './context/UserContext'
import { login } from "./utils/login"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export function Index() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <h2>Home</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      { user ? (
        <button onClick={() => {
          // call logout
          setUser(null);
        }}>logout</button>
      ) : (
          <button
            onClick={async () => {
              const user = await login();
              setUser(user);
            }}>
            Login
          </button>
        )}
    </div>

  )
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
