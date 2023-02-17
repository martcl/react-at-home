import { Window } from './components/Code';
import React, { render, useEffect, useState } from './react-at-home';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Martin Clementz');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    console.log('useEffect called');
    fetch("https://dog.ceo/api/breeds/image/random").then((res) =>
      {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      }).then((json) => {
        
        setData(json);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className='frontpage'>
        <div className="frontpage-content">
          <h1>How does React work????</h1>
          <p>This is an experimental project where I try to build some of the core mechanics of React.</p>
          <img className="react-logo" src="/public/react-logo.png" alt="React logo" />
          {loading && <p>Loading...</p>}
          {!loading && <img className="dog" src={data.message}></img>}
        </div>
        <Window title='react-at-home.ts' code=''>
          Test
        </Window>
      </div>
      <h2>Functionality</h2>
      <ul>
        <li>rendering</li>
        <li>useState</li>
        <li>useEffect (sorta)</li>
        <li>keep focus on rerendering</li>
      </ul>
      <h2>We have buttons!</h2>
      <button id='click-btn' onclick={handleClick}>
        Klikk meg!
      </button>
      <p>{count}</p>
      <h2>And we have input fields! (sorta)</h2>
      <input
        id='name-input'
        type='text'
        value={name}
        oninput={(e) => setName(e.target.value)}
      ></input>
      <p>{name}</p>
    </div>
  );
};

const Child = ({ children }) => {
  return (
    <div id="child-div">
      <div>{children}</div>
      <div>
        <h1>TEST1</h1>
      </div>
      <div>
        TEST2
      </div>
    </div>
  )
}

const Mother = () => {
  return (
    <div id="mother-div">
      <Child><div>REAL CHILD</div><h1>ANOTHER</h1></Child>
    </div>
  )
}

const Index = () => (
  <>
    <App />
  </>
);

render(<Mother />, document.getElementById('root'));

// must export as default.
export default Mother;
