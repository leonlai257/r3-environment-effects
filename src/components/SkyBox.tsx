import { Sky } from '@react-three/drei'
import { useEffect, useState } from 'react'
import DateTime from 'luxon'
import getTime from '../pages/api/getTime'
import { useControls } from 'leva'

type ControlConfig = {
    value: number
    min: number
    max: number
    step: number
}

type SkyBoxProps = {
    config: {
        time: ControlConfig
    }
}

export const SkyBox = ({ config }: SkyBoxProps) => {
    const controls = useControls(config)
    const [localTime, setLocalTime] = useState(null)

    useEffect(() => {
        // fetch('/api/getTime', {
        //     method: 'GET',
        // }).then((res) => {
        //     setLocalTime(res)
        // })
    })

    return <Sky distance={45000} inclination={controls.time} azimuth={controls.time} />
}
