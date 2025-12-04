export interface AppState {
  lightsOn: boolean;
  rotationSpeed: number;
  bloomIntensity: number;
  themeColor: 'gold' | 'silver' | 'ruby';
  isExploded: boolean;
}

export type ThemeColor = AppState['themeColor'];

export interface TreeProps {
  lightsOn: boolean;
  themeColor: ThemeColor;
  isExploded: boolean;
}