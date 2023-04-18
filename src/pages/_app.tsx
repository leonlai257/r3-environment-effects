import { Canvas } from '@react-three/fiber';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Route, Switch } from 'wouter';
import React from 'react';
import Main from '.';
import '../styles/globals.css';

export default function App({ pageProps }: AppProps) {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}>
            <Head>
                <title>React three Environment</title>
                <meta
                    name="React three Environment"
                    content="React three Environment by Leon"
                />
            </Head>
            <Canvas shadows={'soft'}>
                <ambientLight intensity={0.1} />

                <directionalLight
                    intensity={0.5}
                    castShadow
                    shadow-mapSize-height={128}
                    shadow-mapSize-width={128}
                />
                <Switch>
                    <Route path="/">
                        <Main {...pageProps} />
                    </Route>
                </Switch>
            </Canvas>
        </div>
    );
}
