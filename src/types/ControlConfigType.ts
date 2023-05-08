type ControlConfig = {
    value: number
    min: number
    max: number
    step: number
}

export type ControlConfigType = {
    seed: string
    resolution: ControlConfig
    maxHeight: ControlConfig
    frequency: ControlConfig
    exponent: ControlConfig
    octaves: ControlConfig
    strands: ControlConfig
}
