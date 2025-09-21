import type { Region } from "@/types/emission-factors"

export const sampleEmissionData: Region[] = [
    {
        id: "region-1",
        name: "台北市",
        items: [
            {
                id: "item-1",
                substance: "二氧化碳",
                emissionFactor: "2.13",
                gwp5: "1",
                gwp6: "1",
            },
            {
                id: "item-2",
                substance: "甲烷",
                emissionFactor: "0.025",
                gwp5: "28",
                gwp6: "25",
            },
            {
                id: "item-3",
                substance: "氧化亞氮",
                emissionFactor: "0.008",
                gwp5: "265",
                gwp6: "298",
            },
        ],
    },
    {
        id: "region-2",
        name: "新北市",
        items: [
            {
                id: "item-4",
                substance: "二氧化碳",
                emissionFactor: "2.08",
                gwp5: "1",
                gwp6: "1",
            },
            {
                id: "item-5",
                substance: "甲烷",
                emissionFactor: "0.023",
                gwp5: "28",
                gwp6: "25",
            },
            {
                id: "item-6",
                substance: "氧化亞氮",
                emissionFactor: "0.007",
                gwp5: "265",
                gwp6: "298",
            },
            {
                id: "item-7",
                substance: "氫氟碳化物",
                emissionFactor: "0.002",
                gwp5: "1430",
                gwp6: "1400",
            },
        ],
    },
    {
        id: "region-3",
        name: "桃園市",
        items: [
            {
                id: "item-8",
                substance: "二氧化碳",
                emissionFactor: "2.15",
                gwp5: "1",
                gwp6: "1",
            },
            {
                id: "item-9",
                substance: "甲烷",
                emissionFactor: "0.027",
                gwp5: "28",
                gwp6: "25",
            },
            {
                id: "item-10",
                substance: "氧化亞氮",
                emissionFactor: "0.009",
                gwp5: "265",
                gwp6: "298",
            },
        ],
    },
    {
        id: "region-4",
        name: "台中市",
        items: [
            {
                id: "item-11",
                substance: "二氧化碳",
                emissionFactor: "2.11",
                gwp5: "1",
                gwp6: "1",
            },
            {
                id: "item-12",
                substance: "甲烷",
                emissionFactor: "0.024",
                gwp5: "28",
                gwp6: "25",
            },
            {
                id: "item-13",
                substance: "氧化亞氮",
                emissionFactor: "0.008",
                gwp5: "265",
                gwp6: "298",
            },
            {
                id: "item-14",
                substance: "六氟化硫",
                emissionFactor: "0.001",
                gwp5: "23500",
                gwp6: "22800",
            },
        ],
    },
    {
        id: "region-5",
        name: "高雄市",
        items: [
            {
                id: "item-15",
                substance: "二氧化碳",
                emissionFactor: "2.18",
                gwp5: "1",
                gwp6: "1",
            },
            {
                id: "item-16",
                substance: "甲烷",
                emissionFactor: "0.029",
                gwp5: "28",
                gwp6: "25",
            },
            {
                id: "item-17",
                substance: "氧化亞氮",
                emissionFactor: "0.010",
                gwp5: "265",
                gwp6: "298",
            },
        ],
    },
]
