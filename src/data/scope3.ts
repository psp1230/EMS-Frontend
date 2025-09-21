import type { Scope3EmissionItem, Scope3Item } from "@/types/scope3"

export const sampleScope3EmissionData: Scope3EmissionItem[] = [
    { id: "1", substance: "二氧化碳", factor: "2.31" },
    { id: "2", substance: "甲烷", factor: "25.0" },
    { id: "3", substance: "氧化亞氮", factor: "298.0" },
    { id: "4", substance: "氫氟碳化物", factor: "1430.0" },
    { id: "5", substance: "全氟碳化物", factor: "7390.0" },
]

export const sampleScope3ItemData: Scope3Item[] = [
    { id: "1", item: "商務旅行", factor: "0.21" },
    { id: "2", item: "員工通勤", factor: "0.18" },
    { id: "3", item: "廢棄物處理", factor: "0.45" },
    { id: "4", item: "上游運輸", factor: "0.32" },
    { id: "5", item: "下游運輸", factor: "0.28" },
    { id: "6", item: "商品使用", factor: "1.25" },
]
