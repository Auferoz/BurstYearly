import { defineCollection, z } from "astro:content";

const games = defineCollection({
    schema: z.object({
        title: z.string(),
        released: z.string(),
        companie: z.string(),
        poster: z.string().url(),
        genre: z.string(),
        estado: z.string(),
        horas: z.number(),
        fecha_inicio: z.string(),
        fecha_final: z.string(),
        logros_obt: z.number(),
        logros_total: z.number(),
        console_pc: z.string(),
        igdbId: z.number(),
        years_played: z.object({
            y2025: z.boolean(),
            y2024: z.boolean(),
            y2023: z.boolean(),
            y2022: z.boolean(),
        })
    })
})

export const collections = { games }