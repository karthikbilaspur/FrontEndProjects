import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFF1F5,',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
  javascriptDecal: './threejs.png', // New: State for JavaScript decal
});

export default state;