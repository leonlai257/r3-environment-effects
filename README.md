### React three Effect Demo

## Project Repository Structure
# Design related files
`/components/HeightMap.tsx` - Height Map, to change the gradient colors (line 68)
`/components/SkyBox.tsx` - Sky Box, to change the presets and time thresholds for each preset
`/pages/index.tsx` - For all react 3 fibers, especially for Camera preset or movements. (line 187) Also, you can alter the config for the height maps and grass strands.
`/components/Grass.tsx` - For grass and flowers. You can show the flowers by uncommenting Flower Mesh and Flower Sampler. You can also activate the wind layers(swaying effects) of the grass.
`/components/Clouds.tsx` - For clouds position and movements.
`/components/WorldEnvironment.tsx` - For reflections

# Technical/Performance related files
`/components/WaterPlane.tsx` - Water Plane, you can change around the config here, such as the texture size to improve performances

## Introduction

This project is to showcase and demonstrate react three to build a artistic environment.

## Technical Stack Docs

# General Library
React three fiber (https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
React three drei (https://github.com/pmndrs/drei)
React three postprocessing (https://docs.pmnd.rs/react-postprocessing/effect-composer)
React three fiber examples (https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
# Specific example
Water plane (https://threejs.org/examples/?q=water#webgl_shaders_ocean)
Grass/Flowers/Butterflies (https://codesandbox.io/s/y4thxd)
Height Map (https://www.redblobgames.com/maps/terrain-from-noise/)
Gradient for height Map (https://codepen.io/prisoner849/pen/zYKPzLx)
Tunnel (https://tympanus.net/codrops/2017/05/09/infinite-tubes-with-three-js/)
HDRI to Cube Map Sky Box (https://matheowis.github.io/HDRI-to-CubeMap/)

## How to use

### Installation

```zsh
yarn install
# or
npm install
```

### Run locally

```zsh
yarn dev
# or
npm run dev
```
