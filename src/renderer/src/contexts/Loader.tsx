import * as React from 'react';

export interface LoaderContextData {
  addLoader(): void;
  removeLoader(): void;
}

const LoaderContext = React.createContext<LoaderContextData>(
  {} as LoaderContextData
);

export default LoaderContext;