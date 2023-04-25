import { Cloud } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'

type CloudsProps = {
    props?: ThreeElements['group']
}

export const Clouds = ({ props }: CloudsProps) => {
    return (
        <group {...props}>
            <Cloud position={[50, 20, 80]} color={'#ffffff'} opacity={1} speed={0.4} width={40} depth={0.8} segments={200} />
            <Cloud position={[-50, 20, 80]} color={'#ffffff'} opacity={1} speed={0.4} width={40} depth={0.8} segments={200} />
        </group>
    )
}
