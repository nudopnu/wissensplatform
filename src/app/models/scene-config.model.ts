import * as THREE from 'three';


export type SceneConfig = {
    cameraPosition: number[];
    minDistance: number;
    maxDistance: number;
    themes: {
        dark: ThemeConfig;
        light: ThemeConfig;
    }
    antialiasing: boolean;
};


export type ThemeConfig = {
    backgroundColor: THREE.ColorRepresentation;
}


export type ViewMode = 'dark' | 'light';


export const DEFAULT_SCENE_CONFIG: SceneConfig = {
    cameraPosition: [0, 1.5, 2.8],
    minDistance: 0.4,
    maxDistance: 10,
    themes: {
        light: {
            backgroundColor: 0xffffff,
        },
        dark: {
            backgroundColor: 0x1d232a,
        }
    },
    antialiasing: true,
};

