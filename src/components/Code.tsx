import React from '../react-at-home';

export type CodeProps = {
  title: string;
  code: string;
};

export const Window = ({ title, code }: CodeProps) => {
  return (
    <div className='window'>
      <div className='title-bar'>
        <div className='title-bar-text'>{title}</div>
        <div className='title-bar-controls'>
          <button aria-label='Minimize'></button>
          <button aria-label='Maximize'></button>
          <button aria-label='Close'></button>
        </div>
      </div>
      <div className='window-body'>
        {code}
     
      </div>
    </div>
  );
};
