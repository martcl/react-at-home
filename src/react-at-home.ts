// This is a very simple implementation of React
// It is not meant to be used in production
// I got the inspiration from this livetalk https://www.youtube.com/live/f2mMOiCSj5c
// and this repo https://github.com/nikeee/poor-mans-react

import Index from './index';
let rootContainerElement = undefined;

const globalState = [];
let nextStateIndex = 0;

const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === 'function') {
      return tag(props);
    }
    const element = {
      tag,
      props: { ...props, children },
    };
    return element;
  },
};

export const render = (reactElement, container) => {
  // get the real root container element
  if (!rootContainerElement) {
    rootContainerElement = container;
  }

  if (['string', 'number'].includes(typeof reactElement)) {
    container.appendChild(document.createTextNode(String(reactElement)));
    return;
  }

  if (typeof reactElement === 'boolean') return;

  let actualElement = document.createElement(reactElement.tag);
  const props = reactElement.props;
  for (const [prop, value] of Object.entries(props)) {
    if (prop !== 'children') actualElement[prop] = value;
  }

  const children = props.children;
  for (const child of children) {
    render(child, actualElement);
  }
  container.appendChild(actualElement);
};

export const useState = (initialValue) => {
  const stateIndex = nextStateIndex;
  if (globalState[stateIndex] === undefined) {
    globalState[stateIndex] = initialValue;
  }
  const setState = (newState) => {
    const currentState = globalState[stateIndex];
    if (!Object.is(currentState, newState)) {
      globalState[stateIndex] = newState;
      reRender();
    }
  };
  ++nextStateIndex;
  return [globalState[stateIndex], setState] as const;
};

// this hook is currently not working properly
export const useEffect = (callback, dependencies) => {
  const stateIndex = nextStateIndex;
  if (globalState[stateIndex] === undefined) {
    globalState[stateIndex] = dependencies;
  }
  const currentState = globalState[stateIndex];
  const hasDependenciesChanged = dependencies.some((dependency, index) => {
    return !Object.is(dependency, currentState[index]);
  });
  if (
    hasDependenciesChanged ||
    (currentState.length === 0 && dependencies.length === 0)
  ) {
    callback();
    globalState[stateIndex] = dependencies;
  }
  ++nextStateIndex;
};

const reRender = () => {
  nextStateIndex = 0;

  const focusedElement = document.activeElement;
  const focusedElementId = focusedElement?.id;
  
  rootContainerElement.innerHTML = '';
  render(Index(), document.getElementById('root'));
  
  document.getElementById(focusedElementId)?.focus();

};


export default React;