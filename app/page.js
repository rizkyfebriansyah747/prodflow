'use client'
import { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react'

// ─── THEME ─────────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: false, toggle: () => {} })
const useTheme = () => useContext(ThemeCtx)
const LIGHT = {
  bg:'#EEF2F9',card:'#FFFFFF',sidebar:'#003580',border:'#D3DCF0',
  text:'#0A1628',muted:'#5A7A9A',faint:'#B0C4DE',
  accent:'#0050B3',accentBg:'#E6F0FF',
  green:'#15803D',greenBg:'#F0FDF4',red:'#B91C1C',redBg:'#FEF2F2',
  amber:'#B45309',amberBg:'#FFFBEB',purple:'#6D28D9',purpleBg:'#F5F3FF',
  input:'#FFFFFF',inputBorder:'#BDD3E8',shadow:'0 1px 8px rgba(0,53,128,.07)',
}
const DARK = {
  bg:'#0D1B2A',card:'#162032',sidebar:'#0A1628',border:'#1E3A5F',
  text:'#E2EBF6',muted:'#6B90B0',faint:'#2E4A63',
  accent:'#3B82F6',accentBg:'#0D1F3C',
  green:'#22C55E',greenBg:'#052E16',red:'#F87171',redBg:'#2D0A0A',
  amber:'#FCD34D',amberBg:'#2D1A00',purple:'#A78BFA',purpleBg:'#1E1040',
  input:'#1A2D42',inputBorder:'#1E3A5F',shadow:'0 1px 8px rgba(0,0,0,.35)',
}

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const CAT_META = {
  Instagram:{ bg:'#FCE7F3',fg:'#9D174D',dot:'#EC4899',dbg:'#3D0A1E',dfg:'#F9A8D4' },
  TikTok:   { bg:'#E0F2FE',fg:'#0369A1',dot:'#0EA5E9',dbg:'#0C1F2E',dfg:'#7DD3FC' },
  YouTube:  { bg:'#FEE2E2',fg:'#B91C1C',dot:'#EF4444',dbg:'#2D0A0A',dfg:'#FCA5A5' },
  Artikel:  { bg:'#DCFCE7',fg:'#15803D',dot:'#22C55E',dbg:'#052E16',dfg:'#86EFAC' },
  Podcast:  { bg:'#EDE9FE',fg:'#6D28D9',dot:'#8B5CF6',dbg:'#1E1040',dfg:'#C4B5FD' },
  Event:    { bg:'#FEF3C7',fg:'#B45309',dot:'#F59E0B',dbg:'#2D1A00',dfg:'#FCD34D' },
}
const ALL_CATS = Object.keys(CAT_META)
const ROLES_LIST = ['Cameraman','Editor Video','Desain Cover','Talent','Penulis','Scripting','Fotografer','Desainer','Presenter','Reporter']
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAYS_S = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

// Aturan beban kerja per hari
const LOAD_RULES = { utama:2, liputan:1, event:1 }
const LOAD_TYPES = [
  { value:'utama',   label:'Tugas Utama',    color:'#003580' },
  { value:'liputan', label:'Liputan/Dadakan', color:'#B45309' },
  { value:'event',   label:'Tugas Event',     color:'#6D28D9' },
]
const MAX_FILE_MB = 100
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024
const TODAY = '2025-04-21'

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id:'u1',name:'Ahmad Fauzi', email:'manager@tikkim.id', password:'1234',role:'manager',cats:[],active:true,isIntern:false,startDate:'2023-01-01',endDate:null },
  { id:'u2',name:'Rina Kusuma', email:'rina@tikkim.id',    password:'1234',role:'pic',cats:['Instagram','Artikel'],active:true,isIntern:false,startDate:'2023-03-01',endDate:null },
  { id:'u3',name:'Budi Santoso',email:'budi@tikkim.id',    password:'1234',role:'pic',cats:['TikTok','Podcast'],  active:true,isIntern:false,startDate:'2023-03-01',endDate:null },
  { id:'u4',name:'Inul Safitri',email:'inul@tikkim.id',    password:'1234',role:'member',cats:[],active:true,isIntern:true, startDate:'2025-02-01',endDate:'2025-07-31' },
  { id:'u5',name:'Redul Hakim', email:'redul@tikkim.id',   password:'1234',role:'member',cats:[],active:true,isIntern:true, startDate:'2025-02-01',endDate:'2025-07-31' },
  { id:'u6',name:'Sinta Dewi',  email:'sinta@tikkim.id',   password:'1234',role:'member',cats:[],active:true,isIntern:false,startDate:'2024-01-01',endDate:null },
]
const SEED_EVENTS = [
  { id:1,title:'Reels IG — Kenapa Paspor Penting?',cat:'Instagram',loadType:'utama',start:'2025-04-19',end:'2025-04-21',pic:'u2',brief:'Buat reels menarik tentang pentingnya paspor bagi traveler pemula.',
    assignees:[{userId:'u4',role:'Cameraman',status:'review',submitLink:'https://drive.google.com/sample-footage',submitNote:'Raw footage sudah diupload.',attachments:[]},
               {userId:'u5',role:'Desain Cover',status:'aktif',submitLink:null,submitNote:null,attachments:[]}]},
  { id:2,title:'TikTok — Tips Hemat Belanja Bulanan',cat:'TikTok',loadType:'utama',start:'2025-04-21',end:'2025-04-23',pic:'u3',brief:'Konten tips hemat yang relatable.',
    assignees:[{userId:'u4',role:'Talent',status:'aktif',submitLink:null,submitNote:null,attachments:[]},
               {userId:'u6',role:'Scripting',status:'aktif',submitLink:null,submitNote:null,attachments:[]}]},
  { id:3,title:'Artikel: Cara Urus Visa Schengen',cat:'Artikel',loadType:'utama',start:'2025-04-22',end:'2025-04-25',pic:'u2',brief:'Panduan lengkap pengurusan visa Schengen.',
    assignees:[{userId:'u5',role:'Penulis',status:'aktif',submitLink:null,submitNote:null,attachments:[]}]},
  { id:4,title:'YouTube — Travel Vlog Jepang',cat:'YouTube',loadType:'event',start:'2025-04-23',end:'2025-04-30',pic:'u3',brief:'Vlog perjalanan Jepang 7 hari.',
    assignees:[{userId:'u4',role:'Editor Video',status:'aktif',submitLink:null,submitNote:null,attachments:[]},
               {userId:'u5',role:'Desain Cover',status:'aktif',submitLink:null,submitNote:null,attachments:[]}]},
  { id:5,title:'Podcast — Eps. 12 Tips Traveling',cat:'Podcast',loadType:'utama',start:'2025-04-17',end:'2025-04-20',pic:'u3',brief:'Episode podcast travel blogger.',
    assignees:[{userId:'u5',role:'Editor Video',status:'revisi',submitLink:'https://drive.google.com/podcast-eps12',submitNote:'Sudah diedit.',revisionNote:'Intro terlalu panjang, potong di menit ke-2.',attachments:[]}]},
  { id:6,title:'IG Story — Promo Event Mei',cat:'Instagram',loadType:'utama',start:'2025-04-24',end:'2025-04-26',pic:'u2',brief:'Story promosi event offline bulan Mei.',
    assignees:[{userId:'u5',role:'Desainer',status:'aktif',submitLink:null,submitNote:null,attachments:[]}]},
  { id:7,title:'Festival Kuliner Jakarta 2025',cat:'Event',loadType:'event',start:'2025-04-27',end:'2025-05-03',pic:'u2',brief:'Liputan event festival kuliner tahunan.',
    assignees:[{userId:'u4',role:'Cameraman',status:'aktif',submitLink:null,submitNote:null,attachments:[]},
               {userId:'u6',role:'Fotografer',status:'aktif',submitLink:null,submitNote:null,attachments:[]}]},
  { id:8,title:'TikTok — OOTD Ramadan',cat:'TikTok',loadType:'utama',start:'2025-04-14',end:'2025-04-16',pic:'u3',brief:'Konten fashion Ramadan trending.',
    assignees:[{userId:'u4',role:'Talent',status:'selesai',submitLink:'https://drive.google.com/ootd',submitNote:'Selesai.',attachments:[]},
               {userId:'u5',role:'Desainer',status:'selesai',submitLink:'https://drive.google.com/cover',submitNote:'Cover selesai.',attachments:[]}]},
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const uid  = () => 'u'+Date.now()+Math.random().toString(36).slice(2,5)
const eid  = () => Date.now()+Math.floor(Math.random()*9999)
const fmtBytes = b => b<1024*1024 ? `${(b/1024).toFixed(0)} KB` : `${(b/(1024*1024)).toFixed(1)} MB`

function deriveStatus(assignees) {
  if(!assignees?.length) return 'aktif'
  if(assignees.every(a=>a.status==='selesai')) return 'selesai'
  if(assignees.some(a=>a.status==='revisi'))   return 'revisi'
  if(assignees.some(a=>a.status==='review'))   return 'review'
  return 'aktif'
}

// Hitung berapa slot utama yang sudah terisi user pada tanggal tertentu
function getDayLoad(userId, dateStr, events) {
  return events
    .filter(e => e.start<=dateStr && e.end>=dateStr && e.assignees.some(a=>a.userId===userId))
    .reduce((acc,e) => { acc[e.loadType]=(acc[e.loadType]||0)+1; return acc }, {utama:0,liputan:0,event:0})
}

// Apakah user penuh untuk loadType tertentu pada tanggal tertentu?
function isFull(userId, loadType, dateStr, events) {
  if(!userId) return false
  const load = getDayLoad(userId, dateStr, events)
  return (load[loadType]||0) >= (LOAD_RULES[loadType]||99)
}

function avColors(name='') {
  const p=[['#DBEAFE','#1E3A8A'],['#D1FAE5','#064E3B'],['#FEE2E2','#7F1D1D'],['#FEF3C7','#78350F'],['#EDE9FE','#4C1D95'],['#CFFAFE','#164E63'],['#FCE7F3','#831843'],['#FEF9C3','#713F12']]
  return p[(name.charCodeAt(0)||65)%p.length]
}

// ─── EMAIL VIA API ROUTE ─────────────────────────────────────────────────────
// Sends a notification email — calls /api/notify which uses Resend
async function sendNotif(type, payload) {
  try {
    await fetch('/api/notify', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ type, ...payload })
    })
  } catch(e) { console.warn('Email notif failed (non-critical):', e.message) }
}

// ─── ATOMS ──────────────────────────────────────────────────────────────────
function Av({ name='?', size=32 }) {
  const [bg,fg]=avColors(name)
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color:fg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*.35,fontWeight:700,flexShrink:0}}>{name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
}
function Chip({ cat, dark }) {
  const m=CAT_META[cat]||{bg:'#eee',fg:'#333',dbg:'#222',dfg:'#aaa'}
  return <span style={{background:dark?m.dbg:m.bg,color:dark?m.dfg:m.fg,fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700,whiteSpace:'nowrap'}}>{cat}</span>
}
function LTBadge({ type, dark }) {
  const s={utama:{bg:dark?'#0D1F3C':'#E0F2FE',fg:dark?'#7DD3FC':'#0369A1'},liputan:{bg:dark?'#2D1A00':'#FEF3C7',fg:dark?'#FCD34D':'#B45309'},event:{bg:dark?'#1E1040':'#EDE9FE',fg:dark?'#C4B5FD':'#6D28D9'}}[type]||{}
  return <span style={{background:s.bg,color:s.fg,fontSize:10,padding:'2px 8px',borderRadius:4,fontWeight:700}}>{({utama:'Utama',liputan:'Liputan',event:'Event'})[type]||type}</span>
}
function SBadge({ status, dark }) {
  const m={aktif:{l:'#EFF4FF',lf:'#1D4ED8',d:'#0D1F3C',df:'#93C5FD'},review:{l:'#FFFBEB',lf:'#B45309',d:'#2D1A00',df:'#FCD34D'},revisi:{l:'#FEF2F2',lf:'#B91C1C',d:'#2D0A0A',df:'#FCA5A5'},selesai:{l:'#F0FDF4',lf:'#15803D',d:'#052E16',df:'#86EFAC'}}[status]||{l:'#F1F5F9',lf:'#475569',d:'#1E293B',df:'#94A3B8'}
  const label={aktif:'On Progress',review:'Review',revisi:'Revisi',selesai:'Selesai'}[status]||status
  return <span style={{background:dark?m.d:m.l,color:dark?m.df:m.lf,fontSize:11,padding:'3px 9px',borderRadius:6,fontWeight:600,whiteSpace:'nowrap'}}>{label}</span>
}
function SDot({ status }) {
  return <div style={{width:7,height:7,borderRadius:'50%',background:{aktif:'#3B82F6',review:'#F59E0B',revisi:'#EF4444',selesai:'#22C55E'}[status]||'#9CA3AF',flexShrink:0}}/>
}
function Toast({ msg, onClose }) {
  useEffect(()=>{ if(msg){const t=setTimeout(onClose,3200);return()=>clearTimeout(t)} },[msg])
  if(!msg) return null
  return <div style={{position:'fixed',bottom:24,right:24,background:'#003580',color:'#fff',padding:'12px 20px',borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,boxShadow:'0 8px 32px rgba(0,53,128,.4)',fontFamily:'Poppins,sans-serif',maxWidth:360}}>{msg}</div>
}
function Card({ children, style={} }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:16,boxShadow:C.shadow,...style}}>{children}</div>
}
function SecTitle({ children }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return <div style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1.2,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>{String(children).toUpperCase()}</div>
}
function Btn({ onClick, children, variant='default', size='md', style={}, disabled=false }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const base={cursor:disabled?'not-allowed':'pointer',border:'none',borderRadius:9,fontWeight:600,fontFamily:'Poppins,sans-serif',transition:'all .15s',opacity:disabled?.45:1}
  const V={default:{background:'transparent',color:C.text,border:`1px solid ${C.border}`},primary:{background:C.accent,color:'#fff'},danger:{background:'transparent',color:C.red,border:`1px solid ${C.red}`},gold:{background:'#003580',color:'#FFD700',border:'1px solid #0050B3'},ghost:{background:'transparent',color:C.muted,border:'none'}}
  const S={sm:{padding:'5px 12px',fontSize:12},md:{padding:'8px 16px',fontSize:13},lg:{padding:'11px 22px',fontSize:14}}
  return <button onClick={disabled?undefined:onClick} style={{...base,...V[variant],...S[size],...style}}>{children}</button>
}
function TInput({ label, value, onChange, type='text', placeholder='', required=false, note='' }) {
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
function TSel({ label, value, onChange, options=[], required=false }) {
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
function TArea({ label, value, onChange, rows=3, placeholder='' }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  return (
    <div style={{marginBottom:13}}>
      {label&&<div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>{label}</div>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
        style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,color:C.text,background:C.input,boxSizing:'border-box',fontFamily:'Poppins,sans-serif',outline:'none',resize:'vertical'}}/>
    </div>
  )
}

// ─── FILE UPLOADER ───────────────────────────────────────────────────────────
function FileUploader({ files, onChange }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [drag,setDrag]=useState(false)
  const [errors,setErrors]=useState([])

  function handleFiles(fileList) {
    const errs=[], accepted=[]
    Array.from(fileList).forEach(f=>{
      if(f.size>MAX_FILE_BYTES) { errs.push(`${f.name} melebihi ${MAX_FILE_MB}MB. Gunakan link Google Drive.`); return }
      const ext=f.name.split('.').pop().toLowerCase()
      const allowed=['jpg','jpeg','png','gif','webp','mp4','mov','avi','mkv','pdf','docx','xlsx','pptx','zip']
      if(!allowed.includes(ext)) { errs.push(`${f.name} — format tidak didukung.`); return }
      accepted.push(f)
    })
    setErrors(errs)
    if(accepted.length) onChange([...files, ...accepted])
  }

  return (
    <div style={{marginBottom:13}}>
      <div style={{fontSize:12,color:C.muted,marginBottom:5,fontWeight:500}}>
        Lampiran (foto/video maks {MAX_FILE_MB}MB per file)
      </div>
      <div
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files)}}
        onClick={()=>document.getElementById('file-input-tikkim').click()}
        style={{border:`2px dashed ${drag?C.accent:C.border}`,borderRadius:10,padding:'20px 16px',textAlign:'center',cursor:'pointer',background:drag?C.accentBg:C.bg,transition:'all .15s'}}>
        <div style={{fontSize:28,marginBottom:6}}>📎</div>
        <div style={{fontSize:13,color:C.text,fontWeight:500}}>Klik atau drag & drop file di sini</div>
        <div style={{fontSize:11,color:C.muted,marginTop:3}}>JPG, PNG, MP4, MOV, PDF, DOCX dll · Maks {MAX_FILE_MB}MB per file</div>
        <div style={{fontSize:11,color:C.amber,marginTop:3,fontWeight:500}}>File &gt; {MAX_FILE_MB}MB? Gunakan link Google Drive di bawah</div>
      </div>
      <input id="file-input-tikkim" type="file" multiple style={{display:'none'}}
        accept="image/*,video/*,.pdf,.docx,.xlsx,.pptx,.zip"
        onChange={e=>handleFiles(e.target.files)}/>

      {errors.map((e,i)=>(
        <div key={i} style={{fontSize:11,color:C.red,background:C.redBg,borderRadius:7,padding:'5px 10px',marginTop:6,fontWeight:500}}>⚠ {e}</div>
      ))}

      {files.length>0&&(
        <div style={{marginTop:10,display:'flex',flexWrap:'wrap',gap:6}}>
          {files.map((f,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:6,background:C.accentBg,border:`1px solid ${C.border}`,borderRadius:8,padding:'4px 10px',fontSize:12}}>
              <span>{f.type?.startsWith('video')?'🎬':f.type?.startsWith('image')?'🖼️':'📄'}</span>
              <span style={{color:C.text,fontWeight:500,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</span>
              <span style={{color:C.muted}}>({fmtBytes(f.size)})</span>
              <button onClick={()=>onChange(files.filter((_,idx)=>idx!==i))}
                style={{background:'transparent',border:'none',cursor:'pointer',color:C.red,fontSize:14,lineHeight:1,padding:0}}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ASSIGNEE LOAD PICKER ────────────────────────────────────────────────────
// Komponen ini menampilkan semua user dengan indikator beban real-time
// User yang sudah penuh untuk loadType yang dipilih tidak bisa dipilih
function AssigneeRow({ row, idx, loadType, startDate, events, users, onUpdate, onRemove, showRemove }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const uName=id=>users.find(u=>u.id===id)?.name||id

  const activeUsers = users.filter(u=>u.active)

  // Hitung beban setiap user
  const userLoads = useMemo(()=>{
    const result={}
    activeUsers.forEach(u=>{
      result[u.id]=getDayLoad(u.id, startDate, events)
    })
    return result
  },[activeUsers, startDate, events])

  const selectedFull = row.userId ? isFull(row.userId, loadType, startDate, events) : false

  return (
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
        {/* Pilih orang */}
        <div style={{flex:1}}>
          <select value={row.userId} onChange={e=>onUpdate(idx,'userId',e.target.value)}
            style={{width:'100%',padding:'9px 10px',border:`1px solid ${selectedFull?C.red:C.inputBorder}`,borderRadius:9,fontSize:12,fontFamily:'Poppins,sans-serif',color:C.text,background:C.input,outline:'none'}}>
            <option value="">— Pilih anggota —</option>
            {activeUsers.map(u=>{
              const load=userLoads[u.id]||{utama:0,liputan:0,event:0}
              const penuh=isFull(u.id, loadType, startDate, events)
              const loadStr=`U:${load.utama}/${LOAD_RULES.utama} L:${load.liputan}/${LOAD_RULES.liputan} E:${load.event}/${LOAD_RULES.event}`
              return (
                <option key={u.id} value={u.id} disabled={penuh}>
                  {penuh?'🔴':'🟢'} {u.name} ({u.role==='pic'?'PIC':u.role==='manager'?'Mgr':'Tim'}) [{loadStr}]{penuh?` — PENUH (${({utama:'Utama',liputan:'Liputan',event:'Event'})[loadType]})` : ''}
                </option>
              )
            })}
          </select>
          {/* Load indicator untuk user yang dipilih */}
          {row.userId && (
            <div style={{marginTop:4,display:'flex',gap:6,flexWrap:'wrap'}}>
              {LOAD_TYPES.map(lt=>{
                const load=userLoads[row.userId]||{}
                const used=load[lt.value]||0, max=LOAD_RULES[lt.value]
                const full=used>=max, isThisType=lt.value===loadType
                return (
                  <div key={lt.value} style={{display:'flex',alignItems:'center',gap:4,padding:'2px 8px',borderRadius:6,background:full?C.redBg:isThisType?C.accentBg:C.bg,border:`1px solid ${full?C.red:isThisType?C.accent:C.border}`,fontSize:11}}>
                    <div style={{display:'flex',gap:2}}>
                      {Array.from({length:max}).map((_,i)=>(
                        <div key={i} style={{width:7,height:7,borderRadius:2,background:i<used?lt.color:C.border}}/>
                      ))}
                    </div>
                    <span style={{color:full?C.red:isThisType?C.accent:C.muted,fontWeight:isThisType?700:400}}>
                      {lt.label}: {used}/{max}{full?' ⚠':''}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          {selectedFull&&(
            <div style={{fontSize:11,color:C.red,background:C.redBg,borderRadius:7,padding:'6px 10px',marginTop:6,fontWeight:600}}>
              🚫 {uName(row.userId)} sudah penuh untuk slot "{LOAD_TYPES.find(l=>l.value===loadType)?.label}" pada tanggal {startDate}. Pilih orang lain atau ubah tanggal.
            </div>
          )}
        </div>

        {/* Pilih peran */}
        <select value={row.role} onChange={e=>onUpdate(idx,'role',e.target.value)}
          style={{flex:1,padding:'9px 10px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:12,fontFamily:'Poppins,sans-serif',color:C.text,background:C.input,outline:'none'}}>
          <option value="">— Pilih peran —</option>
          {ROLES_LIST.map(r=><option key={r}>{r}</option>)}
        </select>

        {showRemove&&(
          <button onClick={()=>onRemove(idx)}
            style={{width:38,height:40,borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:18,color:C.muted,flexShrink:0}}>×</button>
        )}
      </div>
    </div>
  )
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ user, activePage, onNav, onLogout }) {
  const {dark,toggle}=useTheme()
  const isMgr=user.role==='manager', isPIC=user.role==='pic', isMem=user.role==='member'
  const groups=[
    {sec:null,items:[{id:'calendar',label:'Kalender',icon:'📅'},{id:'dashboard',label:'Dashboard',icon:'🏠'}]},
    {sec:'Konten',items:[
      {id:'mywork',  label:isMgr?'Semua Konten':isPIC?'Konten Saya':'Tugas Saya',icon:'📋',show:true},
      {id:'delegate',label:'Buat & Delegasi',icon:'➕',show:isPIC||isMgr},
      {id:'review',  label:'Review Konten',  icon:'🔍',show:isPIC||isMgr},
      {id:'submit',  label:'Submit Konten',  icon:'📤',show:isMem},
    ].filter(n=>n.show!==false)},
    {sec:'Laporan',items:[
      {id:'stats',label:'Statistik',     icon:'📊',show:isMgr||isPIC},
      {id:'users',label:'Manajemen User',icon:'👥',show:isMgr},
    ].filter(n=>n.show!==false)},
  ]
  return (
    <div style={{width:220,flexShrink:0,background:'#003580',display:'flex',flexDirection:'column',fontFamily:'Poppins,sans-serif'}}>
      <div style={{padding:'20px 18px 14px',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:'#FFD700',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:18}}>🦅</span></div>
          <div>
            <div style={{fontSize:19,fontWeight:900,color:'#FFD700',letterSpacing:-1,lineHeight:1}}>TIKKIM</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,.4)',fontWeight:600,letterSpacing:.8}}>CONTENT MANAGER</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'6px 0'}}>
        {groups.map((g,gi)=>(
          <div key={gi}>
            {g.sec&&<div style={{fontSize:9,color:'rgba(255,255,255,.28)',fontWeight:700,letterSpacing:1.4,padding:'12px 18px 4px'}}>{g.sec}</div>}
            {g.items.map(n=>{
              const a=activePage===n.id
              return <div key={n.id} onClick={()=>onNav(n.id)}
                style={{padding:'9px 18px',fontSize:13,cursor:'pointer',color:a?'#FFD700':'rgba(255,255,255,.6)',background:a?'rgba(255,215,0,.1)':'transparent',fontWeight:a?700:400,borderRight:`3px solid ${a?'#FFD700':'transparent'}`,display:'flex',alignItems:'center',gap:9,transition:'all .15s'}}>
                <span style={{fontSize:14,opacity:a?1:.65}}>{n.icon}</span>{n.label}
              </div>
            })}
          </div>
        ))}
      </div>
      <div style={{padding:'12px 14px',borderTop:'1px solid rgba(255,255,255,.1)'}}>
        <button onClick={toggle} style={{width:'100%',padding:'7px 0',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',borderRadius:9,color:'rgba(255,255,255,.7)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
          {dark?'☀️ Mode Terang':'🌙 Mode Gelap'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <Av name={user.name} size={28}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.38)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{width:'100%',padding:'6px 0',background:'transparent',border:'1px solid rgba(255,255,255,.14)',borderRadius:8,color:'rgba(255,255,255,.45)',fontSize:11,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:500}}>Keluar</button>
      </div>
    </div>
  )
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginPage({ users, onLogin }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [email,setEmail]=useState(''), [pass,setPass]=useState(''), [err,setErr]=useState(''), [loading,setLoading]=useState(false)
  function doLogin() {
    const u=users.find(u=>u.email===email.trim().toLowerCase()&&u.password===pass&&u.active)
    if(!u){setErr('Email atau password salah.'); return}
    setLoading(true); setTimeout(()=>onLogin(u),400)
  }
  const demos=[['manager@tikkim.id','Manager','🏛'],['rina@tikkim.id','PIC Instagram & Artikel','📸'],['budi@tikkim.id','PIC TikTok & Podcast','🎵'],['inul@tikkim.id','Tim Produksi','🎬'],['redul@tikkim.id','Tim Produksi','✏️']]
  return (
    <div style={{display:'flex',minHeight:'100vh',background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{width:440,background:'#003580',display:'flex',flexDirection:'column',justifyContent:'center',padding:'52px 48px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-80,right:-80,width:240,height:240,borderRadius:'50%',background:'rgba(255,215,0,.05)'}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
            <div style={{width:46,height:46,borderRadius:13,background:'#FFD700',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:24}}>🦅</span></div>
            <div>
              <div style={{fontSize:30,fontWeight:900,color:'#FFD700',letterSpacing:-1.5}}>TIKKIM</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,.38)',letterSpacing:1.5,fontWeight:600}}>CONTENT MANAGER</div>
            </div>
          </div>
          <div style={{fontSize:21,fontWeight:700,color:'#fff',marginBottom:28}}>Masuk ke akun kamu</div>
          <div style={{marginBottom:13}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.48)',marginBottom:5,fontWeight:500}}>Email</div>
            <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr('')}} placeholder="email@tikkim.id" onKeyDown={e=>e.key==='Enter'&&doLogin()}
              style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,fontSize:13,color:'#fff',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',outline:'none'}}/>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.48)',marginBottom:5,fontWeight:500}}>Password</div>
            <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr('')}} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&doLogin()}
              style={{width:'100%',padding:'11px 14px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,fontSize:13,color:'#fff',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',outline:'none'}}/>
          </div>
          {err&&<div style={{fontSize:12,color:'#FCA5A5',marginBottom:8,fontWeight:500}}>⚠ {err}</div>}
          <button onClick={doLogin} disabled={loading}
            style={{width:'100%',padding:'12px 0',background:'#FFD700',color:'#003580',border:'none',borderRadius:10,fontSize:14,fontWeight:800,cursor:'pointer',marginTop:10,fontFamily:'Poppins,sans-serif',opacity:loading?.7:1}}>
            {loading?'Masuk...':'Masuk →'}
          </button>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'48px 52px',background:C.bg}}>
        <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>Login cepat (demo)</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Password semua akun: <code style={{background:C.border,padding:'2px 7px',borderRadius:5,fontSize:12,fontWeight:700}}>1234</code></div>
        <div style={{display:'flex',flexDirection:'column',gap:8,maxWidth:380}}>
          {demos.map(([e,label,icon])=>(
            <button key={e} onClick={()=>{setEmail(e);setPass('1234');setTimeout(()=>{const u=users.find(x=>x.email===e);if(u)onLogin(u)},80)}}
              style={{textAlign:'left',padding:'11px 15px',border:`1px solid ${C.border}`,borderRadius:11,background:C.card,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13,display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:20}}>{icon}</span>
              <div><div style={{fontWeight:700}}>{e}</div><div style={{fontSize:11,color:C.muted,marginTop:1}}>{label}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CALENDAR ────────────────────────────────────────────────────────────────
function CalendarPage({ user, users, events, onNav, onToast }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [yr,setYr]=useState(2025), [mo,setMo]=useState(3)
  const [filters,setFilters]=useState(new Set(ALL_CATS))
  const [selDate,setSelDate]=useState(null), [selEv,setSelEv]=useState(null)
  const [view,setView]=useState('month')
  const uName=id=>users.find(u=>u.id===id)?.name||id

  const myEvs=useCallback(()=>{
    let e=events.filter(ev=>filters.has(ev.cat))
    if(user.role==='pic') e=e.filter(ev=>ev.pic===user.id)
    if(user.role==='member') e=e.filter(ev=>ev.assignees.some(a=>a.userId===user.id))
    return e
  },[events,filters,user])

  function onDate(ds){ return myEvs().filter(e=>e.start<=ds&&e.end>=ds) }
  function navMo(d){ setMo(m=>{let n=m+d;if(n>11){setYr(y=>y+1);return 0}if(n<0){setYr(y=>y-1);return 11}return n}) }

  const cells=useMemo(()=>{
    const f=new Date(yr,mo,1).getDay(), dim=new Date(yr,mo+1,0).getDate(), pv=new Date(yr,mo,0).getDate()
    const c=[]
    for(let i=0;i<f;i++) c.push({d:pv-f+1+i,cur:false})
    for(let d=1;d<=dim;d++) c.push({d,cur:true})
    const r=(7-c.length%7)%7; for(let i=1;i<=r;i++) c.push({d:i,cur:false})
    return c
  },[yr,mo])

  const monthList=useMemo(()=>{
    const ms=`${yr}-${String(mo+1).padStart(2,'0')}`
    return myEvs().filter(e=>e.start.startsWith(ms)||e.end.startsWith(ms)).sort((a,b)=>a.start.localeCompare(b.start))
  },[yr,mo,myEvs])

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5}}>Kalender Produksi</div>
          <div style={{fontSize:13,color:C.muted,marginTop:2}}>Jadwal & rencana konten tim TIKKIM</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          {['month','list'].map(v=><Btn key={v} variant={view===v?'primary':'default'} size="sm" onClick={()=>setView(v)}>{v==='month'?'📅 Bulan':'📋 List'}</Btn>)}
          {(user.role==='pic'||user.role==='manager')&&<Btn variant="gold" size="sm" onClick={()=>onNav('delegate')}>+ Buat Konten</Btn>}
        </div>
      </div>

      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16,alignItems:'center'}}>
        <span style={{fontSize:12,color:C.muted,fontWeight:500}}>Filter:</span>
        {ALL_CATS.map(cat=>{const m=CAT_META[cat],on=filters.has(cat);return(
          <button key={cat} onClick={()=>setFilters(p=>{const n=new Set(p);on?(n.size>1&&n.delete(cat)):n.add(cat);return n})}
            style={{padding:'4px 11px',borderRadius:20,fontSize:11,border:`1.5px solid ${on?(dark?m.dfg:m.fg):C.border}`,background:on?(dark?m.dbg:m.bg):'transparent',color:on?(dark?m.dfg:m.fg):C.muted,cursor:'pointer',fontWeight:on?700:400,fontFamily:'Poppins,sans-serif'}}>{cat}</button>
        )})}
      </div>

      {view==='month'?(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',boxShadow:C.shadow}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:`1px solid ${C.border}`,background:dark?C.card:'#F5F8FF'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button onClick={()=>navMo(-1)} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>‹</button>
              <div style={{fontSize:15,fontWeight:700,minWidth:150,textAlign:'center',color:C.text}}>{MONTHS[mo]} {yr}</div>
              <button onClick={()=>navMo(1)} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:16,color:C.muted}}>›</button>
            </div>
            <Btn size="sm" onClick={()=>{setYr(2025);setMo(3)}}>Hari ini</Btn>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`1px solid ${C.border}`,background:dark?C.card:'#F5F8FF'}}>
            {DAYS_S.map(d=><div key={d} style={{textAlign:'center',padding:'8px 4px',fontSize:11,color:C.muted,fontWeight:700}}>{d}</div>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
            {cells.map((cell,idx)=>{
              const ds=cell.cur?`${yr}-${String(mo+1).padStart(2,'0')}-${String(cell.d).padStart(2,'0')}`:null
              const devs=ds?onDate(ds):[], isToday=ds===TODAY
              return (
                <div key={idx} onClick={()=>{if(ds&&devs.length>0){setSelDate(ds);setSelEv(null)}}}
                  style={{minHeight:90,padding:4,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,opacity:cell.cur?1:.3,background:isToday?(dark?'#0D1F3C':'#EFF4FF'):C.card,cursor:ds&&devs.length>0?'pointer':'default'}}>
                  <div style={{width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:isToday?800:500,borderRadius:'50%',background:isToday?'#003580':'transparent',color:isToday?'#FFD700':C.text,marginBottom:3}}>{cell.d}</div>
                  {devs.slice(0,2).map(ev=>{const m=CAT_META[ev.cat]||{};return(
                    <div key={ev.id} onClick={e=>{e.stopPropagation();setSelEv(ev);setSelDate(null)}}
                      style={{fontSize:9,padding:'2px 5px',borderRadius:3,marginBottom:2,background:dark?m.dbg:m.bg,color:dark?m.dfg:m.fg,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:700,cursor:'pointer'}}>{ev.title}</div>
                  )})}
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
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:4}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/></div>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{ev.title}</div>
                <div style={{fontSize:11,color:C.muted}}>PIC: {uName(ev.pic)} · {ev.start} → {ev.end}</div>
              </div>
              <SBadge status={deriveStatus(ev.assignees)} dark={dark}/>
            </div>
          ))}
        </Card>
      )}

      {/* Slide panel: tanggal */}
      {selDate&&(
        <div style={{position:'fixed',top:0,right:0,width:350,height:'100%',background:C.card,borderLeft:`1px solid ${C.border}`,zIndex:300,padding:22,overflowY:'auto',boxShadow:'-6px 0 32px rgba(0,0,0,.12)',fontFamily:'Poppins,sans-serif'}}>
          <button onClick={()=>setSelDate(null)} style={{position:'absolute',top:14,right:14,width:30,height:30,borderRadius:'50%',border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:18,color:C.muted}}>×</button>
          <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:4}}>📅 {selDate}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>{onDate(selDate).length} konten pada tanggal ini</div>
          {onDate(selDate).map(ev=>(
            <div key={ev.id} onClick={()=>{setSelEv(ev);setSelDate(null)}} style={{border:`1px solid ${C.border}`,borderRadius:11,padding:13,marginBottom:9,cursor:'pointer',background:C.bg}}>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:7}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/><SBadge status={deriveStatus(ev.assignees)} dark={dark}/></div>
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

      {/* Slide panel: event detail */}
      {selEv&&(
        <div style={{position:'fixed',top:0,right:0,width:350,height:'100%',background:C.card,borderLeft:`1px solid ${C.border}`,zIndex:300,padding:22,overflowY:'auto',boxShadow:'-6px 0 32px rgba(0,0,0,.12)',fontFamily:'Poppins,sans-serif'}}>
          <button onClick={()=>setSelEv(null)} style={{position:'absolute',top:14,right:14,width:30,height:30,borderRadius:'50%',border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontSize:18,color:C.muted}}>×</button>
          <div style={{marginBottom:10,display:'flex',gap:6,flexWrap:'wrap'}}><Chip cat={selEv.cat} dark={dark}/><LTBadge type={selEv.loadType} dark={dark}/></div>
          <div style={{fontSize:17,fontWeight:800,color:C.text,marginBottom:8,lineHeight:1.4}}>{selEv.title}</div>
          <SBadge status={deriveStatus(selEv.assignees)} dark={dark}/>
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:3}}>PIC</div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:C.text}}>{uName(selEv.pic)}</div>
            <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:3}}>JADWAL</div>
            <div style={{fontSize:13,marginBottom:12,color:C.text}}>{selEv.start} → {selEv.end}</div>
            {selEv.brief&&<><div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:3}}>BRIEF</div><div style={{fontSize:12,color:C.text,marginBottom:14,lineHeight:1.7,background:C.bg,padding:'10px 12px',borderRadius:9}}>{selEv.brief}</div></>}
            <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:8}}>ASSIGNEE ({selEv.assignees.length} peran)</div>
            {selEv.assignees.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                <Av name={uName(a.userId)} size={26}/>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{uName(a.userId)}</div><div style={{fontSize:11,color:C.muted}}>{a.role}</div></div>
                <SDot status={a.status}/><span style={{fontSize:11,color:C.muted,fontWeight:500}}>{a.status}</span>
              </div>
            ))}
          </div>
          {user.role==='member'&&selEv.assignees.some(a=>a.userId===user.id&&(a.status==='aktif'||a.status==='revisi'))&&(
            <Btn variant="primary" style={{width:'100%',marginTop:16}} onClick={()=>{setSelEv(null);onNav('submit')}}>📤 Submit Hasilku</Btn>
          )}
          {(user.role==='pic'||user.role==='manager')&&selEv.assignees.some(a=>a.status==='review')&&(
            <Btn variant="primary" style={{width:'100%',marginTop:16}} onClick={()=>{setSelEv(null);onNav('review')}}>🔍 Buka Review</Btn>
          )}
        </div>
      )}
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function DashboardPage({ user, users, events, onNav }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const uName=id=>users.find(u=>u.id===id)?.name||id
  const myEvs=user.role==='manager'?events:user.role==='pic'?events.filter(e=>e.pic===user.id):events.filter(e=>e.assignees.some(a=>a.userId===user.id))
  const aktif=myEvs.filter(e=>deriveStatus(e.assignees)==='aktif').length
  const review=myEvs.filter(e=>deriveStatus(e.assignees)==='review').length
  const revisi=myEvs.filter(e=>deriveStatus(e.assignees)==='revisi').length
  const selesai=myEvs.filter(e=>deriveStatus(e.assignees)==='selesai').length
  const upcoming=myEvs.filter(e=>{const diff=(new Date(e.end)-new Date(TODAY))/86400000;return diff>=0&&diff<=7&&deriveStatus(e.assignees)!=='selesai'}).sort((a,b)=>a.end.localeCompare(b.end))
  const myLoad=user.role==='member'?getDayLoad(user.id,TODAY,events):null

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>
        {user.role==='manager'?'Dashboard Manager':`Halo, ${user.name.split(' ')[0]}! 👋`}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Senin, 21 April 2025</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[['Aktif',aktif,'#1D4ED8',dark?'#0D1F3C':'#EFF4FF','🔵'],['Review',review,'#B45309',dark?'#2D1A00':'#FFFBEB','🟡'],['Revisi',revisi,'#B91C1C',dark?'#2D0A0A':'#FEF2F2','🔴'],['Selesai',selesai,'#15803D',dark?'#052E16':'#F0FDF4','🟢']].map(([l,v,fg,bg,ic])=>(
          <div key={l} style={{background:bg,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px',boxShadow:C.shadow}}>
            <div style={{fontSize:11,color:fg,fontWeight:700,marginBottom:6}}>{ic} {l.toUpperCase()}</div>
            <div style={{fontSize:30,fontWeight:800,color:fg}}>{v}</div>
          </div>
        ))}
      </div>
      {myLoad&&(
        <Card style={{marginBottom:16}}>
          <SecTitle>Beban Tugasmu Hari Ini — {TODAY}</SecTitle>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {LOAD_TYPES.map(lt=>{
              const used=myLoad[lt.value]||0, max=LOAD_RULES[lt.value], full=used>=max
              return (
                <div key={lt.value} style={{background:full?C.redBg:C.bg,border:`1px solid ${full?C.red:C.border}`,borderRadius:10,padding:'12px 14px'}}>
                  <div style={{fontSize:11,color:full?C.red:C.muted,fontWeight:700,marginBottom:6}}>{lt.label}</div>
                  <div style={{fontSize:24,fontWeight:800,color:full?C.red:C.text}}>{used}<span style={{fontSize:12,color:C.muted,fontWeight:400}}>/{max}</span></div>
                  <div style={{display:'flex',gap:3,marginTop:8}}>
                    {Array.from({length:max}).map((_,i)=><div key={i} style={{height:5,flex:1,borderRadius:3,background:i<used?lt.color:C.border}}/>)}
                  </div>
                  <div style={{fontSize:10,color:full?C.red:C.muted,marginTop:4,fontWeight:full?600:400}}>{full?'🚫 PENUH':'✅ Tersedia'}</div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card>
          <SecTitle>Deadline Minggu Ini</SecTitle>
          {upcoming.length===0&&<div style={{fontSize:13,color:C.muted}}>Tidak ada deadline minggu ini. ✅</div>}
          {upcoming.map(ev=>(
            <div key={ev.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:3,height:38,borderRadius:2,background:CAT_META[ev.cat]?.dot||C.border,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{ev.title}</div>
                <div style={{fontSize:11,color:C.muted}}>Deadline: {ev.end} · PIC: {uName(ev.pic)}</div>
              </div>
              <SBadge status={deriveStatus(ev.assignees)} dark={dark}/>
            </div>
          ))}
        </Card>
        {(user.role==='pic'||user.role==='manager')&&review>0&&(
          <div onClick={()=>onNav('review')} style={{background:dark?'#2D1A00':'#FFFBEB',border:`1px solid ${dark?'#854D0E':'#FCD34D'}`,borderRadius:14,padding:20,cursor:'pointer',display:'flex',flexDirection:'column',justifyContent:'center',gap:8}}>
            <div style={{fontSize:28}}>🔔</div>
            <div style={{fontSize:16,fontWeight:800,color:dark?'#FCD34D':'#B45309'}}>{review} konten menunggu review</div>
            <div style={{fontSize:12,color:C.muted}}>Klik untuk buka Review Konten →</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MY WORK ─────────────────────────────────────────────────────────────────
function MyWorkPage({ user, users, events, onNav }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [tab,setTab]=useState('semua')
  const uName=id=>users.find(u=>u.id===id)?.name||id
  const myEvs=user.role==='manager'?events:user.role==='pic'?events.filter(e=>e.pic===user.id):events.filter(e=>e.assignees.some(a=>a.userId===user.id))
  const filtered=myEvs.filter(e=>tab==='semua'||deriveStatus(e.assignees)===tab).sort((a,b)=>a.end.localeCompare(b.end))
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>
        {user.role==='manager'?'Semua Konten':user.role==='pic'?'Konten Saya':'Tugas Saya'}
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>{user.role==='pic'?`Kategori: ${(user.cats||[]).join(', ')}`:'Semua penugasan'}</div>
      <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {[['semua','Semua'],['aktif','Aktif'],['review','Review'],['revisi','Revisi'],['selesai','Selesai']].map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)} style={{padding:'9px 18px',fontSize:13,cursor:'pointer',color:tab===t?C.accent:C.muted,borderBottom:`2.5px solid ${tab===t?C.accent:'transparent'}`,fontWeight:tab===t?700:400,marginBottom:-1}}>{l}</div>
        ))}
      </div>
      {filtered.length===0&&<div style={{fontSize:13,color:C.muted,padding:'24px 0',textAlign:'center'}}>Tidak ada konten.</div>}
      {filtered.map(ev=>{
        const st=deriveStatus(ev.assignees), myA=ev.assignees.find(a=>a.userId===user.id)
        return (
          <div key={ev.id} style={{background:C.card,border:`1px solid ${st==='revisi'?C.red:C.border}`,borderLeft:`4px solid ${st==='revisi'?C.red:CAT_META[ev.cat]?.dot||C.border}`,borderRadius:12,padding:16,marginBottom:10,boxShadow:C.shadow}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:6}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/></div>
                <div style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:4}}>{ev.title}</div>
                {myA&&<div style={{fontSize:12,color:C.muted,marginBottom:3}}>Peranmu: <strong style={{fontWeight:700,color:C.accent}}>{myA.role}</strong> · Status: <strong style={{fontWeight:600}}>{myA.status}</strong></div>}
                <div style={{fontSize:12,color:C.muted}}>PIC: {uName(ev.pic)} · Deadline: {ev.end}</div>
                {(user.role==='manager'||user.role==='pic')&&(
                  <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:5}}>
                    {ev.assignees.map((a,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:4,background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:'3px 9px'}}>
                        <SDot status={a.status}/><span style={{fontSize:11,fontWeight:500,color:C.text}}>{uName(a.userId)}</span><span style={{fontSize:10,color:C.muted}}>({a.role})</span>
                      </div>
                    ))}
                  </div>
                )}
                {myA?.status==='revisi'&&myA?.revisionNote&&(
                  <div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:9,padding:'9px 12px',fontSize:12,color:C.red,marginTop:10,lineHeight:1.6}}>
                    <strong style={{fontWeight:700}}>📝 Catatan PIC:</strong> {myA.revisionNote}
                  </div>
                )}
              </div>
              <SBadge status={st} dark={dark}/>
            </div>
            {user.role==='member'&&myA&&(myA.status==='aktif'||myA.status==='revisi')&&(
              <div style={{marginTop:12}}><Btn variant="primary" size="sm" onClick={()=>onNav('submit')}>{myA.status==='revisi'?'📤 Submit Ulang':'📤 Submit Hasil'}</Btn></div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── SUBMIT ──────────────────────────────────────────────────────────────────
function SubmitPage({ user, users, events, setEvents, onNav, onToast }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [task,setTask]=useState(''), [link,setLink]=useState(''), [note,setNote]=useState('')
  const [files,setFiles]=useState([]), [sv,setSv]=useState('done'), [sending,setSending]=useState(false)
  const uName=id=>users.find(u=>u.id===id)?.name||id
  const myTasks=events.filter(e=>e.assignees.some(a=>a.userId===user.id&&(a.status==='aktif'||a.status==='revisi')))
  const sel=myTasks.find(e=>String(e.id)===task)
  const myRole=sel?.assignees.find(a=>a.userId===user.id)

  async function doSubmit() {
    if(!task){onToast('Pilih tugas terlebih dahulu!');return}
    if(!link.trim()&&files.length===0){onToast('Lampirkan file atau masukkan link hasil kerja!');return}
    setSending(true)
    // Simulate file upload (in real app, upload to Supabase Storage / S3)
    const attachmentNames=files.map(f=>f.name)
    setEvents(evs=>evs.map(e=>{
      if(String(e.id)!==task) return e
      return {...e, assignees:e.assignees.map(a=>a.userId===user.id?{...a,status:'review',submitLink:link.trim()||null,submitNote:note,attachments:attachmentNames}:a)}
    }))
    // Kirim notifikasi email ke PIC
    const pic=users.find(u=>u.id===sel?.pic)
    if(pic) {
      await sendNotif('submit', {
        to: pic.email, picName: pic.name,
        memberName: user.name, contentTitle: sel?.title,
        role: myRole?.role, link: link.trim(), note,
        attachments: attachmentNames,
      })
    }
    setSending(false)
    onToast('✅ Submit berhasil! PIC sudah dinotifikasi via email.')
    setTask('');setLink('');setNote('');setFiles([])
    setTimeout(()=>onNav('mywork'),1400)
  }

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Submit Konten</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Kirim hasil kerja ke PIC untuk direview</div>
      <div style={{maxWidth:600}}>
        <Card>
          <TSel label="Pilih Tugas Aktif" value={task} onChange={setTask} required
            options={[{value:'',label:'Pilih tugas...'},...myTasks.map(e=>{
              const r=e.assignees.find(a=>a.userId===user.id)
              return {value:String(e.id),label:`${e.title} — ${r?.role}${r?.status==='revisi'?' [REVISI]':''}`}
            })]}/>
          {sel&&(
            <div style={{background:C.bg,borderRadius:9,padding:'12px 14px',marginBottom:13,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>{sel.title}</div>
              <div style={{fontSize:12,color:C.muted}}>PIC: {uName(sel.pic)} · Deadline: {sel.end} · {sel.cat}</div>
              <div style={{fontSize:12,color:C.accent,fontWeight:600,marginTop:4}}>Peranmu: {myRole?.role}</div>
              {myRole?.status==='revisi'&&myRole?.revisionNote&&(
                <div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:8,padding:'8px 10px',fontSize:12,color:C.red,marginTop:8,lineHeight:1.6}}>
                  <strong style={{fontWeight:700}}>📝 Catatan revisi:</strong> {myRole.revisionNote}
                </div>
              )}
              {sel.brief&&<div style={{marginTop:6,fontSize:12,color:C.text,lineHeight:1.6}}><strong style={{fontWeight:600}}>Brief:</strong> {sel.brief}</div>}
            </div>
          )}

          <FileUploader files={files} onChange={setFiles}/>

          <TInput label="Link Google Drive (untuk file >100MB atau sudah ada di Drive)" value={link} onChange={setLink}
            placeholder="https://drive.google.com/..." note="Pastikan link bisa diakses (Anyone with link)"/>
          <TArea label="Catatan untuk PIC" value={note} onChange={setNote} rows={3}
            placeholder="Jelaskan apa yang dikerjakan, versi, atau hal yang perlu diperhatikan..."/>
          <TSel label="Status Pengerjaan" value={sv} onChange={setSv}
            options={[{value:'done',label:'✅ Selesai — siap direview'},{value:'draft',label:'📝 Draft — minta feedback'},{value:'partial',label:'⚙️ Sebagian — masih dikerjakan'}]}/>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:4}}>
            <Btn onClick={()=>onNav('mywork')}>Batal</Btn>
            <Btn variant="gold" onClick={doSubmit} disabled={sending}>{sending?'Mengirim...':'📤 Kirim ke PIC'}</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── DELEGATE ────────────────────────────────────────────────────────────────
function DelegatePage({ user, users, events, setEvents, onNav, onToast }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [title,setTitle]=useState(''), [cat,setCat]=useState('Instagram'), [loadType,setLoadType]=useState('utama')
  const [start,setStart]=useState(TODAY), [end,setEnd]=useState('2025-04-28'), [brief,setBrief]=useState('')
  const [rows,setRows]=useState([{userId:'',role:''}]), [sending,setSending]=useState(false)
  const avail=user.role==='manager'?ALL_CATS:(user.cats||[])
  const uName=id=>users.find(u=>u.id===id)?.name||id

  function updRow(i,f,v){ setRows(r=>r.map((row,idx)=>idx===i?{...row,[f]:v}:row)) }

  async function doSubmit(){
    if(!title.trim()){onToast('Isi judul konten!');return}
    const valid=rows.filter(r=>r.userId&&r.role)
    if(!valid.length){onToast('Tambahkan minimal satu penugasan!');return}
    // Cek penuh
    const overloaded=valid.filter(r=>isFull(r.userId,loadType,start,events))
    if(overloaded.length){onToast(`🚫 ${overloaded.map(r=>uName(r.userId)).join(', ')} sudah penuh. Ubah atau hapus dulu.`);return}
    setSending(true)
    const newEv={id:eid(),title:title.trim(),cat,loadType,start,end,brief,pic:user.id,assignees:valid.map(r=>({userId:r.userId,role:r.role,status:'aktif',submitLink:null,submitNote:null,attachments:[]}))}
    setEvents(ev=>[...ev,newEv])
    // Kirim email ke semua assignee
    for(const r of valid) {
      const member=users.find(u=>u.id===r.userId)
      if(member) await sendNotif('assign',{to:member.email,memberName:member.name,contentTitle:title.trim(),role:r.role,deadline:end,pic:uName(user.id),brief})
    }
    setSending(false)
    onToast('✅ Konten dibuat & notifikasi terkirim via email!')
    setTitle('');setBrief('');setRows([{userId:'',role:''}])
    setTimeout(()=>onNav('calendar'),1400)
  }

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Buat Konten & Delegasi</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Buat konten baru dan delegasikan ke tim. User yang sudah penuh beban tidak bisa dipilih.</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:920}}>
        <Card>
          <SecTitle>Detail Konten</SecTitle>
          <TInput label="Judul Konten" value={title} onChange={setTitle} required placeholder="Contoh: Reels IG — Tips Traveling Hemat"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <TSel label="Kategori" value={cat} onChange={setCat} required options={avail.map(c=>({value:c,label:c}))}/>
            <TSel label="Jenis Tugas" value={loadType} onChange={setLoadType} required
              options={LOAD_TYPES.map(l=>({value:l.value,label:`${l.label} (maks ${LOAD_RULES[l.value]}/hari)`}))}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <TInput label="Tanggal Mulai" value={start} onChange={setStart} type="date" required/>
            <TInput label="Deadline" value={end} onChange={setEnd} type="date" required/>
          </div>
          <TArea label="Brief / Deskripsi" value={brief} onChange={setBrief} rows={3} placeholder="Konsep, referensi, hal penting..."/>
        </Card>
        <Card>
          <SecTitle>Penugasan Tim</SecTitle>
          <div style={{fontSize:12,color:C.muted,marginBottom:12,lineHeight:1.7,background:C.accentBg,padding:'8px 12px',borderRadius:8,border:`1px solid ${C.accent}`}}>
            💡 <strong style={{fontWeight:700}}>Aturan 2+1+1:</strong> Tim produksi maks <strong style={{fontWeight:700}}>2 Tugas Utama</strong>, 1 Liputan, 1 Event per hari. Indikator beban ditampilkan real-time. User yang penuh tidak bisa dipilih.
          </div>
          {rows.map((row,i)=>(
            <AssigneeRow key={i} row={row} idx={i} loadType={loadType} startDate={start} events={events} users={users}
              onUpdate={updRow} onRemove={i=>setRows(r=>r.filter((_,idx)=>idx!==i))} showRemove={rows.length>1}/>
          ))}
          <button onClick={()=>setRows(r=>[...r,{userId:'',role:''}])}
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'8px',border:`1.5px dashed ${C.border}`,borderRadius:9,cursor:'pointer',fontSize:12,color:C.muted,background:'transparent',fontFamily:'Poppins,sans-serif',marginBottom:14,width:'100%',fontWeight:500}}>
            + Tambah peran / penugasan
          </button>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:'flex',justifyContent:'flex-end',gap:8}}>
            <Btn onClick={()=>onNav('calendar')}>Batal</Btn>
            <Btn variant="gold" onClick={doSubmit} disabled={sending}>{sending?'Menyimpan...':'🚀 Buat & Kirim Notifikasi'}</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── REVIEW ──────────────────────────────────────────────────────────────────
function ReviewPage({ user, users, events, setEvents, onToast }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [notes,setNotes]=useState({})
  const [done,setDone]=useState({})
  const [sending,setSending]=useState({})
  const uName=id=>users.find(u=>u.id===id)?.name||id
  const uEmail=id=>users.find(u=>u.id===id)?.email||''

  const toReview=events.filter(e=>{
    const hasReview=e.assignees.some(a=>a.status==='review')
    if(!hasReview) return false
    if(user.role==='manager') return true
    if(user.role==='pic') return e.pic===user.id
    return false
  })

  async function doApprove(evId, aUid) {
    const key=`${evId}-${aUid}`
    setSending(s=>({...s,[key]:true}))
    setEvents(evs=>evs.map(e=>{
      if(e.id!==evId) return e
      return {...e, assignees:e.assignees.map(a=>a.userId===aUid?{...a,status:'selesai'}:a)}
    }))
    // Kirim email ke member
    await sendNotif('approve',{to:uEmail(aUid),memberName:uName(aUid),contentTitle:events.find(e=>e.id===evId)?.title,picName:user.name})
    setSending(s=>({...s,[key]:false}))
    setDone(d=>({...d,[key]:'approved'}))
    onToast(`✅ ${uName(aUid)} diapprove! Email terkirim.`)
  }

  async function doRevision(evId, aUid) {
    const key=`${evId}-${aUid}`
    if(!notes[key]?.trim()){onToast('Tulis catatan revisi terlebih dahulu!');return}
    setSending(s=>({...s,[key]:true}))
    setEvents(evs=>evs.map(e=>{
      if(e.id!==evId) return e
      return {...e, assignees:e.assignees.map(a=>a.userId===aUid?{...a,status:'revisi',revisionNote:notes[key].trim()}:a)}
    }))
    await sendNotif('revision',{to:uEmail(aUid),memberName:uName(aUid),contentTitle:events.find(e=>e.id===evId)?.title,picName:user.name,note:notes[key].trim()})
    setSending(s=>({...s,[key]:false}))
    setDone(d=>({...d,[key]:'revision'}))
    onToast(`📝 Revisi dikirim ke ${uName(aUid)} via email!`)
  }

  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Review Konten</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>Review hasil submit masing-masing assignee secara independen</div>
      {toReview.length===0&&<Card><div style={{fontSize:13,color:C.muted,padding:'8px 0'}}>Tidak ada yang perlu direview saat ini. ✅</div></Card>}
      {toReview.map(ev=>{
        const reviewable=ev.assignees.filter(a=>a.status==='review')
        return (
          <Card key={ev.id} style={{borderLeft:`4px solid ${CAT_META[ev.cat]?.dot||C.border}`}}>
            {/* Header */}
            <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:14,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:7}}><Chip cat={ev.cat} dark={dark}/><LTBadge type={ev.loadType} dark={dark}/></div>
                <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:3}}>{ev.title}</div>
                <div style={{fontSize:12,color:C.muted}}>PIC: {uName(ev.pic)} · Deadline: {ev.end}</div>
                {ev.brief&&<div style={{fontSize:12,color:C.text,marginTop:6,background:C.bg,padding:'7px 10px',borderRadius:8,lineHeight:1.6}}>{ev.brief}</div>}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
                {ev.assignees.map((a,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.muted}}>
                    <SDot status={a.status}/><span style={{fontWeight:500}}>{uName(a.userId)}</span><span style={{color:C.faint}}>({a.role})</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.8,marginBottom:12}}>
              MENUNGGU REVIEW ({reviewable.length} ORANG)
            </div>
            {reviewable.map(a=>{
              const key=`${ev.id}-${a.userId}`, isDone=done[key], isSending=sending[key]
              return (
                <div key={a.userId} style={{background:C.bg,borderRadius:12,padding:16,marginBottom:12,border:`1px solid ${C.border}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                    <Av name={uName(a.userId)} size={36}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.text}}>{uName(a.userId)}</div>
                      <div style={{fontSize:12,color:C.muted}}>Peran: <strong style={{fontWeight:700,color:C.accent}}>{a.role}</strong></div>
                    </div>
                    <SBadge status={a.status} dark={dark}/>
                  </div>

                  {/* Attachments */}
                  {a.attachments?.length>0&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6}}>📎 LAMPIRAN</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                        {a.attachments.map((name,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:5,background:C.accentBg,border:`1px solid ${C.border}`,borderRadius:8,padding:'4px 10px',fontSize:12}}>
                            <span>{name.match(/\.(mp4|mov|avi|mkv)$/i)?'🎬':name.match(/\.(jpg|jpeg|png|gif|webp)$/i)?'🖼️':'📄'}</span>
                            <span style={{color:C.text,fontWeight:500}}>{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link */}
                  {a.submitLink&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:5}}>🔗 LINK HASIL</div>
                      <a href={a.submitLink} target="_blank" rel="noreferrer"
                        style={{display:'inline-block',background:C.accentBg,color:C.accent,padding:'7px 14px',borderRadius:9,fontSize:13,textDecoration:'none',fontWeight:600,wordBreak:'break-all'}}>
                        {a.submitLink}
                      </a>
                    </div>
                  )}

                  {a.submitNote&&(
                    <div style={{background:C.card,borderRadius:9,padding:'10px 13px',fontSize:13,color:C.text,marginBottom:12,border:`1px solid ${C.border}`,lineHeight:1.7}}>
                      <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:4}}>CATATAN DARI {uName(a.userId).toUpperCase()}</div>
                      {a.submitNote}
                    </div>
                  )}

                  {!isDone?(
                    <>
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:6}}>Feedback untuk {uName(a.userId)}</div>
                        <textarea value={notes[key]||''} onChange={e=>setNotes(n=>({...n,[key]:e.target.value}))} rows={2}
                          placeholder={`Kosongkan jika tidak ada revisi, atau tulis catatan spesifik untuk ${uName(a.userId)}...`}
                          style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.inputBorder}`,borderRadius:9,fontSize:13,resize:'none',boxSizing:'border-box',fontFamily:'Poppins,sans-serif',color:C.text,background:C.input,outline:'none'}}/>
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <Btn variant="primary" size="sm" disabled={isSending} onClick={()=>doApprove(ev.id,a.userId)}>
                          {isSending?'Memproses...':'✅ Approve'}
                        </Btn>
                        <Btn variant="danger" size="sm" disabled={isSending} onClick={()=>doRevision(ev.id,a.userId)}>
                          {isSending?'Mengirim...':'📝 Kirim Revisi'}
                        </Btn>
                      </div>
                    </>
                  ):(
                    <div style={{fontSize:13,padding:'9px 12px',borderRadius:9,fontWeight:600,background:isDone==='approved'?C.greenBg:C.redBg,color:isDone==='approved'?C.green:C.red}}>
                      {isDone==='approved'?`✅ ${uName(a.userId)} diapprove. Email terkirim.`:`📝 Revisi dikirim ke ${uName(a.userId)} via email.`}
                    </div>
                  )}
                </div>
              )
            })}
          </Card>
        )
      })}
    </div>
  )
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function StatsPage({ user, users, events }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const myEvs=user.role==='manager'?events:events.filter(e=>e.pic===user.id)
  const total=myEvs.length
  const byStatus={aktif:0,review:0,revisi:0,selesai:0}
  myEvs.forEach(e=>{const s=deriveStatus(e.assignees);if(s in byStatus)byStatus[s]++})
  const byCat={}; ALL_CATS.forEach(c=>{byCat[c]=myEvs.filter(e=>e.cat===c).length})
  const byType={utama:0,liputan:0,event:0}; myEvs.forEach(e=>{if(e.loadType in byType)byType[e.loadType]++})
  const completion=total>0?Math.round(byStatus.selesai/total*100):0
  const sColors={aktif:'#3B82F6',review:'#F59E0B',revisi:'#EF4444',selesai:'#22C55E'}
  const maxCat=Math.max(...Object.values(byCat),1)
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Statistik Produksi</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:22}}>{user.role==='pic'?`Kategori ${(user.cats||[]).join(', ')}`:'Seluruh tim'}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[['Total',total,'#003580'],['Aktif',byStatus.aktif,'#1D4ED8'],['Review',byStatus.review,'#B45309'],['Selesai',byStatus.selesai,'#15803D']].map(([l,v,bg])=>(
          <div key={l} style={{background:bg,borderRadius:12,padding:'16px 18px',boxShadow:C.shadow}}>
            <div style={{fontSize:11,color:'rgba(255,255,255,.6)',fontWeight:700,marginBottom:6}}>{l.toUpperCase()}</div>
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
                {(()=>{let off=0,r=42,c=2*Math.PI*r;return Object.entries(byStatus).map(([s,v])=>{const pct=total>0?v/total:0,d=pct*c,g=c-d,el=<circle key={s} cx="55" cy="55" r={r} fill="none" stroke={sColors[s]} strokeWidth="18" strokeDasharray={`${d} ${g}`} strokeDashoffset={-off*c}/>;off+=pct;return el})})()}
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
          {ALL_CATS.map(cat=>{const m=CAT_META[cat],v=byCat[cat]||0,pct=Math.round(v/maxCat*100);return(
            <div key={cat} style={{marginBottom:11}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:12,color:C.text,fontWeight:500}}>{cat}</span>
                <span style={{fontSize:12,fontWeight:800,color:dark?m.dfg:m.fg}}>{v}</span>
              </div>
              <div style={{height:7,background:C.bg,borderRadius:4,overflow:'hidden',border:`1px solid ${C.border}`}}>
                <div style={{height:'100%',width:`${pct}%`,background:m.dot,borderRadius:4,transition:'width .6s'}}/>
              </div>
            </div>
          )})}
        </Card>
        {user.role==='manager'&&(
          <Card>
            <SecTitle>Produktivitas Tim</SecTitle>
            {users.filter(u=>u.role==='member').map(u=>{
              const count=events.filter(e=>e.assignees.some(a=>a.userId===u.id)).length
              const done=events.filter(e=>e.assignees.find(a=>a.userId===u.id&&a.status==='selesai')).length
              return(
                <div key={u.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:11}}>
                  <Av name={u.name} size={30}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.text}}>{u.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{count} konten · {done} selesai</div>
                  </div>
                  <div style={{fontSize:16,fontWeight:900,color:C.green}}>{done}</div>
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}

// ─── USERS ───────────────────────────────────────────────────────────────────
function UsersPage({ users, setUsers, onToast }) {
  const {dark}=useTheme(); const C=dark?DARK:LIGHT
  const [tab,setTab]=useState('list')
  const [form,setForm]=useState({name:'',email:'',password:'1234',role:'member',cats:[],isIntern:false,startDate:TODAY,endDate:''})
  const [err,setErr]=useState('')
  const expiring=users.filter(u=>u.isIntern&&u.endDate&&u.active&&(new Date(u.endDate)-new Date(TODAY))/86400000<=7&&(new Date(u.endDate)-new Date(TODAY))/86400000>=0)
  const toggleCat=cat=>setForm(f=>({...f,cats:f.cats.includes(cat)?f.cats.filter(c=>c!==cat):[...f.cats,cat]}))
  function doAdd(){
    if(!form.name.trim()||!form.email.trim()){setErr('Nama dan email wajib diisi!');return}
    if(users.find(u=>u.email===form.email.trim().toLowerCase())){setErr('Email sudah digunakan!');return}
    if(form.role==='pic'&&form.cats.length===0){setErr('PIC harus punya minimal 1 kategori!');return}
    if(form.isIntern&&!form.endDate){setErr('Isi tanggal berakhir untuk intern!');return}
    const nu={id:uid(),name:form.name.trim(),email:form.email.trim().toLowerCase(),password:form.password||'1234',role:form.role,cats:form.cats,active:true,isIntern:form.isIntern,startDate:form.startDate,endDate:form.isIntern?form.endDate:null}
    setUsers(u=>[...u,nu]); onToast(`✅ Akun ${form.name} berhasil dibuat!`)
    setForm({name:'',email:'',password:'1234',role:'member',cats:[],isIntern:false,startDate:TODAY,endDate:''}); setErr(''); setTab('list')
  }
  const rLabel={manager:'Manager',pic:'PIC',member:'Tim Produksi'}
  return (
    <div style={{flex:1,overflow:'auto',padding:24,background:C.bg,fontFamily:'Poppins,sans-serif'}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,letterSpacing:-.5,marginBottom:2}}>Manajemen User</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Kelola akun, PIC kategori, dan masa berlaku intern</div>
      {expiring.length>0&&(
        <div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:11,padding:'11px 15px',marginBottom:16,display:'flex',gap:10}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>{expiring.map(u=><div key={u.id} style={{fontSize:12,color:C.amber,fontWeight:500}}>{u.name} — masa magang berakhir {u.endDate}</div>)}</div>
        </div>
      )}
      <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,marginBottom:18}}>
        {[['list','👥 Daftar Akun'],['add','➕ Tambah Akun']].map(([t,l])=>(
          <div key={t} onClick={()=>setTab(t)} style={{padding:'9px 18px',fontSize:13,cursor:'pointer',color:tab===t?C.accent:C.muted,borderBottom:`2.5px solid ${tab===t?C.accent:'transparent'}`,fontWeight:tab===t?700:400,marginBottom:-1}}>{l}</div>
        ))}
      </div>
      {tab==='list'&&(
        <Card style={{padding:0,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,fontFamily:'Poppins,sans-serif'}}>
            <thead><tr style={{background:dark?C.bg:'#F0F5FF',borderBottom:`1px solid ${C.border}`}}>
              {['Nama','Email','Role','Kategori PIC','Masa Berlaku','Status',''].map(h=><th key={h} style={{padding:'11px 14px',fontSize:11,color:C.muted,fontWeight:700,textAlign:'left'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:'11px 14px'}}><div style={{display:'flex',alignItems:'center',gap:9}}><Av name={u.name} size={28}/><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.name}</div>{u.isIntern&&<span style={{fontSize:10,background:C.accentBg,color:C.accent,padding:'1px 6px',borderRadius:4,fontWeight:700}}>Intern</span>}</div></div></td>
                  <td style={{padding:'6px 14px',color:C.muted,fontSize:12}}>{u.email}</td>
                  <td style={{padding:'6px 14px'}}><span style={{fontSize:11,fontWeight:700,padding:'3px 9px',borderRadius:6,background:u.role==='manager'?C.purpleBg:u.role==='pic'?C.accentBg:C.bg,color:u.role==='manager'?C.purple:u.role==='pic'?C.accent:C.muted}}>{rLabel[u.role]}</span></td>
                  <td style={{padding:'6px 14px',fontSize:12,color:C.muted}}>{u.cats?.length?u.cats.join(', '):'—'}</td>
                  <td style={{padding:'6px 14px',fontSize:12,color:u.endDate&&(new Date(u.endDate)-new Date(TODAY))/86400000<=7?C.amber:C.muted,fontWeight:500}}>{u.endDate||'—'}</td>
                  <td style={{padding:'6px 14px'}}><span style={{fontSize:11,fontWeight:700,background:u.active?C.greenBg:C.redBg,color:u.active?C.green:C.red,padding:'3px 9px',borderRadius:6}}>{u.active?'Aktif':'Nonaktif'}</span></td>
                  <td style={{padding:'6px 14px'}}><button onClick={()=>setUsers(us=>us.map(x=>x.id===u.id?{...x,active:!x.active}:x))} style={{fontSize:11,padding:'4px 10px',border:`1px solid ${C.border}`,borderRadius:7,background:'transparent',cursor:'pointer',color:C.muted,fontFamily:'Poppins,sans-serif',fontWeight:500}}>{u.active?'Nonaktifkan':'Aktifkan'}</button></td>
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
            <TInput label="Nama Lengkap" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} required placeholder="Nama lengkap..."/>
            <TInput label="Email Aktif" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} type="email" required placeholder="emailaktif@gmail.com" note="Digunakan login & notifikasi. Gunakan email aktif yang bisa menerima email."/>
            <TInput label="Password Awal" value={form.password} onChange={v=>setForm(f=>({...f,password:v}))} placeholder="1234" note="Ubah setelah login pertama"/>
            <TSel label="Role" value={form.role} onChange={v=>setForm(f=>({...f,role:v,cats:[]}))} options={[{value:'member',label:'Tim Produksi'},{value:'pic',label:'PIC Kategori'},{value:'manager',label:'Manager'}]}/>
            {form.role==='pic'&&(
              <div style={{marginBottom:13}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:6,fontWeight:500}}>Kategori yang dikelola <span style={{color:C.red}}>*</span></div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {ALL_CATS.map(cat=>{const m=CAT_META[cat],on=form.cats.includes(cat);return(
                    <button key={cat} onClick={()=>toggleCat(cat)} style={{padding:'5px 12px',borderRadius:20,fontSize:12,border:`1.5px solid ${on?(dark?m.dfg:m.fg):C.border}`,background:on?(dark?m.dbg:m.bg):'transparent',color:on?(dark?m.dfg:m.fg):C.muted,cursor:'pointer',fontWeight:on?700:400,fontFamily:'Poppins,sans-serif'}}>{cat}</button>
                  )})}
                </div>
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:13,cursor:'pointer'}} onClick={()=>setForm(f=>({...f,isIntern:!f.isIntern}))}>
              <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${form.isIntern?C.accent:C.border}`,background:form.isIntern?C.accent:'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s',flexShrink:0}}>
                {form.isIntern&&<span style={{color:'#fff',fontSize:12,fontWeight:900}}>✓</span>}
              </div>
              <span style={{fontSize:13,color:C.text,fontWeight:500}}>Intern / Magang (memiliki tanggal berakhir)</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <TInput label="Tanggal Mulai" value={form.startDate} onChange={v=>setForm(f=>({...f,startDate:v}))} type="date"/>
              {form.isIntern&&<TInput label="Tanggal Berakhir" value={form.endDate} onChange={v=>setForm(f=>({...f,endDate:v}))} type="date" required/>}
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

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark,setDark]=useState(false)
  const [users,setUsers]=useState(SEED_USERS)
  const [events,setEvents]=useState(SEED_EVENTS)
  const [currentUser,setCurrentUser]=useState(null)
  const [activePage,setActivePage]=useState('calendar')
  const [toast,setToast]=useState('')

  useEffect(()=>{ try{const d=localStorage.getItem('tikkim-dark');if(d)setDark(d==='true')}catch(e){} },[])
  function toggleDark(){ setDark(d=>{ try{localStorage.setItem('tikkim-dark',String(!d))}catch(e){}; return !d }) }

  const ctx={dark,toggle:toggleDark}
  const FONT=`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#003580;border-radius:4px}::-webkit-scrollbar-track{background:transparent}`

  if(!currentUser) return (
    <ThemeCtx.Provider value={ctx}>
      <style>{FONT}</style>
      <LoginPage users={users} onLogin={u=>{setCurrentUser(u);setActivePage('calendar')}}/>
    </ThemeCtx.Provider>
  )

  const sh={user:currentUser,users,events,setEvents,onNav:setActivePage,onToast:setToast}
  const C=dark?DARK:LIGHT

  return (
    <ThemeCtx.Provider value={ctx}>
      <style>{FONT}</style>
      <div style={{display:'flex',height:'100vh',overflow:'hidden',fontFamily:'Poppins,sans-serif',background:C.bg}}>
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
      <Toast msg={toast} onClose={()=>setToast('')}/>
    </ThemeCtx.Provider>
  )
}