'use client'
import { useState, useEffect, useMemo, createContext, useContext } from 'react'

// ─── THEME ────────────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: false, toggle: () => {} })
function useTheme() { return useContext(ThemeCtx) }

const LIGHT = {
  bg: '#F0F4F8', card: '#FFFFFF', sidebar: '#003580', sidebarAccent: '#0050B3',
  border: '#D6E4F0', text: '#0A1628', muted: '#5A7A9A', faint: '#8FAABF',
  accent: '#0050B3', accentBg: '#E6F0FF', accentText: '#003580',
  green: '#0B6E4F', greenBg: '#E6F6F0', red: '#C0392B', redBg: '#FDEDED',
  amber: '#B45309', amberBg: '#FEF9E7', purple: '#6D28D9', purpleBg: '#F3EFFF',
  gold: '#B8860B', goldBg: '#FDF6E3', input: '#FFFFFF', inputBorder: '#BDD3E8',
  navHover: 'rgba(255,255,255,.10)', navActive: 'rgba(255,255,255,.18)',
  shadow: '0 2px 12px rgba(0,53,128,.08)',
}
const DARK = {
  bg: '#0D1B2A', card: '#162032', sidebar: '#0A1628', sidebarAccent: '#0D1F3C',
  border: '#1E3A5F', text: '#E8F1FA', muted: '#6B90B0', faint: '#3D5A73',
  accent: '#3B82F6', accentBg: '#0D1F3C', accentText: '#93C5FD',
  green: '#22C55E', greenBg: '#052E16', red: '#F87171', redBg: '#2D0A0A',
  amber: '#FCD34D', amberBg: '#2D1A00', purple: '#A78BFA', purpleBg: '#1E1040',
  gold: '#FCD34D', goldBg: '#2D1E00', input: '#1A2D42', inputBorder: '#1E3A5F',
  navHover: 'rgba(255,255,255,.08)', navActive: 'rgba(255,255,255,.15)',
  shadow: '0 2px 12px rgba(0,0,0,.4)',
}

// ─── CAT META ──────────────────────────────────────────────────────────────────
const CAT_META = {
  Instagram:  { bg:'#FCE7F3', fg:'#9D174D', dot:'#EC4899', dbg:'#3D0A1E', dfg:'#F9A8D4' },
  TikTok:     { bg:'#E0F2FE', fg:'#0369A1', dot:'#0EA5E9', dbg:'#0C1F2E', dfg:'#7DD3FC' },
  YouTube:    { bg:'#FEE2E2', fg:'#B91C1C', dot:'#EF4444', dbg:'#2D0A0A', dfg:'#FCA5A5' },
  Artikel:    { bg:'#DCFCE7', fg:'#15803D', dot:'#22C55E', dbg:'#052E16', dfg:'#86EFAC' },
  Podcast:    { bg:'#EDE9FE', fg:'#6D28D9', dot:'#8B5CF6', dbg:'#1E1040', dfg:'#C4B5FD' },
  Event:      { bg:'#FEF3C7', fg:'#B45309', dot:'#F59E0B', dbg:'#2D1A00', dfg:'#FCD34D' },
}
const ALL_CATS = Object.keys(CAT_META)
const ROLES_LIST = ['Cameraman','Editor Video','Desain Cover','Talent','Penulis','Scripting','Fotografer','Desainer','Presenter','Reporter']
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAYS_SHORT = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
const LOAD_TYPES = [
  { value:'utama',   label:'Tugas Utama',    max:2, desc:'Maks 2/hari' },
  { value:'liputan', label:'Liputan/Dadakan', max:1, desc:'Maks 1/hari' },
  { value:'event',   label:'Tugas Event',     max:1, desc:'Deadline mingguan' },
]

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INIT_USERS = [
  { id:'u1', name:'Ahmad Fauzi',  email:'manager@tikkim.id',  password:'1234', role:'manager', cats:[], active:true, isIntern:false, startDate:'2023-01-01', endDate:null },
  { id:'u2', name:'Rina Kusuma',  email:'rina@tikkim.id',     password:'1234', role:'pic',     cats:['Instagram','Artikel'], active:true, isIntern:false, startDate:'2023-03-01', endDate:null },
  { id:'u3', name:'Budi Santoso', email:'budi@tikkim.id',     password:'1234', role:'pic',     cats:['TikTok','Podcast'],    active:true, isIntern:false, startDate:'2023-03-01', endDate:null },
  { id:'u4', name:'Inul Safitri', email:'inul@tikkim.id',     password:'1234', role:'member',  cats:[], active:true, isIntern:true,  startDate:'2025-02-01', endDate:'2025-07-31' },
  { id:'u5', name:'Redul Hakim',  email:'redul@tikkim.id',    password:'1234', role:'member',  cats:[], active:true, isIntern:true,  startDate:'2025-02-01', endDate:'2025-07-31' },
  { id:'u6', name:'Sinta Dewi',   email:'sinta@tikkim.id',    password:'1234', role:'member',  cats:[], active:true, isIntern:false, startDate:'2024-01-01', endDate:null },
]
const INIT_EVENTS = [
  { id:1, title:'Reels IG — Kenapa Paspor Penting?', cat:'Instagram', loadType:'utama', start:'2025-04-19', end:'2025-04-21', status:'review', pic:'u2', brief:'Buat reels menarik tentang pentingnya paspor bagi traveler pemula.', assignees:[{userId:'u4',role:'Cameraman',status:'review',submitLink:'https://drive.google.com/sample',submitNote:'Raw footage sudah diupload.'},{userId:'u5',role:'Desain Cover',status:'aktif',submitLink:null,submitNote:null}] },
  { id:2, title:'TikTok — Tips Hemat Belanja Bulanan', cat:'TikTok', loadType:'utama', start:'2025-04-21', end:'2025-04-23', status:'aktif', pic:'u3', brief:'Konten tips hemat yang relatable untuk anak muda.', assignees:[{userId:'u4',role:'Talent',status:'aktif',submitLink:null,submitNote:null},{userId:'u6',role:'Scripting',status:'aktif',submitLink:null,submitNote:null}] },
  { id:3, title:'Artikel: Cara Urus Visa Schengen', cat:'Artikel', loadType:'utama', start:'2025-04-22', end:'2025-04-25', status:'aktif', pic:'u2', brief:'Panduan lengkap pengurusan visa Schengen step by step.', assignees:[{userId:'u5',role:'Penulis',status:'aktif',submitLink:null,submitNote:null}] },
  { id:4, title:'YouTube — Travel Vlog Jepang', cat:'YouTube', loadType:'event', start:'2025-04-23', end:'2025-04-30', status:'aktif', pic:'u3', brief:'Vlog perjalanan Jepang 7 hari, fokus konten kuliner dan budaya.', assignees:[{userId:'u4',role:'Editor Video',status:'aktif',submitLink:null,submitNote:null},{userId:'u5',role:'Desain Cover',status:'aktif',submitLink:null,submitNote:null}] },
  { id:5, title:'Podcast — Eps. 12 Tips Traveling', cat:'Podcast', loadType:'utama', start:'2025-04-17', end:'2025-04-20', status:'revisi', pic:'u3', brief:'Episode podcast dengan narasumber travel blogger.', assignees:[{userId:'u5',role:'Editor Video',status:'revisi',submitLink:'https://drive.google.com/podcast',submitNote:'Sudah diedit, mohon dicek bagian intro.',revisionNote:'Intro terlalu panjang, potong di menit ke-2.'}] },
  { id:6, title:'IG Story — Promo Event Mei', cat:'Instagram', loadType:'utama', start:'2025-04-24', end:'2025-04-26', status:'aktif', pic:'u2', brief:'Story promosi untuk event offline bulan Mei.', assignees:[{userId:'u5',role:'Desainer',status:'aktif',submitLink:null,submitNote:null}] },
  { id:7, title:'Festival Kuliner Jakarta 2025', cat:'Event', loadType:'event', start:'2025-04-27', end:'2025-05-03', status:'aktif', pic:'u2', brief:'Liputan event festival kuliner tahunan di Jakarta.', assignees:[{userId:'u4',role:'Cameraman',status:'aktif',submitLink:null,submitNote:null},{userId:'u6',role:'Fotografer',status:'aktif',submitLink:null,submitNote:null}] },
  { id:8, title:'TikTok — OOTD Ramadan', cat:'TikTok', loadType:'utama', start:'2025-04-14', end:'2025-04-16', status:'selesai', pic:'u3', brief:'Konten fashion Ramadan yang trending.', assignees:[{userId:'u4',role:'Talent',status:'selesai',submitLink:'https://drive.google.com/ootd',submitNote:'Sudah selesai.'},{userId:'u5',role:'Desainer',status:'selesai',submitLink:'https://drive.google.com/cover',submitNote:'Cover sudah dibuat.'}] },
  { id:9, title:'Artikel: 10 Destinasi Domestik', cat:'Artikel', loadType:'utama', start:'2025-04-28', end:'2025-04-30', status:'aktif', pic:'u2', brief:'Daftar 10 destinasi wisata domestik terbaik 2025.', assignees:[{userId:'u6',role:'Penulis',status:'aktif',submitLink:null,submitNote:null}] },
  { id:10, title:'Liputan Peluncuran Produk', cat:'Event', loadType:'liputan', start:'2025-04-25', end:'2025-04-25', status:'aktif', pic:'u2', brief:'Liputan dadakan peluncuran produk klien.', assignees:[{userId:'u6',role:'Reporter',status:'aktif',submitLink:null,submitNote:null}] },
]

// ─── UTILS ────────────────────────────────────────────────────────────────────
function uid() { return 'u'+Date.now()+Math.random().toString(36).slice(2,6) }
function eid() { return Date.now()+Math.floor(Math.random()*9999) }
function today() { return '2025-04-21' }
function getMemberLoad(userId, dateStr, events) {
  const mine = events.filter(e => e.start<=dateStr && e.end>=dateStr && e.assignees.some(a=>a.userId===userId))
  return { utama:mine.filter(e=>e.loadType==='utama').length, liputan:mine.filter(e=>e.loadType==='liputan').length, event:mine.filter(e=>e.loadType==='event').length }
}
function getAvatarColors(name='') {
  const palettes=[['#DBEAFE','#1E3A8A'],['#D1FAE5','#064E3B'],['#FEE2E2','#7F1D1D'],['#FEF3C7','#78350F'],['#EDE9FE','#4C1D95'],['#CFFAFE','#164E63'],['#FCE7F3','#831843'],['#FEF9C3','#713F12']]
  const [bg,fg]=palettes[(name.charCodeAt(0)||65)%palettes.length]
  return {bg,fg}
}

// ─── MICRO UI ──────────────────────────────────────────────────────────────────
function Av({name='?',size=32}) {
  const {bg,fg}=getAvatarColors(name)
  const init=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color:fg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*.36,fontWeight:700,flexShrink:0,letterSpacing:-.5}}>{init}</div>
}

function Chip({cat,dark}) {
  const m=CAT_META[cat]||{}
  const bg=dark?m.dbg:m.bg, fg=dark?m.dfg:m.fg
  return <span style={{background:bg,color:fg,fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700,letterSpacing:.3,whiteSpace:'nowrap'}}>{cat}</span>
}

function LTBadge({type,dark}) {
  const C=dark?DARK:LIGHT
  const s={utama:{bg:dark?'#0D1F3C':'#E0F2FE',fg:dark?'#7DD3FC':'#0369A1'},liputan:{bg:dark?'#2D1A00':'#FEF3C7',fg:dark?'#FCD34D':'#B45309'},event:{bg:dark?'#1E1040':'#EDE9FE',fg:dark?'#C4B5FD':'#6D28D9'}}[type]||{}
  const l={utama:'Utama',liputan:'Liputan',event:'Event'}[type]||type
  return <span style={{background:s.bg,color:s.fg,fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700}}>{l}</span>
}

function SBadge({status,dark}) {
  const map={aktif:{l:'#EFF4FF',lf:'#1D4ED8',d:'#0D1F3C',df:'#93C5FD'},review:{l:'#FFFBEB',lf:'#B45309',d:'#2D1A00',df:'#FCD34D'},revisi:{l:'#FEF2F2',lf:'#B91C1C',d:'#2D0A0A',df:'#FCA5A5'},selesai:{l:'#F0FDF4',lf:'#15803D',d:'#052E16',df:'#86EFAC'},draft:{l:'#F1F5F9',lf:'#475569',d:'#1E293B',df:'#94A3B8'}}
  const s=map[status]||map.draft
  const bg=dark?s.d:s.l, fg=dark?s.df:s.lf
  const label={aktif:'On Progress',review:'Review',revisi:'Revisi',selesai:'Selesai',draft:'Draft'}[status]||status
  return <span style={{background:bg,color:fg,fontSize:11,padding:'3px 9px',borderRadius:6,fontWeight:600,whiteSpace:'nowrap'}}>{label}</span>
}

function SDot({status}) {
  const c={aktif:'#3B82F6',review:'#F59E0B',revisi:'#EF4444',selesai:'#22C55E'}[status]||'#94A3B8'
  return <div style={{width:7,height:7,borderRadius:'50%',background:c,flexShrink:0}}/>
}

function Divider({C}) { return <div style={{height:'0.5px',background:C.border,margin:'12px 0'}}/> }

function ToastMsg({msg,onClose}) {
  useEffect(()=>{if(msg){const t=setTimeout(onClose,3000);return()=>clearTimeout(t)}},[msg])
  if(!msg) return null
  return <div style={{position:'fixed',bottom:24,right:24,background:'#003580',color:'#fff',padding:'12px 20px',borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:'0 8px 32px rgba(0,53,128,.35)',fontFamily:'Poppins,sans-serif',letterSpacing:.2}}>{msg}</div>
}

function Btn({onClick,children,variant='default',size='md',style={},disabled=false}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const base={cursor:disabled?'not-allowed':'pointer',border:'none',borderRadius:9,fontWeight:600,fontFamily:'Poppins,sans-serif',transition:'all .15s',opacity:disabled?.5:1}
  const variants={
    default:{background:'transparent',color:C.text,border:`1px solid ${C.border}`,':hover':{background:C.accentBg}},
    primary:{background:C.accent,color:'#fff'},
    danger: {background:'transparent',color:C.red,border:`1px solid ${C.red}`},
    ghost:  {background:'transparent',color:C.muted,border:'none'},
    gold:   {background:'#003580',color:'#FFD700',border:'1px solid #FFD700'},
  }
  const sizes={sm:{padding:'5px 12px',fontSize:12},md:{padding:'8px 16px',fontSize:13},lg:{padding:'11px 22px',fontSize:14}}
  return <button onClick={disabled?undefined:onClick} style={{...base,...variants[variant],...sizes[size],...style}}>{children}</button>
}

function Input({label,value,onChange,type='text',placeholder='',required=false,note=''}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return (
    <div style={{marginBottom:13}}>
      {label&&<div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>{label}{required&&<span style={{color:C.red}}> *</span>}</div>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,color:C.text,background:C.input,boxSizing:'border-box',outline:'none',fontFamily:'Poppins,sans-serif'}}/>
      {note&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{note}</div>}
    </div>
  )
}

function Sel({label,value,onChange,options=[],required=false}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return (
    <div style={{marginBottom:13}}>
      {label&&<div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>{label}{required&&<span style={{color:C.red}}> *</span>}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,color:C.text,background:C.input,boxSizing:'border-box',fontFamily:'Poppins,sans-serif',outline:'none'}}>
        {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
      </select>
    </div>
  )
}

function Card({children,style={}}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16,boxShadow:C.shadow,...style}}>{children}</div>
}

function SecTitle({children}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return <div style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1.2,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>{String(children).toUpperCase()}</div>
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({user,activePage,onNav,onLogout}) {
  const {dark,toggle}=useTheme()
  const isMgr=user.role==='manager', isPIC=user.role==='pic', isMem=user.role==='member'
  const groups=[
    {sec:null,items:[{id:'calendar',label:'Kalender',icon:'📅'},{id:'dashboard',label:'Dashboard',icon:'🏠'}]},
    {sec:'Konten',items:[
      {id:'mywork',  label:isMgr?'Semua Konten':isPIC?'Konten Saya':'Tugas Saya', icon:'📋'},
      {id:'delegate',label:'Buat & Delegasi', icon:'➕', show:isPIC||isMgr},
      {id:'review',  label:'Review Konten',   icon:'🔍', show:isPIC||isMgr},
      {id:'submit',  label:'Submit Konten',   icon:'📤', show:isMem},
    ].filter(n=>n.show!==false)},
    {sec:'Laporan',items:[
      {id:'stats',label:'Statistik',      icon:'📊', show:isMgr||isPIC},
      {id:'users',label:'Manajemen User', icon:'👥', show:isMgr},
    ].filter(n=>n.show!==false)},
  ]
  return (
    <div style={{width:220,flexShrink:0,background:'#003580',display:'flex',flexDirection:'column',fontFamily:'Poppins,sans-serif'}}>
      {/* Logo */}
      <div style={{padding:'22px 20px 16px',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:'#FFD700',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{fontSize:16}}>🦅</span>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:'#FFD700',letterSpacing:-1,lineHeight:1}}>TIKKIM</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,.45)',fontWeight:500,letterSpacing:.5,marginTop:1}}>CONTENT MANAGER</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
        {groups.map((g,gi)=>(
          <div key={gi}>
            {g.sec&&<div style={{fontSize:9,color:'rgba(255,255,255,.3)',fontWeight:700,letterSpacing:1.4,padding:'14px 18px 5px'}}>{g.sec}</div>}
            {g.items.map(n=>{
              const isActive=activePage===n.id
              return (
                <div key={n.id} onClick={()=>onNav(n.id)}
                  style={{padding:'9px 18px',fontSize:13,cursor:'pointer',color:isActive?'#FFD700':'rgba(255,255,255,.65)',background:isActive?'rgba(255,215,0,.12)':'transparent',fontWeight:isActive?700:400,transition:'all .15s',borderRight:`3px solid ${isActive?'#FFD700':'transparent'}`,display:'flex',alignItems:'center',gap:9}}>
                  <span style={{fontSize:14,opacity:isActive?1:.7}}>{n.icon}</span>{n.label}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Theme toggle + user */}
      <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,.1)'}}>
        <button onClick={toggle} style={{width:'100%',padding:'7px 0',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',borderRadius:9,color:'rgba(255,255,255,.75)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          {dark?'☀️ Light Mode':'🌙 Dark Mode'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <Av name={user.name} size={28}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{width:'100%',padding:'6px 0',background:'transparent',border:'1px solid rgba(255,255,255,.15)',borderRadius:8,color:'rgba(255,255,255,.5)',fontSize:11,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:500}}>Keluar</button>
      </div>
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({users,onLogin}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [email,setEmail]=useState(''), [pass,setPass]=useState(''), [err,setErr]=useState(''), [loading,setLoading]=useState(false)
  function doLogin() {
    const u=users.find(u=>u.email===email.trim().toLowerCase()&&u.password===pass&&u.active)
    if(!u){setErr('Email atau password salah, atau akun tidak aktif.');return}
    setLoading(true); setTimeout(()=>onLogin(u),400)
  }
  const demos=[['manager@tikkim.id','Manager','🏛'],['rina@tikkim.id','PIC Instagram','📸'],['budi@tikkim.id','PIC TikTok','🎵'],['inul@tikkim.id','Tim Produksi','🎬'],['redul@tikkim.id','Tim Produksi','✏️']]
  return (
    <div style={{display:'flex',minHeight:'100vh',background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      {/* Left panel */}
      <div style={{width:440,background:'#003580',display:'flex',flexDirection:'column',justifyContent:'center',padding:'52px 48px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'rgba(255,215,0,.06)'}}/>
        <div style={{position:'absolute',bottom:-40,left:-40,width:160,height:160,borderRadius:'50%',background:'rgba(255,215,0,.04)'}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
            <div style={{width:44,height:44,borderRadius:12,background:'#FFD700',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:22}}>🦅</span>
            </div>
            <div>
              <div style={{fontSize:28,fontWeight:900,color:'#FFD700',letterSpacing:-1.5}}>TIKKIM</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,.4)',letterSpacing:1.5,fontWeight:600}}>CONTENT MANAGER</div>
            </div>
          </div>
          <div style={{fontSize:22,fontWeight:700,color:'#fff',marginBottom:8,lineHeight:1.3}}>Masuk ke akun kamu</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.45)',marginBottom:32}}>Platform manajemen konten tim produksi</div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:6,fontWeight:500}}>Email</div>
            <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr('')}} placeholder="email@tikkim.id" onKeyDown={e=>e.key==='Enter'&&doLogin()}
              style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.14)',borderRadius:10,fontSize:13,color:'#fff',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',outline:'none'}}/>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:6,fontWeight:500}}>Password</div>
            <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr('')}} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&doLogin()}
              style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.14)',borderRadius:10,fontSize:13,color:'#fff',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',outline:'none'}}/>
          </div>
          {err&&<div style={{fontSize:12,color:'#FCA5A5',marginBottom:8,fontWeight:500}}>{err}</div>}
          <button onClick={doLogin} disabled={loading}
            style={{width:'100%',padding:'12px 0',background:'#FFD700',color:'#003580',border:'none',borderRadius:10,fontSize:14,fontWeight:800,cursor:'pointer',marginTop:10,fontFamily:'Poppins,sans-serif',letterSpacing:.3,transition:'opacity .15s',opacity:loading?.7:1}}>
            {loading?'Masuk...':'Masuk →'}
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'48px 52px',background:C.bg}}>
        <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:4}}>Login cepat (demo)</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Password semua akun: <code style={{background:C.border,padding:'2px 7px',borderRadius:5,fontSize:12,fontWeight:600}}>1234</code></div>
        <div style={{display:'flex',flexDirection:'column',gap:9,maxWidth:380}}>
          {demos.map(([e,label,icon])=>(
            <button key={e} onClick={()=>{setEmail(e);setPass('1234');setTimeout(()=>{const u=users.find(x=>x.email===e);if(u)onLogin(u)},80)}}
              style={{textAlign:'left',padding:'12px 16px',border:`1px solid ${C.border}`,borderRadius:11,background:C.card,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13,color:C.text,boxShadow:C.shadow,display:'flex',alignItems:'center',gap:10,transition:'border-color .15s'}}>
              <span style={{fontSize:18}}>{icon}</span>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{e}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:1}}>{label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
function CalendarPage({user,users,events,setEvents,onNav,onToast}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [yr,setYr]=useState(2025), [mo,setMo]=useState(3)
  const [filters,setFilters]=useState(new Set(ALL_CATS))
  const [selDate,setSelDate]=useState(null)
  const [selEv,setSelEv]=useState(null)
  const [view,setView]=useState('month')
  const uName=id=>users.find(u=>u.id===id)?.name||id
  function myEvs(){
    let e=events.filter(ev=>filters.has(ev.cat))
    if(user.role==='pic') e=e.filter(ev=>ev.pic===user.id)
    if(user.role==='member') e=e.filter(ev=>ev.assignees.some(a=>a.userId===user.id))
    return e
  }
  function onDate(ds){return myEvs().filter(e=>e.start<=ds&&e.end>=ds)}
  function navMo(d){setMo(m=>{let n=m+d;if(n>11){setYr(y=>y+1);return 0}if(n<0){setYr(y=>y-1);return 11}return n})}
  function cells(){
    const f=new Date(yr,mo,1).getDay(), dim=new Date(yr,mo+1,0).getDate(), pv=new Date(yr,mo,0).getDate()
    const c=[]
    for(let i=0;i<f;i++) c.push({d:pv-f+1+i,cur:false})
    for(let d=1;d<=dim;d++) c.push({d,cur:true})
    const r=(7-c.length%7)%7
    for(let i=1;i<=r;i++) c.push({d:i,cur:false})
    return c
  }
  const monthList=useMemo(()=>{
    const ms=`${yr}-${String(mo+1).padStart(2,'0')}`
    return myEvs().filter(e=>e.start.startsWith(ms)||e.end.startsWith(ms)).sort((a,b)=>a.start.localeCompare(b.start))
  },[yr,mo,events,filters,user])

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5}}>Kalender Produksi</div>
          <div style={{fontSize:13,color:C.muted,marginTop:2}}>Jadwal & rencana konten tim TIKKIM</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {['month','list'].map(v=>(
            <Btn key={v} variant={view===v?'primary':'default'} size="sm" onClick={()=>setView(v)}>{v==='month'?'📅 Bulan':'📋 List'}</Btn>
          ))}
          {(user.role==='pic'||user.role==='manager')&&<Btn variant="gold" size="sm" onClick={()=>onNav('delegate')}>+ Buat Konten</Btn>}
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16,alignItems:'center'}}>
        <span style={{fontSize:12,color:C.muted,fontWeight:500,marginRight:2}}>Filter:</span>
        {ALL_CATS.map(cat=>{
          const m=CAT_META[cat],on=filters.has(cat)
          const bg=on?(dark?m.dbg:m.bg):'transparent', fg=on?(dark?m.dfg:m.fg):C.muted
          return <button key={cat} onClick={()=>setFilters(p=>{const n=new Set(p);on?(n.size>1&&n.delete(cat)):n.add(cat);return n})}
            style={{padding:'4px 11px',borderRadius:20,fontSize:11,border:`1.5px solid ${on?(dark?m.dfg:m.fg):C.border}`,background:bg,color:fg,cursor:'pointer',fontWeight:on?700:400,fontFamily:'Poppins,sans-serif',transition:'all .15s'}}>{cat}</button>
        })}
      </div>

      {view==='month'?(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',boxShadow:C.shadow}}>
          {/* Cal header */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:`1px solid ${C.border}`,background:dark?C.card:'#F8FAFF'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button onClick={()=>navMo(-1)} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted,fontFamily:'Poppins,sans-serif'}}>‹</button>
              <div style={{fontSize:15,fontWeight:700,minWidth:150,textAlign:'center',color:C.text}}>{MONTHS[mo]} {yr}</div>
              <button onClick={()=>navMo(1)} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted,fontFamily:'Poppins,sans-serif'}}>›</button>
            </div>
            <Btn size="sm" onClick={()=>{setYr(2025);setMo(3)}}>Hari ini</Btn>
          </div>
          {/* Day names */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`1px solid ${C.border}`,background:dark?C.card:'#F8FAFF'}}>
            {DAYS_SHORT.map(d=><div key={d} style={{textAlign:'center',padding:'8px 4px',fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.5}}>{d}</div>)}
          </div>
          {/* Cells */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
            {cells().map((cell,idx)=>{
              const ds=cell.cur?`${yr}-${String(mo+1).padStart(2,'0')}-${String(cell.d).padStart(2,'0')}`:null
              const devs=ds?onDate(ds):[], isToday=ds==='2025-04-21'
              return (
                <div key={idx} onClick={()=>{if(ds&&devs.length>0){setSelDate(ds);setSelEv(null)}}}
                  style={{minHeight:90,padding:4,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,opacity:cell.cur?1:.3,background:isToday?(dark?'#0D1F3C':'#EFF4FF'):C.card,cursor:ds&&devs.length>0?'pointer':'default'}}>
                  <div style={{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:isToday?800:500,borderRadius:'50%',background:isToday?'#003580':'transparent',color:isToday?'#FFD700':C.text,marginBottom:3}}>{cell.d}</div>
                  {devs.slice(0,2).map(ev=>{
                    const m=CAT_META[ev.cat]||{}; const bg=dark?m.dbg:m.bg; const fg=dark?m.dfg:m.fg
                    return <div key={ev.id} onClick={e=>{e.stopPropagation();setSelEv(ev);setSelDate(null)}}
                      style={{fontSize:9,padding:'2px 5px',borderRadius:3,marginBottom:2,background:bg,color:fg,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:700,cursor:'pointer'}}>{ev.title}</div>
                  })}
                  {devs.length>2&&<div style={{fontSize:9,color:C.muted,fontWeight:600}}>+{devs.length-2} lagi</div>}
                </div>
              )
            })}
          </div>
        </div>
      ):(
        <Card>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <button onClick={()=>navMo(-1)} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>‹</button>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{MONTHS[mo]} {yr}</div>
            <button onClick={()=>navMo(1)} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>›</button>
          </div>
          {monthList.length===0&&<div style={{fontSize:13,color:C.muted}}>Tidak ada konten di bulan ini.</div>}
          {monthList.map(ev=>(
            <div key={ev.id} onClick={()=>setSelEv(ev)} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 0',borderBottom:`1px solid ${C.border}`,cursor:'pointer'}}>
              <div style={{width:3,height:44,borderRadius:2,background:CAT_META[ev.cat]?.dot||C.border,flexShrink:0,marginTop:4}}/>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                  <Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/>
                  <span style={{fontSize:13,fontWeight:700,color:C.text}}>{ev.title}</span>
                </div>
                <div style={{fontSize:11,color:C.muted}}>PIC: {uName(ev.pic)} · {ev.start} → {ev.end}</div>
              </div>
              <SBadge status={ev.status} dark={dark}/>
            </div>
          ))}
        </Card>
      )}

      {/* Panel: tanggal */}
      {selDate&&(
        <div style={{position:'fixed',top:0,right:0,width:350,height:'100%',background:C.card,borderLeft:`1px solid ${C.border}`,zIndex:300,padding:22,overflowY:'auto',boxShadow:'-6px 0 32px rgba(0,0,0,.12)',fontFamily:'Poppins,sans-serif'}}>
          <button onClick={()=>setSelDate(null)} style={{position:'absolute',top:14,right:14,width:30,height:30,borderRadius:'50%',border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:18,color:C.muted}}>×</button>
          <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:4}}>📅 {selDate}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:18}}>{onDate(selDate).length} konten pada tanggal ini</div>
          {onDate(selDate).map(ev=>(
            <div key={ev.id} onClick={()=>{setSelEv(ev);setSelDate(null)}} style={{border:`1px solid ${C.border}`,borderRadius:11,padding:13,marginBottom:9,cursor:'pointer',background:C.bg}}>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:7}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/><SBadge status={ev.status} dark={dark}/></div>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:5}}>{ev.title}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Deadline: {ev.end} · PIC: {uName(ev.pic)}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {ev.assignees.map((a,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:4,background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:'3px 8px'}}>
                    <SDot status={a.status}/><span style={{fontSize:11,color:C.text,fontWeight:500}}>{uName(a.userId)}</span><span style={{fontSize:10,color:C.muted}}>({a.role})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel: event detail */}
      {selEv&&(
        <div style={{position:'fixed',top:0,right:0,width:350,height:'100%',background:C.card,borderLeft:`1px solid ${C.border}`,zIndex:300,padding:22,overflowY:'auto',boxShadow:'-6px 0 32px rgba(0,0,0,.12)',fontFamily:'Poppins,sans-serif'}}>
          <button onClick={()=>setSelEv(null)} style={{position:'absolute',top:14,right:14,width:30,height:30,borderRadius:'50%',border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:18,color:C.muted}}>×</button>
          <div style={{marginBottom:10,display:'flex',gap:6,flexWrap:'wrap'}}><Chip cat={selEv.cat} dark={dark}/><LTBadge type={selEv.loadType} dark={dark}/></div>
          <div style={{fontSize:17,fontWeight:800,color:C.text,marginBottom:8,lineHeight:1.4}}>{selEv.title}</div>
          <SBadge status={selEv.status} dark={dark}/>
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:3}}>PIC</div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:C.text}}>{uName(selEv.pic)}</div>
            <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:3}}>JADWAL</div>
            <div style={{fontSize:13,marginBottom:12,color:C.text}}>{selEv.start} → {selEv.end}</div>
            {selEv.brief&&<><div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:3}}>BRIEF</div><div style={{fontSize:12,color:C.text,marginBottom:14,lineHeight:1.7,background:C.bg,padding:'10px 12px',borderRadius:9}}>{selEv.brief}</div></>}
            <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:8}}>ASSIGNEE</div>
            {selEv.assignees.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                <Av name={uName(a.userId)} size={28}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>{uName(a.userId)}</div>
                  <div style={{fontSize:11,color:C.muted}}>{a.role}</div>
                </div>
                <SDot status={a.status}/><span style={{fontSize:11,color:C.muted}}>{a.status}</span>
              </div>
            ))}
          </div>
          {user.role==='member'&&selEv.status==='aktif'&&selEv.assignees.some(a=>a.userId===user.id)&&(
            <Btn variant="primary" style={{width:'100%',marginTop:16}} onClick={()=>{setSelEv(null);onNav('submit')}}>📤 Submit Hasil</Btn>
          )}
          {(user.role==='pic'||user.role==='manager')&&selEv.assignees.some(a=>a.status==='review')&&(
            <Btn variant="primary" style={{width:'100%',marginTop:16}} onClick={()=>{setSelEv(null);onNav('review')}}>🔍 Review Submit</Btn>
          )}
        </div>
      )}
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({user,users,events,onNav}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const uName=id=>users.find(u=>u.id===id)?.name||id
  function myEvs(){
    if(user.role==='manager') return events
    if(user.role==='pic') return events.filter(e=>e.pic===user.id)
    return events.filter(e=>e.assignees.some(a=>a.userId===user.id))
  }
  const evs=myEvs()
  const counts={aktif:evs.filter(e=>e.status==='aktif').length, review:evs.filter(e=>e.status==='review').length, revisi:evs.filter(e=>e.status==='revisi').length, selesai:evs.filter(e=>e.status==='selesai').length}
  const upcoming=evs.filter(e=>{const d=new Date(e.end),t=new Date(today()),diff=(d-t)/86400000;return diff>=0&&diff<=7&&e.status!=='selesai'}).sort((a,b)=>a.end.localeCompare(b.end))
  const myLoad=user.role==='member'?getMemberLoad(user.id,today(),events):null

  const metricCards=[
    {label:'Aktif',val:counts.aktif,bg:dark?'#0D1F3C':'#EFF4FF',fg:dark?'#93C5FD':'#1D4ED8',icon:'🔵'},
    {label:'Review',val:counts.review,bg:dark?'#2D1A00':'#FFFBEB',fg:dark?'#FCD34D':'#B45309',icon:'🟡'},
    {label:'Revisi',val:counts.revisi,bg:dark?'#2D0A0A':'#FEF2F2',fg:dark?'#FCA5A5':'#B91C1C',icon:'🔴'},
    {label:'Selesai',val:counts.selesai,bg:dark?'#052E16':'#F0FDF4',fg:dark?'#86EFAC':'#15803D',icon:'🟢'},
  ]

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>
        {user.role==='manager'?'Dashboard Manager':`Halo, ${user.name.split(' ')[0]}! 👋`}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Senin, 21 April 2025</div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {metricCards.map(m=>(
          <div key={m.label} style={{background:m.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px',boxShadow:C.shadow}}>
            <div style={{fontSize:11,color:m.fg,fontWeight:600,marginBottom:6}}>{m.icon} {m.label.toUpperCase()}</div>
            <div style={{fontSize:30,fontWeight:800,color:m.fg}}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Member load */}
      {myLoad&&(
        <Card style={{marginBottom:16}}>
          <SecTitle>Beban Tugasmu Hari Ini</SecTitle>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {LOAD_TYPES.map(lt=>{
              const used=myLoad[lt.value], full=used>=lt.max
              const barColors={utama:'#003580',liputan:'#B45309',event:'#6D28D9'}
              return (
                <div key={lt.value} style={{background:full?(dark?'#2D0A0A':'#FEF2F2'):C.bg,border:`1px solid ${full?C.red:C.border}`,borderRadius:10,padding:'12px 14px'}}>
                  <div style={{fontSize:11,color:full?C.red:C.muted,fontWeight:700,marginBottom:6}}>{lt.label}</div>
                  <div style={{fontSize:24,fontWeight:800,color:full?C.red:C.text}}>{used}<span style={{fontSize:12,color:C.muted,fontWeight:400}}>/{lt.max}</span></div>
                  <div style={{display:'flex',gap:3,marginTop:8}}>
                    {Array.from({length:lt.max}).map((_,i)=>(
                      <div key={i} style={{height:5,flex:1,borderRadius:3,background:i<used?barColors[lt.value]:C.border,transition:'background .3s'}}/>
                    ))}
                  </div>
                  <div style={{fontSize:10,color:C.muted,marginTop:4}}>{lt.desc}</div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card>
          <SecTitle>Deadline Minggu Ini</SecTitle>
          {upcoming.length===0&&<div style={{fontSize:13,color:C.muted}}>Tidak ada deadline minggu ini.</div>}
          {upcoming.map(ev=>(
            <div key={ev.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:3,height:38,borderRadius:2,background:CAT_META[ev.cat]?.dot||C.border,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{ev.title}</div>
                <div style={{fontSize:11,color:C.muted}}>Deadline: {ev.end} · PIC: {uName(ev.pic)}</div>
              </div>
              <SBadge status={ev.status} dark={dark}/>
            </div>
          ))}
        </Card>
        {(user.role==='pic'||user.role==='manager')&&counts.review>0&&(
          <div onClick={()=>onNav('review')} style={{background:dark?'#2D1A00':'#FFFBEB',border:`1px solid ${dark?'#854D0E':'#FCD34D'}`,borderRadius:14,padding:20,cursor:'pointer',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',gap:8}}>
            <div style={{fontSize:28}}>🔔</div>
            <div style={{fontSize:15,fontWeight:800,color:dark?'#FCD34D':'#B45309'}}>{counts.review} konten menunggu review</div>
            <div style={{fontSize:12,color:C.muted}}>Klik untuk buka halaman Review Konten</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MY WORK ──────────────────────────────────────────────────────────────────
function MyWorkPage({user,users,events,onNav}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [tab,setTab]=useState('semua')
  const uName=id=>users.find(u=>u.id===id)?.name||id
  function myEvs(){
    if(user.role==='manager') return events
    if(user.role==='pic') return events.filter(e=>e.pic===user.id)
    return events.filter(e=>e.assignees.some(a=>a.userId===user.id))
  }
  const filtered=myEvs().filter(e=>tab==='semua'||e.status===tab).sort((a,b)=>a.end.localeCompare(b.end))
  const tabs=[['semua','Semua'],['aktif','Aktif'],['review','Review'],['revisi','Revisi'],['selesai','Selesai']]
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>
        {user.role==='manager'?'Semua Konten':user.role==='pic'?'Konten Saya':'Tugas Saya'}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>
        {user.role==='pic'?`Kategori: ${(user.cats||[]).join(', ')}`:'Semua penugasanmu'}
      </div>
      <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {tabs.map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)}
            style={{padding:'9px 18px',fontSize:13,cursor:'pointer',color:tab===t?C.accent:C.muted,borderBottom:`2.5px solid ${tab===t?C.accent:'transparent'}`,fontWeight:tab===t?700:400,marginBottom:-1,transition:'all .15s'}}>
            {l}
          </div>
        ))}
      </div>
      {filtered.length===0&&<div style={{fontSize:13,color:C.muted,padding:'24px 0',textAlign:'center'}}>Tidak ada konten.</div>}
      {filtered.map(ev=>{
        const myA=ev.assignees.find(a=>a.userId===user.id)
        return (
          <div key={ev.id} style={{background:C.card,border:`1px solid ${ev.status==='revisi'?C.red:C.border}`,borderLeft:`4px solid ${ev.status==='revisi'?C.red:CAT_META[ev.cat]?.dot||C.border}`,borderRadius:12,padding:16,marginBottom:10,boxShadow:C.shadow}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6,flexWrap:'wrap'}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/></div>
                <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:4}}>{ev.title}</div>
                {myA&&<div style={{fontSize:12,color:C.muted,marginBottom:3}}>Peranmu: <strong style={{fontWeight:700,color:C.accent}}>{myA.role}</strong></div>}
                <div style={{fontSize:12,color:C.muted}}>PIC: {uName(ev.pic)} · Deadline: {ev.end}</div>
                {user.role!=='member'&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{ev.assignees.map(a=>uName(a.userId)+' ('+a.role+')').join(', ')}</div>}
                {ev.status==='revisi'&&myA?.revisionNote&&(
                  <div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:9,padding:'9px 12px',fontSize:12,color:C.red,marginTop:10}}>
                    <strong style={{fontWeight:700}}>📝 Catatan PIC:</strong> {myA.revisionNote}
                  </div>
                )}
              </div>
              <SBadge status={ev.status} dark={dark}/>
            </div>
            {user.role==='member'&&(ev.status==='aktif'||ev.status==='revisi')&&(
              <div style={{marginTop:12}}>
                <Btn variant="primary" size="sm" onClick={()=>onNav('submit')}>{ev.status==='revisi'?'📤 Submit Ulang':'📤 Submit Hasil'}</Btn>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── SUBMIT ───────────────────────────────────────────────────────────────────
function SubmitPage({user,users,events,setEvents,onNav,onToast}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [task,setTask]=useState(''), [link,setLink]=useState(''), [note,setNote]=useState(''), [sv,setSv]=useState('done')
  const myTasks=events.filter(e=>e.assignees.some(a=>a.userId===user.id)&&(e.status==='aktif'||e.status==='revisi'))
  const uName=id=>users.find(u=>u.id===id)?.name||id
  const sel=myTasks.find(e=>String(e.id)===task)
  function doSubmit() {
    if(!task){onToast('Pilih tugas terlebih dahulu!');return}
    if(!link.trim()){onToast('Masukkan link hasil kerja!');return}
    setEvents(evs=>evs.map(e=>{
      if(String(e.id)!==task) return e
      return {...e,status:'review',assignees:e.assignees.map(a=>a.userId===user.id?{...a,status:'review',submitLink:link,submitNote:note}:a)}
    }))
    onToast('✅ Submit berhasil! PIC akan mereview segera.')
    setTask('');setLink('');setNote('')
    setTimeout(()=>onNav('mywork'),1400)
  }
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Submit Konten</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Kirim hasil kerja ke PIC untuk direview</div>
      <div style={{maxWidth:560}}>
        <Card>
          <Sel label="Pilih Tugas" value={task} onChange={setTask} required
            options={[{value:'',label:'Pilih tugas...'}, ...myTasks.map(e=>{const r=e.assignees.find(a=>a.userId===user.id);return {value:String(e.id),label:`${e.title} (${r?.role})${e.status==='revisi'?' · REVISI':''}`}})]}/>
          {sel&&<div style={{background:C.bg,borderRadius:9,padding:'10px 13px',marginBottom:13,fontSize:12,color:C.muted,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:600,color:C.text,marginBottom:2}}>{sel.title}</div>
            <div>PIC: {uName(sel.pic)} · Deadline: {sel.end} · {sel.cat}</div>
            {sel.brief&&<div style={{marginTop:4,color:C.text,lineHeight:1.6}}>Brief: {sel.brief}</div>}
          </div>}
          <Input label="Link Hasil Kerja" value={link} onChange={setLink} required placeholder="Google Drive, Figma, Notion, YouTube..."
            note="Pastikan link sudah bisa diakses oleh PIC"/>
          <div style={{marginBottom:13}}>
            <div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>Catatan untuk PIC</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Jelaskan apa yang dikerjakan, kendala, atau hal yang perlu diperhatikan..."
              style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,resize:'vertical',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',color:C.text,background:C.input,outline:'none'}}/>
          </div>
          <Sel label="Status Pengerjaan" value={sv} onChange={setSv}
            options={[{value:'done',label:'✅ Selesai — siap direview'},{value:'draft',label:'📝 Draft — minta feedback awal'},{value:'partial',label:'⚙️ Sebagian — masih dikerjakan'}]}/>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:4}}>
            <Btn onClick={()=>onNav('mywork')}>Batal</Btn>
            <Btn variant="primary" onClick={doSubmit}>📤 Kirim ke PIC</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── DELEGATE ─────────────────────────────────────────────────────────────────
function DelegatePage({user,users,events,setEvents,onNav,onToast}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [title,setTitle]=useState(''), [cat,setCat]=useState('Instagram'), [loadType,setLoadType]=useState('utama')
  const [start,setStart]=useState(today()), [end,setEnd]=useState('2025-04-28'), [brief,setBrief]=useState('')
  const [rows,setRows]=useState([{userId:'',role:''}]), [warns,setWarns]=useState({})
  const avail=user.role==='manager'?ALL_CATS:(user.cats||[])
  const members=users.filter(u=>u.active)
  const uName=id=>users.find(u=>u.id===id)?.name||id
  function updRow(i,f,v){
    setRows(r=>r.map((row,idx)=>{
      if(idx!==i) return row
      const upd={...row,[f]:v}
      if(f==='userId'&&v){
        const load=getMemberLoad(v,start,events), lt=LOAD_TYPES.find(l=>l.value===loadType)
        if(lt&&load[loadType]>=lt.max) setWarns(w=>({...w,[i]:`${uName(v)} sudah penuh slot ${lt.label} hari ini`}))
        else setWarns(w=>{const n={...w};delete n[i];return n})
      }
      return upd
    }))
  }
  function doSubmit(){
    if(!title.trim()){onToast('Isi judul konten!');return}
    const valid=rows.filter(r=>r.userId&&r.role)
    if(!valid.length){onToast('Tambahkan minimal satu penugasan!');return}
    setEvents(ev=>[...ev,{id:eid(),title:title.trim(),cat,loadType,start,end,brief,status:'aktif',pic:user.id,assignees:valid.map(r=>({userId:r.userId,role:r.role,status:'aktif',submitLink:null,submitNote:null}))}])
    onToast('✅ Konten dibuat & notifikasi terkirim!')
    setTitle('');setBrief('');setRows([{userId:'',role:''}])
    setTimeout(()=>onNav('calendar'),1400)
  }
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Buat Konten & Delegasi</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Buat konten baru dan tentukan siapa mengerjakan apa</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:860}}>
        <Card>
          <SecTitle>Detail Konten</SecTitle>
          <Input label="Judul Konten" value={title} onChange={setTitle} required placeholder="Contoh: Reels IG — Tips Traveling Hemat"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Sel label="Kategori" value={cat} onChange={setCat} required options={avail.map(c=>({value:c,label:c}))}/>
            <Sel label="Jenis Tugas" value={loadType} onChange={setLoadType} required options={LOAD_TYPES.map(l=>({value:l.value,label:`${l.label} (${l.desc})`}))}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Input label="Tanggal Mulai" value={start} onChange={setStart} type="date" required/>
            <Input label="Deadline" value={end} onChange={setEnd} type="date" required/>
          </div>
          <div>
            <div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>Brief / Deskripsi</div>
            <textarea value={brief} onChange={e=>setBrief(e.target.value)} rows={3} placeholder="Konsep, referensi, hal penting untuk tim..."
              style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,resize:'vertical',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',color:C.text,background:C.input,outline:'none'}}/>
          </div>
        </Card>
        <Card>
          <SecTitle>Penugasan Tim</SecTitle>
          <div style={{fontSize:12,color:C.muted,marginBottom:12}}>Satu konten bisa dikerjakan beberapa orang dengan peran berbeda.</div>
          {rows.map((row,i)=>(
            <div key={i}>
              <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:4}}>
                <select value={row.userId} onChange={e=>updRow(i,'userId',e.target.value)}
                  style={{flex:1,padding:'9px 10px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,fontFamily:'Poppins,sans-serif',color:C.text,background:C.input}}>
                  <option value="">Pilih orang...</option>
                  {members.map(u=><option key={u.id} value={u.id}>{u.name} ({u.role==='pic'?'PIC':u.role==='manager'?'Manager':'Tim'})</option>)}
                </select>
                <select value={row.role} onChange={e=>updRow(i,'role',e.target.value)}
                  style={{flex:1,padding:'9px 10px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,fontFamily:'Poppins,sans-serif',color:C.text,background:C.input}}>
                  <option value="">Pilih peran...</option>
                  {ROLES_LIST.map(r=><option key={r}>{r}</option>)}
                </select>
                {rows.length>1&&<button onClick={()=>setRows(r=>r.filter((_,idx)=>idx!==i))} style={{width:36,height:38,borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:18,color:C.muted}}>×</button>}
              </div>
              {warns[i]&&<div style={{fontSize:11,color:C.amber,background:C.amberBg,borderRadius:7,padding:'5px 9px',marginBottom:6}}>⚠️ {warns[i]}</div>}
            </div>
          ))}
          <button onClick={()=>setRows(r=>[...r,{userId:'',role:''}])}
            style={{display:'flex',alignItems:'center',gap:7,padding:'8px 13px',border:`1.5px dashed ${C.border}`,borderRadius:9,cursor:'pointer',fontSize:12,color:C.muted,background:'transparent',fontFamily:'Poppins,sans-serif',marginBottom:14,width:'100%',justifyContent:'center',fontWeight:500}}>
            + Tambah penugasan
          </button>
          <Divider C={C}/>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
            <Btn onClick={()=>onNav('calendar')}>Batal</Btn>
            <Btn variant="gold" onClick={doSubmit}>🚀 Buat & Kirim Notifikasi</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── REVIEW ───────────────────────────────────────────────────────────────────
function ReviewPage({user,users,events,setEvents,onToast}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [notes,setNotes]=useState({}), [done,setDone]=useState({})
  const uName=id=>users.find(u=>u.id===id)?.name||id
  const toRev=events.filter(e=>{
    if(user.role==='pic') return e.pic===user.id&&e.assignees.some(a=>a.status==='review')
    if(user.role==='manager') return e.assignees.some(a=>a.status==='review')
    return false
  })
  function doApprove(eid,auid){
    setEvents(evs=>evs.map(e=>{if(e.id!==eid)return e; const na=e.assignees.map(a=>a.userId===auid?{...a,status:'selesai'}:a); return {...e,assignees:na,status:na.every(a=>a.status==='selesai')?'selesai':e.status}}))
    setDone(d=>({...d,[`${eid}-${auid}`]:'approved'})); onToast('✅ Approved! Notifikasi terkirim.')
  }
  function doRevision(eid,auid){
    const key=`${eid}-${auid}`
    if(!notes[key]){onToast('Tulis catatan revisi dulu!');return}
    setEvents(evs=>evs.map(e=>{if(e.id!==eid)return e; return {...e,status:'revisi',assignees:e.assignees.map(a=>a.userId===auid?{...a,status:'revisi',revisionNote:notes[key]}:a)}}))
    setDone(d=>({...d,[`${eid}-${auid}`]:'revision'})); onToast('📝 Catatan revisi dikirim!')
  }
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Review Konten</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Lihat hasil submit tim — approve atau beri catatan revisi</div>
      {toRev.length===0&&<Card><div style={{fontSize:13,color:C.muted,padding:'8px 0'}}>Tidak ada konten yang perlu direview saat ini. ✅</div></Card>}
      {toRev.map(ev=>(
        <Card key={ev.id} style={{borderLeft:`4px solid ${CAT_META[ev.cat]?.dot||C.border}`}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:14}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:6}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/></div>
              <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:3}}>{ev.title}</div>
              <div style={{fontSize:12,color:C.muted}}>PIC: {uName(ev.pic)} · Deadline: {ev.end}</div>
            </div>
            <SBadge status={ev.status} dark={dark}/>
          </div>
          {ev.assignees.filter(a=>a.status==='review').map(a=>{
            const key=`${ev.id}-${a.userId}`, isDone=done[key]
            return (
              <div key={a.userId} style={{background:C.bg,borderRadius:11,padding:15,marginBottom:9,border:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  <Av name={uName(a.userId)} size={32}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:C.text}}>{uName(a.userId)}</div>
                    <div style={{fontSize:11,color:C.muted}}>Peran: {a.role}</div>
                  </div>
                  <div style={{marginLeft:'auto'}}><SBadge status={a.status} dark={dark}/></div>
                </div>
                {a.submitLink&&(
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:4}}>LINK HASIL</div>
                    <a href={a.submitLink} target="_blank" rel="noreferrer"
                      style={{fontSize:13,color:C.accent,textDecoration:'none',fontWeight:600,wordBreak:'break-all'}}>🔗 {a.submitLink}</a>
                  </div>
                )}
                {a.submitNote&&(
                  <div style={{background:C.card,borderRadius:9,padding:'9px 12px',fontSize:12,color:C.text,marginBottom:10,border:`1px solid ${C.border}`,lineHeight:1.6}}>
                    <span style={{fontWeight:700,color:C.muted}}>Catatan: </span>{a.submitNote}
                  </div>
                )}
                {!isDone?(
                  <>
                    <div style={{marginBottom:9}}>
                      <div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>Feedback / Catatan Revisi</div>
                      <textarea value={notes[key]||''} onChange={e=>setNotes(n=>({...n,[key]:e.target.value}))}
                        rows={2} placeholder="Kosongkan jika tidak ada revisi, atau tulis catatan spesifik..."
                        style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,resize:'none',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',color:C.text,background:C.input,outline:'none'}}/>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <Btn variant="primary" size="sm" onClick={()=>doApprove(ev.id,a.userId)}>✅ Approve</Btn>
                      <Btn variant="danger" size="sm" onClick={()=>doRevision(ev.id,a.userId)}>📝 Kirim Revisi</Btn>
                    </div>
                  </>
                ):<div style={{fontSize:12,padding:'6px 0',color:isDone==='approved'?C.green:C.red,fontWeight:700}}>{isDone==='approved'?'✅ Approved — notifikasi terkirim.':'📝 Catatan revisi dikirim ke anggota.'}</div>}
              </div>
            )
          })}
        </Card>
      ))}
    </div>
  )
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function StatsPage({user,users,events}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const myEvs=user.role==='manager'?events:events.filter(e=>e.pic===user.id)
  const total=myEvs.length
  const byStatus={aktif:0,review:0,revisi:0,selesai:0}; myEvs.forEach(e=>{if(byStatus[e.status]!==undefined)byStatus[e.status]++})
  const byCat={}; ALL_CATS.forEach(c=>{byCat[c]=myEvs.filter(e=>e.cat===c).length})
  const byType={utama:0,liputan:0,event:0}; myEvs.forEach(e=>{if(byType[e.loadType]!==undefined)byType[e.loadType]++})
  const completion=total>0?Math.round(byStatus.selesai/total*100):0
  const sColors={aktif:'#3B82F6',review:'#F59E0B',revisi:'#EF4444',selesai:'#22C55E'}
  const maxCat=Math.max(...Object.values(byCat),1)
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Statistik Produksi</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>{user.role==='pic'?`Kategori ${(user.cats||[]).join(', ')}`:'Seluruh tim'}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[['Total',total,'#003580','#fff'],['Aktif',byStatus.aktif,'#1D4ED8','#fff'],['Review',byStatus.review,'#B45309','#fff'],['Selesai',byStatus.selesai,'#15803D','#fff']].map(([l,v,bg,fg])=>(
          <div key={l} style={{background:bg,borderRadius:12,padding:'16px 18px',boxShadow:C.shadow}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.65)',fontWeight:700,marginBottom:6}}>{l.toUpperCase()}</div>
            <div style={{fontSize:32,fontWeight:900,color:'#FFD700'}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card>
          <SecTitle>Status Konten</SecTitle>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <div style={{position:'relative',width:110,height:110,flexShrink:0}}>
              <svg width="110" height="110" style={{transform:'rotate(-90deg)'}}>
                {(()=>{let offset=0,r=42,circ=2*Math.PI*r;return Object.entries(byStatus).map(([s,v])=>{const pct=total>0?v/total:0,dash=pct*circ,gap=circ-dash,el=<circle key={s} cx="55" cy="55" r={r} fill="none" stroke={sColors[s]} strokeWidth="18" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset*circ}/>;offset+=pct;return el})})()}
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:24,fontWeight:900,color:C.text}}>{completion}%</div>
                <div style={{fontSize:9,color:C.muted,fontWeight:700}}>SELESAI</div>
              </div>
            </div>
            <div style={{flex:1}}>
              {Object.entries(byStatus).map(([s,v])=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:9,marginBottom:9}}>
                  <div style={{width:11,height:11,borderRadius:3,background:sColors[s]}}/>
                  <span style={{fontSize:12,flex:1,textTransform:'capitalize',color:C.text,fontWeight:500}}>{s}</span>
                  <span style={{fontSize:16,fontWeight:800,color:C.text}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <SecTitle>Konten per Kategori</SecTitle>
          {ALL_CATS.map(cat=>{
            const m=CAT_META[cat],v=byCat[cat]||0,pct=Math.round(v/maxCat*100)
            return (
              <div key={cat} style={{marginBottom:11}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:12,color:C.text,fontWeight:500}}>{cat}</span>
                  <span style={{fontSize:12,fontWeight:800,color:dark?m.dfg:m.fg}}>{v}</span>
                </div>
                <div style={{height:7,background:C.bg,borderRadius:4,overflow:'hidden',border:`1px solid ${C.border}`}}>
                  <div style={{height:'100%',width:`${pct}%`,background:m.dot,borderRadius:4,transition:'width .6s'}}/>
                </div>
              </div>
            )
          })}
        </Card>
        <Card>
          <SecTitle>Jenis Tugas</SecTitle>
          {LOAD_TYPES.map(lt=>{
            const v=byType[lt.value]||0,pct=total>0?Math.round(v/total*100):0
            const barC={utama:'#003580',liputan:'#B45309',event:'#6D28D9'}[lt.value]
            return (
              <div key={lt.value} style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                <div style={{width:11,height:11,borderRadius:3,background:barC}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:12,color:C.text,fontWeight:500}}>{lt.label}</span>
                    <span style={{fontSize:12,fontWeight:800,color:C.text}}>{v} ({pct}%)</span>
                  </div>
                  <div style={{height:6,background:C.bg,borderRadius:3,overflow:'hidden',border:`1px solid ${C.border}`}}>
                    <div style={{height:'100%',width:`${pct}%`,background:barC,borderRadius:3}}/>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>
        {user.role==='manager'&&(
          <Card>
            <SecTitle>Produktivitas Tim</SecTitle>
            {users.filter(u=>u.role==='member').map(u=>{
              const count=events.filter(e=>e.assignees.some(a=>a.userId===u.id)).length
              const selesai=events.filter(e=>e.status==='selesai'&&e.assignees.some(a=>a.userId===u.id)).length
              return (
                <div key={u.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:11}}>
                  <Av name={u.name} size={30}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.text}}>{u.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{count} konten · {selesai} selesai</div>
                  </div>
                  <div style={{fontSize:16,fontWeight:900,color:C.green}}>{selesai}</div>
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
function UsersPage({users,setUsers,onToast}) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [tab,setTab]=useState('list')
  const [form,setForm]=useState({name:'',email:'',password:'1234',role:'member',cats:[],isIntern:false,startDate:today(),endDate:''})
  const [err,setErr]=useState('')
  const expiring=users.filter(u=>u.isIntern&&u.endDate&&u.active&&(new Date(u.endDate)-new Date(today()))/86400000<=7&&(new Date(u.endDate)-new Date(today()))/86400000>=0)
  function toggleCat(cat){setForm(f=>({...f,cats:f.cats.includes(cat)?f.cats.filter(c=>c!==cat):[...f.cats,cat]}))}
  function doAdd(){
    if(!form.name.trim()||!form.email.trim()){setErr('Nama dan email wajib diisi!');return}
    if(users.find(u=>u.email===form.email.trim().toLowerCase())){setErr('Email sudah digunakan!');return}
    if(form.role==='pic'&&form.cats.length===0){setErr('PIC harus memiliki minimal 1 kategori!');return}
    if(form.isIntern&&!form.endDate){setErr('Isi tanggal berakhir untuk intern!');return}
    const nu={id:uid(),name:form.name.trim(),email:form.email.trim().toLowerCase(),password:form.password||'1234',role:form.role,cats:form.cats,active:true,isIntern:form.isIntern,startDate:form.startDate,endDate:form.isIntern?form.endDate:null}
    setUsers(u=>[...u,nu]); onToast(`✅ Akun ${form.name} berhasil dibuat!`)
    setForm({name:'',email:'',password:'1234',role:'member',cats:[],isIntern:false,startDate:today(),endDate:''}); setErr(''); setTab('list')
  }
  const rLabel={manager:'Manager',pic:'PIC',member:'Tim Produksi'}
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Manajemen User</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Kelola akun, PIC kategori, dan masa berlaku intern</div>
      {expiring.length>0&&(
        <div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:11,padding:'11px 15px',marginBottom:16,display:'flex',gap:10,alignItems:'flex-start'}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.amber,marginBottom:3}}>Peringatan masa magang</div>
            {expiring.map(u=><div key={u.id} style={{fontSize:12,color:C.amber}}>{u.name} — berakhir {u.endDate}</div>)}
          </div>
        </div>
      )}
      <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {[['list','👥 Daftar Akun'],['add','➕ Tambah Akun']].map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)}
            style={{padding:'9px 18px',fontSize:13,cursor:'pointer',color:tab===t?C.accent:C.muted,borderBottom:`2.5px solid ${tab===t?C.accent:'transparent'}`,fontWeight:tab===t?700:400,marginBottom:-1}}>
            {l}
          </div>
        ))}
      </div>
      {tab==='list'&&(
        <Card style={{padding:0,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,fontFamily:'Poppins,sans-serif'}}>
            <thead>
              <tr style={{background:dark?C.bg:'#F0F5FF',borderBottom:`1px solid ${C.border}`}}>
                {['Nama & Role','Email','Kategori PIC','Masa Berlaku','Status',''].map(h=>(
                  <th key={h} style={{padding:'11px 14px',fontSize:11,color:C.muted,fontWeight:700,textAlign:'left',letterSpacing:.3}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'11px 14px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <Av name={u.name} size={28}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.name}</div>
                        <div style={{display:'flex',gap:4,marginTop:2}}>
                          <span style={{fontSize:10,background:u.role==='manager'?C.purpleBg:u.role==='pic'?C.accentBg:dark?'#1E293B':'#F1F5F9',color:u.role==='manager'?C.purple:u.role==='pic'?C.accent:C.muted,padding:'1px 6px',borderRadius:4,fontWeight:700}}>{rLabel[u.role]}</span>
                          {u.isIntern&&<span style={{fontSize:10,background:dark?'#0D1F3C':'#EFF4FF',color:C.accent,padding:'1px 6px',borderRadius:4,fontWeight:700}}>Intern</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'6px 14px',color:C.muted,fontSize:12}}>{u.email}</td>
                  <td style={{padding:'6px 14px',fontSize:12,color:u.cats?.length?C.text:C.muted}}>{u.cats?.length?u.cats.join(', '):'—'}</td>
                  <td style={{padding:'6px 14px',fontSize:12,color:u.endDate&&(new Date(u.endDate)-new Date(today()))/86400000<=7?C.amber:C.muted,fontWeight:u.endDate?500:400}}>{u.endDate||'—'}</td>
                  <td style={{padding:'6px 14px'}}><span style={{fontSize:11,fontWeight:700,background:u.active?C.greenBg:C.redBg,color:u.active?C.green:C.red,padding:'3px 9px',borderRadius:6}}>{u.active?'Aktif':'Nonaktif'}</span></td>
                  <td style={{padding:'6px 14px'}}>
                    <button onClick={()=>setUsers(us=>us.map(x=>x.id===u.id?{...x,active:!x.active}:x))}
                      style={{fontSize:11,padding:'4px 10px',border:`1px solid ${C.border}`,borderRadius:7,background:'transparent',cursor:'pointer',color:C.muted,fontFamily:'Poppins,sans-serif',fontWeight:500}}>
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
        <div style={{maxWidth:520}}>
          <Card>
            <SecTitle>Data Akun Baru</SecTitle>
            {err&&<div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:9,padding:'9px 12px',fontSize:12,color:C.red,marginBottom:13,fontWeight:500}}>⚠️ {err}</div>}
            <Input label="Nama Lengkap" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} required placeholder="Nama lengkap..."/>
            <Input label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} type="email" required placeholder="email@tikkim.id"
              note="Ini akan digunakan untuk login dan menerima notifikasi"/>
            <Input label="Password Awal" value={form.password} onChange={v=>setForm(f=>({...f,password:v}))} placeholder="1234" note="Anggota bisa mengubah password setelah login"/>
            <Sel label="Role" value={form.role} onChange={v=>setForm(f=>({...f,role:v,cats:[]}))}
              options={[{value:'member',label:'Tim Produksi'},{value:'pic',label:'PIC Kategori'},{value:'manager',label:'Manager'}]}/>
            {form.role==='pic'&&(
              <div style={{marginBottom:13}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:6,fontWeight:500}}>Kategori yang dikelola <span style={{color:C.red}}>*</span></div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {ALL_CATS.map(cat=>{
                    const m=CAT_META[cat],on=form.cats.includes(cat)
                    return <button key={cat} onClick={()=>toggleCat(cat)}
                      style={{padding:'5px 12px',borderRadius:20,fontSize:12,border:`1.5px solid ${on?(dark?m.dfg:m.fg):C.border}`,background:on?(dark?m.dbg:m.bg):'transparent',color:on?(dark?m.dfg:m.fg):C.muted,cursor:'pointer',fontWeight:on?700:400,fontFamily:'Poppins,sans-serif',transition:'all .15s'}}>{cat}</button>
                  })}
                </div>
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:13,cursor:'pointer'}} onClick={()=>setForm(f=>({...f,isIntern:!f.isIntern}))}>
              <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${form.isIntern?C.accent:C.border}`,background:form.isIntern?C.accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',flexShrink:0}}>
                {form.isIntern&&<span style={{color:'#fff',fontSize:12,fontWeight:900}}>✓</span>}
              </div>
              <span style={{fontSize:13,color:C.text,fontWeight:500}}>Intern / Magang (memiliki masa berakhir)</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Input label="Tanggal Mulai" value={form.startDate} onChange={v=>setForm(f=>({...f,startDate:v}))} type="date"/>
              {form.isIntern&&<Input label="Tanggal Berakhir" value={form.endDate} onChange={v=>setForm(f=>({...f,endDate:v}))} type="date" required/>}
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:6}}>
              <Btn onClick={()=>{setTab('list');setErr('')}}>Batal</Btn>
              <Btn variant="gold" onClick={doAdd}>✅ Buat Akun</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark,setDark]=useState(false)
  const [users,setUsers]=useState(INIT_USERS)
  const [events,setEvents]=useState(INIT_EVENTS)
  const [currentUser,setCurrentUser]=useState(null)
  const [activePage,setActivePage]=useState('calendar')
  const [toast,setToast]=useState('')

  // Load dark preference
  useEffect(()=>{
    try{const d=localStorage.getItem('tikkim-dark');if(d)setDark(d==='true')}catch(e){}
  },[])
  function toggleDark(){
    setDark(d=>{try{localStorage.setItem('tikkim-dark',String(!d))}catch(e){}; return !d})
  }

  if(!currentUser) return (
    <ThemeCtx.Provider value={{dark,toggle:toggleDark}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <LoginPage users={users} onLogin={u=>{setCurrentUser(u);setActivePage('calendar')}}/>
    </ThemeCtx.Provider>
  )
  const sh={user:currentUser,users,events,setEvents,onNav:setActivePage,onToast:setToast}
  return (
    <ThemeCtx.Provider value={{dark,toggle:toggleDark}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#003580;border-radius:4px}`}</style>
      <div style={{display:'flex',height:'100vh',overflow:'hidden',fontFamily:'Poppins,sans-serif',background:dark?DARK.bg:LIGHT.bg}}>
        <Sidebar user={currentUser} activePage={activePage} onNav={setActivePage} onLogout={()=>{setCurrentUser(null);setActivePage('calendar')}}/>
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          {activePage==='calendar'  && <CalendarPage {...sh}/>}
          {activePage==='dashboard' && <DashboardPage {...sh}/>}
          {activePage==='mywork'    && <MyWorkPage {...sh}/>}
          {activePage==='submit'    && <SubmitPage {...sh}/>}
          {activePage==='delegate'  && <DelegatePage {...sh}/>}
          {activePage==='review'    && <ReviewPage {...sh}/>}
          {activePage==='stats'     && <StatsPage user={currentUser} users={users} events={events}/>}
          {activePage==='users'     && <UsersPage users={users} setUsers={setUsers} onToast={setToast}/>}
        </div>
      </div>
      <ToastMsg msg={toast} onClose={()=>setToast('')}/>
    </ThemeCtx.Provider>
  )
}