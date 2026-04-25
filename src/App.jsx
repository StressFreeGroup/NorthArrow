import { useState, useEffect } from 'react'
import { Shield, Phone, Mail, MapPin, Menu, X, Check, AlertTriangle, TrendingUp, DollarSign, FileText, Users, Truck, Clock, Star, ArrowRight, ChevronDown, ChevronUp, Lock, Zap, Eye, Heart, Wrench, CircleDot, Scale, BadgeCheck, Clipboard, Send, LogIn, Layers, AlertOctagon, TriangleAlert, Ban, Info, ShieldCheck, ExternalLink, XCircle } from 'lucide-react'
import ApplicationForm from './ApplicationForm.jsx'

const C={navy900:'#0A1628',navy800:'#0F2240',navy700:'#132D5E',navy600:'#1A3F7A',navy500:'#2558A3',navy400:'#3B7DD8',navy300:'#6FA3E8',navy200:'#A8C8F0',navy100:'#D4E4F8',navy50:'#EBF2FB',green700:'#1B6E3D',green600:'#238B4E',green500:'#2EA663',green400:'#4CC07E',green100:'#D6F0E2',purple700:'#4A2D7A',purple600:'#5E3B99',purple500:'#7349B8',purple400:'#8F6DD0',purple100:'#E6DCF5',white:'#FFFFFF',grey50:'#F7F8FA',grey100:'#F0F2F5',grey200:'#E2E6EB',grey300:'#CDD3DB',grey400:'#9CA5B2',grey500:'#6B7685',grey600:'#4A5568',grey700:'#2D3748',red600:'#DC2626',red700:'#B91C1C',red50:'#FEF2F2',amber600:'#D97706',amber50:'#FFFBEB'}
const sWrap={maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)'}
const sWide={...sWrap,maxWidth:1400}
const LogoSVG=({size=42})=><svg width={size} height={size} viewBox="0 0 42 42" fill="none"><rect width="42" height="42" rx="8" fill={C.navy800}/><path d="M21 8L28 20H14L21 8Z" fill="#fff" opacity="0.9"/><path d="M21 14L26 22H16L21 14Z" fill={C.navy400}/><rect x="19" y="20" width="4" height="14" rx="1" fill="#fff" opacity="0.9"/><path d="M15 28L21 34L27 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>

function Nav({page,setPage}){
  const[open,setOpen]=useState(false)
  const[scrolled,setScrolled]=useState(false)
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>20);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h)},[])
  const links=[{id:'home',label:'Home'},{id:'coverage',label:'Coverage'},{id:'shield',label:'Shield ADW'},{id:'about',label:'About'},{id:'claims',label:'Claims'},{id:'faq',label:'FAQ'},{id:'contact',label:'Contact'}]
  const go=(id)=>{setPage(id);setOpen(false);window.scrollTo(0,0)}
  return(
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:scrolled?'rgba(255,255,255,0.97)':'rgba(255,255,255,0.92)',backdropFilter:'blur(12px)',borderBottom:scrolled?`1px solid ${C.grey200}`:'1px solid transparent',transition:'all 0.3s ease'}}>
      <div style={{...sWide,display:'flex',alignItems:'center',justifyContent:'space-between',height:72}}>
        <div style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}} onClick={()=>go('home')}>
          <LogoSVG size={42}/>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.2rem',color:C.navy800,lineHeight:1.1,letterSpacing:'-0.02em'}}>NORTH ARROW</div>
            <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.14em',color:C.grey400,textTransform:'uppercase'}}>Insurance Program</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4}} className="nav-desktop">
          {links.map(l=><button key={l.id} onClick={()=>go(l.id)} style={{padding:'8px 14px',fontSize:'0.87rem',fontWeight:600,color:page===l.id?C.navy700:C.grey600,background:page===l.id?C.navy50:'transparent',borderRadius:6,transition:'all 0.2s'}}>{l.label}</button>)}
          <div style={{width:1,height:28,background:C.grey200,margin:'0 6px'}}/>
          <button onClick={()=>go('login')} style={{padding:'8px 14px',fontSize:'0.87rem',fontWeight:600,color:C.grey600}}><LogIn size={15} style={{marginRight:5,verticalAlign:-2}}/>Login</button>
          <button onClick={()=>go('apply')} style={{padding:'10px 22px',fontSize:'0.87rem',background:C.green600,color:C.white,borderRadius:6,fontWeight:700,border:'none',cursor:'pointer'}}>Get Started</button>
        </div>
        <button style={{display:'none'}} className="nav-mobile-toggle" onClick={()=>setOpen(!open)}>{open?<X size={24}/>:<Menu size={24}/>}</button>
      </div>
      {open&&<div style={{background:C.white,borderTop:`1px solid ${C.grey200}`,padding:'20px 24px'}}>
        {links.map(l=><button key={l.id} onClick={()=>go(l.id)} style={{display:'block',width:'100%',textAlign:'left',padding:'12px 0',fontWeight:600,fontSize:'1rem',color:page===l.id?C.navy700:C.grey600,borderBottom:`1px solid ${C.grey100}`}}>{l.label}</button>)}
        <div style={{display:'flex',gap:12,marginTop:16}}>
          <button onClick={()=>go('login')} style={{flex:1,padding:'12px',border:`2px solid ${C.navy700}`,borderRadius:6,fontWeight:700,color:C.navy700,background:'transparent'}}>Login</button>
          <button onClick={()=>go('apply')} style={{flex:1,padding:'12px',background:C.green600,color:C.white,borderRadius:6,fontWeight:700,border:'none'}}>Get Started</button>
        </div>
      </div>}
      <style>{`@media(max-width:960px){.nav-desktop{display:none!important}.nav-mobile-toggle{display:flex!important}}`}</style>
    </nav>
  )
}

function Footer({setPage}){
  const go=(p)=>{setPage(p);window.scrollTo(0,0)}
  return(
    <footer style={{background:C.navy900,color:C.white,padding:'clamp(50px,6vw,80px) 0 0'}}>
      <div style={sWrap}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:40,marginBottom:50}}>
          <div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}><LogoSVG size={32}/><div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1rem'}}>NORTH ARROW</div></div><p style={{color:C.navy300,fontSize:'0.88rem',lineHeight:1.7,maxWidth:280}}>Purpose-built commercial insurance for peer-to-peer RV rental fleets.</p></div>
          <div><h4 style={{fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16,color:C.navy300}}>Products</h4>{['Coverage Plans','Shield ADW','Fleet Insurance','Add-On Coverage'].map(t=><div key={t} style={{color:C.navy200,fontSize:'0.88rem',padding:'5px 0',cursor:'pointer'}}>{t}</div>)}</div>
          <div><h4 style={{fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16,color:C.navy300}}>Company</h4>{[['About','about'],['Claims','claims'],['FAQ','faq'],['Contact','contact']].map(([t,p])=><div key={t} onClick={()=>go(p)} style={{color:C.navy200,fontSize:'0.88rem',padding:'5px 0',cursor:'pointer'}}>{t}</div>)}</div>
          <div><h4 style={{fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:16,color:C.navy300}}>Contact</h4><div style={{display:'flex',flexDirection:'column',gap:10}}><div style={{display:'flex',alignItems:'center',gap:10,color:C.navy200,fontSize:'0.88rem'}}><Phone size={15} color={C.navy300}/> (619) 599-6882</div><div style={{display:'flex',alignItems:'center',gap:10,color:C.navy200,fontSize:'0.88rem'}}><Mail size={15} color={C.navy300}/> info@northarrowins.com</div><div style={{display:'flex',alignItems:'center',gap:10,color:C.navy200,fontSize:'0.88rem'}}><MapPin size={15} color={C.navy300}/> San Diego, CA</div></div></div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',padding:'24px 0',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}><div style={{color:C.navy400,fontSize:'0.78rem'}}>&copy; {new Date().getFullYear()} North Arrow Insurance Program. All rights reserved.</div><div style={{display:'flex',gap:20}}>{['Privacy Policy','Terms of Service','Licensing'].map(t=><span key={t} style={{color:C.navy400,fontSize:'0.78rem',cursor:'pointer'}}>{t}</span>)}</div></div>
      </div>
    </footer>
  )
}

function SectionHeader({overline,title,subtitle,light,center=true,accent='green'}){
  const ac=accent==='purple'?C.purple600:accent==='navy'?C.navy400:accent==='red'?C.red600:C.green600
  return(<div style={{textAlign:center?'center':'left',marginBottom:48,maxWidth:center?680:'none',margin:center?'0 auto 48px':'0 0 48px'}}>{overline&&<div style={{fontFamily:'var(--font-body)',fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:ac,marginBottom:12}}>{overline}</div>}<h2 style={{color:light?C.white:C.navy800,marginBottom:subtitle?16:0}}>{title}</h2>{subtitle&&<p style={{fontSize:'1.05rem',color:light?C.navy200:C.grey500,lineHeight:1.7}}>{subtitle}</p>}</div>)
}

function ComparisonTable({setPage}){
  const rows=[['Bodily Injury Limits','$15K / $30K','$100K / $300K','$300K / $500K'],['Property Damage Limit','$5K','$50K','$100K'],['Deductible','$2,500','$2,000','$1,500'],['Monthly Premium','$68','$89','$124'],['Monthly Fees','$33 flat','$33 flat','$33 flat'],['Renter Addendums','$0','$0','$0'],['Per-Vehicle Deposits','$0','$0','$0'],['Shield ADW Eligible','Yes','Yes','Yes'],['A-Rated Carrier','Yes','Yes','Yes'],['SLI Available','+$18/mo','+$18/mo','+$18/mo'],['Personal Accident','+$10/mo','+$10/mo','+$10/mo'],['Personal Effects','+$7/mo','+$7/mo','+$7/mo'],['Roadside Assistance','+$6/mo','+$6/mo','+$6/mo']]
  return(
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',background:C.white,fontSize:'0.92rem'}}>
        <thead><tr>
          <th style={{textAlign:'left',padding:'18px 24px',background:C.navy800,color:C.white,fontWeight:700,width:'28%'}}>Coverage Detail</th>
          <th style={{textAlign:'center',padding:'18px 24px',background:C.navy800,color:C.white,borderLeft:'1px solid rgba(255,255,255,0.1)'}}><div style={{fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:C.navy300,marginBottom:4}}>Basic</div><div style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:800}}>$101<span style={{fontSize:'0.7rem',fontWeight:400}}>/mo</span></div></th>
          <th style={{textAlign:'center',padding:'18px 24px',background:C.navy700,color:C.white,borderLeft:'1px solid rgba(255,255,255,0.1)',position:'relative'}}><div style={{position:'absolute',top:0,left:0,right:0,height:4,background:C.green500}}/><div style={{fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:C.green400,marginBottom:4}}>Standard - Most Popular</div><div style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:800}}>$122<span style={{fontSize:'0.7rem',fontWeight:400}}>/mo</span></div></th>
          <th style={{textAlign:'center',padding:'18px 24px',background:C.navy800,color:C.white,borderLeft:'1px solid rgba(255,255,255,0.1)'}}><div style={{fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:C.purple400,marginBottom:4}}>Premium</div><div style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',fontWeight:800}}>$157<span style={{fontSize:'0.7rem',fontWeight:400}}>/mo</span></div></th>
        </tr></thead>
        <tbody>
          {rows.map(([label,b,s,p],i)=><tr key={i} style={{background:i%2===0?C.white:C.grey50}}><td style={{padding:'14px 24px',fontWeight:600,color:C.navy800,borderBottom:`1px solid ${C.grey200}`}}>{label}</td><td style={{padding:'14px 24px',textAlign:'center',color:C.grey700,borderBottom:`1px solid ${C.grey200}`,borderLeft:`1px solid ${C.grey200}`}}>{b}</td><td style={{padding:'14px 24px',textAlign:'center',color:C.navy800,fontWeight:600,borderBottom:`1px solid ${C.grey200}`,borderLeft:`1px solid ${C.grey200}`}}>{s}</td><td style={{padding:'14px 24px',textAlign:'center',color:C.grey700,borderBottom:`1px solid ${C.grey200}`,borderLeft:`1px solid ${C.grey200}`}}>{p}</td></tr>)}
          <tr><td style={{padding:'20px 24px'}}></td>{[{label:'Select Basic',bg:C.navy700},{label:'Select Standard',bg:C.green600},{label:'Select Premium',bg:C.purple600}].map((cta,i)=><td key={i} style={{padding:'20px 24px',textAlign:'center',borderLeft:`1px solid ${C.grey200}`}}><button onClick={()=>{setPage('apply');window.scrollTo(0,0)}} style={{width:'100%',padding:'14px 20px',background:cta.bg,color:C.white,fontWeight:700,fontSize:'0.92rem',cursor:'pointer',border:'none',borderRadius:6}}>{cta.label} <ArrowRight size={15} style={{marginLeft:6,verticalAlign:-2}}/></button></td>)}</tr>
        </tbody>
      </table>
    </div>
  )
}

function HomePage({setPage}){
  return(<>
    {/* HERO */}
    <section style={{background:`linear-gradient(160deg, ${C.white} 0%, ${C.grey50} 50%, ${C.navy50} 100%)`,paddingTop:'clamp(120px,14vw,180px)',paddingBottom:'clamp(60px,8vw,100px)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-100,right:-60,width:380,height:380,borderRadius:'50%',background:`radial-gradient(circle, ${C.navy100}33, transparent 70%)`}}/>
      <div style={{...sWrap,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'clamp(40px,6vw,80px)',alignItems:'center',position:'relative'}}>
        <div>
          <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.green600,marginBottom:20}}>Built for Fleet Owners</div>
          <h1 style={{color:C.navy800,marginBottom:24}}>Commercial RV Insurance, <span style={{color:C.green600}}>Reimagined</span></h1>
          <p style={{fontSize:'1.15rem',color:C.grey600,lineHeight:1.75,marginBottom:36,maxWidth:520}}>North Arrow is the only insurance program purpose-built for peer-to-peer RV rental fleets. Real commercial coverage. Transparent pricing. No hidden fees or renter addendums.</p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <button onClick={()=>{setPage('apply');window.scrollTo(0,0)}} style={{display:'inline-flex',alignItems:'center',gap:10,padding:'16px 36px',background:C.green600,color:C.white,borderRadius:6,fontWeight:700,fontSize:'1rem',cursor:'pointer',border:'none'}}>Get a Quote <ArrowRight size={18}/></button>
            <button onClick={()=>{setPage('coverage');window.scrollTo(0,0)}} style={{padding:'16px 36px',borderRadius:6,fontWeight:700,fontSize:'1rem',border:`2px solid ${C.navy700}`,color:C.navy700,background:'transparent',cursor:'pointer'}}>View Plans</button>
          </div>
        </div>
        {/* Data panel — WHITE bg, no green on blue */}
        <div>
          <div style={{background:C.white,border:`2px solid ${C.navy800}`,overflow:'hidden'}}>
            <div style={{background:C.navy800,padding:'16px 28px',display:'flex',alignItems:'center',gap:10}}><div style={{width:8,height:8,borderRadius:'50%',background:C.white}}/><span style={{color:C.white,fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>Program Overview</span></div>
            <div style={{padding:'24px 28px'}}>{[{val:'$101',label:'Starting Monthly',sub:'Basic tier'},{val:'$33',label:'Total Monthly Fees',sub:'Transparent, flat rate'},{val:'3 Tiers',label:'Coverage Options',sub:'Basic, Standard, Premium'},{val:'$0',label:'Renter Addendums',sub:'Completely eliminated'}].map((m,i)=><div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0',borderBottom:i<3?`1px solid ${C.grey200}`:'none'}}><div><div style={{fontWeight:600,fontSize:'0.9rem',color:C.navy800}}>{m.label}</div><div style={{fontSize:'0.78rem',color:C.grey400}}>{m.sub}</div></div><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',fontWeight:800,color:C.navy800}}>{m.val}</div></div>)}</div>
            <div style={{background:C.green600,padding:'16px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'0.72rem',fontWeight:700,color:'rgba(255,255,255,0.8)',textTransform:'uppercase',letterSpacing:'0.08em'}}>Featured Add-On</div><div style={{fontWeight:700,color:C.white}}>Shield Accidental Damage Waiver</div></div><div style={{fontSize:'1.3rem',fontWeight:800,color:C.white}}>$25<span style={{fontSize:'0.7rem',fontWeight:400}}>/day</span></div></div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){section>div{grid-template-columns:1fr!important}}`}</style>
    </section>

    {/* TRUST BAR */}
    <section style={{background:C.white,padding:'36px 0',borderBottom:`1px solid ${C.grey200}`}}>
      <div style={{...sWrap,display:'flex',alignItems:'center',justifyContent:'center',gap:'clamp(24px,4vw,50px)',flexWrap:'wrap'}}>
        {[{icon:BadgeCheck,text:'A-Rated Carriers'},{icon:Shield,text:'Commercial Grade'},{icon:Scale,text:'State Compliant'},{icon:Users,text:'500+ Fleets Protected'},{icon:Clock,text:'Claims in 48 Hours'}].map((t,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8}}><t.icon size={17} color={C.navy400}/><span style={{fontSize:'0.83rem',fontWeight:600,color:C.grey500}}>{t.text}</span></div>)}
      </div>
    </section>

    {/* WHY NORTH ARROW — full-bleed alternating, NO card boxes */}
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}>
      <div style={sWrap}><SectionHeader overline="Why North Arrow" title="Insurance That Speaks Your Language" subtitle="Most commercial programs were never designed for peer-to-peer rental fleets. North Arrow was built from the ground up by fleet operators, for fleet operators."/></div>
      <div style={{background:C.navy800,padding:'clamp(40px,5vw,64px) 0'}}><div style={{...sWrap,display:'grid',gridTemplateColumns:'64px 1fr',gap:24,alignItems:'start'}}><div style={{width:56,height:56,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center'}}><Shield size={26} color={C.white}/></div><div><h3 style={{color:C.white,marginBottom:10}}>True Commercial Coverage</h3><p style={{color:C.navy200,fontSize:'0.95rem',lineHeight:1.7,maxWidth:600}}>Real liability and physical damage policies from A-rated carriers. Not a damage waiver dressed up as insurance.</p></div></div></div>
      <div style={{background:C.white,padding:'clamp(40px,5vw,64px) 0',borderBottom:`1px solid ${C.grey200}`,borderTop:`1px solid ${C.grey200}`}}><div style={{...sWrap,display:'grid',gridTemplateColumns:'64px 1fr',gap:24,alignItems:'start'}}><div style={{width:56,height:56,background:C.green100,display:'flex',alignItems:'center',justifyContent:'center'}}><DollarSign size={26} color={C.green600}/></div><div><h3 style={{color:C.navy800,marginBottom:10}}>Transparent Pricing</h3><p style={{color:C.grey600,fontSize:'0.95rem',lineHeight:1.7,maxWidth:600}}>Three tiers, flat fees, no surprises. Admin ($15) + Claims ($10) + Fleet Services ($8) = $33/mo. That is it.</p></div></div></div>
      <div style={{background:C.green600,padding:'clamp(40px,5vw,64px) 0'}}><div style={{...sWrap,display:'grid',gridTemplateColumns:'64px 1fr',gap:24,alignItems:'start'}}><div style={{width:56,height:56,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}><Zap size={26} color={C.white}/></div><div><h3 style={{color:C.white,marginBottom:10}}>Zero Renter Addendums</h3><p style={{color:'rgba(255,255,255,0.85)',fontSize:'0.95rem',lineHeight:1.7,maxWidth:600}}>The old program charged renters separately and took a cut. North Arrow eliminated that entirely. Your coverage, your control.</p></div></div></div>
    </section>

    {/* COVERAGE COMPARISON TABLE */}
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.grey50}}>
      <div style={sWrap}>
        <SectionHeader overline="Coverage Tiers" title="Three Plans, One Mission" subtitle="Every tier includes the same $33/mo transparent fee structure. Pick the coverage level that matches your fleet." accent="purple"/>
        <ComparisonTable setPage={setPage}/>
      </div>
    </section>

    {/* INDUSTRY ALERT — RED ON WHITE, CAUTION NOTICE STYLE */}
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}>
      <div style={sWrap}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}><AlertTriangle size={22} color={C.red600}/><span style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.red600}}>Industry Alert</span></div>
        <h2 style={{color:C.navy800,marginBottom:12,maxWidth:600}}>The RV Insurance Landscape is Shifting</h2>
        <p style={{color:C.grey500,fontSize:'1.02rem',marginBottom:40,maxWidth:600,lineHeight:1.7}}>Fleet owners need to understand the current state of coverage options. Here is what has changed.</p>

        {/* MBA Warning */}
        <div style={{background:C.red50,borderLeft:`5px solid ${C.red600}`,padding:'clamp(24px,3vw,36px)',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><AlertOctagon size={20} color={C.red600}/><span style={{fontSize:'0.82rem',fontWeight:700,color:C.red700,textTransform:'uppercase',letterSpacing:'0.08em'}}>Warning: MBA Restructured Program</span></div>
          <h3 style={{color:C.navy800,marginBottom:10,fontSize:'clamp(1.2rem,2vw,1.5rem)'}}>Higher Premiums, Lower Coverage Limits</h3>
          <p style={{color:C.grey600,fontSize:'0.92rem',lineHeight:1.7,marginBottom:20,maxWidth:720}}>The industry legacy program now charges more for less. Coverage limits dropped across the board, renter addendums were restructured, and new $399 per-vehicle deposits are required.</p>
          <div style={{display:'flex',gap:'clamp(20px,4vw,48px)',flexWrap:'wrap'}}>{[{val:'$399',label:'New Deposit Per Vehicle'},{val:'Reduced',label:'Coverage Limits'},{val:'Increased',label:'Premium Costs'}].map((m,i)=><div key={i}><div style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:800,color:C.red600}}>{m.val}</div><div style={{fontSize:'0.78rem',color:C.grey500,marginTop:2}}>{m.label}</div></div>)}</div>
        </div>

        {/* Truvi Caution */}
        <div style={{background:C.amber50,borderLeft:`5px solid ${C.amber600}`,padding:'clamp(24px,3vw,36px)',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><TriangleAlert size={20} color={C.amber600}/><span style={{fontSize:'0.82rem',fontWeight:700,color:C.amber600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Caution: Coverage Gap - Truvi</span></div>
          <h3 style={{color:C.navy800,marginBottom:10}}>Truvi Does Not Cover RVs</h3>
          <p style={{color:C.grey600,fontSize:'0.92rem',lineHeight:1.7,marginBottom:16,maxWidth:720}}>Truvi markets damage protection for "short-term vacation rentals" - houses and apartments. Despite marketing to RV platforms, they denied every claim at a major off-road event in 2026.</p>
          <div style={{background:C.white,borderLeft:`3px solid ${C.amber600}`,padding:'14px 20px',maxWidth:500}}><p style={{fontSize:'0.88rem',color:C.grey700,lineHeight:1.6}}>"This limitation should have been flagged during initial conversations."</p><div style={{fontSize:'0.78rem',color:C.grey400,marginTop:6}}>- Truvi VP of Customer Success</div></div>
        </div>

        {/* Competitor Advisory */}
        <div style={{background:C.grey50,borderLeft:`5px solid ${C.navy600}`,padding:'clamp(24px,3vw,36px)',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><Info size={20} color={C.navy600}/><span style={{fontSize:'0.82rem',fontWeight:700,color:C.navy700,textTransform:'uppercase',letterSpacing:'0.08em'}}>Advisory: Competitive Landscape</span></div>
          <h3 style={{color:C.navy800,marginBottom:16}}>Why Alternatives Fall Short</h3>
          {[{name:'MBA',issue:'Higher premiums, lower limits, $399 deposits per vehicle'},{name:'ROAMLY',issue:'Owned by Outdoorsy. Poor reputation. Not independent.'},{name:'IMG',issue:'Outdoorsy-exclusive. Not available as standalone.'},{name:'Generali',issue:'Volume accounts only. Extremely rare for RV fleets.'}].map((c,i)=><div key={i} style={{display:'flex',gap:14,padding:'14px 0',borderBottom:`1px solid ${C.grey200}`}}><Ban size={16} color={C.red600} style={{marginTop:3,flexShrink:0}}/><div><span style={{fontWeight:700,color:C.navy800}}>{c.name}:</span> <span style={{color:C.grey600}}>{c.issue}</span></div></div>)}
        </div>

        {/* North Arrow Solution */}
        <div style={{background:C.green100,borderLeft:`5px solid ${C.green600}`,padding:'clamp(24px,3vw,36px)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><BadgeCheck size={20} color={C.green600}/><span style={{fontSize:'0.82rem',fontWeight:700,color:C.green700,textTransform:'uppercase',letterSpacing:'0.08em'}}>The North Arrow Difference</span></div>
          <h3 style={{color:C.navy800,marginBottom:14}}>Built Different, By Design</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 32px',maxWidth:600}}>{['Real commercial coverage from A-rated carriers','No renter addendums or hidden charges','Standalone Shield ADW for damage protection','Fleet-operator-first program design'].map((t,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:8}}><Check size={16} color={C.green600} style={{marginTop:3,flexShrink:0}}/><span style={{fontSize:'0.88rem',color:C.grey700}}>{t}</span></div>)}</div>
        </div>

        <div style={{textAlign:'center',marginTop:40}}><button onClick={()=>{setPage('coverage');window.scrollTo(0,0)}} style={{padding:'16px 40px',background:C.navy700,color:C.white,borderRadius:6,fontWeight:700,fontSize:'1rem',cursor:'pointer',border:'none',display:'inline-flex',alignItems:'center',gap:10}}>See How We Compare <ArrowRight size={18}/></button></div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.grey50}}>
      <div style={sWrap}>
        <SectionHeader overline="How It Works" title="From Application to Coverage in Three Steps" accent="purple"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:0}}>
          {[{step:'01',icon:FileText,title:'Apply Online',desc:'Complete our streamlined 5-step application. Add your fleet, choose your tier, select add-ons.',color:C.navy700,clickable:true},{step:'02',icon:Eye,title:'Underwriter Review',desc:'Our underwriting team reviews your application and fleet details within business days.',color:C.purple600},{step:'03',icon:BadgeCheck,title:'Get Covered',desc:'Receive policy documents, proof of insurance, and North Arrow owner portal access.',color:C.green600}].map((s,i)=><div key={i} onClick={s.clickable?()=>{setPage('apply');window.scrollTo(0,0)}:undefined} style={{padding:'clamp(32px,4vw,48px)',borderBottom:`4px solid ${s.color}`,borderRight:i<2?`1px solid ${C.grey200}`:'none',background:C.white,cursor:s.clickable?'pointer':'default',transition:'background 0.2s, transform 0.2s',position:'relative'}} onMouseEnter={e=>{if(s.clickable){e.currentTarget.style.background=C.navy50}}} onMouseLeave={e=>{if(s.clickable){e.currentTarget.style.background=C.white}}}><div style={{fontFamily:'var(--font-display)',fontSize:'2.8rem',fontWeight:800,color:C.grey200,marginBottom:16}}>{s.step}</div><div style={{width:44,height:44,background:`${s.color}12`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}><s.icon size={22} color={s.color}/></div><h4 style={{marginBottom:10,color:C.navy800}}>{s.title}</h4><p style={{fontSize:'0.9rem',color:C.grey500,lineHeight:1.7,marginBottom:s.clickable?14:0}}>{s.desc}</p>{s.clickable&&<div style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.85rem',fontWeight:700,color:s.color}}>Start Application <ArrowRight size={14}/></div>}</div>)}
        </div>
      </div>
    </section>

    {/* SHIELD CROSS-SELL */}
    <section style={{background:C.purple600,padding:'clamp(48px,6vw,80px) 0'}}>
      <div style={{...sWrap,display:'grid',gridTemplateColumns:'1fr auto',gap:40,alignItems:'center'}}>
        <div><div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:12}}>Damage Protection</div><h2 style={{color:C.white,marginBottom:16}}>Add Shield ADW to Your Policy</h2><p style={{color:'rgba(255,255,255,0.75)',fontSize:'1.02rem',lineHeight:1.7,maxWidth:520}}>Standalone accidental damage waiver. $25/day with a $250 deductible and $2,500 max per occurrence.</p></div>
        <button onClick={()=>{setPage('shield');window.scrollTo(0,0)}} style={{padding:'16px 40px',background:C.white,color:C.purple700,borderRadius:6,fontWeight:700,fontSize:'1rem',cursor:'pointer',border:'none',whiteSpace:'nowrap',display:'inline-flex',alignItems:'center',gap:10}}>Learn About Shield <ArrowRight size={18}/></button>
      </div>
      <style>{`@media(max-width:768px){section>div{grid-template-columns:1fr!important}}`}</style>
    </section>

    {/* FINAL CTA */}
    <section style={{padding:'clamp(60px,8vw,100px) 0',background:C.grey50}}>
      <div style={{...sWrap,textAlign:'center'}}>
        <h2 style={{color:C.navy800,marginBottom:16}}>Ready to Protect Your Fleet?</h2>
        <p style={{color:C.grey500,fontSize:'1.05rem',marginBottom:32,maxWidth:480,margin:'0 auto 32px'}}>Get started with North Arrow today. Our streamlined application takes minutes, not hours.</p>
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>{setPage('apply');window.scrollTo(0,0)}} style={{padding:'16px 40px',background:C.green600,color:C.white,borderRadius:6,fontWeight:700,fontSize:'1rem',cursor:'pointer',border:'none',display:'inline-flex',alignItems:'center',gap:10}}>Start Your Application <ArrowRight size={18}/></button>
          <button onClick={()=>{setPage('contact');window.scrollTo(0,0)}} style={{padding:'16px 40px',border:`2px solid ${C.navy700}`,color:C.navy700,borderRadius:6,fontWeight:700,fontSize:'1rem',cursor:'pointer',background:'transparent'}}>Talk to an Agent</button>
        </div>
      </div>
    </section>
  </>)
}

function CoveragePage({setPage}){
  return(<>
    <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(140px,16vw,200px)',paddingBottom:'clamp(60px,8vw,100px)'}}><div style={sWrap}><div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.navy300,marginBottom:16}}>Coverage Plans</div><h1 style={{color:C.white,marginBottom:16,maxWidth:600}}>Commercial Coverage Built for Fleets</h1><p style={{color:C.navy200,fontSize:'1.05rem',lineHeight:1.7,maxWidth:540}}>Three tiers of real commercial insurance with transparent $33/mo fees.</p></div></section>

    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.grey50}}><div style={sWrap}><SectionHeader overline="Compare Plans" title="Coverage Comparison Chart" accent="navy"/><ComparisonTable setPage={setPage}/></div></section>

    {/* Fee Breakdown */}
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}>
      <div style={sWrap}>
        <SectionHeader overline="Fee Transparency" title="Know Exactly What You Pay" accent="green"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0,borderTop:`1px solid ${C.grey200}`,borderLeft:`1px solid ${C.grey200}`}}>
          {[{icon:Clipboard,name:'Admin Fee',amount:'$15/mo',desc:'Policy administration and documentation'},{icon:Shield,name:'Claims Fee',amount:'$10/mo',desc:'Claims processing and management'},{icon:Wrench,name:'Fleet Services',amount:'$8/mo',desc:'Fleet support and risk management'}].map((f,i)=><div key={i} style={{padding:'clamp(28px,3vw,40px)',borderRight:`1px solid ${C.grey200}`,borderBottom:`1px solid ${C.grey200}`}}><f.icon size={26} color={C.green600} style={{marginBottom:14}}/><div style={{fontWeight:700,fontSize:'1.8rem',fontFamily:'var(--font-display)',color:C.navy800,marginBottom:4}}>{f.amount}</div><div style={{fontWeight:700,color:C.navy700,marginBottom:8}}>{f.name}</div><p style={{fontSize:'0.86rem',color:C.grey500}}>{f.desc}</p></div>)}
        </div>
        <div style={{textAlign:'center',marginTop:24,padding:'18px',background:C.navy50}}><span style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',fontWeight:700,color:C.navy700}}>$15 + $10 + $8 = $33/mo total</span><span style={{color:C.grey500,marginLeft:12}}>Same for every tier.</span></div>
      </div>
    </section>

    {/* Add-Ons */}
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.grey50}}>
      <div style={sWrap}>
        <SectionHeader overline="Optional Add-Ons" title="Customize Your Protection" accent="purple"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:0,borderTop:`1px solid ${C.grey200}`,borderLeft:`1px solid ${C.grey200}`}}>
          {[{name:'Supplemental Liability (SLI)',price:'$18/mo',icon:Scale,desc:'Additional liability beyond base tier.'},{name:'Personal Accident',price:'$10/mo',icon:Heart,desc:'Medical coverage for rental accidents.'},{name:'Personal Effects',price:'$7/mo',icon:Layers,desc:'Protection for belongings inside the RV.'},{name:'Roadside Assistance',price:'$6/mo',icon:Truck,desc:'Towing, flat tire, lockout, fuel delivery.'}].map((a,i)=><div key={i} style={{padding:'clamp(24px,3vw,32px)',background:C.white,borderRight:`1px solid ${C.grey200}`,borderBottom:`1px solid ${C.grey200}`,borderLeft:`4px solid ${C.purple500}`}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}><a.icon size={22} color={C.purple600}/><span style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'1.2rem',color:C.navy800}}>{a.price}</span></div><h4 style={{fontSize:'1rem',marginBottom:8,color:C.navy800}}>{a.name}</h4><p style={{fontSize:'0.84rem',color:C.grey500,lineHeight:1.6}}>{a.desc}</p></div>)}
        </div>
      </div>
    </section>
  </>)
}

function ShieldPage({setPage}){
  const covered=[
    {t:'Accidental interior damage while vehicle is stationary',sub:'Not from negligence, misuse, or willful acts'},
    {t:'Refrigerator or freezer handle breakage'},
    {t:'Microwave turntable plate (glass plate only)',sub:'Not the microwave unit itself'},
    {t:'Interior sliding door off track',sub:'Not applicable to slide-out room doors'},
    {t:'Toilet clog — standard clearing',sub:'Foreign-object blockage requiring pump-out excluded'},
    {t:'Minor marks, scrapes, or scuffs — max 3 inches, one location per occurrence'},
    {t:'Interior hardware: cabinet latches, magnetic catches, drawer pulls, hinges, handle screws'},
    {t:'Window blind slats or pull cords — accidental breakage'},
    {t:'Shower curtain rod or hooks — accidental breakage'},
    {t:'Broken cup holders or small molded interior trim components'},
    {t:'Fresh water hose and grommet'},
    {t:'Septic hose and adaptor'},
    {t:'Stabilizer jack hand-crank'},
    {t:'TV remote — missing or broken',sub:'Remote only — not the TV or entertainment unit'},
    {t:'Sink, shower, or tub faucet fixtures — accidental damage'},
    {t:'One courtesy mobile service call',sub:"If provided by host at host's sole discretion"},
    {t:'Missing interior supply kit items (small bin items only)'},
  ]
  const notCovered=[
    'Pet or animal damage of any kind',
    'Tires, slide-outs, or awnings',
    'Exterior body, paint, glass, or roof',
    'Generator or mechanical systems',
    'TV, audio, or entertainment system units',
    'Keys, fobs, or lock hardware',
    'Acts of nature or acts of God',
    'Negligence, misuse, or rental agreement violations',
    'Water damage from open vents or windows',
    'Theft of any items',
    'Damage while vehicle is in motion',
    'Pre-existing or undisclosed damage',
    'Foreign-object toilet blockage (pump-out required)',
    'Festival or high-attendance event rentals',
    'Claims submitted after the 5-day window',
    'Sensor readings billable by host',
    'Anything covered by another coverage program',
  ]
  return(<>
    {/* HERO — green/white split */}
    <section style={{display:'grid',gridTemplateColumns:'1.05fr 1fr',minHeight:'78vh'}} className="shield-hero">
      <div style={{background:C.green600,color:C.white,padding:'clamp(120px,14vw,180px) clamp(40px,5vw,80px) clamp(60px,8vw,100px)',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:0.05,backgroundImage:`radial-gradient(${C.white} 1px, transparent 1px)`,backgroundSize:'24px 24px'}}/>
        <div style={{position:'relative',maxWidth:560}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 12px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:99,fontSize:'0.74rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.white,marginBottom:24}}>
            <span style={{width:6,height:6,background:C.white,borderRadius:'50%'}}/>Interior Accidental Damage Liability Waiver
          </div>
          <h1 style={{color:C.white,marginBottom:16,fontSize:'clamp(2.4rem,5vw,3.6rem)',lineHeight:1.05}}>Stress Free Shield</h1>
          <p style={{fontSize:'1.18rem',color:'rgba(255,255,255,0.92)',lineHeight:1.55,marginBottom:14,fontStyle:'italic'}}>Reimbursement for common occurrences.</p>
          <p style={{fontSize:'1rem',color:'rgba(255,255,255,0.82)',lineHeight:1.7,marginBottom:32}}>Reinforcing good experiences start to finish — ensuring minor accidental damage doesn't spoil an otherwise successful trip for guests and hosts alike. The only standalone interior damage waiver built specifically for RV rental fleets.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button onClick={()=>{setPage('apply');window.scrollTo(0,0)}} style={{padding:'15px 32px',background:C.white,color:C.green700,borderRadius:6,fontWeight:700,cursor:'pointer',fontSize:'0.97rem',border:'none',display:'inline-flex',alignItems:'center',gap:8}}>Add Shield to Your Policy <ArrowRight size={17}/></button>
            <a href="https://stressfreeshield.vercel.app/" target="_blank" rel="noopener noreferrer" style={{padding:'15px 28px',background:'transparent',color:C.white,borderRadius:6,fontWeight:700,fontSize:'0.97rem',border:'2px solid rgba(255,255,255,0.5)',display:'inline-flex',alignItems:'center',gap:8,textDecoration:'none'}}>Visit StressFreeShield.com <ExternalLink size={16}/></a>
          </div>
        </div>
      </div>
      <div style={{background:C.navy800,color:C.white,padding:'clamp(100px,12vw,160px) clamp(40px,5vw,72px) clamp(60px,8vw,100px)',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',backgroundSize:'40px 40px',opacity:0.5}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:8}}>
            <span style={{fontFamily:'var(--font-display)',fontSize:'clamp(3.5rem,7vw,6rem)',fontWeight:800,lineHeight:1}}>$25</span>
          </div>
          <div style={{fontSize:'1.02rem',color:C.navy300,marginBottom:28,fontStyle:'italic'}}>per day · per vehicle · capped at $199/trip</div>
          {[['Deductible per occurrence','$250'],['Max coverage per occurrence','$2,500'],['Review window','7 Days'],['Damage notification window','24 Hours'],['Claim submission window','5 Business Days']].map(([l,v])=>
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.08)',gap:14}}>
              <span style={{color:C.navy300,fontSize:'0.93rem'}}>{l}</span>
              <span style={{fontWeight:700,whiteSpace:'nowrap'}}>{v}</span>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:880px){.shield-hero{grid-template-columns:1fr!important}}`}</style>
    </section>

    {/* PROMINENT NOT-AN-INSURANCE-PRODUCT BAR */}
    <section style={{background:C.amber50,borderTop:`1px solid ${C.amber200}`,borderBottom:`1px solid ${C.amber200}`,padding:'18px 0'}}>
      <div style={{...sWrap,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',justifyContent:'center',textAlign:'center'}}>
        <AlertTriangle size={20} color={C.amber600} style={{flexShrink:0}}/>
        <div style={{fontSize:'0.92rem',color:C.grey700,lineHeight:1.55,fontWeight:600}}><strong style={{color:C.red600,letterSpacing:'0.02em'}}>STRESS FREE SHIELD IS NOT AN INSURANCE PRODUCT.</strong> Not regulated by the California Department of Insurance. Stress Free Group LLC is not a licensed insurance carrier.</div>
      </div>
    </section>

    {/* WHAT IS COVERED / NOT COVERED */}
    <section style={{padding:'clamp(60px,8vw,100px) 0',background:C.navy50}}>
      <div style={sWrap}>
        <SectionHeader overline="Coverage Details" title="What's Covered — and What's Not" accent="green"/>
        <p style={{textAlign:'center',color:C.grey600,fontSize:'0.95rem',maxWidth:680,margin:'-8px auto 36px',lineHeight:1.65}}>Items not expressly listed as covered are excluded. All claims are subject to estimate review and approval prior to reimbursement.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className="shield-cov-grid">
          {/* COVERED */}
          <div style={{background:C.white,padding:'clamp(28px,3vw,40px) clamp(22px,3vw,36px)',borderTop:`4px solid ${C.green500}`,boxShadow:'0 2px 12px rgba(15,34,64,0.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${C.grey200}`}}>
              <div style={{width:30,height:30,background:C.green600,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={17} color={C.white}/></div>
              <h3 style={{color:C.green700,margin:0,fontSize:'1.18rem'}}>What IS covered</h3>
            </div>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {covered.map((c,i)=>(
                <li key={i} style={{paddingLeft:18,marginBottom:11,position:'relative',color:C.grey700,fontSize:'0.91rem',lineHeight:1.55}}>
                  <span style={{position:'absolute',left:0,top:8,width:6,height:6,background:C.green500,borderRadius:'50%'}}/>
                  {c.t}
                  {c.sub&&<div style={{fontSize:'0.8rem',color:C.grey500,marginTop:3,fontStyle:'italic'}}>{c.sub}</div>}
                </li>
              ))}
            </ul>
            <div style={{marginTop:18,padding:'12px 14px',background:C.navy50,fontSize:'0.84rem',color:C.navy700,lineHeight:1.55,borderLeft:`3px solid ${C.navy500}`}}>
              <strong>Scratch and scuff limit:</strong> Marks up to 3 inches, one location per occurrence only.
            </div>
          </div>
          {/* NOT COVERED */}
          <div style={{background:C.white,padding:'clamp(28px,3vw,40px) clamp(22px,3vw,36px)',borderTop:`4px solid ${C.red600}`,boxShadow:'0 2px 12px rgba(15,34,64,0.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${C.grey200}`}}>
              <div style={{width:30,height:30,background:C.red600,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><XCircle size={17} color={C.white}/></div>
              <h3 style={{color:C.red600,margin:0,fontSize:'1.18rem'}}>What is NOT covered</h3>
            </div>
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {notCovered.map((c,i)=>(
                <li key={i} style={{paddingLeft:18,marginBottom:11,position:'relative',color:C.grey700,fontSize:'0.91rem',lineHeight:1.55}}>
                  <span style={{position:'absolute',left:0,top:8,width:6,height:6,background:C.red600,borderRadius:'50%'}}/>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FESTIVAL EXCLUSION CALLOUT */}
        <div style={{marginTop:24,padding:'20px 24px',background:C.red50,borderLeft:`4px solid ${C.red600}`,borderRadius:4,display:'flex',gap:14,alignItems:'flex-start'}}>
          <Ban size={22} color={C.red600} style={{marginTop:3,flexShrink:0}}/>
          <div>
            <div style={{fontWeight:700,color:C.red600,marginBottom:6,fontSize:'0.98rem'}}>Festival and high-attendance event exclusion</div>
            <div style={{color:C.grey700,fontSize:'0.91rem',lineHeight:1.65,marginBottom:8}}>The Standard Shield does not apply to any event with <strong>500+ expected attendees within 25 miles</strong> of the vehicle. Named exclusions: Burning Man, Coachella, Stagecoach, King of the Hammers, EDC, and any event designated by Stress Free RVs at booking.</div>
            <div style={{color:C.grey700,fontSize:'0.91rem',lineHeight:1.65,fontStyle:'italic'}}>Planning an event trip? Ask about <strong>Premium Event Coverage</strong> — available separately.</div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.shield-cov-grid{grid-template-columns:1fr!important}}`}</style>
    </section>

    {/* WHY SHIELD */}
    <section style={{padding:'clamp(60px,8vw,100px) 0',background:C.white}}>
      <div style={sWrap}>
        <SectionHeader overline="Why Shield" title="Six Reasons Shield is Different" accent="purple"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:0,borderTop:`1px solid ${C.grey200}`}}>
          {[
            {icon:Lock,title:'Standalone product',desc:'Works independently of any platform. No bundling required, no marketplace lock-in.'},
            {icon:CircleDot,title:'Pre-screened vendors',desc:'San Diego: DeCo Fleet Management Services and Coachwerx SD as preferred repair vendors.'},
            {icon:Ban,title:'Festival events excluded',desc:'High-attendance events (500+ within 25 miles) excluded by design. Premium Event Coverage available separately.'},
            {icon:Star,title:'Capped exposure',desc:'$2,500 maximum coverage per occurrence. $250 deductible. Predictable risk for hosts.'},
            {icon:Clock,title:'Strict claim windows',desc:'24-hour damage notification. 5 business day claim submission. 7-day review window.'},
            {icon:FileText,title:'Clear legal terms',desc:'Defined coverage, exclusions, and processes. Not insurance — a contractual reimbursement program.'},
          ].map((f,i)=>(
            <div key={i} style={{padding:'28px 32px',borderBottom:`1px solid ${C.grey200}`,borderRight:i%3<2?`1px solid ${C.grey200}`:'none',borderLeft:`4px solid ${C.green500}`}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}><f.icon size={20} color={C.green600}/><h4 style={{color:C.navy800,margin:0}}>{f.title}</h4></div>
              <p style={{fontSize:'0.88rem',color:C.grey500,lineHeight:1.65,paddingLeft:32,margin:0}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TERMS AND CONDITIONS / LEGAL */}
    <section style={{padding:'clamp(60px,8vw,100px) 0',background:C.navy50}}>
      <div style={{...sWrap,maxWidth:880}}>
        <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:C.navy600,marginBottom:14,display:'flex',alignItems:'center',gap:10}}><Scale size={15}/>Legal</div>
        <h2 style={{color:C.navy800,marginBottom:14,fontSize:'clamp(1.8rem,3.5vw,2.6rem)'}}>Terms and Conditions</h2>
        <p style={{color:C.grey600,fontSize:'0.96rem',lineHeight:1.7,marginBottom:32}}>Stress Free Shield Interior Accidental Damage Liability Waiver — v2.0 · March 2026 · Stress Free Group LLC (dba Stress Free RVs)</p>

        <div style={{padding:'22px 26px',background:C.red50,border:`1px solid ${C.red600}`,marginBottom:28,borderRadius:4}}>
          <div style={{fontWeight:800,color:C.red600,marginBottom:10,fontSize:'0.94rem',letterSpacing:'0.04em'}}>NOT AN INSURANCE PRODUCT</div>
          <div style={{color:C.grey700,fontSize:'0.92rem',lineHeight:1.7}}>This waiver is not regulated by the California Department of Insurance. Stress Free Group LLC is not a licensed insurance carrier.</div>
        </div>

        <div style={{padding:'24px 28px',background:C.white,border:`1px solid ${C.grey200}`,borderRadius:4}}>
          <div style={{fontSize:'0.74rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:C.navy600,marginBottom:12}}>Legal Notice</div>
          <p style={{color:C.grey700,fontSize:'0.93rem',lineHeight:1.75,margin:0}}>The Stress Free Shield is <strong>NOT AN INSURANCE PRODUCT</strong> and is not regulated by the California Department of Insurance. It is a contractual agreement between the Renter and Stress Free Group LLC (dba Stress Free RVs), a California limited liability company. Stress Free Group LLC is not a licensed insurance carrier. Enrollment does not guarantee reimbursement. All claims are subject to review and approval. Governing law: California. Disputes: San Diego County, CA. Shield v2.0 · March 2026.</p>
        </div>

        <div style={{marginTop:28,display:'flex',gap:12,flexWrap:'wrap'}}>
          <a href="https://stressfreeshield.vercel.app/" target="_blank" rel="noopener noreferrer" style={{padding:'12px 24px',background:C.navy700,color:C.white,borderRadius:6,fontWeight:700,fontSize:'0.9rem',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>Read Full Terms at StressFreeShield.com <ExternalLink size={15}/></a>
          <button onClick={()=>{setPage('contact');window.scrollTo(0,0)}} style={{padding:'12px 24px',background:'transparent',border:`1.5px solid ${C.grey300}`,color:C.grey700,borderRadius:6,fontWeight:700,fontSize:'0.9rem',cursor:'pointer'}}>Questions? Contact Us</button>
        </div>
      </div>
    </section>

    {/* FINAL CTA */}
    <section style={{background:`linear-gradient(135deg, ${C.green700} 0%, ${C.green600} 40%, ${C.navy700} 100%)`,padding:'clamp(60px,8vw,100px) 0',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`radial-gradient(${C.white} 1px, transparent 1px)`,backgroundSize:'28px 28px'}}/>
      <div style={{...sWrap,textAlign:'center',position:'relative'}}>
        <h2 style={{color:C.white,marginBottom:16}}>Add Shield to Your Coverage</h2>
        <p style={{color:'rgba(255,255,255,0.85)',fontSize:'1.04rem',marginBottom:32,maxWidth:540,margin:'0 auto 32px',lineHeight:1.65}}>Combine real commercial insurance from North Arrow with standalone interior damage protection from Shield — the complete fleet coverage stack.</p>
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>{setPage('apply');window.scrollTo(0,0)}} style={{padding:'16px 40px',background:C.white,color:C.green700,borderRadius:6,fontWeight:700,cursor:'pointer',border:'none',fontSize:'0.97rem',display:'inline-flex',alignItems:'center',gap:8}}>Start Application <ArrowRight size={17}/></button>
          <button onClick={()=>{setPage('contact');window.scrollTo(0,0)}} style={{padding:'16px 40px',background:'transparent',border:'2px solid rgba(255,255,255,0.5)',color:C.white,borderRadius:6,fontWeight:700,cursor:'pointer',fontSize:'0.97rem'}}>Contact Us</button>
        </div>
      </div>
    </section>
  </>)
}

function AboutPage(){
  return(<>
    <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(140px,16vw,200px)',paddingBottom:'clamp(60px,8vw,100px)'}}><div style={sWrap}><div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.purple400,marginBottom:16}}>About North Arrow</div><h1 style={{color:C.white,marginBottom:16,maxWidth:600}}>Built by Fleet Operators, for Fleet Operators</h1><p style={{color:C.navy200,fontSize:'1.05rem',lineHeight:1.7,maxWidth:540}}>North Arrow was created because the existing options were failing the people who needed coverage most.</p></div></section>

    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}>
      <div style={{...sWrap,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'clamp(40px,6vw,80px)',alignItems:'start'}}>
        <div><h2 style={{color:C.navy800,marginBottom:20}}>Our Story</h2><p style={{color:C.grey600,lineHeight:1.8,marginBottom:20}}>The peer-to-peer RV rental industry has grown exponentially, but insurance infrastructure never kept up. Legacy programs designed for traditional rental companies were being force-fit onto independent fleet operators.</p><p style={{color:C.grey600,lineHeight:1.8}}>North Arrow exists to close that gap. We partnered directly with A-rated carriers to build a program from scratch for peer-to-peer fleet owners.</p></div>
        <div style={{background:C.navy800,padding:'clamp(32px,4vw,48px)'}}><h3 style={{color:C.white,marginBottom:24}}>What We Believe</h3>{['Fleet owners deserve transparent pricing, not hidden fees','Coverage should be designed around YOUR business model','Damage protection and insurance should be standalone products','Claims should be processed quickly, not weaponized'].map((t,i)=><div key={i} style={{display:'flex',gap:12,marginBottom:16}}><Check size={18} color={C.white} style={{marginTop:3,flexShrink:0}}/><span style={{color:C.navy200,fontSize:'0.9rem',lineHeight:1.6}}>{t}</span></div>)}</div>
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </section>

    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.grey50}}>
      <div style={sWrap}>
        <SectionHeader overline="The Full Stack" title="The Only Vertically Integrated Platform" accent="purple"/>
        <p style={{textAlign:'center',color:C.grey600,fontSize:'1rem',maxWidth:680,margin:'-12px auto 40px',lineHeight:1.65}}>Three companies. One owner. Insurance + damage protection + marketplace — all under one roof. No competitor offers all three.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}} className="stack-grid">
          {/* NORTH ARROW — NAVY */}
          <div style={{background:C.white,padding:0,border:`1px solid ${C.grey200}`,borderTop:`5px solid ${C.navy700}`,boxShadow:'0 2px 14px rgba(15,34,64,0.05)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{padding:'32px 28px 16px',background:`linear-gradient(180deg, ${C.navy50} 0%, ${C.white} 100%)`,minHeight:140,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src="/north-arrow-logo.png" alt="North Arrow Commercial Insurance Services" style={{maxWidth:'100%',maxHeight:100,objectFit:'contain'}}/>
            </div>
            <div style={{padding:'18px 28px 28px',flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{display:'inline-flex',alignSelf:'flex-start',alignItems:'center',gap:6,padding:'4px 10px',background:C.navy50,color:C.navy700,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:99,marginBottom:14}}><Shield size={11}/>Commercial Insurance</div>
              <h3 style={{color:C.navy800,marginBottom:10,fontSize:'1.3rem'}}>North Arrow</h3>
              <p style={{color:C.grey600,fontSize:'0.9rem',lineHeight:1.65,marginBottom:18,flex:1}}>Real commercial liability and physical damage insurance from A-rated carriers. Built specifically for peer-to-peer RV rental fleet operators.</p>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.83rem',fontWeight:700,color:C.navy700}}>This site <ArrowRight size={13}/></div>
            </div>
          </div>

          {/* STRESS FREE SHIELD — GREEN */}
          <div style={{background:C.white,padding:0,border:`1px solid ${C.grey200}`,borderTop:`5px solid ${C.green600}`,boxShadow:'0 2px 14px rgba(15,34,64,0.05)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{padding:'32px 28px 16px',background:`linear-gradient(180deg, ${C.green50} 0%, ${C.white} 100%)`,minHeight:140,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {/* Inline Shield SVG mark */}
              <svg width="84" height="100" viewBox="0 0 84 100" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={C.green500}/>
                    <stop offset="100%" stopColor={C.green700}/>
                  </linearGradient>
                </defs>
                <path d="M42 4 L78 18 L78 50 Q78 78 42 96 Q6 78 6 50 L6 18 Z" fill="url(#shieldGrad)"/>
                <path d="M42 12 L70 22 L70 50 Q70 72 42 86 Q14 72 14 50 L14 22 Z" fill="none" stroke={C.white} strokeWidth="1.5" opacity="0.4"/>
                <path d="M28 50 L38 60 L58 38" fill="none" stroke={C.white} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{padding:'18px 28px 28px',flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{display:'inline-flex',alignSelf:'flex-start',alignItems:'center',gap:6,padding:'4px 10px',background:C.green50,color:C.green700,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:99,marginBottom:14}}><ShieldCheck size={11}/>Damage Waiver · Not Insurance</div>
              <h3 style={{color:C.green700,marginBottom:6,fontSize:'1.3rem'}}>Stress Free Shield</h3>
              <div style={{fontSize:'0.78rem',color:C.grey500,marginBottom:10,fontStyle:'italic'}}>Interior Accidental Damage Liability Waiver</div>
              <p style={{color:C.grey600,fontSize:'0.9rem',lineHeight:1.65,marginBottom:18,flex:1}}>Standalone interior damage waiver. <strong>$25/day</strong> per vehicle (capped at $199/trip). $250 deductible, $2,500 max per occurrence.</p>
              <button onClick={()=>{setPage('shield');window.scrollTo(0,0)}} style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.83rem',fontWeight:700,color:C.green700,background:'transparent',border:'none',padding:0,cursor:'pointer',alignSelf:'flex-start'}}>Learn more <ArrowRight size={13}/></button>
            </div>
          </div>

          {/* P2PRVS — PURPLE */}
          <div style={{background:C.white,padding:0,border:`1px solid ${C.grey200}`,borderTop:`5px solid ${C.purple600}`,boxShadow:'0 2px 14px rgba(15,34,64,0.05)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{padding:'32px 28px 16px',background:`linear-gradient(180deg, ${C.purple100} 0%, ${C.white} 100%)`,minHeight:140,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src="/p2prvs-logo.png" alt="P2PRVS — Peer to Peer RV Rental Marketplace" style={{maxWidth:'100%',maxHeight:90,objectFit:'contain'}}/>
            </div>
            <div style={{padding:'18px 28px 28px',flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{display:'inline-flex',alignSelf:'flex-start',alignItems:'center',gap:6,padding:'4px 10px',background:C.purple100,color:C.purple700,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:99,marginBottom:14}}><Users size={11}/>Marketplace</div>
              <h3 style={{color:C.purple700,marginBottom:10,fontSize:'1.3rem'}}>P2PRVS</h3>
              <p style={{color:C.grey600,fontSize:'0.9rem',lineHeight:1.65,marginBottom:18,flex:1}}>Peer-to-peer RV rental marketplace. Book direct, no platform middleman fees. Hosts retain control of pricing, policies, and guest relationships.</p>
              <a href="https://www.p2prvs.com" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.83rem',fontWeight:700,color:C.purple700,textDecoration:'none'}}>Visit P2PRVS.com <ExternalLink size={12}/></a>
            </div>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:32,padding:'20px 28px',background:C.white,border:`1px solid ${C.grey200}`,borderRadius:6,maxWidth:760,margin:'32px auto 0'}}>
          <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.purple600,marginBottom:6}}>The Big Win</div>
          <div style={{color:C.grey700,fontSize:'0.97rem',lineHeight:1.65}}>No competitor offers all three. <strong style={{color:C.navy800}}>Insurance + damage protection + marketplace</strong> — complete fleet coverage, all under one roof.</div>
        </div>
      </div>
      <style>{`@media(max-width:880px){.stack-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  </>)
}

function ClaimsPage(){
  return(<>
    <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(140px,16vw,200px)',paddingBottom:'clamp(60px,8vw,100px)'}}><div style={sWrap}><div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.navy300,marginBottom:16}}>Claims Center</div><h1 style={{color:C.white,marginBottom:16}}>File or Track a Claim</h1><p style={{color:C.navy200,fontSize:'1.05rem',maxWidth:500}}>Report incidents quickly and track your claim status.</p></div></section>

    <section style={{background:C.navy900,padding:'20px 0'}}><div style={{...sWrap,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}><div style={{display:'flex',alignItems:'center',gap:12}}><FileText size={20} color={C.white}/><div><div style={{fontWeight:700,color:C.white,fontSize:'0.95rem'}}>Start or Track a Claim</div><div style={{fontSize:'0.82rem',color:C.navy300}}>File a claim or check existing claim status.</div></div></div><div style={{display:'flex',gap:12}}><button style={{padding:'12px 28px',background:C.green600,color:C.white,borderRadius:6,fontWeight:700,cursor:'pointer',border:'none',display:'flex',alignItems:'center',gap:8,fontSize:'0.9rem'}}><FileText size={16}/> File a Claim</button><button style={{padding:'12px 28px',background:'rgba(255,255,255,0.08)',color:C.white,borderRadius:6,fontWeight:700,cursor:'pointer',border:'1px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',gap:8,fontSize:'0.9rem'}}><Eye size={16}/> Track a Claim</button></div></div></section>

    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}>
      <div style={sWrap}>
        <SectionHeader overline="Claims Process" title="How Claims Work" accent="green"/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:0,borderTop:`1px solid ${C.grey200}`}}>
          {[{step:'01',title:'Report the Incident',desc:'Contact us within 24 hours. Provide photos, renter details, description.'},{step:'02',title:'Claim Submitted',desc:'Complete formal submission within 5 business days.'},{step:'03',title:'Review and Assessment',desc:'Team reviews documentation and inspects damage.'},{step:'04',title:'Resolution',desc:'Approved claims processed, payment issued.'}].map((s,i)=><div key={i} style={{padding:'28px 24px',borderBottom:`1px solid ${C.grey200}`,borderRight:`1px solid ${C.grey200}`,borderTop:`4px solid ${C.green500}`}}><div style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:800,color:C.grey200,marginBottom:12}}>{s.step}</div><h4 style={{color:C.navy800,marginBottom:8}}>{s.title}</h4><p style={{fontSize:'0.86rem',color:C.grey500,lineHeight:1.65}}>{s.desc}</p></div>)}
        </div>
      </div>
    </section>
  </>)
}

function FAQPage(){
  const[openIdx,setOpenIdx]=useState(null)
  const faqs=[{q:'What types of vehicles does North Arrow cover?',a:'RVs, motorhomes, travel trailers, fifth wheels used in peer-to-peer rental operations. Vehicles must be less than 10 years old.'},{q:'Is North Arrow real commercial insurance?',a:'Yes. Genuine commercial liability and physical damage insurance from A-rated carriers.'},{q:'What is Shield ADW?',a:'Standalone Accidental Damage Waiver. $25/day, $250 deductible, $2,500 max per occurrence.'},{q:'What are the monthly fees?',a:'Flat $33/mo: $15 admin + $10 claims + $8 fleet services. No hidden fees.'},{q:'How long does the application take?',a:'5 consolidated steps, typically 15-30 minutes depending on fleet size.'},{q:'Does North Arrow require GPS tracking?',a:'No. GPS not included or required. Available separately through partners.'},{q:'What makes North Arrow different from MBA?',a:'MBA restructured with higher premiums, lower limits, $399 per-vehicle deposits. North Arrow was built to address these issues.'},{q:'Are festival events covered?',a:'Standard operations covered. Shield ADW excludes festival/high-attendance events.'}]
  return(<>
    <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(140px,16vw,200px)',paddingBottom:'clamp(60px,8vw,100px)'}}><div style={sWrap}><div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.purple400,marginBottom:16}}>FAQ</div><h1 style={{color:C.white}}>Frequently Asked Questions</h1></div></section>
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}><div style={{...sWrap,maxWidth:800}}>{faqs.map((f,i)=><div key={i} style={{borderBottom:`1px solid ${C.grey200}`}}><button onClick={()=>setOpenIdx(openIdx===i?null:i)} style={{width:'100%',textAlign:'left',padding:'22px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontWeight:700,fontSize:'1.02rem',color:C.navy800,paddingRight:20}}>{f.q}</span>{openIdx===i?<ChevronUp size={20} color={C.grey400}/>:<ChevronDown size={20} color={C.grey400}/>}</button>{openIdx===i&&<div style={{paddingBottom:22,color:C.grey600,lineHeight:1.7,fontSize:'0.93rem'}}>{f.a}</div>}</div>)}</div></section>
  </>)
}

function ContactPage(){
  return(<>
    <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(140px,16vw,200px)',paddingBottom:'clamp(60px,8vw,100px)'}}><div style={sWrap}><div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.navy300,marginBottom:16}}>Contact</div><h1 style={{color:C.white}}>Get in Touch</h1><p style={{color:C.navy200,fontSize:'1.05rem',maxWidth:500}}>Have questions about coverage? Our team is here to help.</p></div></section>
    <section style={{padding:'clamp(60px,8vw,120px) 0',background:C.white}}>
      <div style={{...sWrap,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'clamp(40px,6vw,80px)'}}>
        <div><h3 style={{color:C.navy800,marginBottom:24}}>Send Us a Message</h3><div style={{display:'flex',flexDirection:'column',gap:18}}>{[{label:'Full Name',type:'text',ph:'John Smith'},{label:'Email',type:'email',ph:'john@example.com'},{label:'Phone',type:'tel',ph:'(619) 555-0100'},{label:'Fleet Size',type:'number',ph:'Number of vehicles'}].map((f,i)=><div key={i}><label style={{display:'block',fontSize:'0.83rem',fontWeight:600,color:C.grey600,marginBottom:6}}>{f.label}</label><input type={f.type} placeholder={f.ph} style={{width:'100%',padding:'13px 16px',border:`1px solid ${C.grey200}`,borderRadius:6,fontSize:'0.93rem',fontFamily:'var(--font-body)',outline:'none'}}/></div>)}<div><label style={{display:'block',fontSize:'0.83rem',fontWeight:600,color:C.grey600,marginBottom:6}}>Message</label><textarea rows={4} placeholder="Tell us about your fleet..." style={{width:'100%',padding:'13px 16px',border:`1px solid ${C.grey200}`,borderRadius:6,fontSize:'0.93rem',fontFamily:'var(--font-body)',outline:'none',resize:'vertical'}}/></div><button style={{padding:'14px 36px',background:C.green600,color:C.white,borderRadius:6,fontWeight:700,cursor:'pointer',border:'none',display:'inline-flex',alignItems:'center',gap:8,width:'fit-content'}}><Send size={17}/> Send Message</button></div></div>
        <div><div style={{background:C.navy800,padding:'clamp(32px,4vw,48px)',marginBottom:20}}><h3 style={{color:C.white,marginBottom:24}}>Contact Information</h3>{[{icon:Phone,label:'Phone',value:'(619) 599-6882'},{icon:Mail,label:'Email',value:'info@northarrowins.com'},{icon:MapPin,label:'Location',value:'San Diego, California'},{icon:Clock,label:'Hours',value:'Monday - Friday, 9 AM - 5 PM PST'}].map((c,i)=><div key={i} style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:18}}><div style={{width:38,height:38,background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><c.icon size={17} color={C.navy300}/></div><div><div style={{fontSize:'0.78rem',color:C.navy400,fontWeight:600}}>{c.label}</div><div style={{color:C.white,fontWeight:600,marginTop:2}}>{c.value}</div></div></div>)}</div><div style={{background:C.purple100,padding:'clamp(24px,3vw,36px)'}}><h4 style={{color:C.purple700,marginBottom:8}}>Need Urgent Help?</h4><p style={{color:C.purple700,fontSize:'0.9rem',lineHeight:1.6,opacity:0.8}}>For active claims or time-sensitive questions, call (619) 599-6882 directly.</p></div></div>
      </div>
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </section>
  </>)
}

function ApplyPage(){
  return <ApplicationForm/>
}

function LoginPage(){
  return(
    <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg, ${C.grey50}, ${C.navy50})`,paddingTop:72}}>
      <div style={{width:'100%',maxWidth:420,padding:'44px clamp(24px,4vw,44px)',background:C.white,border:`1px solid ${C.grey200}`}}>
        <div style={{textAlign:'center',marginBottom:32}}><LogoSVG size={44}/><div style={{marginTop:14}}><h3 style={{color:C.navy800,marginBottom:4}}>Owner Portal Login</h3><p style={{color:C.grey400,fontSize:'0.88rem'}}>Access your policy, claims, and fleet dashboard.</p></div></div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}><div><label style={{display:'block',fontSize:'0.83rem',fontWeight:600,color:C.grey600,marginBottom:6}}>Email Address</label><input type="email" placeholder="you@example.com" style={{width:'100%',padding:'13px 16px',border:`1px solid ${C.grey200}`,borderRadius:6,fontSize:'0.93rem',fontFamily:'var(--font-body)',outline:'none'}}/></div><div><label style={{display:'flex',justifyContent:'space-between',fontSize:'0.83rem',fontWeight:600,color:C.grey600,marginBottom:6}}>Password <span style={{color:C.navy400,cursor:'pointer',fontWeight:400}}>Forgot password?</span></label><input type="password" placeholder="Enter your password" style={{width:'100%',padding:'13px 16px',border:`1px solid ${C.grey200}`,borderRadius:6,fontSize:'0.93rem',fontFamily:'var(--font-body)',outline:'none'}}/></div><button style={{width:'100%',padding:'15px',background:C.navy700,color:C.white,borderRadius:6,fontWeight:700,cursor:'pointer',fontSize:'0.98rem',marginTop:6,border:'none'}}>Sign In</button></div>
        <div style={{textAlign:'center',marginTop:22,fontSize:'0.86rem',color:C.grey400}}>Don't have an account? <span style={{color:C.green600,fontWeight:600,cursor:'pointer'}}>Apply now</span></div>
      </div>
    </section>
  )
}

export default function App(){
  const[page,setPage]=useState('home')
  const renderPage=()=>{switch(page){case'home':return<HomePage setPage={setPage}/>;case'coverage':return<CoveragePage setPage={setPage}/>;case'shield':return<ShieldPage setPage={setPage}/>;case'about':return<AboutPage/>;case'claims':return<ClaimsPage/>;case'faq':return<FAQPage/>;case'contact':return<ContactPage/>;case'apply':return<ApplyPage/>;case'login':return<LoginPage/>;default:return<HomePage setPage={setPage}/>}}
  return(<><Nav page={page} setPage={setPage}/><main>{renderPage()}</main>{page!=='login'&&<Footer setPage={setPage}/>}</>)
}
