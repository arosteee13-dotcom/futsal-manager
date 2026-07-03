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

const MENTALITIES = {
  defensive: { label: 'Defensiva', attackMod: 0.7, defenseMod: 1.3 },
  balanced: { label: 'Balanceada', attackMod: 1.0, defenseMod: 1.0 },
  attacking: { label: 'Atacante', attackMod: 1.3, defenseMod: 0.7 },
}

const MAX_SQUAD = 14

/* FC Barcelona — plantilla real */
const FCB_SQUAD = [
  { id: 'fcb-1', name: 'Dídac Plana', position: 'portero', skill: 83, energy: 95, number: 21, nationality: '🇪🇸 España', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-2', name: 'Miquel Feixas', position: 'portero', skill: 72, energy: 100, number: 26, nationality: '🇪🇸 España', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-3', name: 'Joao Alves', position: 'cierre', skill: 85, energy: 90, number: 5, nationality: '🇵🇹 Portugal', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-4', name: 'Antonio Pérez Ortega', position: 'cierre', skill: 78, energy: 88, number: 6, nationality: '🇪🇸 España', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-5', name: 'Matheus Rodrigues', position: 'ala', skill: 86, energy: 85, number: 3, nationality: '🇧🇷 Brasil', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-6', name: 'Adolfo Fernández', position: 'ala', skill: 80, energy: 82, number: 8, nationality: '🇪🇸 España', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-7', name: 'Mamadou Touré', position: 'ala', skill: 82, energy: 78, number: 11, nationality: '🇸🇳 Senegal', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-8', name: 'Catela', position: 'ala', skill: 88, energy: 80, number: 13, nationality: '🇧🇷 Brasil', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-9', name: 'Eric Martel', position: 'ala', skill: 76, energy: 92, number: 14, nationality: '🇪🇸 España', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-10', name: 'Sergio González Pérez', position: 'ala', skill: 79, energy: 86, number: 16, nationality: '🇪🇸 España', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-11', name: 'Luciano Gauna', position: 'ala', skill: 84, energy: 75, number: 25, nationality: '🇦🇷 Argentina', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-12', name: 'Pito', position: 'pivot', skill: 92, energy: 83, number: 10, nationality: '🇧🇷 Brasil', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
  { id: 'fcb-13', name: 'Fits', position: 'pivot', skill: 87, energy: 79, number: 19, nationality: '🇦🇴 Angola', goals: 0, matches: 0, value: 0, listed: false, salePrice: 0 },
]

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
        name,
        position: pos,
        skill,
        energy: randInt(70, 100),
        number: pid,
        nationality: '🇪🇸 España',
        goals: 0, matches: 0,
        value, listed: false, salePrice: 0,
      })
    }
  }
  return players
}

const COUNTRIES = [
  { id: 'es', name: 'España', flag: '🇪🇸',
    leagues: [
      { id: 'lnfs1', name: 'LNFS Primera División',
        teams: [
          { id: 'fcb', name: 'FC Barcelona' },
          { id: 'elp', name: 'ElPozo Murcia' },
          { id: 'mov', name: 'Movistar Inter' },
          { id: 'pal', name: 'PALMA Futsal' },
          { id: 'val', name: 'Levante UD' },
          { id: 'jae', name: 'Jaén Paraíso Interior' },
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

function calcTacticMultiplier(formation, mentality) {
  const f = FORMATIONS[formation]
  const m = MENTALITIES[mentality]
  if (!f || !m) return 1
  return f.multiplier * m.attackMod
}

class MatchEngine {
  constructor(homePlayers, tactic, awaySkill, homeName, awayName) {
    this.awaySkill = awaySkill
    this.homeScore = 0
    this.awayScore = 0
    this.minute = 0
    this.finished = false
    this.events = []
    this._timer = null
    this.onEvent = null
    this.onFinish = null
    this.homeSkill = avgSkill(homePlayers) * calcTacticMultiplier(tactic.formation, tactic.mentality)
    this.homeEnergy = avgEnergy(homePlayers) / 100
    this.homeName = homeName || 'Tu Equipo'
    this.awayName = awayName || 'Rival'
  }
  start() { this._tick() }
  _tick() {
    if (this.finished) return
    this.minute++
    if (this.minute > 40) { this._finish(); return }
    const event = this._simulateMinute()
    if (event) {
      this.events.push(event)
      if (event.type === 'homeGoal') this.homeScore++
      else if (event.type === 'awayGoal') this.awayScore++
      if (this.onEvent) this.onEvent(event, this.homeScore, this.awayScore, this.minute)
    }
    this._timer = setTimeout(() => this._tick(), 1400)
  }
  _simulateMinute() {
    const homeChance = this.homeSkill * (0.5 + this.homeEnergy * 0.3)
    const awayChance = this.awaySkill * 0.5
    const totalChance = homeChance + awayChance
    if (Math.random() > 0.42) return null
    const roll = Math.random() * totalChance
    const isHomeAttack = roll < homeChance
    const teamName = isHomeAttack ? this.homeName : this.awayName
    const teamSkill = isHomeAttack ? this.homeSkill : this.awaySkill
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
  _finish() {
    this.finished = true
    if (this._timer) clearTimeout(this._timer)
    if (this.onFinish) this.onFinish()
  }
  stop() {
    this.finished = true
    if (this._timer) clearTimeout(this._timer)
  }
}

/* ============ STATE ============ */
const STORAGE_KEY = 'futsal_saves'

const state = {
  coach: '', team: '', teamId: '', countryId: '', leagueId: '',
  gameId: null,
  stats: { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
  players: [],
  tactic: { formation: '1-2-1', mentality: 'balanced' },
  finances: { balance: 5000, history: [] },
  leagueTeams: [],
  currentMatchday: 1,
  totalMatchdays: 0,
  fixtures: [],
  currentTab: 'club',
  clubSubTab: 'squad',
  marketTab: 'buy',
}

/* ============ HELPERS ============ */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatMoney(amount) {
  const sign = amount >= 0 ? '' : '-'
  return `${sign}€${Math.abs(amount).toLocaleString()}`
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
    id: state.gameId, name: `${state.coach} - ${state.team}`, coach: state.coach, team: state.team, teamId: state.teamId,
    countryId: state.countryId, leagueId: state.leagueId,
    date: new Date().toISOString(), matchday, players: state.players, tactic: state.tactic,
    finances: state.finances, stats: state.stats, leagueTeams: state.leagueTeams,
    currentMatchday: state.currentMatchday, totalMatchdays: state.totalMatchdays, fixtures: state.fixtures,
  }
  if (idx >= 0) saves[idx] = data; else saves.unshift(data)
  setSaves(saves)
}
function autoSave() { saveGame() }
function deleteSave(id) { let s = getSaves(); setSaves(s.filter(x => x.id !== id)) }

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
      const home = ids[i]
      const away = ids[m - 1 - i]
      if (home !== null && away !== null) {
        fixtures.push({ matchday: r + 1, home, away, homeScore: null, awayScore: null, played: false })
      }
    }
    ids.splice(1, 0, ids.pop())
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

function getTeamObj(id) {
  if (id === state.teamId) return { name: state.team, players: state.players, teamId: state.teamId }
  return state.leagueTeams.find(x => x.teamId === id)
}

function autoSimulateOtherMatch(homeId, awayId) {
  const home = getTeamObj(homeId)
  const away = getTeamObj(awayId)
  if (!home || !away) return { homeScore: 0, awayScore: 0 }
  const homeSkill = avgSkill(home.players) * randInt(80, 120) / 100
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
  container.innerHTML = ordered.map(p => {
    const pos = POSITIONS[p.position]
    const initials = getInitials(p.name)
    return `
      <div class="player-card" data-player-id="${p.id}">
        <div class="player-avatar" style="background:${pos.color}">${initials}</div>
        <div class="player-info">
          <div class="player-name">${p.name}</div>
          <span class="player-position" style="background:${pos.color}">${pos.label}</span>
        </div>
        <div class="player-stats">
          <div class="player-stat">
            <span class="stat-label">HAB</span>
            <span class="stat-value">${p.skill}</span>
            <div class="stat-bar"><div class="stat-bar-fill" style="width:${p.skill}%"></div></div>
          </div>
          <div class="player-stat">
            <span class="stat-label">ENE</span>
            <span class="stat-value" style="color:${p.energy > 60 ? 'var(--accent)' : '#EF4444'}">${p.energy}</span>
            <div class="stat-bar"><div class="stat-bar-fill" style="width:${p.energy}%;background:${p.energy > 60 ? 'var(--accent)' : '#EF4444'}"></div></div>
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
}

/* ============ TACTICS ============ */
const formationRoles = {
  '1-2-1': [{ role: 'portero', label: '1' }, { role: 'cierre', label: '2' }, { role: 'ala', label: '3' }, { role: 'pivot', label: '4' }],
  '2-2': [{ role: 'portero', label: '1' }, { role: 'cierre', label: '2' }, { role: 'cierre', label: '3' }, { role: 'ala', label: '4' }],
  '1-1-2': [{ role: 'portero', label: '1' }, { role: 'cierre', label: '2' }, { role: 'ala', label: '3' }, { role: 'ala', label: '4' }],
}

function renderTactics(tactic) {
  renderFormations(tactic.formation)
  renderMentality(tactic.mentality)
  renderPitch(tactic.formation)
  setupTacticsListeners(tactic)
}
function renderFormations(selected) {
  const c = document.getElementById('formation-options')
  if (!c) return
  c.querySelectorAll('.tactics-btn').forEach(b => b.classList.toggle('active', b.dataset.formation === selected))
}
function renderMentality(selected) {
  const c = document.getElementById('mentality-options')
  if (!c) return
  c.querySelectorAll('.tactics-btn').forEach(b => b.classList.toggle('active', b.dataset.mentality === selected))
}
function renderPitch(key) {
  const pitch = document.getElementById('tactics-preview')
  if (!pitch) return
  const roles = formationRoles[key] || formationRoles['1-2-1']
  pitch.innerHTML = `<div class="pitch">${roles.map(r => { const p = POSITIONS[r.role]; return `<div class="pitch-role" style="background:${p.color}">${r.label}</div>` }).join('')}</div>`
}
function setupTacticsListeners(tactic) {
  document.querySelectorAll('#formation-options .tactics-btn').forEach(btn => {
    btn.onclick = () => { tactic.formation = btn.dataset.formation; renderTactics(tactic) }
  })
  document.querySelectorAll('#mentality-options .tactics-btn').forEach(btn => {
    btn.onclick = () => { tactic.mentality = btn.dataset.mentality; renderTactics(tactic) }
  })
}

function renderClub() {
  renderSquad(state.players)
  renderTactics(state.tactic)
}

/* ============ LEAGUE VIEW ============ */
function renderLeague() {
  const selector = document.getElementById('league-selector')
  const tableWrap = document.getElementById('league-table-wrap')
  const mdWrap = document.getElementById('league-matchday-wrap')
  const resultsWrap = document.getElementById('league-results-wrap')
  const liveWrap = document.getElementById('match-live')

  liveWrap.classList.add('hidden')
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
    tableHtml += `<tr class="${isUser ? 'league-row-user' : ''}">
      <td><span class="league-pos ${i < 3 ? 'p' + (i+1) : ''}">${i + 1}</span></td>
      <td>${getTeamName(s.teamId)}</td>
      <td>${s.played}</td><td>${s.won}</td><td>${s.drawn}</td><td>${s.lost}</td>
      <td>${s.gf}</td><td>${s.ga}</td><td><strong>${s.pts}</strong></td>
    </tr>`
  })
  tableHtml += '</table>'
  tableWrap.innerHTML = tableHtml

  /* Matchday */
  if (state.currentMatchday > state.totalMatchdays) {
    mdWrap.innerHTML = '<div class="league-finished">🏆 Temporada completada</div>'
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
      <div class="matchday-location">${location}</div>
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
  document.getElementById('league-matchday-wrap').classList.add('hidden')
  document.getElementById('league-results-wrap').classList.add('hidden')
  document.getElementById('match-live').classList.remove('hidden')
  document.getElementById('score-home').textContent = '0'
  document.getElementById('score-away').textContent = '0'
  document.getElementById('match-clock').textContent = '00:00'
  document.getElementById('match-feed').innerHTML = ''
  document.getElementById('btn-end-match').classList.add('hidden')

  const isHome = fixture.home === state.teamId
  const awaySkill = avgSkill(rival.players)
  engine = new MatchEngine(state.players, state.tactic, awaySkill, state.team, rival.name)

  engine.onEvent = (event, homeScore, awayScore, minute) => {
    document.getElementById('score-home').textContent = isHome ? homeScore : awayScore
    document.getElementById('score-away').textContent = isHome ? awayScore : homeScore
    document.getElementById('match-clock').textContent = formatTime(minute)
    addFeedEvent(event, minute)
    if (minute === 20) addFeedEvent({ text: '— DESCANSO —', type: 'break' }, minute)
  }

  engine.onFinish = () => {
    addFeedEvent({ text: '— FINAL DEL PARTIDO —', type: 'break' }, 40)
    document.getElementById('btn-end-match').classList.remove('hidden')
  }

  document.getElementById('btn-end-match').onclick = () => {
    if (engine) engine.stop()
    finishMatch(isHome, fixture, rival)
  }

  engine.start()
}

function addFeedEvent(event, minute) {
  const feed = document.getElementById('match-feed')
  const el = document.createElement('div')
  if (event.type === 'break') {
    el.className = 'feed-event minute'
    el.textContent = event.text
  } else {
    const time = formatTime(minute)
    el.className = `feed-event${event.type === 'homeGoal' || event.type === 'awayGoal' ? ' goal' : ''}`
    el.innerHTML = `<strong>${time}</strong> ${event.text}`
  }
  feed.appendChild(el)
  feed.scrollTop = feed.scrollHeight
}

function finishMatch(isHome, fixture, rival) {
  const userScore = isHome ? engine.homeScore : engine.awayScore
  const rivalScore = isHome ? engine.awayScore : engine.homeScore

  /* Update fixture */
  fixture.homeScore = isHome ? engine.homeScore : engine.awayScore
  fixture.awayScore = isHome ? engine.awayScore : engine.homeScore
  fixture.played = true

  /* Finance & energy */
  let reward
  if (userScore > rivalScore) { reward = 800; state.stats.wins++ }
  else if (userScore === rivalScore) { reward = 300; state.stats.draws++ }
  else { reward = -200; state.stats.losses++ }
  state.finances.balance += reward
  state.finances.history.push({ reason: `J${state.currentMatchday}: ${userScore}-${rivalScore} vs ${rival.name}`, amount: reward })
  state.players.forEach(p => { p.energy = Math.max(30, p.energy - randInt(15, 35)) })
  updateHeaderBalance()

  /* Player stats */
  const scorer = pickRandom(state.players)
  scorer.goals = (scorer.goals || 0) + (userScore > 0 ? randInt(1, userScore) : 0)
  scorer.matches = (scorer.matches || 0) + 1

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

function showMatchdayResults(userScore, rivalScore, rivalName) {
  document.getElementById('match-live').classList.add('hidden')
  document.getElementById('league-results-wrap').classList.remove('hidden')

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

  document.getElementById('btn-advance-matchday').onclick = () => {
    state.currentMatchday++
    document.getElementById('league-results-wrap').classList.add('hidden')
    document.getElementById('league-matchday-wrap').classList.remove('hidden')
    renderLeague()
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
    const available = allCpuPlayers.filter(p => !p.listed).sort((a, b) => b.value - a.value).slice(0, 20)
    const filtered = search ? available.filter(p => p.name.toLowerCase().includes(search)) : available

    if (filtered.length === 0) {
      container.innerHTML = '<div class="market-empty">No hay jugadores disponibles</div>'
      return
    }

    container.innerHTML = filtered.map(p => {
      const pos = POSITIONS[p.position]
      const canBuy = state.players.length < MAX_SQUAD && state.finances.balance >= p.value
      return `
        <div class="market-card" data-player-id="${p.id}" data-team-id="${p.teamId}">
          <div class="player-avatar" style="width:36px;height:36px;font-size:12px;background:${pos.color}">${getInitials(p.name)}</div>
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
    const listed = state.players.filter(p => p.listed)
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
      return `
        <div class="market-card" data-player-id="${p.id}">
          <div class="player-avatar" style="width:36px;height:36px;font-size:12px;background:${pos.color}">${getInitials(p.name)}</div>
          <div class="market-card-info">
            <div class="market-card-name">${p.name}</div>
            <div class="market-card-detail">${pos.label} · Precio: ${formatMoney(p.salePrice)}</div>
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
        player.listed = false
        player.salePrice = 0
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
  const newPlayer = { ...player, id: `user-${Date.now()}`, energy: 100, matches: 0, goals: 0, listed: false, salePrice: 0 }
  state.players.push(newPlayer)
  updateHeaderBalance()
  renderMarketContent()
}

/* ============ PLAYER MODAL ============ */
function openPlayerModal(player, mode) {
  const pos = POSITIONS[player.position]
  document.getElementById('modal-avatar').textContent = getInitials(player.name)
  document.getElementById('modal-avatar').style.background = pos.color
  document.getElementById('modal-name').textContent = player.name
  document.getElementById('modal-nationality').textContent = player.nationality || '🇪🇸 España'
  const posBadge = document.getElementById('modal-position')
  posBadge.textContent = pos.label
  posBadge.style.background = pos.color
  document.getElementById('modal-skill').textContent = player.skill
  document.getElementById('modal-energy').textContent = player.energy
  document.getElementById('modal-value').textContent = formatMoney(player.value)
  document.getElementById('modal-goals').textContent = player.goals || 0
  document.getElementById('modal-matches').textContent = player.matches || 0

  const actions = document.getElementById('modal-market-actions')
  actions.innerHTML = ''

  if (mode === 'own') {
    if (player.listed) {
      actions.innerHTML = `
        <div class="market-input-group">
          <span class="market-input-label">Precio de venta actual</span>
          <div style="text-align:center;font-weight:700;font-size:16px;color:var(--text)">${formatMoney(player.salePrice)}</div>
        </div>
        <button class="btn-secondary" id="modal-retirar">RETIRAR DEL MERCADO</button>
      `
      document.getElementById('modal-retirar').onclick = () => {
        player.listed = false
        player.salePrice = 0
        closeModal()
        renderMarketContent()
      }
    } else {
      actions.innerHTML = `
        <div class="market-input-group">
          <label class="market-input-label">Precio de venta</label>
          <input class="market-price-input" id="modal-sale-price" type="number" value="${player.value}" min="1">
        </div>
        <button class="btn-primary" id="modal-listar">LISTAR EN MERCADO</button>
      `
      document.getElementById('modal-listar').onclick = () => {
        const price = parseInt(document.getElementById('modal-sale-price').value)
        if (!price || price < 1) return
        player.listed = true
        player.salePrice = price
        closeModal()
        renderMarketContent()
      }
    }
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
        if (team) {
          buyPlayer(player, team)
          closeModal()
        }
      }
    }
  }

  document.getElementById('player-modal').classList.remove('hidden')
}

function closeModal() {
  document.getElementById('player-modal').classList.add('hidden')
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
      if (state.clubSubTab === 'squad') {
        document.getElementById('club-tactics-content').classList.add('hidden')
        document.getElementById('club-squad-content').classList.remove('hidden')
        renderSquad(state.players)
      } else {
        document.getElementById('club-squad-content').classList.add('hidden')
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

  /* Save button */
  document.getElementById('btn-save-game').onclick = () => {
    saveGame()
    const btn = document.getElementById('btn-save-game')
    const orig = btn.textContent
    btn.textContent = '✓ Guardado'
    btn.style.borderColor = 'var(--accent)'
    btn.style.color = 'var(--accent)'
    setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = '' }, 2000)
  }

  /* Modal close */
  document.getElementById('modal-close').onclick = closeModal
  document.getElementById('player-modal').onclick = (e) => { if (e.target === e.currentTarget) closeModal() }
}

function updateHeaderBalance() {
  const el = document.getElementById('header-balance')
  if (el) el.textContent = formatMoney(state.finances.balance)
}

function renderTab(tab) {
  state.currentTab = tab
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
  const view = document.getElementById(`view-${tab}`)
  if (view) view.classList.add('active')
  updateHeaderBalance()
  switch (tab) {
    case 'club': renderClub(); break
    case 'league': renderLeague(); break
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
  state.countryId = selectedCountry.id
  state.leagueId = selectedLeague.id
  state.gameId = Date.now()
  state.stats = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.tactic = { formation: '1-2-1', mentality: 'balanced' }
  state.finances = { balance: 5000, history: [] }

  /* Assign user squad (FC Barcelona) or create default */
  state.players = FCB_SQUAD.map(p => ({ ...p, value: calcValue(p.skill) }))

  /* Generate CPU teams */
  state.leagueTeams = []
  const allTeamIds = [state.teamId]
  for (const t of league.teams) {
    if (t.id === state.teamId) continue
    const squad = generateCpuSquad(t.id)
    state.leagueTeams.push({
      teamId: t.id, name: t.name, players: squad,
    })
    allTeamIds.push(t.id)
  }

  /* Generate fixtures */
  state.fixtures = generateFixtures(allTeamIds)
  state.totalMatchdays = state.fixtures.filter(f => f.matchday === 1).length > 0
    ? Math.max(...state.fixtures.map(f => f.matchday)) : 0
  state.currentMatchday = 1

  startGame()
}

function loadGame(id) {
  const saves = getSaves()
  const data = saves.find(s => s.id === id)
  if (!data) return
  state.coach = data.coach
  state.team = data.team
  state.teamId = data.teamId
  state.countryId = data.countryId
  state.leagueId = data.leagueId
  state.gameId = data.id
  state.stats = data.stats || { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }
  state.players = data.players
  state.tactic = data.tactic || { formation: '1-2-1', mentality: 'balanced' }
  state.finances = data.finances || { balance: 5000, history: [] }
  state.leagueTeams = data.leagueTeams || []
  state.currentMatchday = data.currentMatchday || 1
  state.totalMatchdays = data.totalMatchdays || 0
  state.fixtures = data.fixtures || []
  startGame()
}

function startGame() {
  document.getElementById('menu-screen').classList.add('hidden')
  document.getElementById('game-screen').classList.remove('hidden')
  document.getElementById('header-title').textContent = state.team
  setupNavigation()
  /* Start on club view */
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  document.querySelector('[data-tab="club"]').classList.add('active')
  renderTab('club')
  updateHeaderBalance()
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
    content.innerHTML = selectedLeague.teams.map(t => `<div class="menu-list-item" data-id="${t.id}"><span class="menu-item-text">${t.name}</span><span class="menu-item-arrow">›</span></div>`).join('')
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
        <div class="save-crest"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#E5E7EB"/><text x="24" y="24" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="#6B7280">${getInitials(s.team)}</text></svg></div>
        <div class="save-body">
          <div class="save-team">${s.team}</div>
          <div class="save-manager">Manager: ${s.coach}</div>
          <div class="save-matchday">Jornada ${matchday}</div>
          <div class="save-timestamp">${ts}</div>
        </div>
        <div class="save-actions">
          <button class="save-delete" data-id="${s.id}"><svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
          <button class="save-load" data-id="${s.id}">CARGAR →</button>
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

/* ============ INIT ============ */
document.getElementById('btn-new-game').onclick = () => showBrowser('countries')
document.getElementById('btn-load-game').onclick = showLoadMenu
document.getElementById('btn-browser-back').onclick = handleBrowserBack
document.getElementById('btn-load-cancel').onclick = showMainMenu

showMainMenu()
