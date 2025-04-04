import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './index.module.scss';

const App: React.FC = () => {
  return <div className={styles['style-1']}>Hello, world!</div>;
};

const root = document.getElementById('root');
if (root == null) {
  throw new Error('No root');
}

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(<App />);
