// Hello :) -> https://github.com/Ballwictb

// ── i18n ──────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
    es: {
        tagline: "Un tema vibrante para VS Code y Open VSX.",
        taglineSub: "Dibujado con mucho amor.",
        install: "Descargar",
        github: "Ver en GitHub",
        langSection: "Lenguajes soportados",
        langDesc: "Tokens dedicados para cada uno. Nada de colores genéricos.",
        variantsSection: "5 variantes",
        footerBy: "Hecho por",
        footerRepo: "Ver repositorio",
        footerIssue: "Abrir issue",
        footerLicense: "MIT License · Basado en Sorcerer de Mark Thomas Miller",
        variants: [
            { name: "BESUR", desc: "Neon puro. El original." },
            { name: "BESUR Soft", desc: "Más suave. Para sesiones largas." },
            { name: "BESUR Light", desc: "Mismo color. Fondo blanco." },
            { name: "BESUR Barca", desc: "Inspirado en los colores de FC Barcelona." },
            { name: "BESUR Ocean", desc: "¿Te encanta el azul? Este es tu tema" },
        ],
    },
    en: {
        tagline: "A vibrant theme for VS Code and Open VSX.",
        taglineSub: "Drawn with a lot of love.",
        install: "Download",
        github: "View on GitHub",
        langSection: "Supported languages",
        langDesc: "Dedicated tokens for each one. No generic colors.",
        variantsSection: "5 variants",
        footerBy: "Made by",
        footerRepo: "View repository",
        footerIssue: "Open issue",
        footerLicense: "MIT License · Based on Sorcerer by Mark Thomas Miller",
        variants: [
            { name: "BESUR", desc: "Pure neon. The original." },
            { name: "BESUR Soft", desc: "Softer tones. For long sessions." },
            { name: "BESUR Light", desc: "Same colors. White background." },
            { name: "BESUR Barca", desc: "Inspired by FC Barcelona's colors." },
            { name: "BESUR Ocean", desc: "Love blue? This is your theme" },
        ],
    },
}

// ── theme colors ───────────────────────────────────────────────────────────────
const THEME_COLORS = {
    besur: { bg: "#0e141a", surface: "#16202b", comment: "#6e7d9a", keyword: "#ff006a", string: "#aaed36", fn: "#44dfff", num: "#f5af19", text: "#e8eaf0" },
    "besur-soft": { bg: "#141c25", surface: "#1a2535", comment: "#7a8da8", keyword: "#e0005e", string: "#99d630", fn: "#3acce8", num: "#dfa018", text: "#d8dce8" },
    "besur-light": { bg: "#f8fafc", surface: "#edf0f7", comment: "#7a8da8", keyword: "#cc0055", string: "#4a7c00", fn: "#006ea8", num: "#a06800", text: "#1a1f2e" },
    "besur-barca": { bg: "#0a0d1a", surface: "#003a70", comment: "#7a8da8", keyword: "#a50044", string: "#004d98", fn: "#a50044", num: "#ffed02", text: "#ffed02" },
    "besur-ocean": { bg: "#0a1a2a", surface: "#1a3a5a", comment: "#7a8da8", keyword: "#0066cc", string: "#0099cc", fn: "#0066cc", num: "#ffcc00", text: "#ffffff" },
}

// ── code snippets ──────────────────────────────────────────────────────────────
const CODE = {
    js:
        `// JavaScript
const greet = (name) => {
  const msg = \`Hello, \${name}!\`
  console.log(msg)
  return msg
}
greet("world")`,
    python:
        `# Python
def greet(name: str) -> str:
    msg = f"Hello, {name}!"
    print(msg)
    return msg

greet("world")`,
    sql:
        `-- SQL
SELECT u.name, COUNT(o.id) AS total
FROM users u
LEFT JOIN orders o
  ON u.id = o.user_id
WHERE u.active = TRUE
GROUP BY u.name
ORDER BY total DESC;`,
    xml:
        `<?xml version="1.0" ?>
<users>
  <user id="1">
    <name>Ballwictb</name>
    <role>admin</role>
  </user>
</users>`,
    yaml:
        `# YAML config
server:
  host: localhost
  port: 3000

database:
  name: besur_db
  pool: 5`,
    rust:
        `// Rust
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let msg = greet("world");
    println!("{}", msg);
}`,
}

const FILE_EXT = { js: "js", python: "py", sql: "sql", xml: "xml", yaml: "yaml", rust: "rs" }

const KEYWORDS = /\b(const|let|var|function|def|fn|return|SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|LEFT\s+JOIN|ON|AS|AND|TRUE|false|true|null|None|pub|use|struct|impl|if|else|for|in|import|print|println!|console\.log|format!|COUNT)\b/g
const STRINGS = /(".*?"|'.*?'|`.*?`|f".*?")/g
const NUMBERS = /\b(\d+(\.\d+)?)\b/g

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function highlight(code, colors) {
    const lines = code.split("\n")
    return lines.map(line => {
        // comment line
        if (/^\s*(\/\/|#|--)/.test(line)) {
            return `<span style="color:${colors.comment}">${escapeHtml(line)}</span>`
        }
        // tokenise inline
        const tokens = []
        let i = 0
        const tagged = line.replace(STRINGS, m => `\x00S${m}\x00`)
            .replace(KEYWORDS, m => `\x00K${m}\x00`)
            .replace(NUMBERS, m => `\x00N${m}\x00`)
        const parts = tagged.split("\x00")
        return parts.map(p => {
            if (p[0] === "S") return `<span style="color:${colors.string}">${escapeHtml(p.slice(1))}</span>`
            if (p[0] === "K") return `<span style="color:${colors.keyword}">${escapeHtml(p.slice(1))}</span>`
            if (p[0] === "N") return `<span style="color:${colors.num}">${escapeHtml(p.slice(1))}</span>`
            return `<span style="color:${colors.text}">${escapeHtml(p)}</span>`
        }).join("")
    }).join("\n")
}

// ── state ──────────────────────────────────────────────────────────────────────
let currentLang = "en"
let currentTheme = "besur"
let currentCode = "js"

// ── helpers ────────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id) }
function $$(sel) { return document.querySelectorAll(sel) }

function applyLang() {
    const tx = TRANSLATIONS[currentLang]

    $("tagline").textContent = tx.tagline
    $("taglineSub").textContent = tx.taglineSub
    $("btn-install").textContent = tx.install
    $("btn-github").textContent = tx.github
    $("sec-langs").textContent = tx.langSection
    $("sec-langs-desc").textContent = tx.langDesc
    $("sec-variants").textContent = tx.variantsSection
    $("footer-by").textContent = tx.footerBy
    $("footer-repo").textContent = tx.footerRepo
    $("footer-issue").textContent = tx.footerIssue
    $("footer-license").textContent = tx.footerLicense

    tx.variants.forEach((v, i) => {
        const el = document.querySelector(`[data-variant="${i}"]`)
        if (!el) return
        el.querySelector(".card-name").textContent = v.name
        el.querySelector(".card-desc").textContent = v.desc
    })

    // active lang button
    $$(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === currentLang)
    })
}

function applyTheme() {
    const colors = THEME_COLORS[currentTheme]
    const win = $("code-window")
    const body = $("code-body")
    const topbar = $("code-topbar")

    win.style.background = colors.bg
    win.style.borderColor = colors.keyword + "33"
    win.style.boxShadow = `0 0 40px ${colors.keyword}18`
    topbar.style.background = colors.surface
    body.style.background = colors.bg
    body.style.color = colors.text
    $("code-filename").style.color = colors.comment

    $$(".pill[data-theme]").forEach(btn => {
        btn.classList.toggle("active-theme", btn.dataset.theme === currentTheme)
    })

    applyCode()
}

function applyCode() {
    const colors = THEME_COLORS[currentTheme]
    $("code-body").innerHTML = highlight(CODE[currentCode], colors)
    $("code-filename").textContent = `index.${FILE_EXT[currentCode]}`

    $$(".pill[data-code]").forEach(btn => {
        btn.classList.toggle("active-lang", btn.dataset.code === currentCode)
    })
}

// ── boot ───────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // lang buttons
    $$(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentLang = btn.dataset.lang
            applyLang()
        })
    })

    // theme pills
    $$(".pill[data-theme]").forEach(btn => {
        btn.addEventListener("click", () => {
            currentTheme = btn.dataset.theme
            applyTheme()
        })
    })

    // code lang pills
    $$(".pill[data-code]").forEach(btn => {
        btn.addEventListener("click", () => {
            currentCode = btn.dataset.code
            applyCode()
        })
    })

    applyLang()
    applyTheme()
})
