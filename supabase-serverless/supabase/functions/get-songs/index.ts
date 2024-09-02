import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!

const pool = new postgres.Pool(databaseUrl, 3, true)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Row = {
    title: string,
    title_kana: string,
    category: string,
    artist: string,
    version: string,
    imageurl: string,
    id: number,
    type: string,
    difficulty: string,
    level: string,
    internal_level: number,
    pattern_name: string,
}

type Song = {
    title: string,
    title_kana: string,
    category: string,
    artist: string,
    version: string,
    image_url: string,
    diff: Chart[],
}

type Chart = {
    id: number,
    type: string,
    difficulty: string,
    level: string,
    internal_level: number,
    patterns: string[],
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const connection = await pool.connect()
        const queryStart = Date.now()
        try {
            const result = await connection.queryObject`
          SELECT
              charts.id,
              charts.type,
              charts.difficulty,
              charts.level,
              charts.internal_level,
              songs.title,
              songs.title_kana,
              songs.category,
              songs.artist,
              songs.imageurl,
              songs.version,
              COALESCE(patterns.name, '') as pattern_name
          FROM
              charts
          LEFT JOIN songs ON charts.title_kana = songs.title_kana
          LEFT JOIN chart_to_pattern ON charts.id = chart_to_pattern.chart_id
          LEFT JOIN patterns ON chart_to_pattern.pattern_id = patterns.id
          ORDER BY
              charts.id
      `
            console.log(`Query time: ${Date.now() - queryStart} ms`)

            const patchStart = Date.now()
            const songsMap: Map<string, Map<number, Chart>> = new Map()
            const songsData: Map<string, Song> = new Map()
            const chartPatterns: Map<number, string[]> = new Map()

            const charts: Row[] = result.rows as Row[]
            charts.forEach(chart => {
                songsData.set(chart.title, {
                    title: chart.title,
                    title_kana: chart.title_kana,
                    category: chart.category,
                    artist: chart.artist,
                    version: chart.version,
                    image_url: chart.imageurl
                } as Song)
                if (!songsMap.has(chart.title)) {
                    songsMap.set(chart.title, new Map<number, Chart>())
                }
                if (!chartPatterns.has(chart.id)) {
                    chartPatterns.set(chart.id, [])
                }

                if (chart.pattern_name !== "") {
                    const currentPatterns = chartPatterns.get(chart.id)!
                    currentPatterns.push(chart.pattern_name)
                }

                const difflist = songsMap.get(chart.title)!
                difflist.set(chart.id, { id: chart.id, type: chart.type, difficulty: chart.difficulty, level: chart.level, internal_level: chart.internal_level } as Chart)
                songsMap.set(chart.title, difflist)
            })

            const resObj: Song[] = []
            songsData.forEach((data, title) => {
                const diffs: Chart[] = []
                const diffMap = songsMap.get(title)!
                diffMap.forEach((chart, chartID) => {
                    chart.patterns = chartPatterns.get(chartID)!
                    diffs.push(chart)
                })

                resObj.push({
                    title: data.title,
                    title_kana: data.title_kana,
                    category: data.category,
                    artist: data.artist,
                    version: data.version,
                    image_url: data.image_url,
                    diff: diffs,
                })
            })

            const body = JSON.stringify(resObj)

            console.log(`Patch time: ${Date.now() - patchStart} ms`)

            return new Response(body, {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
            })
        } finally {
            connection.release()
        }
    } catch (err) {
        console.error(err)
        return new Response(String(err?.message ?? err), { status: 500 })
    }
})
