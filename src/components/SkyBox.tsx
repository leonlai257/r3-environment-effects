import { Sky } from '@react-three/drei'
import { DateTime } from 'luxon'
import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

type SkyPreset = 'morning' | 'afternoon' | 'sunset' | 'night'

// Sky Box which will return a custom Sky Box based on local time of day
export const SkyBox = () => {
    const sunsetSkyBox = useMemo(() => new THREE.CubeTextureLoader().load(['/envMap/sunsetEnvironment.hdr']), [])

    const [skyPreset, setSkyPreset] = useState<SkyPreset>('sunset')

    // Set the sky preset based on local time
    useEffect(() => {
        const localTime = DateTime.now()
        const hour = localTime.hour
        if (hour >= 6 && hour < 12) {
            setSkyPreset('morning')
        } else if (hour >= 12 && hour < 18) {
            setSkyPreset('afternoon')
        } else if (hour >= 18 && hour < 24) {
            setSkyPreset('sunset')
        } else if (hour >= 0 && hour < 6) {
            setSkyPreset('night')
        }
    }, [])

    switch (skyPreset) {
        case 'morning':
            return <Sky distance={45000} inclination={1} azimuth={1} />
        case 'afternoon':
            return <Sky distance={45000} inclination={1} azimuth={1} />
        case 'sunset':
            return <Sky distance={45000} inclination={1} azimuth={1} />
        case 'night':
            return <Sky distance={45000} inclination={1} azimuth={1} />
        default:
            return <Sky distance={45000} inclination={1} azimuth={1} />
    }
}
