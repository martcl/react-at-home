// This is a very simple implementation of React
// It is not meant to be used in production
// I got the inspiration from this livetalk https://www.youtube.com/live/f2mMOiCSj5c
// and this repo https://github.com/nikeee/poor-mans-react

import Index from './index';

type HTMLTag = string;
type ReactChild<TProps> = ReactElement<TProps> | string | number | boolean;
type ReactChildren = readonly ReactChild<unknown>[];

interface ReactElement<TProps> {
  tag: string;
  props: TProps & { children: ReactChildren };
}

type HtmlTagOrComponentFunction<TProps> =
  | HTMLTag
  | ((
      props: TProps | null
    ) => ReactElement<TProps & { children: ReactChildren }>);

let rootContainerElement: HTMLElement = undefined;

const globalState: unknown[] = [];
let nextStateIndex = 0;

const React = {
  createElement: <TProps>(
    tag: HtmlTagOrComponentFunction<TProps>,
    props: TProps,
    ...children: ReactChildren | ReactChildren[]
  ) => {
    if (typeof tag === 'function') {
      return tag({ ...props, children: children });
    }

    if (Array.isArray(children[0])) {
      const element = {
        tag,
        props: { ...props, children: children[0] },
      };
      return element;
    }
    const element = {
      tag,
      props: { ...props, children },
    };
    return element;
  },
};

export const render = <TProps>(
  reactElement: ReactChild<TProps>,
  container: HTMLElement
) => {
  // get the real root container element
  if (!rootContainerElement) {
    rootContainerElement = container;
  }

  if (typeof reactElement === 'string' || typeof reactElement === 'number') {
    container.appendChild(document.createTextNode(String(reactElement)));
    return;
  }
  if (typeof reactElement === 'boolean') return;
  if (typeof reactElement === 'undefined') return;

  if (typeof reactElement.tag === 'undefined') return;

  let actualElement = document.createElement(reactElement.tag) as HTMLElement;

  const props = reactElement.props;
  console.log('rendering element', reactElement.tag, 'with props', props);
  for (const [prop, value] of Object.entries(props)) {
    if (prop !== 'children') actualElement[prop] = value;
  }

  const children = props.children;
  for (const child of children) {
    render(child, actualElement);
  }
  container.appendChild(actualElement);
};

export const useState = <T>(initialValue: T | (() => T)) => {
  const stateIndex = nextStateIndex;

  if (globalState[stateIndex] === undefined) {
    globalState[stateIndex] = initialValue;
  }

  const setState = (newState: T) => {
    const currentState = globalState[stateIndex];
    if (!Object.is(currentState, newState)) {
      globalState[stateIndex] = newState;
      reRender();
    }
  };
  ++nextStateIndex;
  return [globalState[stateIndex] as T, setState] as const;
};

export const useEffect = (callback: () => any, dependencies: any[]) => {
  const stateIndex = nextStateIndex;
  if (globalState[stateIndex] === undefined) {
    globalState[stateIndex] = dependencies;
  }
  const currentState = globalState[stateIndex];
  const hasUseEffectBeenCalled = currentState === dependencies;
  const hasDependenciesChanged = dependencies.some((dependency, index) => {
    return !Object.is(dependency, currentState[index]);
  });
  if (hasDependenciesChanged || hasUseEffectBeenCalled) {
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
