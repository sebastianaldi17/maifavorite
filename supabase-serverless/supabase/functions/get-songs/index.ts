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
  category: string,
  artist: string,
  version: string,
  imageurl: string,
  id: number,
  type: string,
  difficulty: string,
  level: string,
  internal_level: number,
}

type Song = {
  title: string,
  category: string,
  artist: string,
  version: string,
  image_url: string,
  diff: Chart[]
}

type Chart = {
  id: number,
  type: string,
  difficulty: string,
  level: string,
  internal_level: number,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const connection = await pool.connect()

    try {
      const result = await connection.queryObject`
          SELECT
              charts.id,
              charts.type,
              charts.difficulty,
              charts.level,
              charts.internal_level,
              songs.title,
              songs.category,
              songs.artist,
              songs.imageurl,
              songs.version
          FROM
              charts
          LEFT JOIN
              songs
          ON
              charts.title_kana = songs.title_kana
          ORDER BY
              charts.id
      `

      const songsMap: Map<string, Chart[]> = new Map()
      const songsData: Map<string, Song> = new Map()

      const charts: Row[] = result.rows as Row[]
      charts.forEach(chart => {
        songsData.set(chart.title, {
          title: chart.title,
          category: chart.category,
          artist: chart.artist,
          version: chart.version,
          image_url: chart.imageurl
       } as Song);
        if (!songsMap.has(chart.title)) {
            songsMap.set(chart.title, []);
        }
        const difflist = songsMap.get(chart.title)!;
        difflist.push({id: chart.id, type: chart.type, difficulty: chart.difficulty, level: chart.level, internal_level: chart.internal_level} as Chart);
        songsMap.set(chart.title, difflist);
      })

      const resObj: Song[] = [];
        songsData.forEach((data, title) => {
            resObj.push({
                title: data.title,
                category: data.category,
                artist: data.artist,
                version: data.version,
                image_url: data.image_url,
                diff: songsMap.get(title)!,
            })
        })

      const body = JSON.stringify(resObj)

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
