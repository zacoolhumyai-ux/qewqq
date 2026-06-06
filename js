// ============================================
// 🍎 One Piece Final - Fruit Notifier
// ============================================
// 1. ใส่ Discord Webhook URL ข้างล่าง
// 2. npm install
// 3. node index.js
// ============================================

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1512697247165317332/_BuDdNAYHEwTqZH_HHSiUt70SsNI6-oDG2ntiqjSJE0cokwesHVjenEIOX1mTMArrg5O"

// ผลไม้ที่จะแจ้งเตือน
const RARE_FRUITS = [
  "Vampire Fruit", "Quake Fruit", "Phoenix Fruit",
  "Dark Fruit", "Ope Fruit", "Venom Fruit",
  "Candy Fruit", "Hollow Fruit", "Chilly Fruit",
  "Gas Fruit", "Flare Fruit", "Light Fruit",
  "Smoke Fruit", "Sand Fruit", "Rumble Fruit",
  "Magma Fruit", "Snow Fruit", "Gravity Fruit",
  "Plasma Fruit"
]

// สีตามความหายาก
const FRUIT_COLOR = {
  "Vampire Fruit": 0x8B0000, "Phoenix Fruit": 0xFF4500,
  "Dark Fruit": 0x2C2C54,   "Ope Fruit": 0x00BFFF,
  "Venom Fruit": 0x39FF14,  "Quake Fruit": 0xFFD700,
  "Gravity Fruit": 0x9400D3,"Magma Fruit": 0xFF6347,
  "Rumble Fruit": 0xFFFF00, "Light Fruit": 0xFFFACD,
  "Plasma Fruit": 0x00FFFF, "Candy Fruit": 0xFF69B4,
  "Hollow Fruit": 0x708090, "Chilly Fruit": 0xADD8E6,
  "Gas Fruit": 0x98FB98,    "Flare Fruit": 0xFF8C00,
  "Smoke Fruit": 0xD3D3D3,  "Sand Fruit": 0xF4A460,
  "Snow Fruit": 0xF0FFFF
}

// emoji ของแต่ละผลไม้
const FRUIT_EMOJI = {
  "Vampire Fruit":"🦇", "Phoenix Fruit":"🔥", "Dark Fruit":"🌙",
  "Ope Fruit":"✂️",    "Venom Fruit":"☠️", "Quake Fruit":"⚡",
  "Gravity Fruit":"⬇️","Magma Fruit":"🌋", "Rumble Fruit":"🔔",
  "Light Fruit":"✨",  "Plasma Fruit":"⚛️","Candy Fruit":"🍭",
  "Hollow Fruit":"💀", "Chilly Fruit":"❄️","Gas Fruit":"💨",
  "Flare Fruit":"🌡️", "Smoke Fruit":"💨", "Sand Fruit":"🏜️",
  "Snow Fruit":"⛄"
}

// ============================================
// ส่งแจ้งเตือนไป Discord
// ============================================
async function notifyDiscord(fruitName, playerName, jobId) {
  const emoji = FRUIT_EMOJI[fruitName] || "🍎"
  const color = FRUIT_COLOR[fruitName] || 0xFF6B6B

  const embed = {
    embeds: [{
      title: `${emoji} พบผลหายาก! ${fruitName}`,
      color: color,
      fields: [
        { name: "🎮 ผู้เล่น", value: playerName || "ไม่ทราบ", inline: true },
        { name: "🆔 Job ID",  value: jobId || "-",             inline: true },
        { name: "⭐ Rarity",  value: "**RARE / ULTRA RARE**",  inline: true },
      ],
      footer: { text: "One Piece Final • Fruit Notifier" },
      timestamp: new Date().toISOString()
    }]
  }

  try {
    const res = await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    })
    if (res.ok) {
      console.log(`✅ Discord แจ้งเตือนแล้ว → ${fruitName} (${playerName})`)
    } else {
      console.error(`❌ Discord Error: ${res.status}`)
    }
  } catch (e) {
    console.error("❌ ส่ง Discord ไม่ได้:", e.message)
  }
}

// ============================================
// Webhook Server รับข้อมูลจาก Roblox
// ============================================
const http = require("http")

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Content-Type", "application/json")

  if (req.method === "POST" && req.url === "/notify") {
    let body = ""
    req.on("data", chunk => body += chunk)
    req.on("end", async () => {
      try {
        const { fruitName, playerName, jobId } = JSON.parse(body)

        // เช็คว่า Rare Fruit ไหม
        if (RARE_FRUITS.includes(fruitName)) {
          await notifyDiscord(fruitName, playerName, jobId)
          res.end(JSON.stringify({ ok: true, message: "แจ้งเตือนแล้ว!" }))
        } else {
          // ไม่ใช่ Rare → ไม่แจ้งเตือน
          res.end(JSON.stringify({ ok: true, message: "ไม่ใช่ Rare Fruit" }))
        }

      } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({ ok: false, error: "JSON ผิดรูปแบบ" }))
      }
    })

  } else if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify({ status: "🟢 Server รันอยู่!", fruits: RARE_FRUITS.length + " Rare Fruits" }))

  } else {
    res.statusCode = 404
    res.end(JSON.stringify({ error: "Not found" }))
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log("=".repeat(45))
  console.log("🍎 One Piece Final - Fruit Notifier")
  console.log("=".repeat(45))
  console.log(`✅ Server รันที่ http://localhost:${PORT}`)
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/notify`)
  console.log(`🎯 Rare Fruits: ${RARE_FRUITS.length} ผล`)
  console.log("=".repeat(45))

  if (DISCORD_WEBHOOK === "https://discord.com/api/webhooks/1512697247165317332/_BuDdNAYHEwTqZH_HHSiUt70SsNI6-oDG2ntiqjSJE0cokwesHVjenEIOX1mTMArrg5O") {
    console.log("⚠️  ยังไม่ได้ใส่ Discord Webhook URL!")
    console.log("   → เปิด index.js แล้วใส่ URL บรรทัดที่ 9")
  } else {
    console.log("🔔 Discord Webhook พร้อมแล้ว!")
  }

  console.log("=".repeat(45))
})
