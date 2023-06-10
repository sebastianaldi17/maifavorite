const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

const SOURCE = "https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search"
// https://maimaidx-eng.com/maimai-mobile/record/musicGenre/search/?genre=99&diff=0
const LOGIN_URL = "https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile"

const difficulties = [
    // ['BASIC', 0, 'basic'],
    // ['ADVANCED', 1, 'advanced'],
    ['EXPERT', 2, 'expert'],
    ['MASTER', 3, 'master'],
    ['RE:MASTER', 4, 'remaster'],
]

require('dotenv').config()


async function fetchCookies() {
    const browser = await puppeteer.launch({headless:"new"})

    const page = await browser.newPage()
    await page.goto(LOGIN_URL)
    
    await page.click('.c-button--openid--segaId')
    await page.type('#sid', process.env.SEGA_ID)
    await page.type('#password', process.env.SEGA_PASSWORD)

    await Promise.all([
        page.waitForNavigation(),
        page.click('#btnSubmit')
    ])

    const cookies = await page.cookies()

    await browser.close()

    return Object.fromEntries(cookies.map((cookie) => {return [cookie.name, cookie.value]}))
}

async function fetchScore(difficulty) {
    // fetch cookies using puppeteer
    const cookies = await fetchCookies()
    if (!cookies.userId) {
        throw error("Login failed!")
    }

    // get data via axios
    const resp = await axios.get(SOURCE + `?genre=99&diff=${difficulty[1]}`,
    {
        headers: {
            Cookie: `userId=${cookies.userId}`
        }
    })

    // scrape data via cheerio
    const scores = []
    const $ = cheerio.load(resp.data)
    const charts = $(`.music_${difficulty[2]}_score_back`).toArray()
    for(const chart of charts) {
        const title = $(chart).find('.music_name_block').text()
        const acc = $(chart).find('.music_score_block').first().text()

        if(acc === '') continue

        var type = "STD"
        const typeImg = $(chart).siblings(`.music_kind_icon, .music_${difficulty[2]}_btn_on`)
        if(typeImg.attr("src").endsWith('music_dx.png')) {
            type = "DX"
        }
        scores.push({
            title: title,
            acc: acc,
            type: type,
            diff: difficulty[0],
        })
    }

    return scores
}

async function main() {
    let scores = []
    for(const diff of difficulties) {
        const current = await fetchScore(diff)
        scores = scores.concat(current)
    }
    
    // fetch chart data from supabase and patch it up to score data
    const chartToScore = []
    try {
        const resp = await axios.get("https://lmqidayjwoayyhhejbtz.functions.supabase.co/get-songs")
        for(let i = 0; i < resp.data.length; i += 1) {
            for(let j = 0; j < resp.data[i].diff.length; j += 1) {
                for(const score of scores) {
                    if(score.title === resp.data[i].title &&
                        score.type === resp.data[i].diff[j].type &&
                        score.diff === resp.data[i].diff[j].difficulty) {
                            chartToScore.push([resp.data[i].diff[j].id, score.acc])
                        }
                }
            }
        }
    } catch (e) {
        console.error(e)
        return
    }
    
    console.log("================== SUCCESS ==================")
    console.log("Import the following to supabase-frontend:")
    console.log(JSON.stringify(chartToScore))
}

main();