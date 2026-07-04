/* ===================================================================
   FUTSAL MANAGER — v2
   =================================================================== */

/* ============ DATA ============ */
const POSITIONS = {
  portero: { label: 'Portero', color: 'var(--color-portero)' },
  cierre: { label: 'Cierre', color: 'var(--color-cierre)' },
  ala: { label: 'Ala', color: 'var(--color-ala)' },
  pivot: { label: 'Pívot', color: 'var(--color-pivot)' },
}

const POS_ORDER = ['portero', 'cierre', 'ala', 'pivot']

const FORMATIONS = {
  '1-2-1': { label: '1-2-1', roles: ['portero', 'cierre', 'ala', 'pivot'], multiplier: 1.0 },
  '2-2': { label: '2-2', roles: ['portero', 'cierre', 'cierre', 'ala'], multiplier: 0.9 },
  '1-1-2': { label: '1-1-2', roles: ['portero', 'cierre', 'ala', 'ala'], multiplier: 1.1 },
}

const GAME_PLANS = {
  bloqueBajo:     { label: 'Bloque Bajo',   desc: 'Equipo replegado, defiende al borde del área. Ahorra energía pero cede el control.', attack: 0.6, defense: 1.4, drain: 1, events: 0.70 },
  juegoCuatro:    { label: 'Juego de 4',    desc: 'Rotación constante de los 4 jugadores. Pases rápidos y mucha movilidad. Desgasta el doble.', attack: 1.2, defense: 0.9, drain: 6, events: 1.20 },
  juegoPivot:     { label: 'Juego Pívot',   desc: 'Juego directo al pívot. Ideal si tienes un delantero fuerte. Ataques verticales y rápidos.', attack: 1.3, defense: 0.8, drain: 3, events: 1.00 },
  roboTransicion: { label: 'Robo y Trans.', desc: 'Presión en media pista para robar y salir en transición. Requiere alas rápidas.', attack: 1.4, defense: 1.1, drain: 4, events: 0.80 },
  porteroJugador: { label: 'Portero-Jug.',  desc: 'Superioridad numérica en ataque. Mucho riesgo: si pierdes el balón, gol seguro.', attack: 1.8, defense: 0.3, drain: 3, events: 1.40 },
}

const MAX_SQUAD = 22
const MAX_CONVOCADOS = 14
const MAX_TITULARES = 5
const MAX_BENCH = 9
const MAX_RESERVES = 8

const INJURIES = [
  { type: 'sprain',    description: 'Esguince de tobillo',     duration: 2, recoveryEnergy: 20 },
  { type: 'strain',    description: 'Rotura fibrilar',          duration: 4, recoveryEnergy: 10 },
  { type: 'contusion', description: 'Contusión muscular',       duration: 1, recoveryEnergy: 30 },
  { type: 'fracture',  description: 'Fractura de dedo',         duration: 3, recoveryEnergy: 15 },
  { type: 'meniscus',  description: 'Lesión de menisco',        duration: 5, recoveryEnergy: 10 },
  { type: 'hamstring', description: 'Lesión en el isquiotibial',duration: 3, recoveryEnergy: 15 },
  { type: 'ankle',     description: 'Torcedura de tobillo',     duration: 2, recoveryEnergy: 25 },
]

/* FC Barcelona — plantilla real */
/* Pool de nombres españoles para CPU */
const NAME_POOLS = {
  portero: ['Álex Ruiz', 'David Molina', 'Jesús Serrano', 'Manuel Blanco', 'Pablo Morales', 'Raúl Gil', 'Sergio Ramos', 'Víctor Navarro'],
  cierre: ['Alberto Torres', 'Carlos Domínguez', 'Daniel Vázquez', 'Fernando Romero', 'Jorge Álvarez', 'Juan Díaz', 'Luis Moreno', 'Miguel Jiménez'],
  ala: ['Adrián Sánchez', 'Alejandro Ramírez', 'Álvaro Hernández', 'Andrés Pérez', 'Antonio López', 'Diego González', 'Francisco Martínez', 'Iván Rodríguez', 'Javier García', 'José Sánchez', 'Marcos López', 'Pedro González', 'Rafael Hernández', 'Rubén Pérez'],
  pivot: ['Alfredo Martínez', 'Emilio Rodríguez', 'Enrique García', 'Gonzalo López', 'Hugo Sánchez', 'Ismael Pérez', 'Marc González', 'Pau Rodríguez', 'Vicente López'],
}

const SURNAMES = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Moreno', 'Jiménez', 'Ruiz', 'Díaz', 'Álvarez', 'Romero', 'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Serrano', 'Blanco', 'Molina', 'Morales']

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calcValue(skill) {
  return skill * 80 + randInt(0, 2000)
}

function generateCpuSquad(teamId) {
  const players = []
  let pid = 1
  const countPerPos = { portero: 2, cierre: 2, ala: 4, pivot: 2 }
  for (const pos of POS_ORDER) {
    const pool = NAME_POOLS[pos]
    const count = countPerPos[pos]
    for (let i = 0; i < count; i++) {
      const name = pickRandom(pool)
      const skill = randInt(55, 90)
      const value = calcValue(skill)
      players.push({
        id: `${teamId}-cpu-${pid++}`,
        name, position: pos, skill,
        energy: randInt(70, 100), number: pid,
        nationality: '🇪🇸 España',
        goals: 0, matches: 0,
        value, transferListed: false, transferPrice: 0, loanListed: false, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [],
        enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, age: randInt(20, 35), foot: pickRandom(['DER', 'IZQ']),
      })
    }
  }
  return players
}

const COUNTRIES = [
  { id: 'es', name: 'España', flag: '🇪🇸',
    leagues: [
      { id: 'lnfs1', name: 'LNFS Primera División', logo: 'https://cdn.resfu.com/img_data/competiciones/108.png?size=120x&lossy=1',
        teams: [
          { id: '1041', name: 'Barça', logo: 'https://cdn.resfu.com/img_data/equipos/1041.png?size=120x&lossy=1',
            staff: [{ name: 'Javier Rodríguez Nebreda', nationality: '🇪🇸 España', role: 'headCoach', avatar: 'img/staff/3622776.png',
              career: [{ team: 'Barça', from: '01/09/2024', to: 'Actualidad', matches: 30, won: 18, drawn: 5, lost: 7 }]
            }] },
          { id: '4146', name: 'ElPozo Murcia Costa Calida', logo: 'https://cdn.resfu.com/img_data/equipos/4146.png?size=120x&lossy=1' },
          { id: '3093', name: 'Inter FS', logo: 'https://cdn.resfu.com/img_data/equipos/3093.png?size=120x&lossy=1' },
          { id: '3092', name: 'Palma Futsal', logo: 'https://cdn.resfu.com/img_data/equipos/3092.png?size=120x&lossy=1' },
          { id: '3219', name: 'Jaén FS', logo: 'https://cdn.resfu.com/img_data/equipos/3219.png?size=120x&lossy=1' },
          { id: '83478', name: 'Cordoba Patrimonio', logo: 'https://cdn.resfu.com/img_data/equipos/83478.png?size=120x&lossy=1',
            staff: [{ name: 'Ema Santoro', nationality: '🇦🇷 Argentina', role: 'headCoach', avatar: 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1',
              career: [{ team: 'Cordoba Patrimonio', from: '01/07/2025', to: 'Actualidad', matches: 15, won: 6, drawn: 3, lost: 6 }]
            }] },
          { id: '69694', name: 'Inagroup El Ejido', logo: 'https://cdn.resfu.com/img_data/equipos/69694.png?size=120x&lossy=1' },
          { id: '3082', name: 'Industrias Santa Coloma', logo: 'https://cdn.resfu.com/img_data/equipos/3082.png?size=120x&lossy=1' },
          { id: '14228', name: 'Jimbee Cartagena', logo: 'https://cdn.resfu.com/img_data/equipos/14228.png?size=120x&lossy=1' },
          { id: '5203', name: 'Manzanares FS', logo: 'https://cdn.resfu.com/img_data/equipos/5203.png?size=120x&lossy=1' },
          { id: '7970', name: 'Noia Portus Apostoli', logo: 'https://cdn.resfu.com/img_data/equipos/7970.png?size=120x&lossy=1' },
          { id: '3193', name: 'O Parrulo Ferrol', logo: 'https://cdn.resfu.com/img_data/equipos/3193.png?size=120x&lossy=1' },
          { id: '2603', name: 'Osasuna Magna', logo: 'https://cdn.resfu.com/img_data/equipos/2603.png?size=120x&lossy=1' },
          { id: '5208', name: 'Peñícola FS', logo: 'https://cdn.resfu.com/img_data/equipos/5208.png?size=120x&lossy=1' },
          { id: '22225', name: 'Viña Albali Valdepeñas', logo: 'https://cdn.resfu.com/img_data/equipos/22225.png?size=120x&lossy=1' },
          { id: '3096', name: 'Wanapix Sala 10', logo: 'https://cdn.resfu.com/img_data/equipos/3096.png?size=120x&lossy=1' },
        ] },
      { id: 'lnfs2', name: 'LNFS Segunda División',
        teams: [
          { id: 'mra', name: 'MRA Navarra' },
          { id: 'bis', name: 'Bisontes Castellón' },
          { id: 'mel', name: 'MELilla' },
        ] },
    ] },
  { id: 'pt', name: 'Portugal', flag: '🇵🇹',
    leagues: [
      { id: 'lpc', name: 'Liga Placard',
        teams: [
          { id: 'spo', name: 'Sporting CP' },
          { id: 'ben', name: 'SL Benfica' },
          { id: 'por', name: 'FC Porto' },
          { id: 'bra', name: 'SC Braga' },
        ] },
    ] },
  { id: 'it', name: 'Italia', flag: '🇮🇹',
    leagues: [
      { id: 'seriea', name: 'Serie A Futsal',
        teams: [
          { id: 'pes', name: 'Pesaro Futsal' },
          { id: 'nap', name: 'Napoli Futsal' },
          { id: 'cis', name: 'Cisinello' },
          { id: 'fel', name: 'Feldi Eboli' },
        ] },
    ] },
  { id: 'br', name: 'Brasil', flag: '🇧🇷',
    leagues: [
      { id: 'lcn', name: 'Liga Nacional',
        teams: [
          { id: 'cor', name: 'Corinthians' },
          { id: 'mag', name: 'Magnus Futsal' },
          { id: 'sor', name: 'Sorocaba' },
          { id: 'joe', name: 'Joaçaba' },
        ] },
    ] },
  { id: 'ar', name: 'Argentina', flag: '🇦🇷',
    leagues: [
      { id: 'arg1', name: 'Primera División',
        teams: [
          { id: 'riv', name: 'River Plate' },
          { id: 'boc', name: 'Boca Juniors' },
          { id: 'san', name: 'San Lorenzo' },
          { id: 'ind', name: 'Independiente' },
        ] },
    ] },
]

/* ============ ENGINE ============ */
const EVENTS_POOL = {
  goal: [
    { text: (t) => `${t} recibe en el área, gira y dispara... ¡GOL!`, type: 'goal' },
    { text: (t) => `${t} fusila al portero desde la frontal. ¡GOL!`, type: 'goal' },
    { text: (t) => `${t} aprovecha un rebote y empuja a la red. ¡GOL!`, type: 'goal' },
    { text: (t) => `${t} ejecuta una falta directa. ¡GOL!`, type: 'goal' },
  ],
  save: [
    { text: (t) => `${t} dispara pero el portero desvía a córner.`, type: 'save' },
    { text: (t) => `${t} prueba suerte desde lejos, atrapado.`, type: 'save' },
  ],
  miss: [
    { text: (t) => `${t} dispara desviado, balón fuera.`, type: 'miss' },
    { text: (t) => `${t} intenta el pase filtrado, cortado.`, type: 'miss' },
    { text: (t) => `${t} su disparo se estrella en el palo.`, type: 'miss' },
    { text: (t) => `${t} no logra controlar el balón.`, type: 'miss' },
  ],
  foul: [
    { text: (t) => `Falta de ${t}. Tiro libre peligroso.`, type: 'foul' },
    { text: (t) => `¡ ${t} comete falta táctica!`, type: 'foul' },
  ],
}

function avgSkill(players) {
  return players.reduce((sum, p) => sum + p.skill, 0) / players.length
}

function avgEnergy(players) {
  return players.reduce((sum, p) => sum + p.energy, 0) / players.length
}

function calcTacticMultiplier(formation, gamePlan) {
  const f = FORMATIONS[formation]
  const m = GAME_PLANS[gamePlan]
  if (!f || !m) return 1
  return f.multiplier * m.attack
}

class MatchEngine {
  constructor(homePlayers, tactic, awaySkill, homeName, awayName, isHome) {
    this.awaySkill = awaySkill
    this.homeScore = 0
    this.awayScore = 0
    this.gameSeconds = 0
    this.half = 1
    this.finished = false
    this.paused = false
    this.events = []
    this._interval = null
    this._goalPauseTimer = null
    this.onEvent = null
    this.onClockUpdate = null
    this.onHalfTime = null
    this.onFinish = null
    this.tacticMult = calcTacticMultiplier(tactic.formation, tactic.gamePlan)
    this.gamePlan = GAME_PLANS[tactic.gamePlan] || GAME_PLANS.juegoCuatro
    this.homeName = homeName || 'Tu Equipo'
    this.awayName = awayName || 'Rival'
    this.homeFactor = isHome !== false ? 1.05 : 1.0
  }

  iniciarCronometro() {
    if (this._interval) return
    this.paused = false
    this._tickReel()
    this._interval = setInterval(() => this._tickReel(), 1000)
  }

  _tickReel() {
    if (this.finished) return
    for (let s = 0; s < 15; s++) {
      if (this.paused || this.finished) break
      this._tickSecond()
    }
    this._updateClock()
  }

  _tickSecond() {
    this.gameSeconds++
    const MAX_SEC = 1200

    if (this.half === 1 && this.gameSeconds >= MAX_SEC) {
      this.gameSeconds = MAX_SEC
      this._halfTime()
      return
    }
    if (this.half === 2 && this.gameSeconds >= MAX_SEC) {
      this.gameSeconds = MAX_SEC
      this._finish()
      return
    }

    /* Desgaste escalado a segundos */
    const enPista = state.players.filter(p => p.enPista)
    enPista.forEach(p => aplicarDesgaste(p, this.gamePlan.drain / 60))

    /* Lesión escalada */
    if (Math.random() < 0.025 / 60) {
      const candidatos = enPista.filter(p => !p.injury)
      if (candidatos.length > 0) {
        const lesionado = pickRandom(candidatos)
        const inj = pickRandom(INJURIES)
        lesionado.injury = { type: inj.type, description: inj.description, duration: inj.duration, remaining: inj.duration, recoveryEnergy: inj.recoveryEnergy }
        lesionado.energy = 0
        lesionado.enPista = false
        if (this.onEvent) this.onEvent({ text: `🚑 Lesión: ${lesionado.name} — ${inj.description}`, type: 'injury' })
      }
    }

    /* Cambios automáticos */
    const cambios = gestionarCambios()
    for (const c of cambios) {
      if (this.onEvent) this.onEvent({ text: `🔄 Sale: ${c.sale.name} (ENE:${c.sale.energy}) → Entra: ${c.entra.name} (ENE:${c.entra.energy})`, type: 'sub' })
    }

    /* Tarjetas escaladas a segundo */
    for (const p of enPista) {
      if (Math.random() < 0.008 / 60 && !p._yellowThisMatch) {
        p.yellowCards = (p.yellowCards || 0) + 1
        p._yellowThisMatch = true
        if (this.onEvent) this.onEvent({ text: `🟨 Amarilla: ${p.name}`, type: 'sub' })
        if (Math.random() < 0.2) {
          p.redCards = (p.redCards || 0) + 1
          p._redThisMatch = true
          p.enPista = false
          if (this.onEvent) this.onEvent({ text: `🟥 Roja: ${p.name} — Expulsado`, type: 'injury' })
        }
      }
    }

    /* Evento del juego */
    const event = this._simulateSecond()
    if (event) {
      this.events.push(event)
      if (event.type === 'homeGoal') {
        this.homeScore++
        const g = pickRandom(enPista)
        if (g) { g._goalsInMatch = (g._goalsInMatch || 0) + 1; g.goals = (g.goals || 0) + 1 }
        /* Asistencia */
        if (Math.random() < 0.35) {
          const ass = pickRandom(enPista.filter(x => x.id !== g?.id))
          if (ass) { ass.assists = (ass.assists || 0) + 1; if (this.onEvent) this.onEvent({ text: `🅰️ Asistencia: ${ass.name}`, type: 'sub' }) }
        }
        /* Pausa por gol 2 segundos reales */
        this.paused = true
        if (this._goalPauseTimer) clearTimeout(this._goalPauseTimer)
        this._goalPauseTimer = setTimeout(() => { this.paused = false }, 2000)
      } else if (event.type === 'awayGoal') { this.awayScore++ }
      if (this.onEvent) this.onEvent(event)
    }
  }

  _simulateSecond() {
    const enPista = state.players.filter(p => p.enPista)
    if (enPista.length === 0) return null
    const homeSkill = enPista.reduce((s, p) => s + getHabilidadEfectiva(p), 0) / enPista.length * this.tacticMult
    const homeEnergyAVG = enPista.reduce((s, p) => s + p.energy, 0) / enPista.length / 100

    const homeChance = homeSkill * (0.5 + homeEnergyAVG * 0.3) * this.gamePlan.attack * this.homeFactor
    const awayChance = this.awaySkill * 0.5 * this.gamePlan.defense
    const totalChance = homeChance + awayChance

    /* Probabilidad de evento escalada a segundo: 42%/60 ≈ 0.7% por segundo */
    if (Math.random() > (0.42 / 60) * this.gamePlan.events) return null
    const roll = Math.random() * totalChance
    const isHomeAttack = roll < homeChance
    const teamName = isHomeAttack ? this.homeName : this.awayName
    const teamSkill = isHomeAttack ? homeSkill : this.awaySkill
    const goalProb = (teamSkill / 100) * 0.35
    if (Math.random() < goalProb) {
      const t = pickRandom(EVENTS_POOL.goal)
      return { text: t.text(teamName), type: isHomeAttack ? 'homeGoal' : 'awayGoal', team: teamName }
    }
    if (Math.random() < 0.55) {
      const t = pickRandom(EVENTS_POOL.save)
      return { text: t.text(teamName), type: 'save', team: teamName }
    }
    const t = pickRandom(EVENTS_POOL.miss)
    return { text: t.text(teamName), type: 'miss', team: teamName }
  }

  _updateClock() {
    if (!this.onClockUpdate) return
    const sec = this.gameSeconds
    const mm = String(Math.floor(sec / 60)).padStart(2, '0')
    const ss = String(sec % 60).padStart(2, '0')
    this.onClockUpdate(`${this.half}T ${mm}:${ss}`)
  }

  _halfTime() {
    this.paused = true
    if (this._interval) { clearInterval(this._interval); this._interval = null }
    if (this.onHalfTime) this.onHalfTime()
  }

  iniciarSegundaParte() {
    if (this.half !== 1) return
    this.half = 2
    this.gameSeconds = 0
    this.paused = false
    this.iniciarCronometro()
  }

  _finish() {
    this.finished = true
    if (this._interval) { clearInterval(this._interval); this._interval = null }
    if (this._goalPauseTimer) clearTimeout(this._goalPauseTimer)
    if (this.onFinish) this.onFinish()
  }

  stop() {
    this.finished = true
    if (this._interval) { clearInterval(this._interval); this._interval = null }
    if (this._goalPauseTimer) clearTimeout(this._goalPauseTimer)
  }
}

/* ============ STATE ============ */
const STORAGE_KEY = 'futsal_saves'
const TACTICS_KEY = 'futsal_tactics'

const state = {
  coach: '', team: '', teamId: '', teamLogo: '', countryId: '', leagueId: '',
  gameId: null,
  matchdaySquad: [], startingFive: [], subsBench: [], convocatoriaValidada: false,
  stats: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
  players: [],
  tactic: { formation: '1-2-1', gamePlan: 'juegoCuatro' },
  finances: { balance: 5000, history: [] },
  leagueTeams: [],
  currentMatchday: 1,
  totalMatchdays: 0,
  fixtures: [],
  currentTab: 'club',
  clubSubTab: 'squad',
  marketTab: 'buy',
  staff: [],
  tacticsSlots: [],
  benchIds: [],
  reserveIds: [],
  selectedPlayerId: null,
}

/* ============ HELPERS ============ */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatMoney(amount) {
  const sign = amount >= 0 ? '' : '-'
  return `${sign}€${Math.abs(amount).toLocaleString()}`
}

function formatValue(val) {
  if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `€${(val / 1000).toFixed(1)}K`
  return `€${val}`
}

function formatTimestamp(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatTime(minute) {
  const half = minute <= 20 ? 1 : 2
  const m = minute <= 20 ? minute : minute - 20
  return `${half}T ${m}:00`
}

/* ============ SAVE / LOAD ============ */
function getSaves() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function setSaves(saves) { localStorage.setItem(STORAGE_KEY, JSON.stringify(saves)) }

function saveGame() {
  const saves = getSaves()
  const idx = saves.findIndex(s => s.id === state.gameId)
  const matchday = state.stats.wins + state.stats.draws + state.stats.losses + 1
  const data = {
    id: state.gameId, name: `${state.coach} - ${state.team}`, coach: state.coach, team: state.team, teamId: state.teamId, teamLogo: state.teamLogo,
    countryId: state.countryId, leagueId: state.leagueId,
    date: new Date().toISOString(), matchday, players: state.players, tactic: state.tactic,
    finances: state.finances, stats: state.stats, leagueTeams: state.leagueTeams,
    currentMatchday: state.currentMatchday, totalMatchdays: state.totalMatchdays, fixtures: state.fixtures,
    tacticsSlots: state.tacticsSlots,
    benchIds: state.benchIds,
    reserveIds: state.reserveIds,
    staff: state.staff,
  }
  if (idx >= 0) saves[idx] = data; else saves.unshift(data)
  setSaves(saves)
  autoSaveTactics()
}
function autoSave() { saveGame() }
function deleteSave(id) { let s = getSaves(); setSaves(s.filter(x => x.id !== id)) }

function autoSaveTactics() {
  if (!state.gameId) return
  const data = { formation: state.tactic.formation, gamePlan: state.tactic.gamePlan, tacticsSlots: state.tacticsSlots, benchIds: state.benchIds, reserveIds: state.reserveIds }
  try { const all = JSON.parse(localStorage.getItem(TACTICS_KEY)) || {}; all[state.gameId] = data; localStorage.setItem(TACTICS_KEY, JSON.stringify(all)) } catch {}
}

function loadTactics() {
  if (!state.gameId) return
  try {
    const all = JSON.parse(localStorage.getItem(TACTICS_KEY)) || {}
    const data = all[state.gameId]
    if (data) {
      state.tactic.formation = data.formation || state.tactic.formation
      state.tactic.gamePlan = data.gamePlan || state.tactic.gamePlan
      if (!state.tacticsSlots || state.tacticsSlots.length === 0) {
        state.tacticsSlots = data.tacticsSlots || []
      }
      if (!state.benchIds || state.benchIds.length === 0) {
        state.benchIds = data.benchIds || []
      }
      if (!state.reserveIds || state.reserveIds.length === 0) {
        state.reserveIds = data.reserveIds || []
      }
    }
  } catch {}
}

/* ============ LEAGUE / FIXTURES ============ */
function generateFixtures(teamIds) {
  const n = teamIds.length
  const rounds = n % 2 === 0 ? n - 1 : n
  const fixtures = []
  const ids = [...teamIds]
  if (n % 2 !== 0) ids.push(null)
  const m = ids.length
  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < m / 2; i++) {
      const home = (r % 2 === 0) ? ids[i] : ids[m - 1 - i]
      const away = (r % 2 === 0) ? ids[m - 1 - i] : ids[i]
      if (home !== null && away !== null)
        fixtures.push({ matchday: r + 1, home, away, homeScore: null, awayScore: null, played: false })
    }
    ids.splice(1, 0, ids.pop())
  }
  const half = rounds
  for (let r = 0; r < half; r++) {
    for (let i = 0; i < m / 2; i++) {
      const f = fixtures[r * (m / 2) + i]
      fixtures.push({ matchday: r + 1 + half, home: f.away, away: f.home, homeScore: null, awayScore: null, played: false })
    }
  }
  return fixtures
}

function getFixtureForUser(matchday) {
  return state.fixtures.find(f => f.matchday === matchday && (f.home === state.teamId || f.away === state.teamId))
}

function getTeamName(id) {
  if (id === state.teamId) return state.team
  const t = state.leagueTeams.find(x => x.teamId === id)
  return t ? t.name : id
}

function getTeamLogo(id) {
  if (id === state.teamId) return state.teamLogo
  for (const c of COUNTRIES) {
    for (const l of c.leagues) {
      const t = l.teams.find(x => x.id === id)
      if (t && t.logo) return t.logo
    }
  }
  return ''
}

function getTeamObj(id) {
  if (id === state.teamId) return { name: state.team, players: state.players, teamId: state.teamId }
  return state.leagueTeams.find(x => x.teamId === id)
}

function autoSimulateOtherMatch(homeId, awayId) {
  const home = getTeamObj(homeId)
  const away = getTeamObj(awayId)
  if (!home || !away) return { homeScore: 0, awayScore: 0 }
  const homeSkill = avgSkill(home.players) * randInt(80, 120) / 100 * 1.05
  const awaySkill = avgSkill(away.players) * randInt(80, 120) / 100
  let homeScore = 0, awayScore = 0
  for (let m = 0; m < 40; m++) {
    if (Math.random() > 0.35) continue
    const prob = (Math.random() < 0.5 ? homeSkill : awaySkill) / 100 * 0.3
    if (Math.random() < prob) {
      if (Math.random() < 0.5) homeScore++; else awayScore++
    }
  }
  return { homeScore, awayScore }
}

function updateLeagueStandings() {
  const standings = {}
  const allIds = [state.teamId, ...state.leagueTeams.map(t => t.teamId)]
  for (const id of allIds) {
    standings[id] = { teamId: id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }
  }
  for (const f of state.fixtures) {
    if (!f.played) continue
    const h = standings[f.home]
    const a = standings[f.away]
    if (!h || !a) continue
    h.played++; a.played++
    h.gf += f.homeScore; h.ga += f.awayScore
    a.gf += f.awayScore; a.ga += f.homeScore
    if (f.homeScore > f.awayScore) { h.won++; a.lost++; h.pts += 3 }
    else if (f.homeScore < f.awayScore) { a.won++; h.lost++; a.pts += 3 }
    else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  const userStanding = standings[state.teamId]
  if (userStanding) {
    state.stats.wins = userStanding.won
    state.stats.draws = userStanding.drawn
    state.stats.losses = userStanding.lost
    state.stats.goalsFor = userStanding.gf
    state.stats.goalsAgainst = userStanding.ga
  }
  return Object.values(standings).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
}

/* ============ CLUB VIEW ============ */
function renderSquad(players) {
  const container = document.getElementById('club-squad-content')
  if (!container) return
  const ordered = [...players].sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position) || a.number - b.number)
  document.getElementById('club-player-count').textContent = `${players.length}/${MAX_SQUAD} jugadores`
  let html = ''
  const roleLabels = { headCoach: 'Entrenador', assistantCoach: 'Asistente', delegate: 'Delegado', fitnessCoach: 'Preparador físico' }
  if (state.staff && state.staff.length > 0) {
    html += `<div class="tactics-subsection-label">Staff técnico (${state.staff.length})</div>`
    state.staff.forEach(s => {
      const avatar = s.avatar || 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
      const avatarStyle = `background-image:url(${avatar});background-size:cover;background-position:center;background-color:var(--bg-surface)`
      html += `<div class="staff-card"><div class="staff-card-avatar" style="${avatarStyle}"></div><div class="staff-card-info"><div class="staff-card-name">${s.name}</div><div class="staff-card-meta">${s.nationality}</div></div><span class="staff-card-role">${roleLabels[s.role] || s.role}</span></div>`
    })
  }
  html += `<div class="tactics-subsection-label" style="margin-top:4px">PLANTILLA (${players.length})</div>`
  container.innerHTML = html + ordered.map(p => {
    const pos = POSITIONS[p.position]
    const initials = getInitials(p.name)
    const avatarStyle = p.avatar ? `background-image:url(${p.avatar});background-color:${pos.color}` : `background:${pos.color}`
    const val = p.value || calcValue(p.skill)
    return `
      <div class="player-card" data-player-id="${p.id}">
        <div class="player-avatar" style="${avatarStyle}">${p.avatar ? '' : initials}</div>
        <div class="player-info">
          <div class="player-row1">
            <span class="player-name">${p.name}</span>
            <span class="player-stat-num">${p.age ? `${p.age}y` : '-'}</span>
            <span class="player-stat-num">${formatValue(val)}</span>
            <span class="player-rating-num">${p.skill}</span>
          </div>
          <div class="player-row2">
            <span class="player-position" style="background:${pos.color}">${pos.label}</span>
            <span class="player-foot">${p.foot || 'DER'}</span>
            <span class="player-nation">${p.nationality}</span>
            ${p.transferListed || p.loanListed ? `<span class="player-badges">${p.transferListed ? '<span class="player-badge badge-lt">LT</span>' : ''}${p.loanListed ? '<span class="player-badge badge-lc">LC</span>' : ''}</span>` : ''}
          </div>
        </div>
      </div>
    `
  }).join('')
  container.querySelectorAll('.player-card').forEach(card => {
    card.onclick = () => {
      const pid = card.dataset.playerId
      const player = state.players.find(p => p.id === pid)
      if (player) openPlayerModal(player, 'own')
    }
  })
  container.querySelectorAll('.staff-card').forEach((card, i) => {
    card.onclick = () => openStaffModal(state.staff[i])
  })
}

/* ============ TACTICS ============ */
const formationRoles = {
  '1-2-1': [{ role: 'portero', label: '1' }, { role: 'cierre', label: '2' }, { role: 'ala', label: '3' }, { role: 'pivot', label: '4' }],
  '2-2': [{ role: 'portero', label: '1' }, { role: 'cierre', label: '2' }, { role: 'cierre', label: '3' }, { role: 'ala', label: '4' }],
  '1-1-2': [{ role: 'portero', label: '1' }, { role: 'cierre', label: '2' }, { role: 'ala', label: '3' }, { role: 'ala', label: '4' }],
}

function renderHome() {
  const container = document.getElementById('home-content')
  if (!container) return
  const standings = updateLeagueStandings()
  const userPos = standings.findIndex(s => s.teamId === state.teamId) + 1
  const fixture = getFixtureForUser(state.currentMatchday)
  const rivalId = fixture ? (fixture.home === state.teamId ? fixture.away : fixture.home) : null
  const rivalName = rivalId ? getTeamName(rivalId) : '—'
  const isHome = fixture ? fixture.home === state.teamId : false
  const rivalPos = rivalId ? (standings.findIndex(s => s.teamId === rivalId) + 1) : '—'
  const rivalLogo = rivalId ? getTeamLogo(rivalId) : ''
  const isPlayoffs = state.playoffs && state.playoffs.fixtures && state.playoffs.fixtures.length > 0
  const roundNames = { QF: 'Cuartos de final', SF: 'Semifinal', F: 'Final' }
  container.innerHTML = `
    <div class="home-card">
      <div class="home-avatar-wrap">${state.teamLogo ? `<img class="home-logo" src="${state.teamLogo}" alt="">` : ''}</div>
      <div class="home-team-name">${state.team}</div>
      <div class="home-stats">
        <div class="home-stat"><span class="home-stat-icon">🏆</span><span>${userPos}º de ${standings.length}</span></div>
        <div class="home-stat"><span class="home-stat-icon">💰</span><span>${formatMoney(state.finances.balance)}</span></div>
        <div class="home-stat"><span class="home-stat-icon">👥</span><span>${state.players.length}/${MAX_SQUAD}</span></div>
        <div class="home-stat"><span class="home-stat-icon">📊</span><span>${state.stats.wins}V ${state.stats.draws}E ${state.stats.losses}D</span></div>
      </div>
    </div>
    ${fixture ? `
    <div class="home-card home-match">
      <div class="home-section-title">Próximo encuentro</div>
      <div class="home-match-teams">
        <div class="home-team-side">
          <img class="home-team-logo" src="${state.teamLogo || ''}" alt="">
          <div class="home-team-label">${state.team}</div>
          <div class="home-team-pos">${userPos}º</div>
        </div>
        <div class="home-vs">VS</div>
        <div class="home-team-side" style="cursor:pointer" onclick="showTeamInfo('${rivalId}')">
          <img class="home-team-logo" src="${rivalLogo}" alt="">
          <div class="home-team-label">${rivalName}</div>
          <div class="home-team-pos">${rivalPos}º</div>
        </div>
      </div>
      ${isPlayoffs
        ? `<div class="home-matchday-label">${roundNames[state.playoffs.round] || 'Eliminatoria'}</div>`
        : `<div class="home-matchday-label">Jornada ${state.currentMatchday} de ${state.totalMatchdays} · ${fixture.horario || ''}</div>`
      }
      <div class="home-match-location">${isHome ? '🏠 Local' : '✈️ Visitante'}</div>
      <button class="btn-primary" id="btn-home-play">▶ JUGAR PARTIDO</button>
    </div>` : '<div class="home-card home-match"><div class="home-section-title">🏆 Temporada completada</div></div>'}
  `
  const playBtn = document.getElementById('btn-home-play')
  if (playBtn) playBtn.onclick = () => startMatchFromLeague(rivalId, fixture)
}

function renderClub() {
  const titleEl = document.getElementById('club-title')
  if (titleEl) titleEl.textContent = state.team
  const logoEl = document.getElementById('club-logo')
  if (logoEl) {
    logoEl.innerHTML = state.teamLogo ? `<img class="team-logo" src="${state.teamLogo}" alt="${state.team}">` : ''
  }
  document.getElementById('club-squad-content').classList.add('hidden')
  document.getElementById('club-tactics-content').classList.add('hidden')
  document.querySelectorAll('#view-club .sub-tab').forEach(b => b.classList.toggle('active', b.dataset.subtab === state.clubSubTab))
  if (state.clubSubTab === 'squad') {
    document.getElementById('club-squad-content').classList.remove('hidden')
    renderSquad(state.players)
  } else {
    document.getElementById('club-tactics-content').classList.remove('hidden')
    renderTactics(state.tactic)
  }
}

function renderBenchCard(player, extraClass) {
  const pos = POSITIONS[player.position]
  const avatarStyle = player.avatar
    ? `background-image:url(${player.avatar});background-size:cover;background-position:center;background-color:${pos.color}`
    : `background:${pos.color}`
  return `<div class="bench-card ${extraClass}" data-player-id="${player.id}">
    <div class="bc-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
    <div class="bc-info">
      <div class="bc-name-row">
        <span class="bc-name">${player.name}</span>
        <span class="bc-pos" style="background:${pos.color}">${pos.label}</span>
      </div>
      <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
    </div>
  </div>`
}

/* ============ TÁCTICA + CONVOCATORIA ============ */
function getEneColor(energy) {
  if (energy > 70) return '#10B981'
  if (energy >= 50) return '#F59E0B'
  return '#EF4444'
}

const POS_MULTIPLIER = {
  portero: { portero: 1.0, cierre: 0.5, ala: 0.3, pivot: 0.2 },
  cierre:  { portero: 0.3, cierre: 1.0, ala: 0.7, pivot: 0.5 },
  ala:     { portero: 0.2, cierre: 0.6, ala: 1.0, pivot: 0.7 },
  pivot:   { portero: 0.2, cierre: 0.5, ala: 0.7, pivot: 1.0 },
}

const SLOT_ROLES = {
  '1-2-1': ['portero', 'cierre', 'ala', 'ala', 'pivot'],
  '2-2':   ['portero', 'cierre', 'cierre', 'pivot', 'pivot'],
  '1-1-2': ['portero', 'cierre', 'ala', 'pivot', 'pivot'],
}

function getPositionMultiplier(naturalPosition, assignedRole) {
  const row = POS_MULTIPLIER[naturalPosition]
  return row ? row[assignedRole] || 0.3 : 1
}

function renderTactics(tactic) {
  const container = document.getElementById('club-tactics-content')
  if (!container) return

  /* Init slots if needed */
  const roles = SLOT_ROLES[tactic.formation]
  if (!state.tacticsSlots || state.tacticsSlots.length !== roles.length) {
    state.tacticsSlots = roles.map(() => null)
  } else {
    /* On formation change, preserve players whose role still exists */
    const oldRoles = SLOT_ROLES[tactic.formation] || roles
    if (oldRoles.length !== roles.length) {
      state.tacticsSlots = roles.map(r => {
        const idx = oldRoles.indexOf(r)
        return idx >= 0 ? state.tacticsSlots[idx] : null
      })
    }
  }

  const slots = state.tacticsSlots
  const assignedIds = slots.filter(Boolean)
  const assigned = assignedIds.map(id => state.players.find(p => p.id === id)).filter(Boolean)
  const available = state.players.filter(p => !assignedIds.includes(p.id) && !p.injury)
  const injured = state.players.filter(p => p.injury)

  state.benchIds = state.benchIds.filter(id => available.find(p => p.id === id))
  if (state.benchIds.length > MAX_BENCH) state.benchIds = state.benchIds.slice(0, MAX_BENCH)
  const bench = state.benchIds.map(id => state.players.find(p => p.id === id)).filter(Boolean)
  const rest = available.filter(p => !state.benchIds.includes(p.id))

  const complete = slots.every(Boolean)
  const hasGK = slots.some(id => {
    if (!id) return false
    const p = state.players.find(x => x.id === id)
    return p && p.position === 'portero'
  })
  const enoughAvailable = available.length >= 5

  /* Build HTML */
  let html = `<div class="tactics-section">
    <label class="tactics-label">Formación</label>
    <div class="tactics-options" id="formation-options">
      <button class="tactics-btn ${tactic.formation === '1-2-1' ? 'active' : ''}" data-formation="1-2-1">1-2-1</button>
      <button class="tactics-btn ${tactic.formation === '2-2' ? 'active' : ''}" data-formation="2-2">2-2</button>
      <button class="tactics-btn ${tactic.formation === '1-1-2' ? 'active' : ''}" data-formation="1-1-2">1-1-2</button>
    </div>
  </div>
  <div class="tactics-section">
    <label class="tactics-label">Modelo</label>
    <select id="gameplan-select" class="tactics-select">
      ${Object.entries(GAME_PLANS).map(([key, gp]) =>
        `<option value="${key}" ${tactic.gamePlan === key ? 'selected' : ''}>${gp.label}</option>`
      ).join('')}
    </select>
    <div class="gameplan-desc" id="gameplan-desc">${GAME_PLANS[tactic.gamePlan].desc}</div>
  </div>`

  /* Vertical pitch: attack top → goalkeeper bottom */
  const FORMATION_GRID = {
    '1-2-1': [
      [null, null, null, null],
      [null, null,    2, null],
      [   0,    1, null,    4],
      [null, null,    3, null],
      [null, null, null, null],
    ],
    '2-2': [
      [null, null, null, null],
      [null,    1, null,    3],
      [   0, null, null, null],
      [null,    2, null,    4],
      [null, null, null, null],
    ],
    '1-1-2': [
      [null, null, null, null],
      [null, null, null,    3],
      [   0,    1,    2, null],
      [null, null, null,    4],
      [null, null, null, null],
    ],
  }

  function renderPitchSlot(i) {
    const role = roles[i]
    const pid = slots[i]
    const player = pid ? state.players.find(p => p.id === pid) : null
    const pos = POSITIONS[role]
    if (player) {
      const mult = getPositionMultiplier(player.position, role)
      const penalty = mult < 1 ? '⚠️' : ''
      const avatarStyle = player.avatar ? `background-image:url(${player.avatar});background-size:cover;background-position:center;background-color:${pos.color}` : `background:${pos.color}`
      return `<div class="pitch-slot-wrap">
        <div class="pitch-slot filled" data-slot="${i}" style="border-color:${pos.color};background:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
        </div>
        <span class="pitch-slot-role" style="color:#fff" ${penalty ? `data-penalty="${penalty}"` : ''}>${pos.label}</span>
        <span class="pitch-slot-name">${player.injury ? '🩹 ' : ''}${player.name}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
      </div>`
    }
    return `<div class="pitch-slot-wrap">
      <div class="pitch-slot empty" data-slot="${i}">+</div>
      <span class="pitch-slot-role">${pos.label}</span>
    </div>`
  }

  html += `<div class="pitch-grid">
    <div class="pitch-col-label" style="grid-area:1/1">POR</div>
    <div class="pitch-col-label" style="grid-area:1/2">CIE</div>
    <div class="pitch-col-label" style="grid-area:1/3">ALA</div>
    <div class="pitch-col-label" style="grid-area:1/4">PIV</div>`
  const gridData = FORMATION_GRID[tactic.formation] || FORMATION_GRID['1-2-1']
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      const slotIdx = gridData[row][col]
      if (slotIdx === null) continue
      const cssRow = row + 2
      const cssCol = col + 1
      const area = `${cssRow}/${cssCol}`
      const role = roles[slotIdx]
      const pid = slots[slotIdx]
      const player = pid ? state.players.find(p => p.id === pid) : null
      const pos = POSITIONS[role]
      if (player) {
        const mult = getPositionMultiplier(player.position, role)
        const penalty = mult < 1 ? '⚠️' : ''
        const avatarStyle = player.avatar ? `background-image:url(${player.avatar});background-size:cover;background-position:center;background-color:${pos.color}` : `background:${pos.color}`
        html += `<div class="pitch-slot-wrap" style="grid-area:${area}">
          <div class="pitch-slot filled" data-slot="${slotIdx}" style="border-color:${pos.color};background:${pos.color}">
            <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
          </div>
          <span class="pitch-slot-role" style="color:#fff" ${penalty ? `data-penalty="${penalty}"` : ''}>${pos.label}</span>
          <span class="pitch-slot-name">${player.injury ? '🩹 ' : ''}${player.name}</span>
          <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
        </div>`
      } else {
        html += `<div class="pitch-slot-wrap" style="grid-area:${area}">
          <div class="pitch-slot empty" data-slot="${slotIdx}">+</div>
          <span class="pitch-slot-role">${pos.label}</span>
        </div>`
      }
    }
  }
  html += `</div>`

  /* Bench grid (9 circles: 5 + 4) */
  html += `<div class="tactics-subsection-label">BANQUILLO (${bench.length}/${MAX_BENCH})</div>
    <div class="bench-grid">`
  for (let i = 0; i < MAX_BENCH; i++) {
    const pid = state.benchIds[i]
    const player = pid ? state.players.find(p => p.id === pid) : null
    if (player) {
      const pos = POSITIONS[player.position]
      const avatarStyle = player.avatar ? `background-image:url(${player.avatar});background-size:cover;background-position:center;background-color:${pos.color}` : `background:${pos.color}`
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot filled" data-bench="${i}" style="border-color:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
        </div>
        <span class="bench-slot-name">${player.injury ? '🩹 ' : ''}${player.name}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
      </div>`
    } else {
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot empty" data-bench="${i}">+</div>
        <span class="bench-slot-name">—</span>
      </div>`
    }
  }
  html += `</div>`

  /* Reserve slots (2) */
  html += `<div class="tactics-subsection-label">RESERVAS</div>
    <div class="bench-grid">`
  for (let i = 0; i < MAX_RESERVES; i++) {
    const pid = state.reserveIds[i]
    const player = pid ? state.players.find(p => p.id === pid) : null
    if (player) {
      const pos = POSITIONS[player.position]
      const avatarStyle = player.avatar ? `background-image:url(${player.avatar});background-size:cover;background-position:center;background-color:${pos.color}` : `background:${pos.color}`
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot filled" data-reserve="${i}" style="border-color:${pos.color}">
          <div class="slot-avatar" style="${avatarStyle}">${player.avatar ? '' : getInitials(player.name)}</div>
        </div>
        <span class="bench-slot-name">${player.injury ? '🩹 ' : ''}${player.name}</span>
        <div class="stat-row"><div class="stat-circle" style="background:${getEneColor(player.energy)}">${player.energy}</div><div class="stat-circle" style="background:#9CA3AF">${player.skill}</div></div>
      </div>`
    } else {
      html += `<div class="bench-slot-wrap">
        <div class="bench-slot empty" data-reserve="${i}">+</div>
        <span class="bench-slot-name">—</span>
      </div>`
    }
  }
  html += `</div>`

  /* Injured */
  if (injured.length > 0) {
    html += `<div class="tactics-subsection-label" style="color:#EF4444">NO DISPONIBLES 🚑</div>
      <div class="bench-row">${injured.map(p => {
        const i = p.injury
        const rt = i.remaining === 1 ? '🟡 falta 1 jornada' : `🔴 faltan ${i.remaining} jornadas`
        return `<div class="bench-card unavailable">
          <div class="bc-avatar" style="background:#EF4444;font-size:14px">🚑</div>
          <div class="bc-info">
            <div class="bc-name-row"><span class="bc-name">🩹 ${p.name}</span></div>
            <div class="bc-injury-text">${i.description} (${rt})</div>
          </div>
        </div>`
      }).join('')}</div>`
  }

  container.innerHTML = html

  /* Event listeners */
  document.querySelectorAll('#formation-options .tactics-btn').forEach(btn => {
    btn.onclick = () => { tactic.formation = btn.dataset.formation; renderTactics(tactic) }
  })
  document.getElementById('gameplan-select').onchange = (e) => {
    tactic.gamePlan = e.target.value
    const descEl = document.getElementById('gameplan-desc')
    if (descEl) descEl.textContent = GAME_PLANS[tactic.gamePlan].desc
    renderTactics(tactic)
  }
  document.querySelectorAll('.pitch-slot, .bench-slot').forEach(el => {
    el.onclick = () => handleSlotClick(el, tactic)
  })
  /* Clear selection on click outside */
  document.getElementById('club-tactics-content').onclick = (e) => {
    if (e.target.closest('.pitch-slot') || e.target.closest('.bench-slot')) return
    state.selectedPlayerId = null
    document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
  }
  /* Auto-validate whenever formation is complete */
  if (complete && hasGK && enoughAvailable) {
    state.matchdaySquad = [...slots, ...state.benchIds, ...state.reserveIds]
    state.startingFive = slots
    state.subsBench = [...state.benchIds, ...state.reserveIds]
    state.convocatoriaValidada = true
  } else {
    state.convocatoriaValidada = false
  }

  /* Re-apply selected class after re-render */
  if (state.selectedPlayerId) {
    document.querySelectorAll('.pitch-slot, .bench-slot').forEach(el => {
      const sid = getPlayerIdFromSlot(el)
      if (sid === state.selectedPlayerId) el.classList.add('selected')
    })
  }

  autoSaveTactics()
}

function autoAssignSquad() {
  const roles = SLOT_ROLES[state.tactic.formation] || SLOT_ROLES['1-2-1']
  const assigned = []
  const available = state.players.filter(p => !p.injury)

  state.tacticsSlots = roles.map(role => {
    const candidates = available.filter(p => !assigned.includes(p.id))
    const best = candidates.sort((a, b) => {
      const multA = getPositionMultiplier(a.position, role)
      const multB = getPositionMultiplier(b.position, role)
      if (multB !== multA) return multB - multA
      return b.skill - a.skill
    })[0]
    if (best) assigned.push(best.id)
    return best ? best.id : null
  })

  const benchPool = available.filter(p => !assigned.includes(p.id))
  state.benchIds = benchPool.slice(0, MAX_BENCH).map(p => p.id)
  assigned.push(...state.benchIds)

  const reservePool = available.filter(p => !assigned.includes(p.id))
  state.reserveIds = reservePool.slice(0, MAX_RESERVES).map(p => p.id)
}

function getPlayerIdFromSlot(el) {
  const slotIdx = el.dataset.slot
  const benchIdx = el.dataset.bench
  const reserveIdx = el.dataset.reserve
  if (slotIdx !== undefined) return state.tacticsSlots[parseInt(slotIdx)]
  if (benchIdx !== undefined) return state.benchIds[parseInt(benchIdx)]
  if (reserveIdx !== undefined) return state.reserveIds[parseInt(reserveIdx)]
  return null
}

function handleSlotClick(el, tactic) {
  const filled = el.classList.contains('filled')
  const pid = el.dataset.playerId
  const slotIdx = el.dataset.slot
  const benchIdx = el.dataset.bench
  const reserveIdx = el.dataset.reserve

  /* Determine the container type and current player ID */
  let currentPid = null
  let targetArray = null
  let targetIndex = -1
  if (slotIdx !== undefined) {
    targetIndex = parseInt(slotIdx)
    currentPid = state.tacticsSlots[targetIndex]
    targetArray = 'tacticsSlots'
  } else if (benchIdx !== undefined) {
    targetIndex = parseInt(benchIdx)
    currentPid = state.benchIds[targetIndex]
    targetArray = 'benchIds'
  } else if (reserveIdx !== undefined) {
    targetIndex = parseInt(reserveIdx)
    currentPid = state.reserveIds[targetIndex]
    targetArray = 'reserveIds'
  }

  /* No player selected yet */
  if (!state.selectedPlayerId) {
    if (filled && currentPid) {
      state.selectedPlayerId = currentPid
      document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
      el.classList.add('selected')
    }
    renderTactics(tactic)
    return
  }

  /* Same player clicked → deselect */
  if (state.selectedPlayerId === currentPid) {
    state.selectedPlayerId = null
    document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
    renderTactics(tactic)
    return
  }

  /* Different player or empty slot → place selected player here */
  if (targetArray && targetIndex >= 0) {
    if (currentPid) {
      /* Swap: find where selected player is and swap places */
      for (let arr of ['tacticsSlots', 'benchIds', 'reserveIds']) {
        const a = state[arr]
        for (let i = 0; i < a.length; i++) {
          if (a[i] === state.selectedPlayerId) {
            a[i] = currentPid
            state[targetArray][targetIndex] = state.selectedPlayerId
            state.selectedPlayerId = null
            document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
            renderTactics(tactic)
            return
          }
        }
      }
    } else {
      /* Empty slot: place selected player here */
      for (let arr of ['tacticsSlots', 'benchIds', 'reserveIds']) {
        const a = state[arr]
        for (let i = 0; i < a.length; i++) {
          if (a[i] === state.selectedPlayerId) {
            if (targetArray === 'tacticsSlots' || targetArray === 'benchIds' || targetArray === 'reserveIds') {
              a[i] = null
            }
            state[targetArray][targetIndex] = state.selectedPlayerId
            state.selectedPlayerId = null
            document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
            renderTactics(tactic)
            return
          }
        }
      }
    }
  }

  state.selectedPlayerId = null
  document.querySelectorAll('.pitch-slot.selected, .bench-slot.selected').forEach(s => s.classList.remove('selected'))
  renderTactics(tactic)
}

/* ============ FATIGA & SUSTITUCIONES ============ */
function getHabilidadEfectiva(player, assignedRole) {
  const mult = assignedRole ? getPositionMultiplier(player.position, assignedRole) : 1
  const base = player.energy < 50 ? Math.round(player.skill * 0.5) : player.skill
  return Math.round(base * mult)
}

function aplicarDesgaste(player, drainMult) {
  const base = drainMult || 3
  const extraMap = { portero: -1, ala: 1 }
  const extra = extraMap[player.position] || 0
  player.energy = Math.max(0, player.energy - (base + extra + randInt(-1, 1)))
  player.minutosEnPista = (player.minutosEnPista || 0) + 1
}

function findSustituto(banquillo, posicion, enPistaIds) {
  const similares = { portero: ['portero'], cierre: ['cierre', 'ala'], ala: ['ala', 'cierre'], pivot: ['pivot', 'ala'] }
  const validas = similares[posicion] || [posicion]
  return banquillo
    .filter(p => validas.includes(p.position) && p.energy >= 60 && !enPistaIds.includes(p.id))
    .sort((a, b) => b.energy - a.energy)[0]
}

function gestionarCambios() {
  const enPista = state.players.filter(p => p.enPista)
  const banquillo = state.players.filter(p => p.convocado && !p.enPista)
  const enPistaIds = enPista.map(p => p.id)
  let cambios = []

  for (const jugador of enPista) {
    if (jugador.energy >= 60) continue
    const sustituto = findSustituto(banquillo, jugador.position, enPistaIds)
    if (!sustituto) continue
    jugador.enPista = false
    sustituto.enPista = true
    enPistaIds[enPistaIds.indexOf(jugador.id)] = sustituto.id
    cambios.push({ sale: jugador, entra: sustituto })
    if (sustituto.energy < 60) break
  }
  return cambios
}

function simularLesion() {
  for (const p of state.players) {
    if (!p.enPista) continue
    if (p.injury) continue
    if (Math.random() > 0.025) continue
    const inj = pickRandom(INJURIES)
    p.injury = { type: inj.type, description: inj.description, duration: inj.duration, remaining: inj.duration, recoveryEnergy: inj.recoveryEnergy }
    p.energy = 0
    return p
  }
  return null
}

/* ============ LEAGUE VIEW ============ */
function renderLeague() {
  const selector = document.getElementById('league-selector')
  const tableWrap = document.getElementById('league-table-wrap')
  const mdWrap = document.getElementById('league-matchday-wrap')
  const resultsWrap = document.getElementById('league-results-wrap')
  resultsWrap.classList.add('hidden')

  /* Dropdown */
  const country = COUNTRIES.find(c => c.id === state.countryId)
  let opts = ''
  const allLeagues = []
  for (const c of COUNTRIES) for (const l of c.leagues) allLeagues.push({ ...l, country: c })
  for (const l of allLeagues) {
    const isOwn = l.id === state.leagueId
    opts += `<option value="${l.id}" data-country="${l.country.id}" ${isOwn ? 'selected' : ''}>${l.country.flag} ${l.name}</option>`
  }
  selector.innerHTML = opts

  /* Table */
  const standings = updateLeagueStandings()
  let tableHtml = `<table class="league-table"><tr><th>#</th><th>Equipo</th><th>PJ</th><th>V</th><th>E</th><th>D</th><th>GF</th><th>GC</th><th>Pts</th></tr>`
  standings.forEach((s, i) => {
    const isUser = s.teamId === state.teamId
    const logo = getTeamLogo(s.teamId)
    tableHtml += `<tr class="${isUser ? 'league-row-user' : ''}" data-team-id="${s.teamId}" style="${!isUser ? 'cursor:pointer' : ''}">
      <td><span class="league-pos ${i < 3 ? 'p' + (i+1) : ''}">${i + 1}</span></td>
      <td>${logo ? `<img class="team-logo" src="${logo}" style="width:18px;height:18px;vertical-align:middle;margin-right:6px">` : ''}${getTeamName(s.teamId)}</td>
      <td>${s.played}</td><td>${s.won}</td><td>${s.drawn}</td><td>${s.lost}</td>
      <td>${s.gf}</td><td>${s.ga}</td><td><strong>${s.pts}</strong></td>
    </tr>`
  })
  tableHtml += '</table>'
  tableWrap.innerHTML = tableHtml
  tableWrap.querySelectorAll('tr[data-team-id]').forEach(row => {
    row.onclick = () => showTeamInfo(row.dataset.teamId)
  })

  /* Matchday */
  if (state.currentMatchday > state.totalMatchdays) {
    const finalStandings = updateLeagueStandings()
    const userPos = finalStandings.findIndex(s => s.teamId === state.teamId) + 1
    mdWrap.innerHTML = `
      <div class="league-finished">
        <div style="font-size:32px;margin-bottom:8px">🏆</div>
        <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px">Temporada completada</div>
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">Has quedado <strong>${userPos}º</strong> de ${finalStandings.length}</div>
        <button class="btn-primary" id="btn-new-season">🏆 NUEVA TEMPORADA</button>
      </div>`
    document.getElementById('btn-new-season').onclick = resetSeason
    return
  }

  const fixture = getFixtureForUser(state.currentMatchday)
  if (!fixture) {
    mdWrap.innerHTML = '<div class="league-finished">No hay partido esta jornada</div>'
    return
  }

  const rivalId = fixture.home === state.teamId ? fixture.away : fixture.home
  const rivalName = getTeamName(rivalId)
  const isHome = fixture.home === state.teamId
  const location = isHome ? '🏠 Local' : '✈️ Visitante'

  mdWrap.innerHTML = `
    <div class="league-matchday-card">
      <div class="matchday-label">Jornada ${state.currentMatchday} de ${state.totalMatchdays}</div>
      <div class="matchday-rival">🆚 ${rivalName}</div>
      <div class="matchday-location">${location} · ${fixture.horario || ''}</div>
      <button class="btn-primary" id="btn-play-match">▶ JUGAR PARTIDO</button>
    </div>
  `
  document.getElementById('btn-play-match').onclick = () => startMatchFromLeague(rivalId, fixture)
}

/* ============ MATCH ============ */
let engine = null

function startMatchFromLeague(rivalId, fixture) {
  const rival = getTeamObj(rivalId)
  if (!rival) return

  /* Set starting five on court */
  const five = state.startingFive.length > 0 ? state.startingFive : state.tacticsSlots.filter(Boolean)
  state.players.forEach(p => { p.enPista = false })
  five.forEach(id => {
    const p = state.players.find(x => x.id === id)
    if (p) p.enPista = true
  })

  document.getElementById('view-league').classList.remove('active')
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  document.getElementById('view-match').classList.add('active')
  document.getElementById('bottom-nav').style.display = 'none'
  document.getElementById('btn-header-menu').style.display = 'none'
  document.getElementById('match-result-area').classList.add('hidden')
  document.getElementById('score-home').textContent = '0'
  document.getElementById('score-away').textContent = '0'
  document.getElementById('match-clock').textContent = '00:00'
  document.getElementById('match-feed').innerHTML = ''
  document.getElementById('btn-end-match').style.display = 'none'
  document.getElementById('match-home-name').textContent = state.team
  document.getElementById('match-away-name').textContent = rival.name
  document.getElementById('match-home-logo').src = state.teamLogo || ''
  document.getElementById('match-away-logo').src = getTeamLogo(rivalId) || ''

  const isHome = fixture.home === state.teamId
  const awaySkill = avgSkill(rival.players)
  engine = new MatchEngine(state.players, state.tactic, awaySkill, state.team, rival.name, isHome)

  engine.onClockUpdate = (clockStr) => {
    document.getElementById('match-clock').textContent = clockStr
    document.getElementById('score-home').textContent = isHome ? engine.homeScore : engine.awayScore
    document.getElementById('score-away').textContent = isHome ? engine.awayScore : engine.homeScore
    renderPlayerRatings()
  }

  engine.onEvent = (event) => {
    addFeedEvent(event)
  }

  /* Game plan selector */
  const planesEl = document.getElementById('match-planes')
  planesEl.innerHTML = `<select class="tactics-select" id="match-gameplan-select">
    ${Object.entries(GAME_PLANS).map(([key, gp]) =>
      `<option value="${key}" ${tactic.gamePlan === key ? 'selected' : ''}>${gp.label}</option>`
    ).join('')}
  </select>
  <div class="gameplan-desc" id="match-gameplan-desc">${GAME_PLANS[tactic.gamePlan].desc}</div>`
  document.getElementById('match-gameplan-select').onchange = (e) => {
    if (tactic.gamePlan === e.target.value) return
    tactic.gamePlan = e.target.value
    if (engine) engine.gamePlan = GAME_PLANS[tactic.gamePlan]
    document.getElementById('match-gameplan-desc').textContent = GAME_PLANS[tactic.gamePlan].desc
    addFeedEvent({ text: `🔄 Cambio táctico: ${GAME_PLANS[tactic.gamePlan].label}`, type: 'sub' })
  }

  /* Starting lineup announcement */
  const titularesStr = state.startingFive.map(id => { const p = state.players.find(x => x.id === id); return p ? `${p.name} (${POSITIONS[p.position].label})` : '' }).join(', ')
  addFeedEvent({ text: `🏁 Once titular: ${titularesStr}`, type: 'break' })

  engine.onHalfTime = () => {
    addFeedEvent({ text: '— DESCANSO —', type: 'break' })
    document.getElementById('btn-half-time').classList.remove('hidden')
    document.getElementById('btn-end-match').style.display = 'none'
  }

  engine.onFinish = () => {
    addFeedEvent({ text: '— FINAL DEL PARTIDO —', type: 'break' })
    document.getElementById('btn-end-match').style.display = 'block'
    document.getElementById('btn-half-time').classList.add('hidden')
  }

  document.getElementById('btn-end-match').onclick = () => {
    if (engine) engine.stop()
    finishMatch(isHome, fixture, rival)
  }

  document.getElementById('btn-half-time').onclick = () => {
    document.getElementById('btn-half-time').classList.add('hidden')
    if (engine) engine.iniciarSegundaParte()
  }

  document.getElementById('btn-tactica').onclick = () => {
    document.getElementById('view-match').classList.remove('active')
    document.getElementById('view-club').classList.add('active')
    document.getElementById('bottom-nav').style.display = ''
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
    document.querySelector('[data-tab="club"]').classList.add('active')
    state.clubSubTab = 'tactics'
    renderClub()
  }

  renderPlayerRatings()
  setTimeout(() => { if (engine) engine.iniciarCronometro() }, 100)
}

function addFeedEvent(event) {
  const feed = document.getElementById('match-feed')
  const el = document.createElement('div')
  if (event.type === 'break') {
    el.className = 'feed-event minute'
    el.textContent = event.text
  } else {
    const sec = engine ? engine.gameSeconds : 0
    const mm = String(Math.floor(sec / 60)).padStart(2, '0')
    const ss = String(sec % 60).padStart(2, '0')
    const time = `${engine ? engine.half + 'T' : '1T'} ${mm}:${ss}`
    let extra = ''
    if (event.type === 'homeGoal' || event.type === 'awayGoal') extra = ' goal'
    else if (event.type === 'sub') extra = ' sub'
    else if (event.type === 'injury') extra = ' injury'
    el.className = `feed-event${extra}`
    el.innerHTML = `<strong>${time}</strong> ${event.text}`
  }
  feed.appendChild(el)
  feed.scrollTop = feed.scrollHeight
}

function renderPlayerRatings() {
  const container = document.getElementById('match-players')
  if (!container) return
  const enPista = state.players.filter(p => p.enPista)
  container.innerHTML = enPista.map(p => {
    const pos = POSITIONS[p.position]
    const avatarStyle = p.avatar ? `background-image:url(${p.avatar});background-size:cover;background-position:center;background-color:${pos.color}` : `background:${pos.color}`
    return `<div class="match-player-item">
      <div class="match-player-avatar" style="${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
      <span class="match-player-name">${p.name}</span>
      <span class="match-player-ene" style="color:${getEneColor(p.energy)}">${p.energy}</span>
      <span class="match-player-rating">${'★'.repeat(Math.max(1, Math.round(getHabilidadEfectiva(p) / 20)))}</span>
    </div>`
  }).join('')
}

function finishMatch(isHome, fixture, rival) {
  const userScore = isHome ? engine.homeScore : engine.awayScore
  const rivalScore = isHome ? engine.awayScore : engine.homeScore

  /* Update fixture */
  fixture.homeScore = isHome ? engine.homeScore : engine.awayScore
  fixture.awayScore = isHome ? engine.awayScore : engine.homeScore
  fixture.played = true

  /* Finance */
  let reward
  if (userScore > rivalScore) { reward = 800; state.stats.wins++ }
  else if (userScore === rivalScore) { reward = 300; state.stats.draws++ }
  else { reward = -200; state.stats.losses++ }
  state.finances.balance += reward
  state.finances.history.push({ reason: `J${state.currentMatchday}: ${userScore}-${rivalScore} vs ${rival.name}`, amount: reward })
  

  /* Post-match recovery: calculate days until next match */
  const nextFixture = getFixtureForUser(state.currentMatchday + 1)
  let recoveryMult = 1.0
  if (nextFixture && nextFixture.date) {
    const curDate = new Date(fixture.date + 'T12:00:00')
    const nxtDate = new Date(nextFixture.date + 'T12:00:00')
    const days = Math.round((nxtDate - curDate) / (1000 * 60 * 60 * 24))
    if (days <= 4) recoveryMult = 0.5
  }
  state.players.forEach(p => {
    p.enPista = false
    p.minutosEnPista = 0
    p.convocado = false
    p.titular = false
    p.energy = Math.min(100, p.energy + Math.round(randInt(15, 30) * recoveryMult))
  })
  state.convocatoriaValidada = false

  /* Match history per player */
  state.players.filter(p => p.minutosEnPista > 0).forEach(p => {
    if (!p.matchHistory) p.matchHistory = []
    const rating = Math.round(5 + (p._yellowThisMatch ? -0.5 : 0) + (p._redThisMatch ? -2 : 0) + ((p.goals || 0) > 0 ? 2 : 0) + ((p.assists || 0) > 0 ? 1 : 0) + Math.random() * 2)
    p.matchHistory.push({
      matchday: state.currentMatchday,
      rival: rival.name,
      minutes: p.minutosEnPista || 0,
      rating: Math.min(10, Math.max(1, rating)),
      goals: p._goalsInMatch || 0,
      yellow: !!p._yellowThisMatch,
      red: !!p._redThisMatch,
    })
    p.matches = (p.matches || 0) + 1
    p.goals = (p.goals || 0) + (p._goalsInMatch || 0)
    delete p._yellowThisMatch; delete p._redThisMatch; delete p._goalsInMatch; delete p._assistThisMatch
  })

  /* Auto-simulate other matches */
  const otherFixtures = state.fixtures.filter(f => f.matchday === state.currentMatchday && f.played === false)
  for (const f of otherFixtures) {
    const result = autoSimulateOtherMatch(f.home, f.away)
    f.homeScore = result.homeScore
    f.awayScore = result.awayScore
    f.played = true
  }

  updateLeagueStandings()
  showMatchdayResults(userScore, rivalScore, rival.name)
  autoSave()
}

function resetSeason() {
  state.currentMatchday = 1
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }

  /* Reset league standings */
  state.fixtures.forEach(f => { f.played = false; f.homeScore = null; f.awayScore = null })

  /* Reset players */
  state.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })

  /* Reset CPU teams */
  state.leagueTeams.forEach(t => {
    t.players.forEach(p => { p.energy = 100; p.injury = null; p.goals = 0; p.matches = 0 })
  })

  /* Reset tactics */
  state.tacticsSlots = []
  state.benchIds = []
  state.reserveIds = []
  state.convocatoriaValidada = false
  state.selectedPlayerId = null

  /* Season prize */
  state.finances.balance += 2000
  state.finances.history.push({ reason: '🏆 Premio temporada', amount: 2000 })

  autoSaveTactics()
  saveGame()
  renderLeague()
}

function showMatchdayResults(userScore, rivalScore, rivalName) {
  /* Show result card in match view */
  document.getElementById('btn-end-match').style.display = 'none'
  document.getElementById('match-result-area').classList.remove('hidden')
  document.getElementById('result-home-display').textContent = userScore
  document.getElementById('result-away-display').textContent = rivalScore

  document.getElementById('btn-match-back').onclick = () => {
    document.getElementById('view-match').classList.remove('active')
    document.getElementById('view-league').classList.add('active')
    document.getElementById('bottom-nav').style.display = ''
    document.getElementById('btn-header-menu').style.display = ''
    document.getElementById('match-result-area').classList.add('hidden')

    const fixtures = state.fixtures.filter(f => f.matchday === state.currentMatchday)
    const list = document.getElementById('league-results-list')
    list.innerHTML = fixtures.map(f => {
      const homeName = getTeamName(f.home)
      const awayName = getTeamName(f.away)
      const isUserMatch = f.home === state.teamId || f.away === state.teamId
      return `
        <div class="results-item ${isUserMatch ? 'results-item-user' : ''}">
          <span class="results-team right">${homeName}</span>
          <span class="results-score">${f.homeScore} - ${f.awayScore}</span>
          <span class="results-team">${awayName}</span>
        </div>
      `
    }).join('')

    const standings = updateLeagueStandings()
    const userPos = standings.findIndex(s => s.teamId === state.teamId) + 1
    document.getElementById('league-standings-change').innerHTML = `Tu equipo ocupa el <strong>${userPos}º</strong> puesto`
    document.getElementById('league-results-wrap').classList.remove('hidden')
    document.getElementById('league-matchday-wrap').classList.add('hidden')

    document.getElementById('btn-advance-matchday').onclick = () => {
      state.currentMatchday++
      for (const p of state.players) {
        if (!p.injury) continue
        p.injury.remaining--
        if (p.injury.remaining <= 0) { p.energy = p.injury.recoveryEnergy; p.injury = null }
      }
      document.getElementById('league-results-wrap').classList.add('hidden')
      document.getElementById('league-matchday-wrap').classList.remove('hidden')
      renderLeague()
    }
  }
}

/* ============ MARKET VIEW ============ */
function renderMarket() {
  const tab = state.marketTab
  document.querySelectorAll('#view-market .sub-tab').forEach(b => b.classList.toggle('active', b.dataset.marketTab === tab))
  renderMarketContent()
}

function renderMarketContent() {
  const container = document.getElementById('market-content')
  const search = (document.getElementById('market-search').value || '').toLowerCase()

  const allCpuPlayers = []
  for (const t of state.leagueTeams) {
    for (const p of t.players) {
      allCpuPlayers.push({ ...p, teamName: t.name, teamId: t.teamId })
    }
  }

  if (state.marketTab === 'buy') {
    const available = allCpuPlayers.filter(p => !p.transferListed).sort((a, b) => b.value - a.value).slice(0, 20)
    const filtered = search ? available.filter(p => p.name.toLowerCase().includes(search)) : available

    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">No hay jugadores disponibles</div>'
      return
    }

    container.innerHTML = filtered.map(p => {
      const pos = POSITIONS[p.position]
      const canBuy = state.players.length < MAX_SQUAD && state.finances.balance >= p.value
      const avatarStyle = p.avatar ? `background-image:url(${p.avatar});background-color:${pos.color}` : `background:${pos.color}`
      return `
        <div class="market-card" data-player-id="${p.id}" data-team-id="${p.teamId}">
          <div class="player-avatar" style="width:36px;height:36px;font-size:12px;${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
          <div class="market-card-info">
            <div class="market-card-name">${p.name}</div>
            <div class="market-card-detail">${pos.label} · ${p.teamName} · HAB ${p.skill}</div>
          </div>
          <div class="market-card-right">
            <div class="market-card-value">${formatMoney(p.value)}</div>
            <button class="market-card-btn ${canBuy ? 'buy' : 'disabled'}">${canBuy ? 'COMPRAR' : (state.players.length >= MAX_SQUAD ? 'PLANTILLA LLENA' : 'SIN FONDOS')}</button>
          </div>
        </div>
      `
    }).join('')

    container.querySelectorAll('.market-card').forEach(card => {
      card.onclick = () => {
        const pid = card.dataset.playerId
        const tid = card.dataset.teamId
        const team = state.leagueTeams.find(t => t.teamId === tid)
        if (team) {
          const player = team.players.find(p => p.id === pid)
          if (player) openPlayerModal({ ...player, teamName: team.name }, 'cpu')
        }
      }
      card.querySelector('.market-card-btn.buy')?.addEventListener('click', (e) => {
        e.stopPropagation()
        const pid = card.dataset.playerId
        const tid = card.dataset.teamId
        const team = state.leagueTeams.find(t => t.teamId === tid)
        if (!team) return
        const player = team.players.find(p => p.id === pid)
        if (!player || state.players.length >= MAX_SQUAD || state.finances.balance < player.value) return
        buyPlayer(player, team)
      })
    })
  } else {
    const listed = state.players.filter(p => p.transferListed)
    if (listed.length === 0) {
      container.innerHTML = '<div class="market-empty">No tienes jugadores en venta.<br>Ve a Club > Plantilla y abre un jugador para listarlo.</div>'
      return
    }
    const filtered = search ? listed.filter(p => p.name.toLowerCase().includes(search)) : listed
    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">Ningún jugador coincide con la búsqueda</div>'
      return
    }
    container.innerHTML = filtered.map(p => {
      const pos = POSITIONS[p.position]
      const avatarStyle = p.avatar ? `background-image:url(${p.avatar});background-color:${pos.color}` : `background:${pos.color}`
      return `
        <div class="market-card" data-player-id="${p.id}">
          <div class="player-avatar" style="width:36px;height:36px;font-size:12px;${avatarStyle}">${p.avatar ? '' : getInitials(p.name)}</div>
          <div class="market-card-info">
            <div class="market-card-name">${p.name}</div>
            <div class="market-card-detail">${pos.label} · Precio: ${formatMoney(p.transferPrice)}</div>
          </div>
          <div class="market-card-right">
            <button class="market-card-btn sell">RETIRAR</button>
          </div>
        </div>
      `
    }).join('')
    container.querySelectorAll('.market-card').forEach(card => {
      card.onclick = () => {
        const pid = card.dataset.playerId
        const player = state.players.find(p => p.id === pid)
        if (player) openPlayerModal(player, 'own')
      }
      card.querySelector('.market-card-btn.sell')?.addEventListener('click', (e) => {
        e.stopPropagation()
        const pid = card.dataset.playerId
        const player = state.players.find(p => p.id === pid)
        if (!player) return
        player.transferListed = false
        player.transferPrice = 0
        renderMarketContent()
      })
    })
  }
}

function buyPlayer(player, team) {
  if (state.players.length >= MAX_SQUAD) return
  if (state.finances.balance < player.value) return
  state.finances.balance -= player.value
  state.finances.history.push({ reason: `Compra: ${player.name}`, amount: -player.value })
  const idx = team.players.indexOf(player)
  if (idx >= 0) team.players.splice(idx, 1)
  const newPlayer = { ...player, id: `user-${Date.now()}`, energy: 100, matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, mvp: 0, matchHistory: [], transferListed: false, transferPrice: 0, loanListed: false, enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null, age: randInt(20, 35), foot: pickRandom(['DER', 'IZQ']) }
  state.players.push(newPlayer)
  
  renderMarketContent()
}

/* ============ PLAYER MODAL ============ */
function openPlayerModal(player, mode) {
  const pos = POSITIONS[player.position]
  const avatarEl = document.getElementById('modal-avatar')
  avatarEl.textContent = player.avatar ? '' : getInitials(player.name)
  avatarEl.style.background = player.avatar ? `url(${player.avatar}) center/cover, ${pos.color}` : pos.color
  document.getElementById('modal-name').textContent = player.name
  document.getElementById('modal-nationality').textContent = `${player.nationality || '🇪🇸 España'}`
  document.getElementById('modal-meta').textContent = `${player.age || '-'} años · ${player.foot || 'DER'}`
  const posBadge = document.getElementById('modal-position')
  posBadge.textContent = pos.label
  posBadge.style.background = pos.color
  document.getElementById('modal-skill').textContent = player.skill
  document.getElementById('modal-energy').textContent = player.energy
  document.getElementById('modal-value').textContent = formatMoney(player.value)
  document.getElementById('modal-pj').textContent = player.matches || 0
  document.getElementById('modal-g').textContent = player.goals || 0
  document.getElementById('modal-a').textContent = player.assists || 0
  document.getElementById('modal-ta').textContent = player.yellowCards || 0
  document.getElementById('modal-tr').textContent = player.redCards || 0
  document.getElementById('modal-mvp').textContent = player.mvp || 0

  /* Match history */
  const historyEl = document.getElementById('modal-history')
  if (historyEl) {
    const hist = (player.matchHistory || []).slice(-8).reverse()
    historyEl.innerHTML = hist.length === 0
      ? '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:8px">Sin partidos jugados</div>'
      : hist.map(m => {
          const acts = []
          if (m.goals > 0) acts.push(`⚽${m.goals}`)
          if (m.yellow) acts.push('🟨')
          if (m.red) acts.push('🟥')
          return `<div class="hist-item">
            <span class="hist-matchday">J${m.matchday}</span>
            <span class="hist-rival">vs ${m.rival}</span>
            <span class="hist-minutes">${m.minutes}\'</span>
            <span class="hist-rating">${'★'.repeat(Math.max(1, Math.round(m.rating / 2)))} ${m.rating}</span>
            <span class="hist-actions">${acts.join(' ') || ''}</span>
          </div>`
        }).join('')
  }

  const actions = document.getElementById('modal-market-actions')
  actions.innerHTML = ''

  if (mode === 'own') {
    /* LT button */
    if (player.transferListed) {
      actions.innerHTML += `
        <div class="market-input-group">
          <span class="market-input-label">Precio de venta actual</span>
          <div style="text-align:center;font-weight:700;font-size:16px;color:var(--text)">${formatMoney(player.transferPrice)}</div>
        </div>
        <button class="btn-secondary" id="modal-retirar-lt">RETIRAR DE TRANSFERIBLES</button>
      `
    } else {
      actions.innerHTML += `
        <div class="market-input-group">
          <label class="market-input-label">Precio para lista de transferibles</label>
          <input class="market-price-input" id="modal-lt-price" type="number" value="${player.value}" min="1">
        </div>
        <button class="btn-primary" id="modal-listar-lt" style="background:#EF4444">LISTA TRANSFERIBLES</button>
      `
    }
    /* LC button */
    if (player.loanListed) {
      actions.innerHTML += `<button class="btn-secondary" id="modal-retirar-lc" style="margin-top:6px">RETIRAR DE CEDIBLES</button>`
    } else {
      actions.innerHTML += `<button class="btn-primary" id="modal-listar-lc" style="margin-top:6px;background:var(--accent)">LISTA CEDIBLES</button>`
    }

    /* LT events */
    const retirarLT = document.getElementById('modal-retirar-lt')
    if (retirarLT) retirarLT.onclick = () => { player.transferListed = false; player.transferPrice = 0; closeModal(); renderMarketContent(); renderSquad(state.players) }
    const listarLT = document.getElementById('modal-listar-lt')
    if (listarLT) listarLT.onclick = () => {
      const price = parseInt(document.getElementById('modal-lt-price').value)
      if (!price || price < 1) return
      player.transferListed = true; player.transferPrice = price; closeModal(); renderMarketContent(); renderSquad(state.players)
    }
    /* LC events */
    const retirarLC = document.getElementById('modal-retirar-lc')
    if (retirarLC) retirarLC.onclick = () => { player.loanListed = false; closeModal(); renderSquad(state.players) }
    const listarLC = document.getElementById('modal-listar-lc')
    if (listarLC) listarLC.onclick = () => { player.loanListed = true; closeModal(); renderSquad(state.players) }

  } else if (mode === 'cpu') {
    const canBuy = state.players.length < MAX_SQUAD && state.finances.balance >= player.value
    actions.innerHTML = `
      <button class="btn-primary ${canBuy ? '' : 'disabled'}" id="modal-comprar" ${!canBuy ? 'disabled' : ''}>
        ${canBuy ? `COMPRAR · ${formatMoney(player.value)}` : (state.players.length >= MAX_SQUAD ? 'PLANTILLA LLENA' : 'SIN FONDOS')}
      </button>
    `
    if (canBuy) {
      document.getElementById('modal-comprar').onclick = () => {
        const team = state.leagueTeams.find(t => t.teamId === player.teamId || t.players?.includes(player))
        if (team) { buyPlayer(player, team); closeModal() }
      }
    }
  }

  document.getElementById('player-modal').classList.add('open')
}

function closeModal() {
  document.getElementById('player-modal').classList.remove('open')
}

function openStaffModal(staff) {
  const avatar = staff.avatar || 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
  const roleLabels = { headCoach: 'Entrenador', assistantCoach: 'Asistente', delegate: 'Delegado', fitnessCoach: 'Preparador físico' }
  document.getElementById('staff-modal-avatar').src = avatar
  document.getElementById('staff-modal-name').textContent = staff.name
  document.getElementById('staff-modal-role').textContent = roleLabels[staff.role] || staff.role

  const career = staff.career || [{ team: state.team, from: '—', to: 'Actualidad', matches: 0, won: 0, drawn: 0, lost: 0 }]
  const total = { matches: 0, won: 0, drawn: 0, lost: 0 }

  document.getElementById('staff-modal-career').innerHTML = career.map(c => {
    total.matches += c.matches; total.won += c.won; total.drawn += c.drawn; total.lost += c.lost
    return `<div class="staff-career-item">
      <span class="staff-career-team">${c.team}</span>
      <span class="staff-career-dates">${c.from} → ${c.to}</span>
      <span class="staff-career-record">${c.won}V ${c.drawn}E ${c.lost}D</span>
      <span class="staff-career-matches">${c.matches} part.</span>
    </div>`
  }).join('')

  document.getElementById('staff-modal-total').innerHTML = career.length > 0
    ? `<div class="staff-career-total">TOTAL: ${total.matches} part. · ${total.won}V ${total.drawn}E ${total.lost}D</div>`
    : ''

  document.getElementById('staff-modal').classList.add('open')
}

/* ============ FINANCES VIEW ============ */
function renderFinances() {
  document.getElementById('finance-balance').textContent = formatMoney(state.finances.balance)
  const container = document.getElementById('finance-history')
  if (!container) return
  if (state.finances.history.length === 0) {
    container.innerHTML = '<div class="finance-item" style="justify-content:center;color:var(--text-muted)">Sin movimientos aún</div>'
    return
  }
  container.innerHTML = state.finances.history.map(item => {
    const cls = item.amount >= 0 ? 'positive' : 'negative'
    const sign = item.amount >= 0 ? '+' : ''
    return `<div class="finance-item"><span class="finance-item-reason">${item.reason}</span><span class="finance-item-amount ${cls}">${sign}${formatMoney(item.amount)}</span></div>`
  }).join('')
}

/* ============ NAVIGATION ============ */
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      renderTab(tab)
    }
  })

  /* Club sub-tabs */
  document.querySelectorAll('#view-club .sub-tab').forEach(btn => {
    btn.onclick = () => {
      state.clubSubTab = btn.dataset.subtab
      document.querySelectorAll('#view-club .sub-tab').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById('club-squad-content').classList.add('hidden')
      document.getElementById('club-tactics-content').classList.add('hidden')
      if (state.clubSubTab === 'squad') {
        document.getElementById('club-squad-content').classList.remove('hidden')
        renderSquad(state.players)
      } else {
        document.getElementById('club-tactics-content').classList.remove('hidden')
        renderTactics(state.tactic)
      }
    }
  })

  /* Market sub-tabs */
  document.querySelectorAll('#view-market .sub-tab').forEach(btn => {
    btn.onclick = () => {
      state.marketTab = btn.dataset.marketTab
      document.querySelectorAll('#view-market .sub-tab').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      renderMarketContent()
    }
  })

  /* Market search */
  document.getElementById('market-search').oninput = () => renderMarketContent()

  /* League selector */
  document.getElementById('league-selector').onchange = (e) => {
    // Just visual for now
  }

  /* Modal close */
  document.getElementById('modal-close').onclick = closeModal
  document.getElementById('player-modal').onclick = (e) => { if (e.target === e.currentTarget) closeModal() }
  document.getElementById('staff-modal-close').onclick = () => { document.getElementById('staff-modal').classList.remove('open') }
  document.getElementById('staff-modal').onclick = (e) => { if (e.target === e.currentTarget) document.getElementById('staff-modal').classList.remove('open') }
}

function renderTab(tab) {
  state.currentTab = tab
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  const view = document.getElementById(`view-${tab}`)
  if (view) view.classList.add('active')
  
  switch (tab) {
    case 'club': renderClub(); break
    case 'league': renderLeague(); break
    case 'home': renderHome(); break
    case 'market': renderMarket(); break
    case 'finances': renderFinances(); break
  }
}

/* ============ GAME INIT ============ */
function newGame(coach) {
  const country = COUNTRIES.find(c => c.id === selectedCountry.id)
  const league = country.leagues.find(l => l.id === selectedLeague.id)
  state.coach = coach
  state.team = selectedTeam.name
  state.teamId = selectedTeam.id
  state.teamLogo = selectedTeam.logo || ''
  state.staff = selectedTeam.staff || []
  state.countryId = selectedCountry.id
  state.leagueId = selectedLeague.id
  state.gameId = Date.now()
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.tactic = { formation: '1-2-1', gamePlan: 'juegoCuatro' }
  state.tacticsSlots = []
  state.benchIds = []
  state.reserveIds = []
  state.convocatoriaValidada = false
  /* Clear old tactics save */
  try { const all = JSON.parse(localStorage.getItem(TACTICS_KEY)) || {}; delete all[state.gameId]; localStorage.setItem(TACTICS_KEY, JSON.stringify(all)) } catch {}
  state.finances = { balance: 5000, history: [] }

  /* Assign user squad based on selected team */
  const userSquad = REAL_SQUADS[state.teamId] || FCB_SQUAD
  state.players = userSquad.map(p => ({
    ...p, value: calcValue(p.skill),
    enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null,
  }))
  state.players.forEach(p => { p.energy = 100 })

  /* Generate CPU teams */
  state.leagueTeams = []
  const allTeamIds = [state.teamId]
  for (const t of league.teams) {
    if (t.id === state.teamId) continue
    const base = REAL_SQUADS[t.id]
    const squad = base
      ? base.map(p => ({ ...p, value: calcValue(p.skill), enPista: false, minutosEnPista: 0, convocado: false, titular: false, injury: null }))
      : generateCpuSquad(t.id)
    const defaultStaff = t.staff || [{ name: pickRandom(NAME_POOLS.ala), nationality: '🇪🇸 España', role: 'headCoach', avatar: 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1', career: [{ team: t.name, from: '01/09/2026', to: 'Actualidad', matches: 0, won: 0, drawn: 0, lost: 0 }] }]
    state.leagueTeams.push({ teamId: t.id, name: t.name, players: squad, staff: defaultStaff })
    allTeamIds.push(t.id)
  }

  /* Generate fixtures */
  state.fixtures = generateFixtures(allTeamIds)
  state.totalMatchdays = state.fixtures.filter(f => f.matchday === 1).length > 0
    ? Math.max(...state.fixtures.map(f => f.matchday)) : 0
  state.currentMatchday = 1

  /* Assign dates and schedules */
  const WEEKEND_DAYS = [
    { day: 5, label: 'Viernes 20:00' },
    { day: 6, label: 'Sábado 18:00' },
    { day: 0, label: 'Domingo 12:00' },
  ]
  const MIDWEEK_MD = [7, 14, 21, 28]
  state.fixtures.forEach(f => {
    const d = new Date(2026, 8, 1)
    let offset = (f.matchday - 1) * 8
    if (f.matchday > 15) offset += 21
    if (f.matchday > 23) offset += 14
    d.setDate(d.getDate() + offset)
    if (MIDWEEK_MD.includes(f.matchday)) {
      const diff = (5 - d.getDay() + 7) % 7
      d.setDate(d.getDate() + diff)
      f.horario = 'Viernes 20:00'
    } else {
      const weighted = [WEEKEND_DAYS[0],WEEKEND_DAYS[0],WEEKEND_DAYS[0],WEEKEND_DAYS[0],WEEKEND_DAYS[0],...Array(25).fill(WEEKEND_DAYS[1]),...Array(20).fill(WEEKEND_DAYS[2])]
      const slot = pickRandom(weighted)
      const diff = (slot.day - d.getDay() + 7) % 7
      d.setDate(d.getDate() + diff)
      f.horario = slot.label
    }
    f.date = d.toISOString().slice(0, 10)
  })
  /* Validate minimum 8 days between matchdays */
  for (let md = 1; md < state.totalMatchdays; md++) {
    const cur = state.fixtures.filter(f => f.matchday === md && (f.home === state.teamId || f.away === state.teamId))
    const nxt = state.fixtures.filter(f => f.matchday === md + 1 && (f.home === state.teamId || f.away === state.teamId))
    if (cur.length === 0 || nxt.length === 0) continue
    const curDate = new Date(cur[0].date + 'T12:00:00')
    const nxtDate = new Date(nxt[0].date + 'T12:00:00')
    const diff = Math.round((nxtDate - curDate) / (1000 * 60 * 60 * 24))
    if (diff < 8) {
      nxtDate.setDate(nxtDate.getDate() + (8 - diff))
      const nd = nxtDate.getDay()
      if (nd >= 1 && nd <= 4) nxtDate.setDate(nxtDate.getDate() + ((5 - nd + 7) % 7))
      const newDate = nxtDate.toISOString().slice(0, 10)
      state.fixtures.filter(f => f.matchday === md + 1).forEach(f => { f.date = newDate })
    }
  }

  /* Sync horario with actual day after validation */
  const DAY_LABELS = { 5: 'Viernes', 6: 'Sábado', 0: 'Domingo' }
  state.fixtures.filter(f => f.matchday <= state.totalMatchdays).forEach(f => {
    if (!f.horario) return
    const d = new Date(f.date + 'T12:00:00')
    const label = DAY_LABELS[d.getDay()]
    if (label && !f.horario.startsWith(label)) {
      const parts = f.horario.split(' ')
      f.horario = `${label} ${parts.slice(1).join(' ') || '20:00'}`
    }
  })

  autoAssignSquad()

  startGame()
}

function loadGame(id) {
  const saves = getSaves()
  const data = saves.find(s => s.id === id)
  if (!data) return
  state.coach = data.coach
  state.team = data.team
  state.teamId = data.teamId
  state.teamLogo = data.teamLogo || ''
  state.countryId = data.countryId
  state.leagueId = data.leagueId
  state.gameId = data.id
  state.stats = data.stats || { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.players = (data.players || []).map(p => ({ ...p, age: p.age || randInt(22, 34) }))
  state.tactic = data.tactic || { formation: '1-2-1', gamePlan: 'juegoCuatro' }
  state.finances = data.finances || { balance: 5000, history: [] }
  state.leagueTeams = data.leagueTeams || []
  state.currentMatchday = data.currentMatchday || 1
  state.totalMatchdays = data.totalMatchdays || 0
  state.fixtures = data.fixtures || []
  state.tacticsSlots = data.tacticsSlots || []
  state.benchIds = data.benchIds || []
  state.reserveIds = data.reserveIds || []
  state.staff = data.staff || []
  startGame()
}

function startGame() {
  document.getElementById('menu-screen').classList.add('hidden')
  document.getElementById('game-screen').classList.remove('hidden')
  loadTactics()
  setupNavigation()
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelector('[data-tab="home"]').classList.add('active')
  renderTab('home')
  
}

/* ============ MENU ============ */
let menuStep = null
let selectedCountry = null
let selectedLeague = null
let selectedTeam = null

function showMainMenu() {
  document.getElementById('menu-screen').classList.remove('hidden')
  document.getElementById('game-screen').classList.add('hidden')
  document.getElementById('menu-main').classList.remove('hidden')
  document.getElementById('menu-browser').classList.add('hidden')
  document.getElementById('menu-load').classList.add('hidden')
  document.getElementById('menu-coach').classList.add('hidden')
  menuStep = null
}

function showBrowser(step) {
  document.getElementById('menu-main').classList.add('hidden')
  document.getElementById('menu-load').classList.add('hidden')
  document.getElementById('menu-coach').classList.add('hidden')
  document.getElementById('menu-browser').classList.remove('hidden')
  menuStep = step
  const title = document.getElementById('menu-browser-title')
  const content = document.getElementById('menu-browser-content')
  if (step === 'countries') {
    title.textContent = 'Selecciona un país'
    content.innerHTML = COUNTRIES.map(c => `<div class="menu-list-item" data-id="${c.id}"><span class="menu-item-flag">${c.flag}</span><span class="menu-item-text">${c.name}</span><span class="menu-item-arrow">›</span></div>`).join('')
    content.querySelectorAll('.menu-list-item').forEach(el => {
      el.onclick = () => { selectedCountry = COUNTRIES.find(c => c.id === el.dataset.id); selectedLeague = null; selectedTeam = null; showBrowser('leagues') }
    })
  } else if (step === 'leagues') {
    title.textContent = `${selectedCountry.flag} ${selectedCountry.name}`
    content.innerHTML = selectedCountry.leagues.map(l => `<div class="menu-list-item" data-id="${l.id}"><span class="menu-item-text">${l.name}</span><span class="menu-item-arrow">›</span></div>`).join('')
    content.querySelectorAll('.menu-list-item').forEach(el => {
      el.onclick = () => { selectedLeague = selectedCountry.leagues.find(l => l.id === el.dataset.id); selectedTeam = null; showBrowser('teams') }
    })
  } else if (step === 'teams') {
    title.textContent = selectedLeague.name
    content.innerHTML = selectedLeague.teams.map(t => {
      const logoHtml = t.logo ? `<img class="team-logo" src="${t.logo}" style="width:24px;height:24px;margin-right:8px">` : ''
      return `<div class="menu-list-item" data-id="${t.id}">${logoHtml}<span class="menu-item-text">${t.name}</span><span class="menu-item-arrow">›</span></div>`
    }).join('')
    content.querySelectorAll('.menu-list-item').forEach(el => {
      el.onclick = () => { selectedTeam = selectedLeague.teams.find(t => t.id === el.dataset.id); showCoachInput() }
    })
  }
}

function showCoachInput() {
  document.getElementById('menu-browser').classList.add('hidden')
  document.getElementById('menu-main').classList.add('hidden')
  document.getElementById('menu-coach').classList.remove('hidden')
  document.getElementById('coach-summary').innerHTML = `${selectedCountry.flag} ${selectedLeague.name}<br><strong>${selectedTeam.name}</strong>`
  const input = document.getElementById('coach-input')
  input.value = ''; input.style.borderColor = ''; input.placeholder = 'Ej: Carlos'
  document.getElementById('btn-coach-back').onclick = () => { document.getElementById('menu-coach').classList.add('hidden'); showBrowser('teams') }
  document.getElementById('btn-start-game').onclick = () => {
    const coachName = input.value.trim()
    if (!coachName) { input.style.borderColor = '#EF4444'; input.placeholder = 'Escribe tu nombre'; return }
    newGame(coachName)
  }
  input.onkeydown = (e) => { if (e.key === 'Enter') document.getElementById('btn-start-game').click() }
  setTimeout(() => input.focus(), 100)
}

function handleBrowserBack() {
  if (menuStep === 'leagues') { selectedCountry = null; showBrowser('countries') }
  else if (menuStep === 'teams') { selectedLeague = null; showBrowser('leagues') }
  else { showMainMenu() }
}

/* ============ LOAD MENU ============ */
function showLoadMenu() {
  document.getElementById('menu-main').classList.add('hidden')
  document.getElementById('menu-browser').classList.add('hidden')
  document.getElementById('menu-coach').classList.add('hidden')
  document.getElementById('menu-load').classList.remove('hidden')
  const saves = getSaves()
  const content = document.getElementById('load-content')
  if (saves.length === 0) {
    content.innerHTML = '<div class="empty-state">No hay partidas guardadas</div>'
    return
  }
  content.innerHTML = saves.map(s => {
    const st = s.stats || { wins: 0, draws: 0, losses: 0 }
    const record = `${st.wins}V · ${st.draws}E · ${st.losses}D`
    const ts = s.date ? formatTimestamp(s.date) : ''
    const matchday = s.matchday || 1
    return `
      <div class="save-card" data-id="${s.id}">
        <div class="save-crest">${s.teamLogo ? `<img src="${s.teamLogo}" style="width:48px;height:48px;object-fit:contain" alt="${s.team}">` : `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#E5E7EB"/><text x="24" y="24" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="#6B7280">${getInitials(s.team)}</text></svg>`}</div>
        <div class="save-body">
          <div class="save-team">${s.team}</div>
          <div class="save-manager">Manager: ${s.coach}</div>
          <div class="save-matchday">Jornada ${matchday}</div>
          <div class="save-timestamp">${ts}</div>
        </div>
        <div class="save-actions">
          <button class="save-delete" data-id="${s.id}"><svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
          <button class="save-load" data-id="${s.id}">CARGAR</button>
        </div>
      </div>
    `
  }).join('')
  content.querySelectorAll('.save-load').forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); loadGame(Number(btn.dataset.id)) } })
  content.querySelectorAll('.save-delete').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation()
      const id = Number(btn.dataset.id)
      const card = document.querySelector(`.save-card[data-id="${id}"]`)
      if (card) { card.style.transition = 'transform 0.2s ease, opacity 0.2s ease'; card.style.transform = 'translateX(-100%)'; card.style.opacity = '0'; setTimeout(() => { deleteSave(id); showLoadMenu() }, 250) }
      else { deleteSave(id); showLoadMenu() }
    }
  })
}

/* ============ CALENDAR ============ */
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getCalMatchIcon(md) {
  const f = state.fixtures.find(x => x.matchday === md && (x.home === state.teamId || x.away === state.teamId))
  if (!f) return ''
  const rivalId = f.home === state.teamId ? f.away : f.home
  const isHome = f.home === state.teamId
  const logo = getTeamLogo(rivalId)
  const homeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  const awaySvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l-3 5h2v4l-4 3 1 5 4-3v4l2 2 2-2v-4l4 3 1-5-4-3V7h2z"/></svg>'
  return `<span class="cal-day-icon">${logo ? `<img class="cal-day-logo" src="${logo}">` : ''}<span class="cal-day-loc">${isHome ? homeSvg : awaySvg}</span></span>`
}

function getSeasonDate(matchday) {
  const f = state.fixtures.find(x => x.matchday === matchday)
  if (f && f.date) return new Date(f.date + 'T12:00:00')
  const d = new Date(2026, 8, 1)
  d.setDate(d.getDate() + (matchday - 1) * 7)
  return d
}

let calMonthOffset = 0

function showCalendar() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  const view = document.getElementById('view-calendar')
  if (view) view.classList.add('active')
  calMonthOffset = 0
  renderCalendar()
}

function renderCalendar() {
  const container = document.getElementById('calendar-content')
  if (!container) return

  /* Current month from offset */
  const baseDate = new Date(2026, 8 + calMonthOffset, 1)
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const monthName = MONTHS_ES[month]
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  /* Build grid */
  let gridHtml = `<div class="cal-header">
    <button class="cal-nav-btn" id="cal-prev">◀</button>
    <span class="cal-month-title">${monthName} ${year}</span>
    <button class="cal-nav-btn" id="cal-next">▶</button>
  </div>
  <div class="cal-grid">`

  DAYS_ES.forEach(d => { gridHtml += `<div class="cal-day-header">${d}</div>` })

  for (let i = 0; i < startOffset; i++) {
    gridHtml += `<div class="cal-day empty"></div>`
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const found = state.fixtures.find(f => {
      if (f.matchday > state.totalMatchdays) return false
      const fd = getSeasonDate(f.matchday)
      return fd.getDate() === day && fd.getMonth() === month && fd.getFullYear() === year
    })
    const matchday = found ? found.matchday : 0
    const hasMatch = matchday >= 1 && matchday <= state.totalMatchdays
    gridHtml += `<div class="cal-day${hasMatch ? ' match-day' : ''}"${hasMatch ? ` data-md="${matchday}"` : ''}>
      <span class="cal-day-num">${day}</span>
      ${hasMatch ? getCalMatchIcon(matchday) : ''}
    </div>`
  }
  gridHtml += `</div>`

  /* Matches this month */
  const monthFixtures = state.fixtures.filter(f => {
    if (f.matchday > state.totalMatchdays) return false
    const fd = getSeasonDate(f.matchday)
    return fd.getMonth() === month && fd.getFullYear() === year
  })

  if (monthFixtures.length > 0) {
    gridHtml += `<div class="cal-match-list">`
    monthFixtures.sort((a, b) => a.matchday - b.matchday).forEach(f => {
      const isUser = f.home === state.teamId || f.away === state.teamId
      if (!isUser) return
      const rivalId = f.home === state.teamId ? f.away : f.home
      const rivalName = getTeamName(rivalId)
      const rivalLogo = getTeamLogo(rivalId)
      const isHome = f.home === state.teamId
      const fd = getSeasonDate(f.matchday)
      const result = f.played ? `${f.homeScore} - ${f.awayScore}` : '—'
      gridHtml += `<div class="cal-match-item">
        <img class="cal-match-logo" src="${rivalLogo || ''}" alt="">
        <div class="cal-match-info">
          <div class="cal-match-rival">J${f.matchday} · ${rivalName}</div>
          <div class="cal-match-meta">${String(fd.getDate()).padStart(2,'0')}/${String(fd.getMonth()+1).padStart(2,'0')} · ${f.horario || ''} ${isHome ? '🏠' : '✈️'}</div>
        </div>
        <div class="cal-match-result${f.played ? ' played' : ''}">${result}</div>
      </div>`
    })
    gridHtml += `</div>`
  } else {
    gridHtml += '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:14px">Sin partidos este mes</div>'
  }

  gridHtml += `<button class="cal-back-btn" id="cal-back">← Volver</button>`

  container.innerHTML = gridHtml

  /* Events */
  document.getElementById('cal-prev').onclick = () => { calMonthOffset--; renderCalendar() }
  document.getElementById('cal-next').onclick = () => { calMonthOffset++; renderCalendar() }
  document.getElementById('cal-back').onclick = () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
    document.querySelector('[data-tab="home"]').classList.add('active')
    renderTab('home')
  }
  document.querySelectorAll('.cal-day.match-day').forEach(el => {
    el.onclick = () => { document.getElementById('cal-back').click(); /* placeholder */ }
  })
}

/* ============ TEAM INFO ============ */
function showTeamInfo(teamId) {
  if (teamId === state.teamId) return
  const team = getTeamObj(teamId)
  if (!team) return
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  document.getElementById('view-team').classList.add('active')
  const standings = updateLeagueStandings()
  const pos = standings.findIndex(s => s.teamId === teamId) + 1
  const logo = getTeamLogo(teamId)
  const league = COUNTRIES.flatMap(c => c.leagues).find(l => l.id === state.leagueId)
  const leagueLogo = league && league.logo ? league.logo : ''
  let html = `
    <div class="view-header">
      <div class="view-header-left">
        ${leagueLogo ? `<img class="team-logo" src="${leagueLogo}" style="width:22px;height:22px;opacity:0.5;margin-right:2px">` : ''}
        ${logo ? `<img class="team-logo" src="${logo}" style="width:32px;height:32px">` : ''}
        <h2>${team.name}</h2>
      </div>
      <button class="btn-back" id="btn-team-back">← Volver</button>
    </div>
    <div class="team-info-card">
      <span class="finance-label">Posición en liga</span>
      <span class="finance-balance">${pos}º de ${standings.length}</span>
    </div>
    ${team.staff && team.staff.length > 0 ? `<div class="tactics-subsection-label">Staff técnico (${team.staff.length})</div>${team.staff.map(s => {
      const roleLabels = { headCoach: 'Entrenador', assistantCoach: 'Asistente', delegate: 'Delegado', fitnessCoach: 'Preparador físico' }
      const avatar = s.avatar || 'https://cdn.resfu.com/media/img/nofoto_jugador.png?size=120x&lossy=1'
      const avatarStyle = `background-image:url(${avatar});background-size:cover;background-position:center;background-color:var(--bg-surface)`
      return `<div class="staff-card staff-card-team" data-staff-name="${s.name}"><div class="staff-card-avatar" style="${avatarStyle}"></div><div class="staff-card-info"><div class="staff-card-name">${s.name}</div><div class="staff-card-meta">${s.nationality}</div></div><span class="staff-card-role">${roleLabels[s.role] || s.role}</span></div>`
    }).join('')}` : ''}
    <div class="tactics-subsection-label">PLANTILLA (${team.players.length})</div>
    <div class="squad-grid">`
  team.players.forEach(p => {
    const pos = POSITIONS[p.position]
    const initials = getInitials(p.name)
    const avatarStyle = p.avatar ? `background-image:url(${p.avatar});background-color:${pos.color}` : `background:${pos.color}`
    const val = p.value || calcValue(p.skill)
    html += `<div class="player-card">
      <div class="player-avatar" style="${avatarStyle}">${p.avatar ? '' : initials}</div>
      <div class="player-info">
        <div class="player-row1">
          <span class="player-name">${p.name}</span>
          <span class="player-stat-num">${p.age ? `${p.age}y` : '-'}</span>
          <span class="player-stat-num">${formatValue(val)}</span>
          <span class="player-rating-num">${p.skill}</span>
        </div>
        <div class="player-row2">
          <span class="player-position" style="background:${pos.color}">${pos.label}</span>
          <span class="player-foot">${p.foot || 'DER'}</span>
          <span class="player-nation">${p.nationality}</span>
        </div>
      </div>
    </div>`
  })
  html += `</div><button class="btn-secondary" id="btn-team-back-2" style="margin-top:12px">← Volver</button>`
  document.getElementById('team-info-content').innerHTML = html
  document.getElementById('btn-team-back').onclick = goBackFromTeam
  document.getElementById('btn-team-back-2').onclick = goBackFromTeam
  document.querySelectorAll('#team-info-content .staff-card-team').forEach(card => {
    const name = card.dataset.staffName
    if (team.staff) {
      const staff = team.staff.find(s => s.name === name)
      if (staff) card.onclick = () => openStaffModal(staff)
    }
  })
}
function goBackFromTeam() {
  document.getElementById('view-team').classList.remove('active')
  const prevTab = state.currentTab
  const v = document.getElementById(`view-${prevTab}`)
  if (v) v.classList.add('active')
}

/* ============ MENU DROPDOWN ============ */
function showSideMenu() {
  const dd = document.getElementById('header-dropdown')
  const overlay = document.getElementById('dropdown-overlay')
  const logo = document.getElementById('dd-team-logo')
  const name = document.getElementById('dd-team-name')
  if (logo) logo.src = state.teamLogo || ''
  if (name) name.textContent = state.team || 'Futsal Manager'
  dd.classList.add('open')
  overlay.classList.add('open')
}

function hideSideMenu() {
  document.getElementById('header-dropdown').classList.remove('open')
  document.getElementById('dropdown-overlay').classList.remove('open')
}

document.getElementById('btn-header-menu').onclick = (e) => {
  e.stopPropagation()
  if (document.getElementById('header-dropdown').classList.contains('open')) {
    hideSideMenu()
  } else {
    showSideMenu()
  }
}

document.getElementById('dropdown-overlay').onclick = hideSideMenu

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.onclick = () => {
    hideSideMenu()
    const action = item.dataset.action
    if (action === 'quit') {
      saveGame()
      hideSideMenu()
      showMainMenu()
    } else if (action === 'save') {
      saveGame()
      hideSideMenu()
      const btn = document.getElementById('btn-header-menu')
      btn.innerHTML = '✓'
      setTimeout(() => {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
      }, 1500)
    } else if (action === 'inbox') {
      hideSideMenu()
      alert('📬 Bandeja de entrada — Próximamente')
    } else if (action === 'calendar') {
      hideSideMenu()
      showCalendar()
    } else if (action === 'history') {
      alert('📊 Historial — Próximamente')
    } else if (action === 'settings') {
      alert('⚙️ Ajustes — Próximamente')
    }
  }
})

/* ============ INIT ============ */
document.getElementById('btn-new-game').onclick = () => showBrowser('countries')
document.getElementById('btn-load-game').onclick = showLoadMenu
document.getElementById('btn-browser-back').onclick = handleBrowserBack
document.getElementById('btn-load-cancel').onclick = showMainMenu

showMainMenu()
