import React, { useReducer } from 'react';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { AppState } from './types';

// Initial state for the experience
const initialState: AppState = {
  lightsOn: true,
  rotationSpeed: 0.3,
  bloomIntensity: 1.5,
  themeColor: 'gold',
  isExploded: false,
};

// Simple reducer to handle partial updates
const reducer = (state: AppState, action: Partial<AppState>): AppState => {
  return { ...state, ...action };
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Scene Background */}
      <Scene state={state} />
      
      {/* UI Overlay */}
      <Overlay state={state} dispatch={dispatch} />
    </div>
  );
};

export default App;