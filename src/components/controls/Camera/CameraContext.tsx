import { createContext, useContext } from 'react';
import { CameraModel } from './CameraView';

export enum CameraFocusScaleMode {
  Contain = 'contain',
  Cover = 'cover',
  NoScale = 'noScale',
}

export type CameraFocusOptions = {
  scaleMode?: CameraFocusScaleMode;
  scaleMargin?: number;
};

const defaultCameraContext = {
  scale: 1,
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 500,
  isDragging: false,
  update: (target: CameraModel) => {
    console.log('update not ready', target);
  },
  focus: (target: HTMLElement, options: CameraFocusOptions = {}) => {
    console.log('focus not ready', target, options);
  },
};
export type CameraContextType = typeof defaultCameraContext;

const CameraContext = createContext(defaultCameraContext);

export const useCamera = () => {
  return useContext(CameraContext);
};

export default CameraContext;
