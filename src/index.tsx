import { Header } from './components/Header';
import React, { render, useEffect, useState } from './react-at-home';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Martin Clementz');

  const handleClick = () => {
    setCount(count + 1);
  };

  // kinda broken
  useEffect(() => {
    console.log('This should be called only once, on first mount. pliz');
  }, []);

  return (
    <div class='content'>
      <h1>React at home</h1>
      <p>
        <span className='code'>react-at-home.ts</span> is a simple version of
        Reactjs.
      </p>
      <p>It is a learning project to understand how React works.</p>
      <p>It is not intended to be used in production.</p>
      <h2>We have buttons!</h2>
      <button onclick={handleClick}>Klikk meg!</button>
      <p>{count}</p>
      <h2>And we have input fields! (sorta)</h2>
      <input
        type='text'
        value={name}
        oninput={(e) => setName(e.target.value)}
      ></input>
      <p>{name}</p>
    </div>
  );
};

const Index = () => (
  <>
    <Header />
    <App />
  </>
);

render(<Index />, document.getElementById('root'));

// must export as default.
export default Index;
