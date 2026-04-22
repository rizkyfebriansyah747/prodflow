'use client'
import { useState, useEffect, useMemo } from 'react'

// ─── PALETTE & CONSTANTS ──────────────────────────────────────────────────────
const C = {
  bg: '#cad3dc', card: '#fefefe', border: '#E8E6E1',
  text: '#1C1B18', muted: '#7A7870', faint: '#AEACA6',
  accent: '#2563EB', accentBg: '#EFF4FF',
  green: '#16A34A', greenBg: '#F0FDF4',
  amber: '#D97706', amberBg: '#FFFBEB',
  red: '#DC2626', redBg: '#FEF2F2',
  purple: '#7C3AED', purpleBg: '#F5F3FF',
  teal: '#0D9488', tealBg: '#F0FDFA',
  coral: '#EA580C', coralBg: '#FFF7ED',
  sidebar: '#1C1B18',
}

const CAT_META = {
  Instagram:  { key: 'ig',  bg: '#FCE7F3', fg: '#9D174D', dot: '#EC4899' },
  TikTok:     { key: 'tt',  bg: '#EFF4FF', fg: '#1D4ED8', dot: '#3B82F6' },
  YouTube:    { key: 'yt',  bg: '#FEF2F2', fg: '#B91C1C', dot: '#EF4444' },
  Artikel:    { key: 'ar',  bg: '#F0FDF4', fg: '#15803D', dot: '#22C55E' },
  Podcast:    { key: 'pk',  bg: '#F5F3FF', fg: '#6D28D9', dot: '#8B5CF6' },
  Event:      { key: 'ev',  bg: '#FFF7ED', fg: '#C2410C', dot: '#F97316' },
}
const ALL_CATS = Object.keys(CAT_META)
const ROLES_LIST = ['Cameraman','Editor Video','Desain Cover','Talent','Penulis','Scripting','Fotografer','Desainer','Presenter','Reporter']
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAYS_SHORT = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
const LOAD_TYPES = [
  { value: 'utama',    label: 'Tugas Utama',   max: 2, desc: 'Maks 2/hari' },
  { value: 'liputan',  label: 'Liputan/Dadakan',max: 1, desc: 'Maks 1/hari' },
  { value: 'event',    label: 'Tugas Event',    max: 1, desc: 'Deadline mingguan' },
]

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_USERS = [
  { id:'u1', name:'Ahmad Fauzi',  email:'manager@tikkim.id',  password:'1234', role:'manager', cats:[], active:true, isIntern:false, startDate:'2023-01-01', endDate:null },
  { id:'u2', name:'Rina Kusuma',  email:'rina@tikkim.id',     password:'1234', role:'pic',     cats:['Instagram','Artikel'], active:true, isIntern:false, startDate:'2023-03-01', endDate:null },
  { id:'u3', name:'Budi Santoso', email:'budi@tikkim.id',     password:'1234', role:'pic',     cats:['TikTok','Podcast'], active:true, isIntern:false, startDate:'2023-03-01', endDate:null },
  { id:'u4', name:'Inul Safitri', email:'inul@tikkim.id',     password:'1234', role:'member',  cats:[], active:true, isIntern:true,  startDate:'2025-02-01', endDate:'2025-07-31' },
  { id:'u5', name:'Redul Hakim',  email:'redul@tikkim.id',    password:'1234', role:'member',  cats:[], active:true, isIntern:true,  startDate:'2025-02-01', endDate:'2025-07-31' },
  { id:'u6', name:'Sinta Dewi',   email:'sinta@tikkim.id',    password:'1234', role:'member',  cats:[], active:true, isIntern:false, startDate:'2024-01-01', endDate:null },
]

const INIT_EVENTS = [
  { id:1, title:'Reels IG — Kenapa Paspor Penting?', cat:'Instagram', loadType:'utama', start:'2025-04-19', end:'2025-04-21', status:'review', pic:'u2', brief:'Buat reels menarik tentang pentingnya paspor bagi traveler pemula.', assignees:[{userId:'u4',role:'Cameraman',status:'review',submitLink:'https://drive.google.com/sample',submitNote:'Raw footage sudah diupload, 12 menit total.'},{userId:'u5',role:'Desain Cover',status:'aktif',submitLink:null,submitNote:null}] },
  { id:2, title:'TikTok — Tips Hemat Belanja Bulanan', cat:'TikTok', loadType:'utama', start:'2025-04-21', end:'2025-04-23', status:'aktif', pic:'u3', brief:'Konten tips hemat yang relatable untuk anak muda.', assignees:[{userId:'u4',role:'Talent',status:'aktif',submitLink:null,submitNote:null},{userId:'u6',role:'Scripting',status:'aktif',submitLink:null,submitNote:null}] },
  { id:3, title:'Artikel: Cara Urus Visa Schengen', cat:'Artikel', loadType:'utama', start:'2025-04-22', end:'2025-04-25', status:'aktif', pic:'u2', brief:'Panduan lengkap pengurusan visa Schengen step by step.', assignees:[{userId:'u5',role:'Penulis',status:'aktif',submitLink:null,submitNote:null}] },
  { id:4, title:'YouTube — Travel Vlog Jepang', cat:'YouTube', loadType:'event', start:'2025-04-23', end:'2025-04-30', status:'aktif', pic:'u3', brief:'Vlog perjalanan Jepang 7 hari, fokus konten kuliner dan budaya.', assignees:[{userId:'u4',role:'Editor Video',status:'aktif',submitLink:null,submitNote:null},{userId:'u5',role:'Desain Cover',status:'aktif',submitLink:null,submitNote:null}] },
  { id:5, title:'Podcast — Eps. 12 Tips Traveling', cat:'Podcast', loadType:'utama', start:'2025-04-17', end:'2025-04-20', status:'revisi', pic:'u3', brief:'Episode podcast dengan narasumber travel blogger.', assignees:[{userId:'u5',role:'Editor Video',status:'revisi',submitLink:'https://drive.google.com/podcast',submitNote:'Sudah diedit, mohon dicek bagian intro.',revisionNote:'Intro terlalu panjang, potong di menit ke-2. Audio bagian tengah kurang jelas.'}] },
  { id:6, title:'IG Story — Promo Event Mei', cat:'Instagram', loadType:'utama', start:'2025-04-24', end:'2025-04-26', status:'aktif', pic:'u2', brief:'Story promosi untuk event offline bulan Mei.', assignees:[{userId:'u5',role:'Desainer',status:'aktif',submitLink:null,submitNote:null}] },
  { id:7, title:'Festival Kuliner Jakarta 2025', cat:'Event', loadType:'event', start:'2025-04-27', end:'2025-05-03', status:'aktif', pic:'u2', brief:'Liputan event festival kuliner tahunan di Jakarta.', assignees:[{userId:'u4',role:'Cameraman',status:'aktif',submitLink:null,submitNote:null},{userId:'u6',role:'Fotografer',status:'aktif',submitLink:null,submitNote:null}] },
  { id:8, title:'TikTok — OOTD Ramadan', cat:'TikTok', loadType:'utama', start:'2025-04-14', end:'2025-04-16', status:'selesai', pic:'u3', brief:'Konten fashion Ramadan yang trending.', assignees:[{userId:'u4',role:'Talent',status:'selesai',submitLink:'https://drive.google.com/ootd',submitNote:'Sudah selesai.'},{userId:'u5',role:'Desainer',status:'selesai',submitLink:'https://drive.google.com/cover',submitNote:'Cover sudah dibuat.'}] },
  { id:9, title:'Artikel: 10 Destinasi Domestik', cat:'Artikel', loadType:'utama', start:'2025-04-28', end:'2025-04-30', status:'aktif', pic:'u2', brief:'Daftar 10 destinasi wisata domestik terbaik 2025.', assignees:[{userId:'u6',role:'Penulis',status:'aktif',submitLink:null,submitNote:null}] },
  { id:10, title:'YouTube — Review Kamera Mirrorless', cat:'YouTube', loadType:'utama', start:'2025-05-02', end:'2025-05-06', status:'aktif', pic:'u3', brief:'Review mendalam kamera mirrorless terbaru untuk content creator.', assignees:[{userId:'u4',role:'Editor Video',status:'aktif',submitLink:null,submitNote:null}] },
  { id:11, title:'Liputan Peluncuran Produk Baru', cat:'Event', loadType:'liputan', start:'2025-04-25', end:'2025-04-25', status:'aktif', pic:'u2', brief:'Liputan dadakan peluncuran produk klien.', assignees:[{userId:'u6',role:'Reporter',status:'aktif',submitLink:null,submitNote:null}] },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function uid() { return 'u' + Date.now() + Math.random().toString(36).slice(2,6) }
function eid() { return Date.now() + Math.floor(Math.random()*1000) }
function today() { return '2025-04-21' }

function getMemberLoad(userId, dateStr, events) {
  const dayEvents = events.filter(e => e.start <= dateStr && e.end >= dateStr)
  const mine = dayEvents.filter(e => e.assignees.some(a => a.userId === userId))
  const utama   = mine.filter(e => e.loadType === 'utama').length
  const liputan  = mine.filter(e => e.loadType === 'liputan').length
  const event    = mine.filter(e => e.loadType === 'event').length
  return { utama, liputan, event }
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Av({ name='?', size=32, color='#E8E6E1' }) {
  const init = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const colors = ['#DBEAFE:#1D4ED8','#D1FAE5:#065F46','#FEE2E2:#991B1B','#FEF3C7:#92400E','#F3E8FF:#6B21A8','#CFFAFE:#155E75','#FCE7F3:#9D174D','#FEF9C3:#854D0E']
  const idx = name.charCodeAt(0) % colors.length
  const [bg,fg] = colors[idx].split(':')
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color:fg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.35,fontWeight:600,flexShrink:0}}>{init}</div>
}

function Chip({ cat }) {
  const m = CAT_META[cat] || { bg:'#F1F0ED', fg:'#5A5854' }
  return <span style={{background:m.bg,color:m.fg,fontSize:10,padding:'2px 7px',borderRadius:4,fontWeight:600,letterSpacing:.3}}>{cat}</span>
}

function LoadTypeBadge({ type }) {
  const styles = { utama:{bg:'#EFF4FF',fg:'#1D4ED8',label:'Utama'}, liputan:{bg:'#FFF7ED',fg:'#C2410C',label:'Liputan'}, event:{bg:'#F5F3FF',fg:'#6D28D9',label:'Event'} }
  const s = styles[type] || styles.utama
  return <span style={{background:s.bg,color:s.fg,fontSize:10,padding:'2px 7px',borderRadius:4,fontWeight:600}}>{s.label}</span>
}

function StatusBadge({ status }) {
  const map = { aktif:{bg:'#EFF4FF',fg:'#1D4ED8'}, review:{bg:'#FFFBEB',fg:'#B45309'}, revisi:{bg:'#FEF2F2',fg:'#B91C1C'}, selesai:{bg:'#F0FDF4',fg:'#15803D'}, draft:{bg:'#F7F6F3',fg:'#6B7280'} }
  const s = map[status] || map.draft
  const label = { aktif:'On Progress', review:'Review', revisi:'Revisi', selesai:'Selesai', draft:'Draft' }[status] || status
  return <span style={{background:s.bg,color:s.fg,fontSize:11,padding:'3px 8px',borderRadius:6,fontWeight:500}}>{label}</span>
}

function StatDot({ status }) {
  const colors = { aktif:'#3B82F6', review:'#F59E0B', revisi:'#EF4444', selesai:'#22C55E' }
  return <div style={{width:7,height:7,borderRadius:'50%',background:colors[status]||'#9CA3AF',flexShrink:0}}/>
}

function Btn({ onClick, children, variant='default', size='md', style={} }) {
  const base = { cursor:'pointer', border:'none', borderRadius:8, fontWeight:500, transition:'opacity .15s', fontFamily:'inherit' }
  const variants = {
    default: { background:'transparent', color:C.text, border:`0.5px solid ${C.border}` },
    primary: { background:C.sidebar, color:'#fff' },
    danger:  { background:'transparent', color:C.red, border:`0.5px solid ${C.red}` },
    ghost:   { background:'transparent', color:C.muted, border:'none' },
  }
  const sizes = { sm:{ padding:'4px 10px', fontSize:12 }, md:{ padding:'7px 14px', fontSize:13 }, lg:{ padding:'10px 20px', fontSize:14 } }
  return <button onClick={onClick} style={{...base,...variants[variant],...sizes[size],...style}}>{children}</button>
}

function Input({ label, value, onChange, type='text', placeholder='', required=false }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{label}{required && <span style={{color:C.red}}> *</span>}</div>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:'100%',padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.text,background:'white',boxSizing:'border-box',outline:'none',fontFamily:'inherit'}} />
    </div>
  )
}

function Select({ label, value, onChange, options=[], required=false }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{label}{required && <span style={{color:C.red}}> *</span>}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:'100%',padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.text,background:'white',boxSizing:'border-box',fontFamily:'inherit'}}>
        {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  )
}

function Card({ children, style={} }) {
  return <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:16,...style}}>{children}</div>
}

function SectionTitle({ children }) {
  return <div style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:.8,marginBottom:10,paddingBottom:6,borderBottom:`0.5px solid ${C.border}`}}>{children.toUpperCase()}</div>
}

function Toast({ msg, onClose }) {
  useEffect(()=>{ if(msg){ const t=setTimeout(onClose,2800); return()=>clearTimeout(t) } },[msg])
  if(!msg) return null
  return <div style={{position:'fixed',bottom:24,right:24,background:C.sidebar,color:'#fff',padding:'11px 18px',borderRadius:10,fontSize:13,fontWeight:500,zIndex:9999,boxShadow:'0 4px 24px rgba(0,0,0,.18)'}}>{msg}</div>
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ user, users, activePage, onNav, onLogout }) {
  const isMgr = user.role==='manager', isPIC = user.role==='pic', isMember = user.role==='member'
  const navGroups = [
    { section:null, items:[
      { id:'calendar',  label:'Kalender' },
      { id:'dashboard', label:'Dashboard' },
    ]},
    { section:'Konten', items:[
      { id:'mywork',   label: isMgr?'Semua Konten': isPIC?'Konten Saya':'Tugas Saya', show:true },
      { id:'delegate', label:'Buat & Delegasi', show: isPIC||isMgr },
      { id:'review',   label:'Review Konten',   show: isPIC||isMgr },
      { id:'submit',   label:'Submit Konten',   show: isMember },
    ].filter(n=>n.show!==false)},
    { section:'Kelola', items:[
      { id:'stats',  label:'Statistik',        show: isMgr||isPIC },
      { id:'users',  label:'Manajemen User',   show: isMgr },
    ].filter(n=>n.show!==false)},
  ]

  return (
    <div style={{width:210,flexShrink:0,background:C.sidebar,display:'flex',flexDirection:'column',padding:'0 0 16px'}}>
      {/* Logo */}
      <div style={{padding:'20px 20px 16px',borderBottom:`1px solid rgba(255,255,255,.08)`}}>
        <div style={{fontSize:22,fontWeight:800,color:'#fff',letterSpacing:-1}}>TIKKIM</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:2,fontWeight:500}}>
          {isMgr?'Manager':isPIC?`PIC · ${(user.cats||[]).join(', ')}`:'Tim Produksi'}
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
        {navGroups.map((g,gi)=>(
          <div key={gi}>
            {g.section && <div style={{fontSize:9,color:'rgba(255,255,255,.3)',fontWeight:700,letterSpacing:1.2,padding:'12px 20px 4px'}}>{g.section.toUpperCase()}</div>}
            {g.items.map(n=>(
              <div key={n.id} onClick={()=>onNav(n.id)}
                style={{padding:'8px 20px',fontSize:13,cursor:'pointer',color: activePage===n.id?'#fff':'rgba(255,255,255,.55)',background: activePage===n.id?'rgba(255,255,255,.1)':'transparent',fontWeight: activePage===n.id?600:400,transition:'all .15s',borderRight: activePage===n.id?'2px solid #fff':'2px solid transparent'}}>
                {n.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{padding:'12px 16px',borderTop:`1px solid rgba(255,255,255,.08)`,margin:'0 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <Av name={user.name} size={28}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout}
          style={{width:'100%',padding:'5px 0',fontSize:11,border:'0.5px solid rgba(255,255,255,.2)',borderRadius:7,background:'transparent',color:'rgba(255,255,255,.6)',cursor:'pointer',fontFamily:'inherit'}}>
          Keluar
        </button>
      </div>
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin }) {
  const [email,setEmail]=useState(''), [pass,setPass]=useState(''), [err,setErr]=useState('')
  function doLogin() {
    const u=users.find(u=>u.email===email.trim().toLowerCase()&&u.password===pass&&u.active)
    if(!u){setErr('Email atau password salah, atau akun tidak aktif.');return}
    onLogin(u)
  }
  const demos=[['manager@tikkim.id','Manager'],['rina@tikkim.id','PIC Instagram'],['budi@tikkim.id','PIC TikTok'],['inul@tikkim.id','Tim Produksi'],['redul@tikkim.id','Tim Produksi']]
  return (
    <div style={{display:'flex',minHeight:'100vh',background:C.bg}}>
      <div style={{width:420,background:C.sidebar,display:'flex',flexDirection:'column',justifyContent:'center',padding:48}}>
        <div style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:-2,marginBottom:4}}>TIKKIM</div>
        <div style={{fontSize:14,color:'rgba(255,255,255,.45)',marginBottom:40}}>Content Production Manager</div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:5}}>Email</div>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr('')}} placeholder="email@tikkim.id" onKeyDown={e=>e.key==='Enter'&&doLogin()}
            style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.08)',border:`1px solid rgba(255,255,255,.12)`,borderRadius:9,fontSize:13,color:'#fff',boxSizing:'border-box',fontFamily:'inherit',outline:'none'}}/>
        </div>
        <div style={{marginBottom:6}}>
          <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:5}}>Password</div>
          <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr('')}} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&doLogin()}
            style={{width:'100%',padding:'10px 12px',background:'rgba(255,255,255,.08)',border:`1px solid rgba(255,255,255,.12)`,borderRadius:9,fontSize:13,color:'#fff',boxSizing:'border-box',fontFamily:'inherit',outline:'none'}}/>
        </div>
        {err&&<div style={{fontSize:12,color:'#FCA5A5',marginBottom:8}}>{err}</div>}
        <button onClick={doLogin} style={{width:'100%',padding:'11px 0',background:'#fff',color:C.sidebar,border:'none',borderRadius:9,fontSize:14,fontWeight:700,cursor:'pointer',marginTop:8,fontFamily:'inherit'}}>Masuk</button>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:48}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:6}}>Login cepat</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Password semua akun demo: <code style={{background:C.border,padding:'2px 6px',borderRadius:4}}>1234</code></div>
        <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:360}}>
          {demos.map(([e,label])=>(
            <button key={e} onClick={()=>{setEmail(e);setPass('1234');setTimeout(()=>{const u=users.find(x=>x.email===e);if(u)onLogin(u)},80)}}
              style={{textAlign:'left',padding:'10px 14px',border:`0.5px solid ${C.border}`,borderRadius:9,background:C.card,cursor:'pointer',fontFamily:'inherit',fontSize:13}}>
              <span style={{color:C.text,fontWeight:500}}>{e}</span>
              <span style={{float:'right',fontSize:11,color:C.muted,marginTop:1}}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
function CalendarPage({ user, users, events, setEvents, onNav, onToast }) {
  const [yr,setYr]=useState(2025), [mo,setMo]=useState(3)
  const [filters,setFilters]=useState(new Set(ALL_CATS))
  const [selectedDate,setSelectedDate]=useState(null)
  const [selectedEvent,setSelectedEvent]=useState(null)
  const [view,setView]=useState('month')

  function visibleEvents() {
    let evs = events.filter(e=>filters.has(e.cat))
    if(user.role==='pic') evs=evs.filter(e=>e.pic===user.id)
    if(user.role==='member') evs=evs.filter(e=>e.assignees.some(a=>a.userId===user.id))
    return evs
  }

  function eventsOnDate(ds) {
    return visibleEvents().filter(e=>e.start<=ds&&e.end>=ds)
  }

  function navMo(dir) {
    setMo(m=>{let n=m+dir;if(n>11){setYr(y=>y+1);return 0}if(n<0){setYr(y=>y-1);return 11}return n})
  }

  function renderMonthGrid() {
    const first=new Date(yr,mo,1).getDay()
    const dim=new Date(yr,mo+1,0).getDate()
    const prev=new Date(yr,mo,0).getDate()
    const cells=[]
    for(let i=0;i<first;i++) cells.push({d:prev-first+1+i,cur:false})
    for(let d=1;d<=dim;d++) cells.push({d,cur:true})
    const rem=(7-cells.length%7)%7
    for(let i=1;i<=rem;i++) cells.push({d:i,cur:false})
    return cells
  }

  const cells = renderMonthGrid()

  function getMonthList() {
    const ms=`${yr}-${String(mo+1).padStart(2,'0')}`
    return visibleEvents().filter(e=>e.start.startsWith(ms)||e.end.startsWith(ms)).sort((a,b)=>a.start.localeCompare(b.start))
  }

  const userName = uid => users.find(u=>u.id===uid)?.name || uid

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <div>
          <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5}}>Kalender Produksi</div>
          <div style={{fontSize:13,color:C.muted,marginTop:2}}>Jadwal konten tim TIKKIM</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          {['month','list'].map(v=>(
            <Btn key={v} variant={view===v?'primary':'default'} size="sm" onClick={()=>setView(v)}>
              {v==='month'?'Bulan':'List'}
            </Btn>
          ))}
          {(user.role==='pic'||user.role==='manager')&&
            <Btn variant="primary" size="sm" onClick={()=>onNav('delegate')}>+ Buat Konten</Btn>}
        </div>
      </div>

      {/* Category filters */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16,alignItems:'center'}}>
        <span style={{fontSize:12,color:C.muted,marginRight:2}}>Kategori:</span>
        {ALL_CATS.map(cat=>{
          const m=CAT_META[cat], on=filters.has(cat)
          return <button key={cat} onClick={()=>setFilters(prev=>{const n=new Set(prev);on?(n.size>1&&n.delete(cat)):n.add(cat);return n})}
            style={{padding:'3px 10px',borderRadius:12,fontSize:11,border:`1px solid ${on?m.fg:C.border}`,background:on?m.bg:'transparent',color:on?m.fg:C.muted,cursor:'pointer',fontWeight:on?600:400,fontFamily:'inherit'}}>{cat}</button>
        })}
      </div>

      {view==='month'?(
        <Card style={{padding:0,overflow:'hidden'}}>
          {/* Header */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderBottom:`0.5px solid ${C.border}`}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button onClick={()=>navMo(-1)} style={{width:28,height:28,borderRadius:8,border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>‹</button>
              <div style={{fontSize:15,fontWeight:600,minWidth:140,textAlign:'center'}}>{MONTHS[mo]} {yr}</div>
              <button onClick={()=>navMo(1)} style={{width:28,height:28,borderRadius:8,border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>›</button>
            </div>
            <Btn size="sm" onClick={()=>{setYr(2025);setMo(3)}}>Hari ini</Btn>
          </div>
          {/* Day headers */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`0.5px solid ${C.border}`}}>
            {DAYS_SHORT.map(d=><div key={d} style={{textAlign:'center',padding:'8px 4px',fontSize:11,color:C.muted,fontWeight:600}}>{d}</div>)}
          </div>
          {/* Cells */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
            {cells.map((cell,idx)=>{
              const ds=cell.cur?`${yr}-${String(mo+1).padStart(2,'0')}-${String(cell.d).padStart(2,'0')}`:null
              const dayEvs=ds?eventsOnDate(ds):[]
              const isToday=ds==='2025-04-21', isSel=ds===selectedDate
              return (
                <div key={idx} onClick={()=>{if(ds&&dayEvs.length>0){setSelectedDate(ds);setSelectedEvent(null)}}}
                  style={{minHeight:88,padding:4,borderRight:`0.5px solid ${C.border}`,borderBottom:`0.5px solid ${C.border}`,opacity:cell.cur?1:.35,background:isSel?'#FFFBEB':isToday?'#EFF4FF':'white',cursor:ds&&dayEvs.length>0?'pointer':'default',transition:'background .1s'}}
                  onMouseEnter={e=>{if(ds&&dayEvs.length>0)e.currentTarget.style.background='#F7F6F3'}}
                  onMouseLeave={e=>{e.currentTarget.style.background=isSel?'#FFFBEB':isToday?'#EFF4FF':'white'}}>
                  <div style={{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:isToday?700:500,borderRadius:'50%',background:isToday?C.sidebar:'transparent',color:isToday?'#fff':C.text,marginBottom:3}}>{cell.d}</div>
                  {dayEvs.slice(0,2).map(ev=>{
                    const m=CAT_META[ev.cat]||{}
                    return <div key={ev.id} style={{fontSize:9,padding:'1px 5px',borderRadius:3,marginBottom:2,background:m.bg||'#eee',color:m.fg||'#333',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:600,cursor:'pointer'}} onClick={e=>{e.stopPropagation();setSelectedEvent(ev);setSelectedDate(null)}}>{ev.title}</div>
                  })}
                  {dayEvs.length>2&&<div style={{fontSize:9,color:C.muted,fontWeight:500}}>+{dayEvs.length-2} lagi</div>}
                </div>
              )
            })}
          </div>
        </Card>
      ):(
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button onClick={()=>navMo(-1)} style={{width:28,height:28,borderRadius:8,border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>‹</button>
              <div style={{fontSize:14,fontWeight:600}}>{MONTHS[mo]} {yr}</div>
              <button onClick={()=>navMo(1)} style={{width:28,height:28,borderRadius:8,border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>›</button>
            </div>
          </div>
          {getMonthList().length===0&&<div style={{fontSize:13,color:C.muted,padding:'8px 0'}}>Tidak ada konten di bulan ini.</div>}
          {getMonthList().map(ev=>(
            <div key={ev.id} onClick={()=>setSelectedEvent(ev)} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 0',borderBottom:`0.5px solid ${C.border}`,cursor:'pointer'}}>
              <div style={{width:3,height:40,borderRadius:2,background:CAT_META[ev.cat]?.dot||'#ccc',flexShrink:0,marginTop:2}}/>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
                  <Chip cat={ev.cat}/><LoadTypeBadge type={ev.loadType}/>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>{ev.title}</span>
                </div>
                <div style={{fontSize:11,color:C.muted}}>PIC: {userName(ev.pic)} · {ev.start} → {ev.end} · {ev.assignees.map(a=>userName(a.userId)+' ('+a.role+')').join(', ')}</div>
              </div>
              <StatusBadge status={ev.status}/>
            </div>
          ))}
        </Card>
      )}

      {/* Date tasks panel */}
      {selectedDate && (
        <div style={{position:'fixed',top:0,right:0,width:340,height:'100%',background:'white',borderLeft:`0.5px solid ${C.border}`,zIndex:200,padding:20,overflowY:'auto',boxShadow:'-4px 0 24px rgba(0,0,0,.08)'}}>
          <button onClick={()=>setSelectedDate(null)} style={{position:'absolute',top:14,right:14,width:28,height:28,borderRadius:'50%',border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>×</button>
          <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>{selectedDate}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>{eventsOnDate(selectedDate).length} konten pada tanggal ini</div>
          {eventsOnDate(selectedDate).map(ev=>(
            <div key={ev.id} onClick={()=>{setSelectedEvent(ev);setSelectedDate(null)}} style={{border:`0.5px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:8,cursor:'pointer',background:C.bg}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                <Chip cat={ev.cat}/><LoadTypeBadge type={ev.loadType}/>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:4}}>{ev.title}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Deadline: {ev.end}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {ev.assignees.map((a,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:4,background:'white',border:`0.5px solid ${C.border}`,borderRadius:6,padding:'3px 8px'}}>
                    <StatDot status={a.status}/>
                    <span style={{fontSize:11,color:C.text}}>{userName(a.userId)}</span>
                    <span style={{fontSize:10,color:C.muted}}>({a.role})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event detail panel */}
      {selectedEvent && (
        <div style={{position:'fixed',top:0,right:0,width:340,height:'100%',background:'white',borderLeft:`0.5px solid ${C.border}`,zIndex:200,padding:20,overflowY:'auto',boxShadow:'-4px 0 24px rgba(0,0,0,.08)'}}>
          <button onClick={()=>setSelectedEvent(null)} style={{position:'absolute',top:14,right:14,width:28,height:28,borderRadius:'50%',border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>×</button>
          <div style={{marginBottom:10}}>
            <Chip cat={selectedEvent.cat}/>
            {' '}<LoadTypeBadge type={selectedEvent.loadType}/>
          </div>
          <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:6,lineHeight:1.4}}>{selectedEvent.title}</div>
          <StatusBadge status={selectedEvent.status}/>
          <div style={{marginTop:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:3}}>PIC</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{userName(selectedEvent.pic)}</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:3}}>Jadwal</div>
            <div style={{fontSize:13,marginBottom:12}}>{selectedEvent.start} → {selectedEvent.end}</div>
            {selectedEvent.brief&&<><div style={{fontSize:11,color:C.muted,marginBottom:3}}>Brief</div><div style={{fontSize:12,color:C.text,marginBottom:12,lineHeight:1.6,background:C.bg,padding:'8px 10px',borderRadius:8}}>{selectedEvent.brief}</div></>}
            <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Assignee</div>
            {selectedEvent.assignees.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 0',borderBottom:`0.5px solid ${C.border}`}}>
                <Av name={userName(a.userId)} size={26}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600}}>{userName(a.userId)}</div>
                  <div style={{fontSize:11,color:C.muted}}>{a.role}</div>
                </div>
                <StatDot status={a.status}/>
                <span style={{fontSize:11,color:C.muted}}>{a.status}</span>
              </div>
            ))}
          </div>
          {user.role==='member'&&selectedEvent.status==='aktif'&&selectedEvent.assignees.some(a=>a.userId===user.id)&&(
            <Btn variant="primary" style={{width:'100%',marginTop:16}} onClick={()=>{setSelectedEvent(null);onNav('submit')}}>Submit Hasil</Btn>
          )}
          {(user.role==='pic'||user.role==='manager')&&selectedEvent.status==='review'&&(
            <Btn variant="primary" style={{width:'100%',marginTop:16}} onClick={()=>{setSelectedEvent(null);onNav('review')}}>Review Submit</Btn>
          )}
        </div>
      )}
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ user, users, events, onNav }) {
  function myEvents() {
    if(user.role==='manager') return events
    if(user.role==='pic') return events.filter(e=>e.pic===user.id)
    return events.filter(e=>e.assignees.some(a=>a.userId===user.id))
  }
  const evs=myEvents()
  const aktif=evs.filter(e=>e.status==='aktif').length
  const review=evs.filter(e=>e.status==='review').length
  const revisi=evs.filter(e=>e.status==='revisi').length
  const selesai=evs.filter(e=>e.status==='selesai').length
  const userName=uid=>users.find(u=>u.id===uid)?.name||uid
  const upcoming=evs.filter(e=>{const d=new Date(e.end),t=new Date(today()),diff=(d-t)/86400000;return diff>=0&&diff<=7&&e.status!=='selesai'}).sort((a,b)=>a.end.localeCompare(b.end))

  const metrics=[['Aktif',aktif,'#EFF4FF','#1D4ED8'],['Review',review,'#FFFBEB','#B45309'],['Revisi',revisi,'#FEF2F2','#B91C1C'],['Selesai',selesai,'#F0FDF4','#15803D']]

  // load info for members
  const myLoad = user.role==='member' ? getMemberLoad(user.id, today(), events) : null

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>
        {user.role==='manager'?'Dashboard Manager':`Halo, ${user.name.split(' ')[0]}!`}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Senin, 21 April 2025</div>

      {/* Metrics */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {metrics.map(([label,val,bg,fg])=>(
          <div key={label} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{label}</div>
            <div style={{fontSize:26,fontWeight:700,color:fg}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Member load info */}
      {myLoad && (
        <Card style={{marginBottom:16}}>
          <SectionTitle>Beban Tugasmu Hari Ini</SectionTitle>
          <div style={{display:'flex',gap:12}}>
            {LOAD_TYPES.map(lt=>{
              const used=myLoad[lt.value], full=used>=lt.max
              return (
                <div key={lt.value} style={{flex:1,background:full?'#FEF2F2':C.bg,border:`0.5px solid ${full?C.red:C.border}`,borderRadius:9,padding:'10px 12px'}}>
                  <div style={{fontSize:11,color:full?C.red:C.muted,fontWeight:600,marginBottom:4}}>{lt.label}</div>
                  <div style={{fontSize:20,fontWeight:700,color:full?C.red:C.text}}>{used}<span style={{fontSize:12,color:C.muted,fontWeight:400}}>/{lt.max}</span></div>
                  <div style={{display:'flex',gap:3,marginTop:6}}>
                    {Array.from({length:lt.max}).map((_,i)=>(
                      <div key={i} style={{height:4,flex:1,borderRadius:2,background:i<used?C.accent:C.border}}/>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Upcoming deadlines */}
      <Card>
        <SectionTitle>Deadline Minggu Ini</SectionTitle>
        {upcoming.length===0&&<div style={{fontSize:13,color:C.muted}}>Tidak ada konten deadline minggu ini.</div>}
        {upcoming.map(ev=>(
          <div key={ev.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:`0.5px solid ${C.border}`}}>
            <div style={{width:3,height:36,borderRadius:2,background:CAT_META[ev.cat]?.dot||'#ccc',flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>{ev.title}</div>
              <div style={{fontSize:11,color:C.muted}}>Deadline: {ev.end} · PIC: {userName(ev.pic)}</div>
            </div>
            <StatusBadge status={ev.status}/>
          </div>
        ))}
      </Card>

      {/* Review alert for PIC/Manager */}
      {(user.role==='pic'||user.role==='manager')&&review>0&&(
        <div style={{background:'#FFFBEB',border:`0.5px solid #FCD34D`,borderRadius:10,padding:'12px 14px',display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>onNav('review')}>
          <div style={{width:8,height:8,borderRadius:'50%',background:C.amber,flexShrink:0}}/>
          <div style={{fontSize:13,color:'#92400E',fontWeight:500}}>{review} konten menunggu reviewmu → Buka Review Konten</div>
        </div>
      )}
    </div>
  )
}

// ─── MY WORK ──────────────────────────────────────────────────────────────────
function MyWorkPage({ user, users, events, onNav }) {
  const [tab,setTab]=useState('semua')
  const userName=uid=>users.find(u=>u.id===uid)?.name||uid

  function myEvents() {
    if(user.role==='manager') return events
    if(user.role==='pic') return events.filter(e=>e.pic===user.id)
    return events.filter(e=>e.assignees.some(a=>a.userId===user.id))
  }

  const statuses=['semua','aktif','review','revisi','selesai']
  const filtered = myEvents().filter(e=>tab==='semua'||e.status===tab)
    .sort((a,b)=>a.end.localeCompare(b.end))

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>
        {user.role==='manager'?'Semua Konten':user.role==='pic'?'Konten Saya':'Tugas Saya'}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>
        {user.role==='pic'?`Kategori: ${(user.cats||[]).join(', ')}`:'Semua penugasan'}
      </div>
      <div style={{display:'flex',gap:0,borderBottom:`0.5px solid ${C.border}`,marginBottom:16}}>
        {statuses.map(s=>(
          <div key={s} onClick={()=>setTab(s)}
            style={{padding:'8px 16px',fontSize:13,cursor:'pointer',color:tab===s?C.text:C.muted,borderBottom:`2px solid ${tab===s?C.sidebar:'transparent'}`,fontWeight:tab===s?600:400,marginBottom:-0.5,textTransform:'capitalize'}}>
            {s==='semua'?'Semua':s}
          </div>
        ))}
      </div>
      {filtered.length===0&&<div style={{fontSize:13,color:C.muted,padding:'20px 0'}}>Tidak ada konten.</div>}
      {filtered.map(ev=>{
        const myRole=ev.assignees.find(a=>a.userId===user.id)
        const myA=myRole
        return (
          <div key={ev.id} style={{background:C.card,border:`0.5px solid ${ev.status==='revisi'?C.red:C.border}`,borderLeft:`3px solid ${ev.status==='revisi'?C.red:CAT_META[ev.cat]?.dot||C.border}`,borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5,flexWrap:'wrap'}}>
                  <Chip cat={ev.cat}/><LoadTypeBadge type={ev.loadType}/>
                  <span style={{fontSize:14,fontWeight:700,color:C.text}}>{ev.title}</span>
                </div>
                {myRole&&<div style={{fontSize:12,color:C.muted,marginBottom:3}}>Peranmu: <strong style={{fontWeight:600,color:C.text}}>{myRole.role}</strong></div>}
                <div style={{fontSize:12,color:C.muted}}>PIC: {userName(ev.pic)} · Deadline: {ev.end}</div>
                {user.role!=='member'&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{ev.assignees.map(a=>userName(a.userId)+' ('+a.role+')').join(', ')}</div>}
                {ev.status==='revisi'&&myA?.revisionNote&&(
                  <div style={{background:'#FEF2F2',border:`0.5px solid #FECACA`,borderRadius:8,padding:'8px 10px',fontSize:12,color:C.red,marginTop:8}}>
                    <strong style={{fontWeight:600}}>Catatan PIC:</strong> {myA.revisionNote}
                  </div>
                )}
              </div>
              <StatusBadge status={ev.status}/>
            </div>
            {user.role==='member'&&(ev.status==='aktif'||ev.status==='revisi')&&(
              <div style={{marginTop:10}}>
                <Btn variant="primary" size="sm" onClick={()=>onNav('submit')}>
                  {ev.status==='revisi'?'Submit Ulang':'Submit Hasil'}
                </Btn>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── SUBMIT ───────────────────────────────────────────────────────────────────
function SubmitPage({ user, users, events, setEvents, onNav, onToast }) {
  const [task,setTask]=useState(''), [link,setLink]=useState(''), [note,setNote]=useState(''), [statusVal,setStatusVal]=useState('done')
  const myTasks=events.filter(e=>e.assignees.some(a=>a.userId===user.id)&&(e.status==='aktif'||e.status==='revisi'))
  const userName=uid=>users.find(u=>u.id===uid)?.name||uid
  const sel=myTasks.find(e=>String(e.id)===task)

  function doSubmit() {
    if(!task){onToast('Pilih tugas terlebih dahulu!');return}
    if(!link){onToast('Masukkan link hasil kerja!');return}
    setEvents(evs=>evs.map(e=>{
      if(String(e.id)!==task) return e
      return {...e, status:'review', assignees:e.assignees.map(a=>a.userId===user.id?{...a,status:'review',submitLink:link,submitNote:note}:a)}
    }))
    onToast('Submit berhasil! PIC akan mereview segera.')
    setTask('');setLink('');setNote('')
    setTimeout(()=>onNav('mywork'),1200)
  }

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>Submit Konten</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Kirim hasil kerja ke PIC untuk direview</div>
      <Card style={{maxWidth:560}}>
        <Select label="Pilih Tugas" value={task} onChange={setTask} required
          options={[{value:'',label:'Pilih tugas...'}, ...myTasks.map(e=>{
            const r=e.assignees.find(a=>a.userId===user.id)
            return {value:String(e.id), label:`${e.title} (${r?.role})${e.status==='revisi'?' · REVISI':''}`}
          })]}/>
        {sel&&<div style={{background:C.bg,borderRadius:8,padding:'10px 12px',marginBottom:12,fontSize:12,color:C.muted}}>
          PIC: {userName(sel.pic)} · Deadline: {sel.end} · {sel.cat}
          {sel.brief&&<div style={{marginTop:4,color:C.text}}>Brief: {sel.brief}</div>}
        </div>}
        <Input label="Link Hasil Kerja" value={link} onChange={setLink} required placeholder="Google Drive, Figma, Notion, YouTube..."/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Catatan untuk PIC</div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Jelaskan apa yang dikerjakan, kendala, atau hal yang perlu diperhatikan..."
            style={{width:'100%',padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,resize:'vertical',boxSizing:'border-box',fontFamily:'inherit',color:C.text,outline:'none'}}/>
        </div>
        <Select label="Status Pengerjaan" value={statusVal} onChange={setStatusVal}
          options={[{value:'done',label:'Selesai — siap direview'},{value:'draft',label:'Draft — minta feedback awal'},{value:'partial',label:'Sebagian — masih dikerjakan'}]}/>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:4}}>
          <Btn onClick={()=>onNav('mywork')}>Batal</Btn>
          <Btn variant="primary" onClick={doSubmit}>Kirim ke PIC</Btn>
        </div>
      </Card>
    </div>
  )
}

// ─── DELEGATE ─────────────────────────────────────────────────────────────────
function DelegatePage({ user, users, events, setEvents, onNav, onToast }) {
  const [title,setTitle]=useState(''), [cat,setCat]=useState('Instagram')
  const [loadType,setLoadType]=useState('utama')
  const [start,setStart]=useState(today()), [end,setEnd]=useState('2025-04-28')
  const [brief,setBrief]=useState('')
  const [rows,setRows]=useState([{userId:'',role:''}])
  const [loadWarn,setLoadWarn]=useState({})

  const activeMembers=users.filter(u=>u.active&&(u.role==='member'||u.role==='pic'||u.role==='manager'))
  const picId = user.role==='manager'?rows[0]?.userId:user.id
  const userName=uid=>users.find(u=>u.id===uid)?.name||uid

  // Only PIC can assign their cats; managers can assign any cat
  const availCats = user.role==='manager' ? ALL_CATS : (user.cats||[])

  function updateRow(i,field,val) {
    setRows(r=>r.map((row,idx)=>{
      if(idx!==i) return row
      const updated={...row,[field]:val}
      if(field==='userId'&&val) {
        const load=getMemberLoad(val,start,events)
        const lt=LOAD_TYPES.find(l=>l.value===loadType)
        if(lt&&load[loadType]>=lt.max) {
          setLoadWarn(w=>({...w,[i]:`${userName(val)} sudah penuh untuk slot ${lt.label} hari ini (${load[loadType]}/${lt.max})`}))
        } else setLoadWarn(w=>{const n={...w};delete n[i];return n})
      }
      return updated
    }))
  }

  function doSubmit() {
    if(!title.trim()){onToast('Isi judul konten!');return}
    const valid=rows.filter(r=>r.userId&&r.role)
    if(valid.length===0){onToast('Tambahkan minimal satu penugasan!');return}
    const newEv={
      id:eid(), title:title.trim(), cat, loadType, start, end, brief, status:'aktif',
      pic: user.role==='manager'?(user.id):user.id,
      assignees:valid.map(r=>({userId:r.userId,role:r.role,status:'aktif',submitLink:null,submitNote:null}))
    }
    setEvents(ev=>[...ev,newEv])
    onToast('Konten dibuat & notifikasi terkirim ke tim!')
    setTitle('');setBrief('');setRows([{userId:'',role:''}])
    setTimeout(()=>onNav('calendar'),1200)
  }

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>Buat Konten & Delegasi</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Buat konten baru dan tentukan siapa mengerjakan apa</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:800}}>
        <Card>
          <SectionTitle>Detail Konten</SectionTitle>
          <Input label="Judul Konten" value={title} onChange={setTitle} required placeholder="Contoh: Reels IG — Tips Traveling Hemat"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Select label="Kategori" value={cat} onChange={setCat} required options={availCats.map(c=>({value:c,label:c}))}/>
            <Select label="Jenis Tugas" value={loadType} onChange={setLoadType} required
              options={LOAD_TYPES.map(l=>({value:l.value,label:`${l.label} (${l.desc})`}))}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Input label="Tanggal Mulai" value={start} onChange={setStart} type="date" required/>
            <Input label="Deadline" value={end} onChange={setEnd} type="date" required/>
          </div>
          <div>
            <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Brief / Deskripsi</div>
            <textarea value={brief} onChange={e=>setBrief(e.target.value)} rows={3} placeholder="Konsep, referensi, hal penting untuk tim..."
              style={{width:'100%',padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,resize:'vertical',boxSizing:'border-box',fontFamily:'inherit',color:C.text,outline:'none'}}/>
          </div>
        </Card>

        <Card>
          <SectionTitle>Penugasan Tim</SectionTitle>
          <div style={{fontSize:12,color:C.muted,marginBottom:12}}>Satu konten bisa dikerjakan beberapa orang dengan peran berbeda. Sistem akan memperingatkan jika slot penuh.</div>
          {rows.map((row,i)=>(
            <div key={i}>
              <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:4}}>
                <select value={row.userId} onChange={e=>updateRow(i,'userId',e.target.value)}
                  style={{flex:1,padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:'inherit',color:C.text}}>
                  <option value="">Pilih orang...</option>
                  {activeMembers.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <select value={row.role} onChange={e=>updateRow(i,'role',e.target.value)}
                  style={{flex:1,padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:'inherit',color:C.text}}>
                  <option value="">Pilih peran...</option>
                  {ROLES_LIST.map(r=><option key={r}>{r}</option>)}
                </select>
                {rows.length>1&&<button onClick={()=>setRows(r=>r.filter((_,idx)=>idx!==i))} style={{width:28,height:36,borderRadius:8,border:`0.5px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>×</button>}
              </div>
              {loadWarn[i]&&<div style={{fontSize:11,color:C.amber,background:'#FFFBEB',borderRadius:6,padding:'5px 8px',marginBottom:6}}>⚠ {loadWarn[i]}</div>}
            </div>
          ))}
          <button onClick={()=>setRows(r=>[...r,{userId:'',role:''}])}
            style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',border:`1px dashed ${C.border}`,borderRadius:8,cursor:'pointer',fontSize:12,color:C.muted,background:'transparent',fontFamily:'inherit',marginBottom:12}}>
            + Tambah penugasan
          </button>
          <div style={{borderTop:`0.5px solid ${C.border}`,paddingTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
            <Btn onClick={()=>onNav('calendar')}>Batal</Btn>
            <Btn variant="primary" onClick={doSubmit}>Buat & Kirim Notifikasi</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── REVIEW ───────────────────────────────────────────────────────────────────
function ReviewPage({ user, users, events, setEvents, onToast }) {
  const [notes,setNotes]=useState({})
  const [processed,setProcessed]=useState({})
  const userName=uid=>users.find(u=>u.id===uid)?.name||uid

  // PIC only sees their category; manager sees all
  const toReview=events.filter(e=>{
    if(user.role==='pic') return e.pic===user.id && e.assignees.some(a=>a.status==='review')
    if(user.role==='manager') return e.assignees.some(a=>a.status==='review')
    return false
  })

  function doApprove(evId, assigneeUserId) {
    setEvents(evs=>evs.map(e=>{
      if(e.id!==evId) return e
      const newA=e.assignees.map(a=>a.userId===assigneeUserId?{...a,status:'selesai'}:a)
      const allDone=newA.every(a=>a.status==='selesai')
      return {...e, assignees:newA, status:allDone?'selesai':e.status}
    }))
    setProcessed(p=>({...p,[`${evId}-${assigneeUserId}`]:'approved'}))
    onToast('Approved! Notifikasi terkirim.')
  }

  function doRevision(evId, assigneeUserId) {
    const key=`${evId}-${assigneeUserId}`
    if(!notes[key]){onToast('Tulis catatan revisi dulu!');return}
    setEvents(evs=>evs.map(e=>{
      if(e.id!==evId) return e
      return {...e, status:'revisi', assignees:e.assignees.map(a=>a.userId===assigneeUserId?{...a,status:'revisi',revisionNote:notes[key]}:a)}
    }))
    setProcessed(p=>({...p,[key]:'revision'}))
    onToast('Catatan revisi dikirim ke anggota!')
  }

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>Review Konten</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Konten yang disubmit tim — lihat hasil, approve, atau beri feedback revisi</div>
      {toReview.length===0&&<Card><div style={{fontSize:13,color:C.muted,padding:'8px 0'}}>Tidak ada konten yang perlu direview saat ini.</div></Card>}
      {toReview.map(ev=>(
        <Card key={ev.id} style={{borderLeft:`3px solid ${CAT_META[ev.cat]?.dot||C.border}`}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:12}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5,flexWrap:'wrap'}}>
                <Chip cat={ev.cat}/><LoadTypeBadge type={ev.loadType}/>
              </div>
              <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:3}}>{ev.title}</div>
              <div style={{fontSize:12,color:C.muted}}>PIC: {userName(ev.pic)} · Deadline: {ev.end}</div>
            </div>
            <StatusBadge status={ev.status}/>
          </div>

          {ev.assignees.filter(a=>a.status==='review').map(a=>{
            const key=`${ev.id}-${a.userId}`
            const done=processed[key]
            return (
              <div key={a.userId} style={{background:C.bg,borderRadius:10,padding:14,marginBottom:8,border:`0.5px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <Av name={userName(a.userId)} size={30}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{userName(a.userId)}</div>
                    <div style={{fontSize:11,color:C.muted}}>Peran: {a.role}</div>
                  </div>
                  <div style={{marginLeft:'auto'}}><StatusBadge status={a.status}/></div>
                </div>
                {a.submitLink&&(
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:3}}>Link Submit</div>
                    <a href={a.submitLink} target="_blank" rel="noreferrer"
                      style={{fontSize:13,color:C.accent,textDecoration:'none',wordBreak:'break-all'}}>{a.submitLink}</a>
                  </div>
                )}
                {a.submitNote&&(
                  <div style={{background:'white',borderRadius:8,padding:'8px 10px',fontSize:12,color:C.text,marginBottom:10,border:`0.5px solid ${C.border}`}}>
                    <span style={{fontWeight:600,color:C.muted}}>Catatan: </span>{a.submitNote}
                  </div>
                )}
                {!done?(
                  <>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Feedback / Catatan Revisi</div>
                      <textarea value={notes[key]||''} onChange={e=>setNotes(n=>({...n,[key]:e.target.value}))}
                        rows={2} placeholder="Kosongkan jika tidak ada revisi, atau tulis catatan spesifik..."
                        style={{width:'100%',padding:'8px 10px',border:`0.5px solid ${C.border}`,borderRadius:8,fontSize:13,resize:'none',boxSizing:'border-box',fontFamily:'inherit',color:C.text,outline:'none'}}/>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <Btn variant="primary" size="sm" onClick={()=>doApprove(ev.id,a.userId)}>✓ Approve</Btn>
                      <Btn variant="danger" size="sm" onClick={()=>doRevision(ev.id,a.userId)}>Kirim Revisi</Btn>
                    </div>
                  </>
                ):(
                  <div style={{fontSize:12,padding:'6px 0',color:done==='approved'?C.green:C.red,fontWeight:500}}>
                    {done==='approved'?'✓ Approved — notifikasi terkirim.':'✓ Catatan revisi dikirim ke anggota.'}
                  </div>
                )}
              </div>
            )
          })}
        </Card>
      ))}
    </div>
  )
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function StatsPage({ user, users, events }) {
  const myEvs = user.role==='manager' ? events : events.filter(e=>e.pic===user.id)
  const total=myEvs.length
  const byStatus={aktif:0,review:0,revisi:0,selesai:0}
  myEvs.forEach(e=>{ if(byStatus[e.status]!==undefined) byStatus[e.status]++ })
  const byCat={}
  ALL_CATS.forEach(c=>{byCat[c]=myEvs.filter(e=>e.cat===c).length})
  const byType={utama:0,liputan:0,event:0}
  myEvs.forEach(e=>{ if(byType[e.loadType]!==undefined) byType[e.loadType]++ })
  const completion = total>0 ? Math.round(byStatus.selesai/total*100) : 0
  const statusColors={aktif:'#3B82F6',review:'#F59E0B',revisi:'#EF4444',selesai:'#22C55E'}
  const maxCat=Math.max(...Object.values(byCat),1)

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>Statistik Produksi</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Laporan konten {user.role==='pic'?`kategori ${(user.cats||[]).join(', ')}`:'seluruh tim'}</div>

      {/* Summary cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[['Total Konten',total,'#1C1B18'],['Aktif',byStatus.aktif,'#1D4ED8'],['Review',byStatus.review,'#B45309'],['Selesai',byStatus.selesai,'#15803D']].map(([l,v,c])=>(
          <div key={l} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{l}</div>
            <div style={{fontSize:28,fontWeight:700,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {/* Status chart */}
        <Card>
          <SectionTitle>Status Konten</SectionTitle>
          <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:16}}>
            <div style={{position:'relative',width:100,height:100,flexShrink:0}}>
              <svg width="100" height="100" style={{transform:'rotate(-90deg)'}}>
                {(()=>{
                  let offset=0
                  const r=38, circ=2*Math.PI*r
                  return Object.entries(byStatus).map(([s,v])=>{
                    const pct=total>0?v/total:0
                    const dash=pct*circ, gap=circ-dash
                    const el=<circle key={s} cx="50" cy="50" r={r} fill="none" stroke={statusColors[s]} strokeWidth="16" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset*circ} style={{transition:'stroke-dasharray .5s'}}/>
                    offset+=pct
                    return el
                  })
                })()}
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:22,fontWeight:700}}>{completion}%</div>
                <div style={{fontSize:9,color:C.muted}}>selesai</div>
              </div>
            </div>
            <div style={{flex:1}}>
              {Object.entries(byStatus).map(([s,v])=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:2,background:statusColors[s]}}/>
                  <span style={{fontSize:12,flex:1,textTransform:'capitalize'}}>{s}</span>
                  <span style={{fontSize:14,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Category bars */}
        <Card>
          <SectionTitle>Konten per Kategori</SectionTitle>
          {ALL_CATS.map(cat=>{
            const m=CAT_META[cat], v=byCat[cat]||0, pct=Math.round(v/maxCat*100)
            return (
              <div key={cat} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:12,color:C.text}}>{cat}</span>
                  <span style={{fontSize:12,fontWeight:600,color:m.fg}}>{v}</span>
                </div>
                <div style={{height:6,background:C.bg,borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:m.dot,borderRadius:3,transition:'width .5s'}}/>
                </div>
              </div>
            )
          })}
        </Card>

        {/* Load type breakdown */}
        <Card>
          <SectionTitle>Jenis Tugas</SectionTitle>
          {LOAD_TYPES.map(lt=>{
            const v=byType[lt.value]||0, pct=total>0?Math.round(v/total*100):0
            return (
              <div key={lt.value} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <div style={{width:10,height:10,borderRadius:2,background:lt.value==='utama'?C.accent:lt.value==='liputan'?C.coral:C.purple,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                    <span style={{fontSize:12}}>{lt.label}</span>
                    <span style={{fontSize:12,fontWeight:600}}>{v} ({pct}%)</span>
                  </div>
                  <div style={{height:5,background:C.bg,borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:lt.value==='utama'?C.accent:lt.value==='liputan'?C.coral:C.purple,borderRadius:3}}/>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>

        {/* Top assignees (manager only) */}
        {user.role==='manager'&&(
          <Card>
            <SectionTitle>Produktivitas Tim</SectionTitle>
            {users.filter(u=>u.role==='member').map(u=>{
              const count=events.filter(e=>e.assignees.some(a=>a.userId===u.id)).length
              const done=events.filter(e=>e.status==='selesai'&&e.assignees.some(a=>a.userId===u.id)).length
              return (
                <div key={u.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <Av name={u.name} size={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{u.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{count} konten · {done} selesai</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:C.green}}>{done}</div>
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function UsersPage({ users, setUsers, onToast }) {
  const [tab,setTab]=useState('list')
  const [form,setForm]=useState({name:'',email:'',password:'1234',role:'member',cats:[],isIntern:false,startDate:today(),endDate:''})
  const [err,setErr]=useState('')

  function toggleCat(cat) {
    setForm(f=>({...f,cats:f.cats.includes(cat)?f.cats.filter(c=>c!==cat):[...f.cats,cat]}))
  }

  function doAddUser() {
    if(!form.name.trim()||!form.email.trim()){setErr('Nama dan email wajib diisi!');return}
    if(users.find(u=>u.email===form.email.trim().toLowerCase())){setErr('Email sudah digunakan!');return}
    if(form.role==='pic'&&form.cats.length===0){setErr('PIC harus memiliki minimal 1 kategori!');return}
    const newUser={
      id:uid(), name:form.name.trim(), email:form.email.trim().toLowerCase(),
      password:form.password||'1234', role:form.role, cats:form.cats,
      active:true, isIntern:form.isIntern,
      startDate:form.startDate, endDate:form.isIntern?form.endDate:null
    }
    setUsers(u=>[...u,newUser])
    onToast(`Akun ${form.name} berhasil dibuat!`)
    setForm({name:'',email:'',password:'1234',role:'member',cats:[],isIntern:false,startDate:today(),endDate:''})
    setErr('');setTab('list')
  }

  function toggleActive(id) {
    setUsers(u=>u.map(x=>x.id===id?{...x,active:!x.active}:x))
  }

  const roleLabel={manager:'Manager',pic:'PIC',member:'Tim Produksi'}
  const roleBadge={manager:'purple',pic:'blue',member:'gray'}

  // Expiry warning
  const expiring=users.filter(u=>u.isIntern&&u.endDate&&u.active).filter(u=>{
    const diff=(new Date(u.endDate)-new Date(today()))/86400000
    return diff>=0&&diff<=7
  })

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg}}>
      <div style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:-.5,marginBottom:2}}>Manajemen User</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Kelola akun, PIC kategori, dan masa berlaku intern</div>

      {expiring.length>0&&(
        <div style={{background:'#FFFBEB',border:`0.5px solid #FCD34D`,borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'flex-start',gap:10}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:C.amber,marginTop:4,flexShrink:0}}/>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'#92400E',marginBottom:2}}>Peringatan masa magang</div>
            {expiring.map(u=><div key={u.id} style={{fontSize:12,color:'#92400E'}}>{u.name} — berakhir {u.endDate}</div>)}
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:0,borderBottom:`0.5px solid ${C.border}`,marginBottom:16}}>
        {[['list','Daftar Akun'],['add','+ Tambah Akun']].map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)}
            style={{padding:'8px 16px',fontSize:13,cursor:'pointer',color:tab===t?C.text:C.muted,borderBottom:`2px solid ${tab===t?C.sidebar:'transparent'}`,fontWeight:tab===t?600:400,marginBottom:-0.5}}>
            {l}
          </div>
        ))}
      </div>

      {tab==='list'&&(
        <Card style={{padding:0,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead>
              <tr style={{borderBottom:`0.5px solid ${C.border}`,background:C.bg}}>
                {['Nama','Email','Akses','PIC Kategori','Masa Berlaku','Status',''].map(h=>(
                  <th key={h} style={{padding:'10px 12px',fontSize:11,color:C.muted,fontWeight:600,textAlign:'left'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:`0.5px solid ${C.border}`}}>
                  <td style={{padding:'10px 12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <Av name={u.name} size={26}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:500}}>{u.name}</div>
                        {u.isIntern&&<span style={{fontSize:10,background:'#EFF4FF',color:'#1D4ED8',padding:'1px 5px',borderRadius:4,fontWeight:600}}>Intern</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'6px 12px',color:C.muted,fontSize:12}}>{u.email}</td>
                  <td style={{padding:'6px 12px'}}><StatusBadge status={u.role}/><span style={{background:roleBadge[u.role]==='purple'?'#F5F3FF':roleBadge[u.role]==='blue'?'#EFF4FF':'#F7F6F3',color:roleBadge[u.role]==='purple'?C.purple:roleBadge[u.role]==='blue'?C.accent:C.muted,fontSize:11,padding:'2px 7px',borderRadius:6,fontWeight:500}}>{roleLabel[u.role]}</span></td>
                  <td style={{padding:'6px 12px',fontSize:12,color:C.muted}}>{u.cats?.length>0?u.cats.join(', '):'—'}</td>
                  <td style={{padding:'6px 12px',fontSize:12,color:u.endDate&&(new Date(u.endDate)-new Date(today()))/86400000<=7?C.amber:C.muted}}>{u.endDate||'—'}</td>
                  <td style={{padding:'6px 12px'}}><span style={{background:u.active?'#F0FDF4':'#FEF2F2',color:u.active?C.green:C.red,fontSize:11,padding:'2px 7px',borderRadius:6,fontWeight:500}}>{u.active?'Aktif':'Nonaktif'}</span></td>
                  <td style={{padding:'6px 12px'}}>
                    <button onClick={()=>toggleActive(u.id)}
                      style={{fontSize:11,padding:'3px 8px',border:`0.5px solid ${C.border}`,borderRadius:6,background:'transparent',cursor:'pointer',color:C.muted,fontFamily:'inherit'}}>
                      {u.active?'Nonaktifkan':'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab==='add'&&(
        <div style={{maxWidth:500}}>
          <Card>
            <SectionTitle>Data Akun Baru</SectionTitle>
            {err&&<div style={{background:'#FEF2F2',border:`0.5px solid #FECACA`,borderRadius:8,padding:'8px 10px',fontSize:12,color:C.red,marginBottom:12}}>{err}</div>}
            <Input label="Nama Lengkap" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} required placeholder="Nama lengkap..."/>
            <Input label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} type="email" required placeholder="email@tikkim.id"/>
            <Input label="Password Awal" value={form.password} onChange={v=>setForm(f=>({...f,password:v}))} type="text" placeholder="1234"/>
            <Select label="Role" value={form.role} onChange={v=>setForm(f=>({...f,role:v,cats:[]}))}
              options={[{value:'member',label:'Tim Produksi'},{value:'pic',label:'PIC Kategori'},{value:'manager',label:'Manager'}]}/>

            {form.role==='pic'&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:6}}>Kategori yang dikelola <span style={{color:C.red}}>*</span></div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {ALL_CATS.map(cat=>{
                    const m=CAT_META[cat], on=form.cats.includes(cat)
                    return <button key={cat} onClick={()=>toggleCat(cat)}
                      style={{padding:'4px 10px',borderRadius:10,fontSize:12,border:`1px solid ${on?m.fg:C.border}`,background:on?m.bg:'transparent',color:on?m.fg:C.muted,cursor:'pointer',fontWeight:on?600:400,fontFamily:'inherit'}}>{cat}</button>
                  })}
                </div>
              </div>
            )}

            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <input type="checkbox" id="isIntern" checked={form.isIntern} onChange={e=>setForm(f=>({...f,isIntern:e.target.checked}))} style={{width:14,height:14,cursor:'pointer'}}/>
              <label htmlFor="isIntern" style={{fontSize:13,color:C.text,cursor:'pointer'}}>Intern / Magang (ada masa berakhir)</label>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Input label="Tanggal Mulai" value={form.startDate} onChange={v=>setForm(f=>({...f,startDate:v}))} type="date"/>
              {form.isIntern&&<Input label="Tanggal Berakhir" value={form.endDate} onChange={v=>setForm(f=>({...f,endDate:v}))} type="date" required/>}
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:4}}>
              <Btn onClick={()=>{setTab('list');setErr('')}}>Batal</Btn>
              <Btn variant="primary" onClick={doAddUser}>Buat Akun</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [users,setUsers]=useState(INIT_USERS)
  const [events,setEvents]=useState(INIT_EVENTS)
  const [currentUser,setCurrentUser]=useState(null)
  const [activePage,setActivePage]=useState('calendar')
  const [toast,setToast]=useState('')

  function handleLogin(u) { setCurrentUser(u); setActivePage('calendar') }
  function handleLogout() { setCurrentUser(null); setActivePage('calendar') }

  if(!currentUser) return <LoginPage users={users} onLogin={handleLogin}/>

  const shared={user:currentUser,users,events,setEvents,onNav:setActivePage,onToast:setToast}

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',fontFamily:'"DM Sans",system-ui,sans-serif',background:C.bg}}>
      <Sidebar user={currentUser} users={users} activePage={activePage} onNav={setActivePage} onLogout={handleLogout}/>
      <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        {activePage==='calendar'  && <CalendarPage {...shared}/>}
        {activePage==='dashboard' && <DashboardPage {...shared}/>}
        {activePage==='mywork'    && <MyWorkPage {...shared}/>}
        {activePage==='submit'    && <SubmitPage {...shared} setEvents={setEvents}/>}
        {activePage==='delegate'  && <DelegatePage {...shared} setEvents={setEvents}/>}
        {activePage==='review'    && <ReviewPage {...shared} setEvents={setEvents}/>}
        {activePage==='stats'     && <StatsPage user={currentUser} users={users} events={events}/>}
        {activePage==='users'     && <UsersPage users={users} setUsers={setUsers} onToast={setToast}/>}
      </div>
      <Toast msg={toast} onClose={()=>setToast('')}/>
    </div>
  )
}