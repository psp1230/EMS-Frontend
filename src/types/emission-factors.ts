export interface EmissionItem {
    id: string
    substance: string
    emissionFactor: string
    gwp5: string
    gwp6: string
}

export interface Region {
    id: string
    name: string
    items: EmissionItem[]
}
