import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'dashboard' | 'about' | 'services' | 'projects' | 'testimonials' | 'tools' | 'messages' | 'settings'

interface Service { id: number; title: string; short: string; featured: boolean; features: string[] }
interface Project { id: number; title: string; category: string; description: string; tools: string[]; image: string }
interface Testimonial { id: number; name: string; role: string; text: string; service: string; rating: number; published: boolean }
interface ToolGroup { id: number; category: string; items: string[] }
interface Message { id: number; name: string; email: string; service: string; message: string; date: string; read: boolean }

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INIT_SERVICES: Service[] = [
  { id:1, title:'Customer Service', short:'Friendly, professional, and reliable support so your clients feel valued.', featured:true, features:['Customer inquiries','Chat & email support','Follow-ups','Complaint handling'] },
  { id:2, title:'Email Management', short:'Keeping your inbox organized, communication clear, and messages handled.', featured:true, features:['Inbox organization','Sorting & filtering','Professional replies','Follow-ups'] },
  { id:3, title:'Administrative Support', short:'Handling day-to-day admin so you can focus on what matters most.', featured:false, features:['Document management','Report preparation','File organization','Meeting coordination'] },
  { id:4, title:'Data Entry & Research', short:'Accurate, timely data entry so your records stay clean and current.', featured:false, features:['Data entry','Web research','Database management','Spreadsheet work'] },
]

const INIT_PROJECTS: Project[] = [
  { id:1, title:'Customer Service Support', category:'Customer Service', description:'Managed end-to-end customer inquiries for a growing e-commerce brand.', tools:['Gmail','Zendesk','Slack','Notion'], image:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=260&fit=crop&auto=format' },
  { id:2, title:'Email Management System', category:'Email Management', description:'Designed organized inbox workflows for a coaching business.', tools:['Outlook','Notion','Google Calendar'], image:'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=260&fit=crop&auto=format' },
  { id:3, title:'Administrative Support', category:'Administrative', description:'Streamlined scheduling and document management for a solopreneur.', tools:['Google Workspace','Notion','Zoom'], image:'https://images.unsplash.com/photo-1558478551-1a378f63328e?w=400&h=260&fit=crop&auto=format' },
]

const INIT_TESTIMONIALS: Testimonial[] = [
  { id:1, name:'Jessica Morales', role:'CEO, Bloom Digital Agency', text:'Working with Kate completely transformed how we handle client communications.', service:'Email Management', rating:5, published:true },
  { id:2, name:'David Okafor', role:'Founder, Okafor Consulting', text:"I was drowning in customer inquiries before Kate stepped in. She's professional and proactive.", service:'Customer Service', rating:5, published:true },
  { id:3, name:'Sarah Chen', role:'Online Business Manager', text:'Kate handles my entire calendar. She anticipates needs before I even ask.', service:'Administrative', rating:5, published:true },
]

const INIT_TOOLS: ToolGroup[] = [
  { id:1, category:'Productivity', items:['Google Workspace','Microsoft Office','Notion','Trello'] },
  { id:2, category:'Communication', items:['Gmail','Outlook','Zoom','Slack'] },
  { id:3, category:'Customer Service', items:['Zendesk','Freshdesk','HubSpot','Intercom'] },
  { id:4, category:'Skills', items:['Customer Service','Email Management','Data Entry','Time Management'] },
]

const INIT_MESSAGES: Message[] = [
  { id:1, name:'Maria Santos', email:'maria@example.com', service:'Customer Service', message:'Hi Kate! I need help with customer support for my online shop. Could we set up a call?', date:'2026-09-20', read:false },
  { id:2, name:'James Park', email:'james@example.com', service:'Email Management', message:'Looking for someone to manage my inbox and calendar. Your profile looks great!', date:'2026-09-18', read:false },
  { id:3, name:'Anna Reyes', email:'anna@example.com', service:'Administrative Support', message:"We'd love to onboard you as our VA. Please let me know your availability.", date:'2026-09-15', read:true },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const C = {
  bg: '#F7FAF0', white: '#FFFFFF', deep: '#3D5C2E', matcha: '#7FAE60',
  light: '#B8D4A0', pale: '#E6F0D8', border: '#D6E9C4', text: '#2A3824',
  muted: '#7A8F72', mid: '#52634A',
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary'|'ghost'|'outline'|'danger'; size?: 'sm'|'md'; disabled?: boolean; className?: string
}) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-xl transition-all cursor-pointer disabled:opacity-40'
  const sizeC = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
  const varC = {
    primary: 'text-white hover:opacity-90 active:scale-[.98]',
    ghost: 'hover:bg-[#E6F0D8] text-[#2A3824]',
    outline: 'border border-[#D6E9C4] text-[#2A3824] hover:bg-[#E6F0D8]',
    danger: 'text-red-600 hover:bg-red-50',
  }[variant]
  return <button onClick={onClick} disabled={disabled} className={`${base} ${sizeC} ${varC} ${className}`}
    style={variant==='primary'?{background:'linear-gradient(135deg,#7FAE60,#3D5C2E)'}:{}}>
    {children}
  </button>
}

function Badge({ children, color = 'green' }: { children: React.ReactNode; color?: 'green'|'red'|'yellow'|'gray' }) {
  const c = { green:{ bg:'#E6F0D8', text:'#3D5C2E' }, red:{ bg:'#FEE2E2', text:'#991B1B' }, yellow:{ bg:'#FEF3C7', text:'#92400E' }, gray:{ bg:'#F3F4F6', text:'#374151' } }[color]
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background:c.bg, color:c.text }}>{children}</span>
}

function Input({ label, value, onChange, type='text', placeholder='', rows=0 }: {
  label: string; value: string; onChange: (v:string)=>void; type?: string; placeholder?: string; rows?: number
}) {
  const inputStyle = { background:C.white, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, padding:'10px 14px', outline:'none', width:'100%', fontFamily:'DM Sans,sans-serif' }
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color:C.mid }}>{label}</label>
      {rows > 0
        ? <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, resize:'vertical' }} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />}
    </div>
  )
}

function Card({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl p-6 ${className}`} style={{ background:C.white, border:`1px solid ${C.border}` }}>{children}</div>
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { key: Page; label: string; icon: React.ReactNode }[] = [
  { key:'dashboard', label:'Dashboard', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { key:'about', label:'About Me', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { key:'services', label:'Services', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { key:'projects', label:'Projects', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { key:'testimonials', label:'Testimonials', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
  { key:'tools', label:'Tools & Skills', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg> },
  { key:'messages', label:'Messages', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { key:'settings', label:'Settings', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> },
]

function Sidebar({ page, setPage, onLogout }: { page: Page; setPage: (p:Page)=>void; onLogout: ()=>void }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col border-r z-40" style={{ background:C.white, borderColor:C.border }}>
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor:C.border }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background:'linear-gradient(135deg,#7FAE60,#3D5C2E)', fontFamily:'Playfair Display,serif' }}>KY</div>
        <div>
          <p className="text-sm font-semibold" style={{ color:C.text }}>Kate Villaraza</p>
          <p className="text-xs" style={{ color:C.muted }}>Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)}
            className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all mx-auto"
            style={{ background:page===n.key?C.pale:'transparent', color:page===n.key?C.deep:C.muted, borderRadius:12, margin:'1px 8px', width:'calc(100% - 16px)' }}>
            {n.icon}{n.label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t" style={{ borderColor:C.border }}>
        <a href="#" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl mb-2 hover:bg-[#E6F0D8] transition-colors" style={{ color:C.mid }}
          onClick={e => { e.preventDefault(); window.location.hash = '' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m12 0l-4-4m4 4l-4 4M21 12V7a2 2 0 00-2-2H7" /></svg>
          View Portfolio
        </a>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-colors hover:bg-red-50 text-red-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </aside>
  )
}

// ─── Dashboard Overview ────────────────────────────────────────────────────────

function Dashboard({ unread, setPage }: { unread: number; setPage: (p:Page)=>void }) {
  const stats = [
    { label:'Services', value:4, icon:'💼', color:C.pale },
    { label:'Projects', value:3, icon:'📁', color:'#EFF6FF' },
    { label:'Testimonials', value:3, icon:'⭐', color:'#FEF9C3' },
    { label:'Unread Messages', value:unread, icon:'✉️', color:'#FEE2E2', alert:unread>0 },
  ]
  const activity = [
    { text:'New message from Maria Santos', time:'2h ago', dot:'red' },
    { text:'James Park inquired about Email Management', time:'1d ago', dot:'red' },
    { text:'Testimonial from Sarah Chen published', time:'3d ago', dot:'green' },
    { text:'Project "Customer Service Support" updated', time:'5d ago', dot:'green' },
    { text:'Anna Reyes message marked as read', time:'6d ago', dot:'gray' },
  ]
  const dotC = { red:'#EF4444', green:C.matcha, gray:C.border }
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Welcome back, Kate!</h1>
        <p className="text-sm" style={{ color:C.muted }}>Here's what's happening with your portfolio.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-all" style={{ background:s.color, border:`1px solid ${C.border}` }}
            onClick={() => { if(s.label==='Unread Messages') setPage('messages') }}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <p className="text-2xl font-semibold" style={{ color:C.text }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color:C.muted }}>{s.label}</p>
            {s.alert && <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Action needed</span>}
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold mb-5" style={{ color:C.text }}>Recent Activity</h2>
          <div className="flex flex-col gap-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background:dotC[a.dot as keyof typeof dotC] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color:C.text }}>{a.text}</p>
                  <p className="text-xs mt-0.5" style={{ color:C.muted }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-base font-semibold mb-5" style={{ color:C.text }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Add Service', page:'services' as Page, icon:'➕' },
              { label:'Add Project', page:'projects' as Page, icon:'📂' },
              { label:'Add Testimonial', page:'testimonials' as Page, icon:'💬' },
              { label:'Check Messages', page:'messages' as Page, icon:'✉️' },
              { label:'Update About', page:'about' as Page, icon:'👤' },
              { label:'Edit Settings', page:'settings' as Page, icon:'⚙️' },
            ].map(q => (
              <button key={q.label} onClick={() => setPage(q.page)} className="flex items-center gap-2 p-3 rounded-xl text-left text-sm transition-all hover:-translate-y-0.5 hover:shadow-sm" style={{ background:C.pale, color:C.text }}>
                <span>{q.icon}</span>{q.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── About Me ─────────────────────────────────────────────────────────────────

function AboutPage() {
  const [bio1, setBio1] = useState("Hello! I'm Kate — a dedicated and detail-oriented Virtual Assistant passionate about helping businesses stay organized.")
  const [bio2, setBio2] = useState("I bring structure, warmth, and reliability to every engagement. Whether it's taming a chaotic inbox or supporting your customers — I've got you covered.")
  const [saved, setSaved] = useState(false)
  const [strengths, setStrengths] = useState(['Customer-focused','Organized & reliable','Detail-oriented','Strong communicator','Problem solver','Quick learner'])
  const [newStrength, setNewStrength] = useState('')
  const statsInit = [{ raw:'3+', label:'Years Experience' },{ raw:'50+', label:'Clients Supported' },{ raw:'120+', label:'Projects Completed' },{ raw:'98%', label:'Satisfaction' }]
  const [stats, setStats] = useState(statsInit)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>About Me</h1>
        <Btn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}>{saved ? '✓ Saved!' : 'Save Changes'}</Btn>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>Bio</h2>
          <Input label="Paragraph 1" value={bio1} onChange={setBio1} rows={3} />
          <Input label="Paragraph 2" value={bio2} onChange={setBio2} rows={3} />
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>Stats</h2>
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Input label={`Stat ${i+1} Value`} value={s.raw} onChange={v => setStats(st => st.map((x,j)=>j===i?{...x,raw:v}:x))} />
              <Input label="Label" value={s.label} onChange={v => setStats(st => st.map((x,j)=>j===i?{...x,label:v}:x))} />
            </div>
          ))}
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>Strengths</h2>
          <div className="flex flex-wrap gap-2">
            {strengths.map(s => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background:C.pale, color:C.text }}>
                {s}
                <button onClick={() => setStrengths(st => st.filter(x=>x!==s))} className="text-[#7A8F72] hover:text-red-500 ml-0.5">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newStrength} onChange={e=>setNewStrength(e.target.value)} placeholder="Add strength…" onKeyDown={e=>{if(e.key==='Enter'&&newStrength.trim()){setStrengths(s=>[...s,newStrength.trim()]);setNewStrength('')}}}
              className="flex-1 text-sm rounded-xl px-3 py-2" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }} />
            <Btn size="sm" onClick={() => { if(newStrength.trim()){setStrengths(s=>[...s,newStrength.trim()]);setNewStrength('')} }}>Add</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

function ServicesPage() {
  const [items, setItems] = useState(INIT_SERVICES)
  const [editing, setEditing] = useState<Service|null>(null)
  const [adding, setAdding] = useState(false)
  const blank: Omit<Service,'id'> = { title:'', short:'', featured:false, features:[] }
  const [draft, setDraft] = useState<Omit<Service,'id'>>(blank)
  const [newFeature, setNewFeature] = useState('')
  const save = () => {
    if (!draft.title.trim()) return
    if (editing) { setItems(i => i.map(x=>x.id===editing.id?{...editing,...draft}:x)); setEditing(null) }
    else { setItems(i => [...i,{...draft,id:Date.now()}]); setAdding(false) }
    setDraft(blank); setNewFeature('')
  }
  const openEdit = (s: Service) => { setEditing(s); setDraft({title:s.title,short:s.short,featured:s.featured,features:[...s.features]}); setAdding(false) }
  const openAdd = () => { setAdding(true); setEditing(null); setDraft(blank) }
  const cancel = () => { setEditing(null); setAdding(false); setDraft(blank) }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Services</h1>
        <Btn onClick={openAdd}>+ Add Service</Btn>
      </div>
      {(adding || editing) && (
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>{editing ? 'Edit Service' : 'New Service'}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Title" value={draft.title} onChange={v=>setDraft(d=>({...d,title:v}))} />
            <div className="flex items-center gap-2 self-end pb-1">
              <input type="checkbox" id="featured" checked={draft.featured} onChange={e=>setDraft(d=>({...d,featured:e.target.checked}))} className="accent-[#7FAE60]" />
              <label htmlFor="featured" className="text-sm" style={{ color:C.mid }}>Featured (highlight card)</label>
            </div>
          </div>
          <Input label="Short Description" value={draft.short} onChange={v=>setDraft(d=>({...d,short:v}))} rows={2} />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color:C.mid }}>Features</label>
            <div className="flex flex-wrap gap-2">
              {draft.features.map(f => (
                <span key={f} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background:C.pale, color:C.text }}>{f}
                  <button onClick={() => setDraft(d=>({...d,features:d.features.filter(x=>x!==f)}))} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newFeature} onChange={e=>setNewFeature(e.target.value)} placeholder="Add feature…" onKeyDown={e=>{if(e.key==='Enter'&&newFeature.trim()){setDraft(d=>({...d,features:[...d.features,newFeature.trim()]}));setNewFeature('')}}}
                className="flex-1 text-sm rounded-xl px-3 py-2" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }} />
              <Btn size="sm" onClick={()=>{if(newFeature.trim()){setDraft(d=>({...d,features:[...d.features,newFeature.trim()]}));setNewFeature('')}}}>Add</Btn>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Btn onClick={save}>Save</Btn><Btn variant="outline" onClick={cancel}>Cancel</Btn>
          </div>
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(s => (
          <Card key={s.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold" style={{ color:C.text }}>{s.title}</h3>
                {s.featured && <Badge color="green">Featured</Badge>}
              </div>
              <div className="flex gap-1">
                <Btn size="sm" variant="ghost" onClick={() => openEdit(s)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={()=>setItems(i=>i.filter(x=>x.id!==s.id))}>Delete</Btn>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color:C.muted }}>{s.short}</p>
            <div className="flex flex-wrap gap-1">
              {s.features.map(f => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:C.pale, color:C.mid }}>{f}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsPage() {
  const [items, setItems] = useState(INIT_PROJECTS)
  const [editing, setEditing] = useState<Project|null>(null)
  const [adding, setAdding] = useState(false)
  const blank: Omit<Project,'id'> = { title:'', category:'', description:'', tools:[], image:'' }
  const [draft, setDraft] = useState<Omit<Project,'id'>>(blank)
  const [newTool, setNewTool] = useState('')
  const CATS = ['Customer Service','Email Management','Administrative','Social Media','Data Entry']
  const save = () => {
    if (!draft.title.trim()) return
    if (editing) setItems(i=>i.map(x=>x.id===editing.id?{...editing,...draft}:x))
    else setItems(i=>[...i,{...draft,id:Date.now()}])
    setEditing(null); setAdding(false); setDraft(blank); setNewTool('')
  }
  const openEdit = (p: Project) => { setEditing(p); setDraft({title:p.title,category:p.category,description:p.description,tools:[...p.tools],image:p.image}); setAdding(false) }
  const cancel = () => { setEditing(null); setAdding(false); setDraft(blank) }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Projects</h1>
        <Btn onClick={() => { setAdding(true); setEditing(null); setDraft(blank) }}>+ Add Project</Btn>
      </div>
      {(adding || editing) && (
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>{editing ? 'Edit Project' : 'New Project'}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Title" value={draft.title} onChange={v=>setDraft(d=>({...d,title:v}))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color:C.mid }}>Category</label>
              <select value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))} className="text-sm rounded-xl px-3 py-2.5" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }}>
                <option value="">Select…</option>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input label="Description" value={draft.description} onChange={v=>setDraft(d=>({...d,description:v}))} rows={2} />
          <Input label="Cover Image URL" value={draft.image} onChange={v=>setDraft(d=>({...d,image:v}))} placeholder="https://..." />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color:C.mid }}>Tools Used</label>
            <div className="flex flex-wrap gap-2">
              {draft.tools.map(t=><span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background:C.pale, color:C.text }}>{t}<button onClick={()=>setDraft(d=>({...d,tools:d.tools.filter(x=>x!==t)}))} className="hover:text-red-500 ml-0.5">×</button></span>)}
            </div>
            <div className="flex gap-2">
              <input value={newTool} onChange={e=>setNewTool(e.target.value)} placeholder="Add tool…" onKeyDown={e=>{if(e.key==='Enter'&&newTool.trim()){setDraft(d=>({...d,tools:[...d.tools,newTool.trim()]}));setNewTool('')}}}
                className="flex-1 text-sm rounded-xl px-3 py-2" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }} />
              <Btn size="sm" onClick={()=>{if(newTool.trim()){setDraft(d=>({...d,tools:[...d.tools,newTool.trim()]}));setNewTool('')}}}>Add</Btn>
            </div>
          </div>
          <div className="flex gap-3 pt-1"><Btn onClick={save}>Save</Btn><Btn variant="outline" onClick={cancel}>Cancel</Btn></div>
        </Card>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <Card key={p.id} className="flex flex-col gap-3 p-0 overflow-hidden">
            <div className="aspect-video overflow-hidden" style={{ background:C.pale }}>
              {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
            </div>
            <div className="px-5 pb-5 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold" style={{ color:C.text }}>{p.title}</h3>
                <Badge color="green">{p.category}</Badge>
              </div>
              <p className="text-xs" style={{ color:C.muted }}>{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.tools.map(t=><span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:C.pale, color:C.mid }}>{t}</span>)}
              </div>
              <div className="flex gap-2 pt-1">
                <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={()=>setItems(i=>i.filter(x=>x.id!==p.id))}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsPage() {
  const [items, setItems] = useState(INIT_TESTIMONIALS)
  const [editing, setEditing] = useState<Testimonial|null>(null)
  const [adding, setAdding] = useState(false)
  const blank: Omit<Testimonial,'id'> = { name:'', role:'', text:'', service:'', rating:5, published:true }
  const [draft, setDraft] = useState<Omit<Testimonial,'id'>>(blank)
  const save = () => {
    if (!draft.name.trim()) return
    if (editing) setItems(i=>i.map(x=>x.id===editing.id?{...editing,...draft}:x))
    else setItems(i=>[...i,{...draft,id:Date.now()}])
    setEditing(null); setAdding(false); setDraft(blank)
  }
  const openEdit = (t: Testimonial) => { setEditing(t); setDraft({name:t.name,role:t.role,text:t.text,service:t.service,rating:t.rating,published:t.published}); setAdding(false) }
  const SERVICES = ['Email Management','Customer Service','Administrative','Social Media','Data Entry']
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Testimonials</h1>
        <Btn onClick={() => { setAdding(true); setEditing(null); setDraft(blank) }}>+ Add Testimonial</Btn>
      </div>
      {(adding || editing) && (
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Client Name" value={draft.name} onChange={v=>setDraft(d=>({...d,name:v}))} />
            <Input label="Role / Company" value={draft.role} onChange={v=>setDraft(d=>({...d,role:v}))} />
          </div>
          <Input label="Testimonial Text" value={draft.text} onChange={v=>setDraft(d=>({...d,text:v}))} rows={3} />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color:C.mid }}>Service</label>
              <select value={draft.service} onChange={e=>setDraft(d=>({...d,service:e.target.value}))} className="text-sm rounded-xl px-3 py-2.5" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }}>
                <option value="">Select…</option>
                {SERVICES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color:C.mid }}>Rating (1-5)</label>
              <select value={draft.rating} onChange={e=>setDraft(d=>({...d,rating:Number(e.target.value)}))} className="text-sm rounded-xl px-3 py-2.5" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }}>
                {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} stars</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 self-end pb-2">
              <input type="checkbox" id="pub" checked={draft.published} onChange={e=>setDraft(d=>({...d,published:e.target.checked}))} className="accent-[#7FAE60]" />
              <label htmlFor="pub" className="text-sm" style={{ color:C.mid }}>Published</label>
            </div>
          </div>
          <div className="flex gap-3"><Btn onClick={save}>Save</Btn><Btn variant="outline" onClick={()=>{setEditing(null);setAdding(false);setDraft(blank)}}>Cancel</Btn></div>
        </Card>
      )}
      <div className="flex flex-col gap-3">
        {items.map(t => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color:C.text }}>{t.name}</p>
                  <span className="text-xs" style={{ color:C.muted }}>{t.role}</span>
                  {t.published ? <Badge color="green">Published</Badge> : <Badge color="gray">Draft</Badge>}
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color:C.muted }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">{Array.from({length:t.rating}).map((_,i)=><span key={i} style={{color:'#F59E0B',fontSize:12}}>★</span>)}</div>
                  <Badge color="yellow">{t.service}</Badge>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Btn size="sm" variant="ghost" onClick={()=>setItems(i=>i.map(x=>x.id===t.id?{...x,published:!x.published}:x))}>{t.published?'Unpublish':'Publish'}</Btn>
                <Btn size="sm" variant="ghost" onClick={()=>openEdit(t)}>Edit</Btn>
                <Btn size="sm" variant="danger" onClick={()=>setItems(i=>i.filter(x=>x.id!==t.id))}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Tools & Skills ───────────────────────────────────────────────────────────

function ToolsPage() {
  const [groups, setGroups] = useState(INIT_TOOLS)
  const [newItems, setNewItems] = useState<Record<number,string>>({})
  const [newCat, setNewCat] = useState('')
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Tools & Skills</h1>
        <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200)}}>{saved?'✓ Saved!':'Save Changes'}</Btn>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map(g => (
          <Card key={g.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color:C.matcha }}>{g.category}</h2>
              <Btn size="sm" variant="danger" onClick={()=>setGroups(gs=>gs.filter(x=>x.id!==g.id))}>Remove</Btn>
            </div>
            <div className="flex flex-col gap-1.5">
              {g.items.map(item=>(
                <div key={item} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs" style={{ background:C.pale, color:C.text }}>
                  {item}
                  <button onClick={()=>setGroups(gs=>gs.map(x=>x.id===g.id?{...x,items:x.items.filter(i=>i!==item)}:x))} className="text-[#7A8F72] hover:text-red-500 ml-1.5">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newItems[g.id]||''} onChange={e=>setNewItems(n=>({...n,[g.id]:e.target.value}))} placeholder="Add item…"
                onKeyDown={e=>{if(e.key==='Enter'&&(newItems[g.id]||'').trim()){setGroups(gs=>gs.map(x=>x.id===g.id?{...x,items:[...x.items,newItems[g.id].trim()]}:x));setNewItems(n=>({...n,[g.id]:''}))}}}
                className="flex-1 text-xs rounded-lg px-2.5 py-2" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }} />
              <Btn size="sm" onClick={()=>{const v=(newItems[g.id]||'').trim();if(v){setGroups(gs=>gs.map(x=>x.id===g.id?{...x,items:[...x.items,v]}:x));setNewItems(n=>({...n,[g.id]:''}))} }}>+</Btn>
            </div>
          </Card>
        ))}
        <Card className="flex flex-col gap-3 justify-center items-center text-center border-dashed" style={{ borderStyle:'dashed' }}>
          <p className="text-xs font-medium" style={{ color:C.muted }}>Add Category</p>
          <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category name…" className="w-full text-sm rounded-xl px-3 py-2" style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text }} />
          <Btn onClick={()=>{if(newCat.trim()){setGroups(g=>[...g,{id:Date.now(),category:newCat.trim(),items:[]}]);setNewCat('')}}}>Add Group</Btn>
        </Card>
      </div>
    </div>
  )
}

// ─── Messages ─────────────────────────────────────────────────────────────────

function MessagesPage({ messages, setMessages }: { messages: Message[]; setMessages: React.Dispatch<React.SetStateAction<Message[]>> }) {
  const [viewing, setViewing] = useState<Message|null>(null)
  const [filter, setFilter] = useState<'all'|'unread'|'read'>('all')
  const visible = messages.filter(m => filter==='all'?true:filter==='unread'?!m.read:m.read)
  const markRead = (id: number) => setMessages(ms=>ms.map(m=>m.id===id?{...m,read:true}:m))
  const toggleRead = (id: number) => setMessages(ms=>ms.map(m=>m.id===id?{...m,read:!m.read}:m))
  const del = (id: number) => { setMessages(ms=>ms.filter(m=>m.id!==id)); if(viewing?.id===id) setViewing(null) }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>
          Messages <span className="ml-2 text-sm font-normal px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">{messages.filter(m=>!m.read).length} unread</span>
        </h1>
        <div className="flex gap-2">
          {(['all','unread','read'] as const).map(f=><button key={f} onClick={()=>setFilter(f)} className="px-3 py-1.5 text-xs rounded-xl capitalize transition-all" style={{ background:filter===f?C.deep:'transparent', color:filter===f?'#fff':C.muted, border:`1px solid ${C.border}` }}>{f}</button>)}
        </div>
      </div>
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-2">
          {visible.length === 0 && <p className="text-sm text-center py-8" style={{ color:C.muted }}>No messages</p>}
          {visible.map(m => (
            <div key={m.id} onClick={() => { setViewing(m); markRead(m.id) }}
              className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-sm"
              style={{ background:viewing?.id===m.id?C.pale:C.white, border:`1px solid ${viewing?.id===m.id?C.matcha:C.border}` }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color:C.text }}>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                  {m.name}
                </p>
                <span className="text-xs shrink-0" style={{ color:C.muted }}>{m.date}</span>
              </div>
              <p className="text-xs mb-1" style={{ color:C.muted }}>{m.email}</p>
              <p className="text-xs truncate" style={{ color:C.mid }}>{m.message}</p>
              <Badge color="green">{m.service}</Badge>
            </div>
          ))}
        </div>
        <div className="lg:col-span-3">
          {viewing ? (
            <Card className="flex flex-col gap-5 h-full">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold" style={{ color:C.text }}>{viewing.name}</h2>
                  <p className="text-xs" style={{ color:C.muted }}>{viewing.email} · {viewing.date}</p>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" variant="outline" onClick={()=>toggleRead(viewing.id)}>{messages.find(m=>m.id===viewing.id)?.read?'Mark Unread':'Mark Read'}</Btn>
                  <Btn size="sm" variant="danger" onClick={()=>del(viewing.id)}>Delete</Btn>
                </div>
              </div>
              <Badge color="yellow">{viewing.service}</Badge>
              <div className="p-4 rounded-xl text-sm leading-relaxed flex-1" style={{ background:C.pale, color:C.text }}>
                {viewing.message}
              </div>
              <a href={`mailto:${viewing.email}`} className="inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all" style={{ background:'linear-gradient(135deg,#7FAE60,#3D5C2E)' }}>
                Reply via Email ↗
              </a>
            </Card>
          ) : (
            <div className="h-full rounded-2xl flex items-center justify-center text-sm" style={{ background:C.pale, color:C.muted, minHeight:300 }}>
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

function SettingsPage() {
  const [fields, setFields] = useState({
    siteName:'Kate Yu Villaraza', tagline:'Your Reliable Partner in Productivity.',
    heroTitle:'Your Reliable Partner in Productivity.', heroSub:'Helping businesses stay organized, connected, and focused.',
    email:'kate@katevillaraza.co', phone:'+63 917 123 4567', location:'Manila, Philippines',
    linkedin:'linkedin.com/in/katevillaraza', instagram:'@katevillaraza', twitter:'@katevillaraza',
    available:'true',
  })
  const [saved, setSaved] = useState(false)
  const f = (key: string) => ({ label:key, value:fields[key as keyof typeof fields], onChange:(v:string)=>setFields(s=>({...s,[key]:v})) })
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Website Settings</h1>
        <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200)}}>{saved?'✓ Saved!':'Save Changes'}</Btn>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>General Info</h2>
          <Input {...f('siteName')} label="Site Name" />
          <Input {...f('tagline')} label="Tagline" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="avail" checked={fields.available==='true'} onChange={e=>setFields(s=>({...s,available:e.target.checked?'true':'false'}))} className="accent-[#7FAE60]" />
            <label htmlFor="avail" className="text-sm" style={{ color:C.mid }}>Show "Available for New Clients" badge</label>
          </div>
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>Hero Section</h2>
          <Input {...f('heroTitle')} label="Hero Title" />
          <Input {...f('heroSub')} label="Hero Subtitle" rows={2} />
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>Contact Info</h2>
          <Input {...f('email')} label="Email" type="email" />
          <Input {...f('phone')} label="Phone" />
          <Input {...f('location')} label="Location" />
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold" style={{ color:C.text }}>Social Links</h2>
          <Input {...f('linkedin')} label="LinkedIn URL" />
          <Input {...f('instagram')} label="Instagram Handle" />
          <Input {...f('twitter')} label="Twitter Handle" />
        </Card>
      </div>
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: ()=>void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (email !== 'kate@admin.com' || pass !== 'admin123') { setError('Invalid email or password.'); return }
    setLoading(true); setTimeout(() => { setLoading(false); onLogin() }, 900)
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background:C.bg }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg font-semibold" style={{ background:'linear-gradient(135deg,#7FAE60,#3D5C2E)', fontFamily:'Playfair Display,serif' }}>KY</div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily:'Playfair Display,serif', color:C.text }}>Admin Login</h1>
          <p className="text-sm mt-1" style={{ color:C.muted }}>Sign in to manage your portfolio</p>
          <p className="text-xs mt-2 px-4 py-2 rounded-lg inline-block" style={{ background:C.pale, color:C.mid }}>Demo: kate@admin.com / admin123</p>
        </div>
        <form onSubmit={submit} className="rounded-3xl p-8 flex flex-col gap-4 shadow-sm" style={{ background:C.white, border:`1px solid ${C.border}` }}>
          {error && <div className="px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color:C.mid }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="kate@admin.com"
              style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:14, padding:'12px 16px', outline:'none' }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color:C.mid }}>Password</label>
            <div className="relative">
              <input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} required placeholder="••••••••"
                style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:14, padding:'12px 44px 12px 16px', outline:'none', width:'100%' }} />
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded" style={{ color:C.muted }}>
                {show?'Hide':'Show'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-full text-sm font-medium text-white mt-2 disabled:opacity-60 hover:opacity-90 transition-all" style={{ background:'linear-gradient(135deg,#7FAE60,#3D5C2E)' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [page, setPage] = useState<Page>('dashboard')
  const [messages, setMessages] = useState(INIT_MESSAGES)
  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  const unread = messages.filter(m => !m.read).length
  return (
    <div className="flex min-h-screen" style={{ background:C.bg }}>
      <Sidebar page={page} setPage={setPage} onLogout={() => setAuthed(false)} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto">
          {page === 'dashboard' && <Dashboard unread={unread} setPage={setPage} />}
          {page === 'about' && <AboutPage />}
          {page === 'services' && <ServicesPage />}
          {page === 'projects' && <ProjectsPage />}
          {page === 'testimonials' && <TestimonialsPage />}
          {page === 'tools' && <ToolsPage />}
          {page === 'messages' && <MessagesPage messages={messages} setMessages={setMessages} />}
          {page === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  )
}
