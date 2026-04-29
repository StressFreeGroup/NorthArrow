import { useState, useEffect } from 'react'
import { Check, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Save, Plus, Trash2, Edit3, Building2, FileText, Truck, Settings, Wrench, ShieldCheck, AlertCircle, Mail, Phone, User, Lock, Send } from 'lucide-react'

const C={navy900:'#0A1628',navy800:'#0F2240',navy700:'#132D5E',navy600:'#1A3F7A',navy500:'#2558A3',navy400:'#3B7DD8',navy300:'#6FA3E8',navy200:'#A8C8F0',navy100:'#D4E4F8',navy50:'#EBF2FB',green700:'#1B6E3D',green600:'#238B4E',green500:'#2EA663',green400:'#4CC07E',green100:'#D6F0E2',green50:'#F0FAF4',purple700:'#4A2D7A',purple600:'#5E3B99',purple500:'#7349B8',purple400:'#8F6DD0',purple100:'#E6DCF5',white:'#FFFFFF',grey50:'#F7F8FA',grey100:'#F0F2F5',grey200:'#E2E6EB',grey300:'#CDD3DB',grey400:'#9CA5B2',grey500:'#6B7685',grey600:'#4A5568',grey700:'#2D3748',red600:'#DC2626',red50:'#FEF2F2',amber600:'#D97706',amber50:'#FFFBEB',amber200:'#FDE68A'}

const STATES=['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

// ─── INPUT PRIMITIVES ─────────────────────────────────────
const labelStyle={display:'block',fontSize:'0.78rem',fontWeight:700,color:C.grey700,marginBottom:6,letterSpacing:'0.02em',textTransform:'uppercase'}
const inputStyle={width:'100%',padding:'12px 14px',border:`1.5px solid ${C.grey200}`,borderRadius:6,fontSize:'0.94rem',fontFamily:'var(--font-body, system-ui)',outline:'none',background:C.white,transition:'border-color 0.15s'}

function TextField({label,required,value,onChange,placeholder,type='text'}){
  return(
    <div>
      <label style={labelStyle}>{label}{required&&<span style={{color:C.red600,marginLeft:4}}>*</span>}</label>
      <input type={type} value={value||''} onChange={onChange} placeholder={placeholder} style={inputStyle} onFocus={e=>e.target.style.borderColor=C.navy500} onBlur={e=>e.target.style.borderColor=C.grey200}/>
    </div>
  )
}
function SelectField({label,required,value,onChange,options,placeholder='Select...'}){
  return(
    <div>
      <label style={labelStyle}>{label}{required&&<span style={{color:C.red600,marginLeft:4}}>*</span>}</label>
      <select value={value||''} onChange={onChange} style={{...inputStyle,cursor:'pointer'}} onFocus={e=>e.target.style.borderColor=C.navy500} onBlur={e=>e.target.style.borderColor=C.grey200}>
        <option value="">{placeholder}</option>
        {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  )
}
function Toggle({label,value,onChange}){
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:C.grey50,borderLeft:`3px solid ${value===true?C.green500:value===false?C.grey300:C.grey200}`,marginBottom:8,gap:14}}>
      <div style={{flex:1,fontSize:'0.93rem',color:C.grey700,lineHeight:1.45}}>{label}</div>
      <div style={{display:'flex',gap:6,flexShrink:0}}>
        <button type="button" onClick={()=>onChange(true)} style={{padding:'7px 18px',fontSize:'0.83rem',fontWeight:700,border:'none',cursor:'pointer',borderRadius:4,background:value===true?C.green600:C.white,color:value===true?C.white:C.grey500,boxShadow:value===true?'none':`inset 0 0 0 1px ${C.grey200}`}}>YES</button>
        <button type="button" onClick={()=>onChange(false)} style={{padding:'7px 18px',fontSize:'0.83rem',fontWeight:700,border:'none',cursor:'pointer',borderRadius:4,background:value===false?C.navy700:C.white,color:value===false?C.white:C.grey500,boxShadow:value===false?'none':`inset 0 0 0 1px ${C.grey200}`}}>NO</button>
      </div>
    </div>
  )
}
function Section({icon:Icon,title,count,children,defaultOpen=true}){
  const[open,setOpen]=useState(defaultOpen)
  return(
    <div style={{border:`1px solid ${C.grey200}`,marginBottom:16,background:C.white,overflow:'hidden'}}>
      <button type="button" onClick={()=>setOpen(!open)} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'16px 20px',background:open?C.navy50:C.grey50,border:'none',cursor:'pointer',textAlign:'left',transition:'background 0.15s'}}>
        <div style={{width:34,height:34,background:C.white,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${C.grey200}`,flexShrink:0}}><Icon size={17} color={C.navy700}/></div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:'0.97rem',color:C.navy800}}>{title}</div>
          {count&&<div style={{fontSize:'0.78rem',color:C.grey500,marginTop:2}}>{count}</div>}
        </div>
        {open?<ChevronUp size={18} color={C.grey500}/>:<ChevronDown size={18} color={C.grey500}/>}
      </button>
      {open&&<div style={{padding:'24px 20px'}}>{children}</div>}
    </div>
  )
}
const Row=({children})=><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>{children}</div>
const Stack=({children})=><div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:14}}>{children}</div>

// ─── PROFILE GATE ─────────────────────────────────────────
function ProfileGate({onComplete}){
  const[p,setP]=useState({name:'',email:'',phone:''})
  const[err,setErr]=useState('')
  const submit=()=>{
    if(!p.name||!p.email||!p.phone){setErr('All fields are required to begin your application.');return}
    if(!p.email.includes('@')){setErr('Please enter a valid email address.');return}
    const id='NA-'+Math.random().toString(36).slice(2,8).toUpperCase()
    onComplete({...p,appId:id,startedAt:new Date().toISOString()})
  }
  return(
    <div style={{maxWidth:560,margin:'0 auto',background:C.white,padding:'clamp(36px,5vw,56px)',border:`1px solid ${C.grey200}`,boxShadow:'0 4px 24px rgba(15,34,64,0.06)'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
        <div style={{width:42,height:42,background:C.navy800,display:'flex',alignItems:'center',justifyContent:'center'}}><User size={20} color={C.white}/></div>
        <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:C.navy600}}>Begin Application</div>
      </div>
      <h2 style={{color:C.navy800,marginBottom:10,fontSize:'1.7rem'}}>Create Your Profile</h2>
      <p style={{color:C.grey600,fontSize:'0.95rem',lineHeight:1.65,marginBottom:28}}>Quick profile to start. We'll generate an Application ID so you can save your progress and return at any time.</p>
      <Stack>
        <TextField label="Full Name" required value={p.name} onChange={e=>setP({...p,name:e.target.value})} placeholder="Jane Smith"/>
        <TextField label="Email Address" required type="email" value={p.email} onChange={e=>setP({...p,email:e.target.value})} placeholder="you@company.com"/>
        <TextField label="Phone Number" required type="tel" value={p.phone} onChange={e=>setP({...p,phone:e.target.value})} placeholder="(619) 555-0100"/>
      </Stack>
      {err&&<div style={{padding:'10px 14px',background:C.red50,color:C.red600,fontSize:'0.86rem',marginBottom:14,borderLeft:`3px solid ${C.red600}`}}>{err}</div>}
      <button type="button" onClick={submit} style={{width:'100%',padding:'14px',background:C.green600,color:C.white,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.97rem',display:'flex',alignItems:'center',justifyContent:'center',gap:8,borderRadius:6}}>Generate Application ID <ArrowRight size={17}/></button>
      <div style={{marginTop:18,fontSize:'0.8rem',color:C.grey400,textAlign:'center',lineHeight:1.55}}>Your information is used only for your application. We never share or sell data.</div>
    </div>
  )
}

// ─── STEP 1: FLEET OWNER ──────────────────────────────────
function Step1({owner,setOwner,prior,setPrior}){
  return(<>
    <Section icon={Building2} title="Entity and Contact Information" count="12 fields">
      <Stack>
        <SelectField label="Entity Type" required value={owner.entity} onChange={e=>setOwner({...owner,entity:e.target.value})} options={['Individual','Business / LLC','Corporation','Partnership','Trust']}/>
      </Stack>
      <Row>
        <TextField label="Legal Name / Business Name" required value={owner.name} onChange={e=>setOwner({...owner,name:e.target.value})} placeholder="Full legal name"/>
        <SelectField label="Registered State" required value={owner.regState} onChange={e=>setOwner({...owner,regState:e.target.value})} options={STATES}/>
      </Row>
      <Row>
        <TextField label="Registration Address" required value={owner.addr} onChange={e=>setOwner({...owner,addr:e.target.value})} placeholder="Street address"/>
        <TextField label="Suite / Office" value={owner.suite} onChange={e=>setOwner({...owner,suite:e.target.value})} placeholder="Optional"/>
      </Row>
      <Row>
        <TextField label="City" required value={owner.city} onChange={e=>setOwner({...owner,city:e.target.value})}/>
        <SelectField label="State" required value={owner.state} onChange={e=>setOwner({...owner,state:e.target.value})} options={STATES}/>
      </Row>
      <Row>
        <TextField label="Postal Code" required value={owner.zip} onChange={e=>setOwner({...owner,zip:e.target.value})} placeholder="00000"/>
        <TextField label="Phone Number" required type="tel" value={owner.phone} onChange={e=>setOwner({...owner,phone:e.target.value})} placeholder="(___) ___-____"/>
      </Row>
      <Row>
        <TextField label="Email Address" required type="email" value={owner.email} onChange={e=>setOwner({...owner,email:e.target.value})} placeholder="email@example.com"/>
        <TextField label="Date of Birth" required type="date" value={owner.dob} onChange={e=>setOwner({...owner,dob:e.target.value})}/>
      </Row>
      <TextField label="Driver's License Number" required value={owner.license} onChange={e=>setOwner({...owner,license:e.target.value})} placeholder="License number"/>
    </Section>

    <Section icon={FileText} title="Prior Insurance History" count="2-3 questions">
      <Toggle label="Has applicant ever been cancelled or non-renewed by a rental insurance carrier?" value={prior.cancelled} onChange={v=>setPrior({...prior,cancelled:v})}/>
      <Toggle label="Is the applicant currently or previously insured for rental coverage?" value={prior.insured} onChange={v=>setPrior({...prior,insured:v})}/>
      {prior.insured===true&&<div style={{marginTop:14}}><TextField label="Name of Current or Previous Rental Insurance Provider" value={prior.priorCarrier} onChange={e=>setPrior({...prior,priorCarrier:e.target.value})} placeholder="e.g., MBA, Roamly, Progressive Commercial"/></div>}
      {prior.cancelled===true&&<div style={{marginTop:14}}><TextField label="Reason for cancellation or non-renewal" value={prior.cancelReason} onChange={e=>setPrior({...prior,cancelReason:e.target.value})} placeholder="Briefly explain"/></div>}
    </Section>
  </>)
}

// ─── STEP 2: VEHICLES ─────────────────────────────────────
const VEHICLE_TYPES=['Travel Trailer','5th Wheel','Toy Hauler','Class A Motorhome','Class B Motorhome','Class C Motorhome','Truck Camper','Pop-Up Camper','Other']
function Step2({vehicles,setVehicles,lien,setLien,vCond,setVCond}){
  const[draft,setDraft]=useState({year:'',make:'',model:'',value:'',length:'',vin:'',type:'',subtype:''})
  const[editIdx,setEditIdx]=useState(null)
  const reset=()=>{setDraft({year:'',make:'',model:'',value:'',length:'',vin:'',type:'',subtype:''});setEditIdx(null)}
  const addOrUpdate=()=>{
    if(!draft.year||!draft.make||!draft.model||!draft.vin)return
    if(editIdx!==null){const arr=[...vehicles];arr[editIdx]=draft;setVehicles(arr)}
    else setVehicles([...vehicles,draft])
    reset()
  }
  const edit=i=>{setDraft(vehicles[i]);setEditIdx(i)}
  const remove=i=>setVehicles(vehicles.filter((_,j)=>j!==i))
  return(<>
    <Section icon={Truck} title="Vehicle Entry" count={`${vehicles.length} vehicle${vehicles.length===1?'':'s'} added`}>
      {vehicles.length>0&&<div style={{marginBottom:20}}>
        <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:C.green700,marginBottom:10}}>Your Fleet</div>
        {vehicles.map((v,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',background:C.green50,borderLeft:`3px solid ${C.green500}`,marginBottom:6}}>
            <Check size={17} color={C.green600} style={{flexShrink:0}}/>
            <div style={{flex:1,fontSize:'0.92rem',color:C.navy800}}>
              <strong>{v.year} {v.make} {v.model}</strong>
              <span style={{color:C.grey500,marginLeft:10,fontSize:'0.85rem'}}>VIN: {v.vin} · ${v.value} · {v.length}ft · {v.type}</span>
            </div>
            <button type="button" onClick={()=>edit(i)} style={{padding:'6px 10px',background:C.white,border:`1px solid ${C.grey200}`,cursor:'pointer',color:C.navy700,fontSize:'0.78rem',fontWeight:700,borderRadius:4,display:'inline-flex',alignItems:'center',gap:4}}><Edit3 size={12}/>Edit</button>
            <button type="button" onClick={()=>remove(i)} style={{padding:'6px 10px',background:C.white,border:`1px solid ${C.grey200}`,cursor:'pointer',color:C.red600,fontSize:'0.78rem',fontWeight:700,borderRadius:4,display:'inline-flex',alignItems:'center',gap:4}}><Trash2 size={12}/>Remove</button>
          </div>
        ))}
      </div>}
      <div style={{padding:18,background:C.grey50,border:`1px dashed ${C.grey300}`}}>
        <div style={{fontWeight:700,color:C.navy800,marginBottom:14,fontSize:'0.95rem'}}>{editIdx!==null?`Editing Vehicle #${editIdx+1}`:`Add Vehicle #${vehicles.length+1}`}</div>
        <Row>
          <TextField label="Year" required value={draft.year} onChange={e=>setDraft({...draft,year:e.target.value})} placeholder="2022"/>
          <TextField label="Make" required value={draft.make} onChange={e=>setDraft({...draft,make:e.target.value})} placeholder="Forest River"/>
        </Row>
        <Row>
          <TextField label="Model" required value={draft.model} onChange={e=>setDraft({...draft,model:e.target.value})} placeholder="East to West Alta"/>
          <TextField label="Declared Value ($)" required type="number" value={draft.value} onChange={e=>setDraft({...draft,value:e.target.value})} placeholder="35000"/>
        </Row>
        <Row>
          <TextField label="Length (ft)" required value={draft.length} onChange={e=>setDraft({...draft,length:e.target.value})} placeholder="28"/>
          <TextField label="VIN" required value={draft.vin} onChange={e=>setDraft({...draft,vin:e.target.value.toUpperCase()})} placeholder="17-character VIN"/>
        </Row>
        <Row>
          <SelectField label="Vehicle Type" required value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value})} options={VEHICLE_TYPES}/>
          <TextField label="Sub-Type / Trim" value={draft.subtype} onChange={e=>setDraft({...draft,subtype:e.target.value})} placeholder="Optional"/>
        </Row>
        <div style={{display:'flex',gap:10,marginTop:6}}>
          <button type="button" onClick={addOrUpdate} style={{padding:'10px 22px',background:C.navy700,color:C.white,border:'none',cursor:'pointer',fontWeight:700,fontSize:'0.88rem',display:'inline-flex',alignItems:'center',gap:6,borderRadius:6}}><Plus size={15}/>{editIdx!==null?'Update Vehicle':'Add to Fleet'}</button>
          {editIdx!==null&&<button type="button" onClick={reset} style={{padding:'10px 22px',background:C.white,color:C.grey600,border:`1px solid ${C.grey200}`,cursor:'pointer',fontWeight:700,fontSize:'0.88rem',borderRadius:6}}>Cancel</button>}
        </div>
      </div>
    </Section>

    <Section icon={Lock} title="Lien Information" count="Conditional">
      <Toggle label="Is there an active lien on any vehicle in your fleet?" value={lien.hasLien} onChange={v=>setLien({...lien,hasLien:v})}/>
      {lien.hasLien===true&&<div style={{marginTop:18,padding:18,background:C.amber50,border:`1px solid ${C.amber200}`}}>
        <div style={{fontWeight:700,color:C.navy800,marginBottom:14,fontSize:'0.92rem'}}>Lienholder Details</div>
        <Stack>
          <TextField label="Lienholder Name" required value={lien.name} onChange={e=>setLien({...lien,name:e.target.value})} placeholder="Bank or finance company name"/>
        </Stack>
        <Row>
          <TextField label="Address" required value={lien.addr} onChange={e=>setLien({...lien,addr:e.target.value})}/>
          <TextField label="City" required value={lien.city} onChange={e=>setLien({...lien,city:e.target.value})}/>
        </Row>
        <Row>
          <SelectField label="State" required value={lien.state} onChange={e=>setLien({...lien,state:e.target.value})} options={STATES}/>
          <TextField label="Postal Code" required value={lien.zip} onChange={e=>setLien({...lien,zip:e.target.value})}/>
        </Row>
        <Row>
          <TextField label="Phone" type="tel" value={lien.phone} onChange={e=>setLien({...lien,phone:e.target.value})}/>
          <TextField label="Email" type="email" value={lien.email} onChange={e=>setLien({...lien,email:e.target.value})}/>
        </Row>
        <Row>
          <TextField label="Fax" value={lien.fax} onChange={e=>setLien({...lien,fax:e.target.value})}/>
          <TextField label="Account / Loan Number" value={lien.account} onChange={e=>setLien({...lien,account:e.target.value})}/>
        </Row>
      </div>}
    </Section>

    <Section icon={AlertCircle} title="Per-Vehicle Condition" count="6 questions, applies to all units">
      <Toggle label="Are all vehicles licensed for road use?" value={vCond.licensed} onChange={v=>setVCond({...vCond,licensed:v})}/>
      <Toggle label="Do all vehicles have a clean title?" value={vCond.cleanTitle} onChange={v=>setVCond({...vCond,cleanTitle:v})}/>
      <Toggle label="Is there any existing unrepaired damage on any vehicle?" value={vCond.damage} onChange={v=>setVCond({...vCond,damage:v})}/>
      {vCond.damage===true&&<div style={{margin:'8px 0 12px'}}><TextField label="Describe the damage" value={vCond.damageDetail} onChange={e=>setVCond({...vCond,damageDetail:e.target.value})} placeholder="Brief description"/></div>}
      <Toggle label="Is there cracked or broken glass / windshield on any vehicle?" value={vCond.glass} onChange={v=>setVCond({...vCond,glass:v})}/>
      <Toggle label="Is any vehicle homemade or custom-built?" value={vCond.custom} onChange={v=>setVCond({...vCond,custom:v})}/>
      {vCond.custom===true&&<div style={{margin:'8px 0 12px'}}><TextField label="Explain the custom build" value={vCond.customDetail} onChange={e=>setVCond({...vCond,customDetail:e.target.value})} placeholder="Brief description"/></div>}
      <Toggle label="Has the frame been materially altered on any vehicle?" value={vCond.altered} onChange={v=>setVCond({...vCond,altered:v})}/>
      {vCond.altered===true&&<div style={{margin:'8px 0 12px'}}><TextField label="Explain the alteration" value={vCond.alteredDetail} onChange={e=>setVCond({...vCond,alteredDetail:e.target.value})} placeholder="Brief description"/></div>}
    </Section>
  </>)
}

// ─── STEP 3: OPERATIONS ───────────────────────────────────
function Step3({res,setRes,renter,setRenter,emp,setEmp}){
  const set=(state,setter)=>(k)=>(v)=>setter({...state,[k]:v})
  const sR=set(res,setRes),sN=set(renter,setRenter),sE=set(emp,setEmp)
  return(<>
    <Section icon={FileText} title="Rental Reservations" count="13 questions">
      <Toggle label="Does the applicant require advance reservations?" value={res.advanceRes} onChange={sR('advanceRes')}/>
      <Toggle label="Does the applicant accept all reservation requests?" value={res.acceptAll} onChange={sR('acceptAll')}/>
      <Toggle label="Does the applicant allow same-day rentals?" value={res.sameDay} onChange={sR('sameDay')}/>
      <Toggle label="Does the applicant allow hourly rentals?" value={res.hourly} onChange={sR('hourly')}/>
      <Toggle label="Are rental agreements completed and signed on every rental?" value={res.signedAgreement} onChange={sR('signedAgreement')}/>
      <Toggle label="Are rental agreements renewed every 30 days for long-term rentals?" value={res.renew30} onChange={sR('renew30')}/>
      <Toggle label="Are all drivers listed as authorized on the rental agreement?" value={res.allDrivers} onChange={sR('allDrivers')}/>
      <Toggle label="Are all additional drivers required to be present at pickup?" value={res.driversPresent} onChange={sR('driversPresent')}/>
      <Toggle label="Is there a formal check-out process performed before each rental?" value={res.checkout} onChange={sR('checkout')}/>
      <Toggle label="Is the renter required to sign or agree to the check-out process?" value={res.checkoutSign} onChange={sR('checkoutSign')}/>
      <Toggle label="Is there a formal check-in process performed after each rental?" value={res.checkin} onChange={sR('checkin')}/>
      <Toggle label="Is the renter required to sign or agree to the check-in process?" value={res.checkinSign} onChange={sR('checkinSign')}/>
      <Toggle label="Is the applicant a member of any local, state, or national trade association?" value={res.tradeAssoc} onChange={sR('tradeAssoc')}/>
    </Section>

    <Section icon={User} title="Renter Qualification and Training" count="14 questions">
      <Toggle label="Does the applicant ask the renter about trip plans or destination?" value={renter.tripPlans} onChange={sN('tripPlans')}/>
      <Toggle label="Does the applicant visually inspect the driver's licenses of all drivers for validity?" value={renter.inspectLic} onChange={sN('inspectLic')}/>
      <Toggle label="Does the applicant verify that the renter has insurance prior to releasing each rental?" value={renter.verifyIns} onChange={sN('verifyIns')}/>
      <Toggle label="Must the insurance provide at least the minimum coverages required by applicable state law?" value={renter.stateMin} onChange={sN('stateMin')}/>
      <Toggle label="Must the insurance provide coverage to all authorized / additional drivers?" value={renter.coverDrivers} onChange={sN('coverDrivers')}/>
      <Toggle label="Must the insurance provide coverage for damages or loss to the rented vehicle?" value={renter.coverDamage} onChange={sN('coverDamage')}/>
      <Toggle label="Does the applicant require a driving record questionnaire completed by every renter?" value={renter.drivingRecord} onChange={sN('drivingRecord')}/>
      <Toggle label="Do all renter requirements also apply to all authorized / additional drivers?" value={renter.applyAll} onChange={sN('applyAll')}/>
      <Toggle label="Does the applicant provide vehicle driving / operation instructions to every renter?" value={renter.instructions} onChange={sN('instructions')}/>
      <Toggle label="Are the instructions provided verbally?" value={renter.verbal} onChange={sN('verbal')}/>
      <Toggle label="Are the instructions provided in writing?" value={renter.written} onChange={sN('written')}/>
      <Toggle label="Are the instructions provided via single or multiple videos?" value={renter.videos} onChange={sN('videos')}/>
      <Toggle label="Are renters required to demonstrate driving / towing ability before pickup?" value={renter.demo} onChange={sN('demo')}/>
      <Toggle label="Does the applicant rent to anyone under 25 years of age?" value={renter.under25} onChange={sN('under25')}/>
    </Section>

    <Section icon={Settings} title="Employee Selection and Training" count="7 questions">
      <Toggle label="Is there a designated rental manager?" value={emp.rentalMgr} onChange={sE('rentalMgr')}/>
      <Toggle label="Is there formal training for counter practices?" value={emp.counter} onChange={sE('counter')}/>
      <Toggle label="Is there formal training for walk-through procedures?" value={emp.walkthrough} onChange={sE('walkthrough')}/>
      <Toggle label="Is there formal training for driving safety?" value={emp.driving} onChange={sE('driving')}/>
      <Toggle label="Are MVRs (Motor Vehicle Records) checked before hiring drivers?" value={emp.mvr} onChange={sE('mvr')}/>
      <Toggle label="Do employees attend rental business education courses or seminars?" value={emp.education} onChange={sE('education')}/>
      <Toggle label="Does the applicant employ certified maintenance and repair technicians?" value={emp.certTech} onChange={sE('certTech')}/>
    </Section>
  </>)
}

// ─── STEP 4: SAFETY AND MAINTENANCE ───────────────────────
function Step4({maint,setMaint,fleet,setFleet,preChecks,setPreChecks}){
  const setM=(k)=>(v)=>setMaint({...maint,[k]:v})
  const setF=(k)=>(v)=>setFleet({...fleet,[k]:v})
  const setPC=(k)=>(v)=>setPreChecks({...preChecks,[k]:v})
  return(<>
    <Section icon={Wrench} title="Fleet Maintenance and Loss Prevention" count="23 questions">
      <Toggle label="Are vehicles serviced in accordance with manufacturer recommendations?" value={maint.mfgService} onChange={setM('mfgService')}/>
      <Toggle label="Does the applicant perform its own vehicle maintenance and repair?" value={maint.ownRepair} onChange={setM('ownRepair')}/>
      <Toggle label="Are maintenance and repair technicians certified?" value={maint.certTech} onChange={setM('certTech')}/>
      <Toggle label="Is there a formal training program for all technicians?" value={maint.techTraining} onChange={setM('techTraining')}/>
      <Toggle label="Are vehicle maintenance records kept for all vehicles?" value={maint.records} onChange={setM('records')}/>
      <Toggle label="Are tires replaced in accordance with manufacturer recommendations?" value={maint.tires} onChange={setM('tires')}/>
      <Toggle label="Are brakes replaced in accordance with manufacturer recommendations?" value={maint.brakes} onChange={setM('brakes')}/>
      <Toggle label="Is the renter questioned about any problems or issues after each rental?" value={maint.renterIssues} onChange={setM('renterIssues')}/>
      <Toggle label="Are vehicle safety inspections performed regularly?" value={maint.inspections} onChange={setM('inspections')}/>
      <Toggle label="Are tires checked before and after each rental?" value={maint.tiresCheck} onChange={setM('tiresCheck')}/>
      <Toggle label="Are brakes / brake connectors checked before and after each rental?" value={maint.brakeCheck} onChange={setM('brakeCheck')}/>
      <Toggle label="Does each parking / storage location have security cameras installed?" value={maint.cameras} onChange={setM('cameras')}/>
      <Toggle label="Is each parking / storage location fully fenced?" value={maint.fenced} onChange={setM('fenced')}/>
      <Toggle label="Is each parking / storage location secured or guarded at all times?" value={maint.guarded} onChange={setM('guarded')}/>
      <Toggle label="Are rental vehicles stored inside a building or under covered parking?" value={maint.covered} onChange={setM('covered')}/>
      <Toggle label="Does the applicant have an offseason storage and maintenance process or plan in place?" value={maint.offseason} onChange={setM('offseason')}/>
      <Toggle label="Does the applicant have a loss prevention plan for severe weather?" value={maint.lossPrev} onChange={setM('lossPrev')}/>
      <Toggle label="Do all rental vehicles have security anti-theft devices installed?" value={maint.antiTheft} onChange={setM('antiTheft')}/>
      <Toggle label="Is there a formal theft prevention plan in place?" value={maint.theftPlan} onChange={setM('theftPlan')}/>
      <Toggle label="Are there formal fire prevention procedures?" value={maint.firePlan} onChange={setM('firePlan')}/>
      <Toggle label="Does the applicant allow after-hours dropoffs?" value={maint.afterHours} onChange={setM('afterHours')}/>
      <Toggle label="Is there a secure key dropbox?" value={maint.dropbox} onChange={setM('dropbox')}/>
      <Toggle label="Are vehicles returned to a safe / secured location?" value={maint.safeReturn} onChange={setM('safeReturn')}/>
    </Section>

    <Section icon={Truck} title="Fleet Specifics" count="5 questions">
      <Toggle label="Are child safety seats available for renters who request them?" value={fleet.childSeats} onChange={setF('childSeats')}/>
      <Toggle label="Are any rental vehicles ever stationary for over 30 days?" value={fleet.stationary30} onChange={setF('stationary30')}/>
      <Toggle label="Does the applicant provide equipment operation instructions to every renter?" value={fleet.equipInstr} onChange={setF('equipInstr')}/>
      <Toggle label="Does the applicant allow the use of awnings?" value={fleet.awnings} onChange={setF('awnings')}/>
      <Toggle label="Are operational, safety, and warning labels affixed to each rental vehicle?" value={fleet.labels} onChange={setF('labels')}/>
    </Section>

    <Section icon={ShieldCheck} title="Pre-Rental Safety Systems Checked" count="11 systems">
      <p style={{fontSize:'0.88rem',color:C.grey600,marginBottom:14,lineHeight:1.55}}>Confirm that the following systems are physically inspected and verified prior to each rental:</p>
      {[['generator','Generator'],['tanks','Holding Tanks'],['plumbing','Plumbing'],['fridge','Refrigerator'],['electrical','Electrical'],['lpg','LPG Gas System'],['stove','Stove / Oven'],['furnace','Furnace / AC'],['slides','Slide Outs, Jacks, and Stabilizers'],['detectors','Smoke / Fire / Carbon Monoxide Detectors'],['hitches','Hitches and Hitch Locking Mechanisms']].map(([k,label])=>(
        <Toggle key={k} label={label} value={preChecks[k]} onChange={setPC(k)}/>
      ))}
    </Section>
  </>)
}

// ─── STEP 5: COVERAGE AND REVIEW ──────────────────────────
const TIERS=[
  {id:'basic',   name:'Bronze · Basic',     price:80,  prem:47,  limits:'BI $15K/$30K · PD $5K · Ded $2,500',         color:C.navy700},
  {id:'standard',name:'Silver · Standard',  price:100, prem:67,  limits:'BI $100K/$300K · PD $50K · Ded $2,000',      color:C.green600},
  {id:'premium', name:'Gold · Premium',     price:124, prem:91,  limits:'BI $300K/$500K · PD $100K · Ded $1,500',     color:C.purple600,popular:true},
  {id:'platinum',name:'Platinum · Elite',   price:167, prem:134, limits:'BI $1M/$2M · PD $250K · Ded $500',           color:C.navy900},
]
const ADDONS=[
  {id:'sli',name:'Supplemental Liability Insurance',price:18,desc:'Additional liability coverage above base limits.'},
  {id:'pai',name:'Personal Accident Insurance',price:10,desc:'Medical coverage for renters and passengers.'},
  {id:'pec',name:'Personal Effects Coverage',price:7,desc:'Protects belongings inside the vehicle.'},
  {id:'roadside',name:'Roadside Assistance',price:6,desc:'Towing, lockout, jumpstart, fuel delivery.'},
]
function Step5({tier,setTier,addons,setAddons,shield,setShield,terms,setTerms,vehicles,owner}){
  const totalPerVehicle=tier?TIERS.find(t=>t.id===tier).price:0
  const addonTotal=addons.reduce((s,id)=>s+ADDONS.find(a=>a.id===id).price,0)
  const shieldMonthly=shield?199:0  // capped at $199/month for estimation purposes
  const fleetCount=vehicles.length||1
  return(<>
    <Section icon={ShieldCheck} title="Choose Your Coverage Tier" defaultOpen>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
        {TIERS.map(t=>{const sel=tier===t.id;return(
          <button type="button" key={t.id} onClick={()=>setTier(t.id)} style={{textAlign:'left',padding:'24px 22px',background:sel?C.white:C.grey50,border:`2px solid ${sel?t.color:C.grey200}`,cursor:'pointer',borderRadius:6,position:'relative',transition:'all 0.15s'}}>
            {t.popular&&<div style={{position:'absolute',top:-9,right:14,padding:'3px 11px',background:C.green600,color:C.white,fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',borderRadius:3}}>Most Popular</div>}
            <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:t.color,marginBottom:6}}>{t.name}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:4}}>
              <span style={{fontFamily:'var(--font-display, Georgia)',fontSize:'2.2rem',fontWeight:800,color:C.navy800}}>${t.price}</span>
              <span style={{color:C.grey500,fontSize:'0.85rem'}}>/mo per vehicle</span>
            </div>
            <div style={{fontSize:'0.78rem',color:C.grey500,marginBottom:14}}>${t.prem} premium + $33 fees</div>
            <div style={{fontSize:'0.82rem',color:C.grey700,lineHeight:1.6,padding:'10px 12px',background:C.grey50,borderLeft:`3px solid ${t.color}`}}>{t.limits}</div>
            {sel&&<div style={{marginTop:14,display:'flex',alignItems:'center',gap:6,fontSize:'0.82rem',color:t.color,fontWeight:700}}><Check size={14}/>Selected</div>}
          </button>
        )})}
      </div>
    </Section>

    <Section icon={Plus} title="Optional Add-Ons" count={`${addons.length} selected`}>
      {ADDONS.map(a=>{const sel=addons.includes(a.id);return(
        <label key={a.id} style={{display:'flex',alignItems:'flex-start',gap:14,padding:'14px 16px',marginBottom:8,background:sel?C.green50:C.grey50,borderLeft:`3px solid ${sel?C.green500:C.grey200}`,cursor:'pointer'}}>
          <input type="checkbox" checked={sel} onChange={()=>setAddons(sel?addons.filter(x=>x!==a.id):[...addons,a.id])} style={{marginTop:3,accentColor:C.green600,width:17,height:17,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:14,marginBottom:3}}>
              <span style={{fontWeight:700,color:C.navy800,fontSize:'0.93rem'}}>{a.name}</span>
              <span style={{fontWeight:700,color:C.green700,fontSize:'0.92rem',whiteSpace:'nowrap'}}>+${a.price}/mo</span>
            </div>
            <div style={{fontSize:'0.83rem',color:C.grey500,lineHeight:1.55}}>{a.desc}</div>
          </div>
        </label>
      )})}
    </Section>

    <Section icon={ShieldCheck} title="Stress Free Shield (Damage Waiver)">
      <label style={{display:'flex',alignItems:'flex-start',gap:14,padding:'18px 20px',background:shield?C.green50:C.grey50,borderLeft:`3px solid ${shield?C.green500:C.grey200}`,cursor:'pointer'}}>
        <input type="checkbox" checked={shield} onChange={e=>setShield(e.target.checked)} style={{marginTop:3,accentColor:C.green600,width:17,height:17,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,color:C.navy800,fontSize:'0.97rem',marginBottom:4}}>Add Stress Free Shield to Your Policy</div>
          <div style={{fontSize:'0.86rem',color:C.grey600,lineHeight:1.6,marginBottom:8}}>Standalone interior accidental damage waiver. <strong>$25/day</strong> per vehicle, capped at <strong>$199/trip</strong>. <strong>$250</strong> deductible per occurrence, <strong>$2,500</strong> max coverage. Festival / high-attendance events excluded.</div>
          <div style={{fontSize:'0.74rem',color:C.grey500,fontStyle:'italic',padding:'6px 10px',background:C.amber50,borderLeft:`2px solid ${C.amber600}`,display:'inline-block'}}>NOT AN INSURANCE PRODUCT — Not regulated by the CA Department of Insurance.</div>
        </div>
      </label>
    </Section>

    <Section icon={FileText} title="Application Summary" defaultOpen>
      <div style={{background:C.navy800,color:C.white,padding:'24px 26px',borderRadius:6}}>
        <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:C.navy300,marginBottom:14}}>Estimated Monthly Total</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'10px 20px',fontSize:'0.92rem'}}>
          <div style={{color:C.navy200}}>Coverage Tier ({tier?TIERS.find(t=>t.id===tier).name:'Not selected'})</div>
          <div style={{textAlign:'right',fontWeight:700}}>${totalPerVehicle}/mo per vehicle</div>
          <div style={{color:C.navy200}}>Add-Ons ({addons.length})</div>
          <div style={{textAlign:'right',fontWeight:700}}>${addonTotal}/mo per vehicle</div>
          {shield&&<>
            <div style={{color:C.navy200}}>Stress Free Shield (waiver, capped)</div>
            <div style={{textAlign:'right',fontWeight:700}}>up to ${shieldMonthly}/mo per vehicle</div>
          </>}
          <div style={{gridColumn:'1 / -1',height:1,background:'rgba(255,255,255,0.12)',margin:'8px 0'}}/>
          <div style={{color:C.white,fontWeight:700}}>Per Vehicle (estimated)</div>
          <div style={{textAlign:'right',fontWeight:800,fontSize:'1.05rem'}}>${totalPerVehicle+addonTotal+shieldMonthly}/mo</div>
          <div style={{color:C.white,fontWeight:700}}>Fleet of {fleetCount}</div>
          <div style={{textAlign:'right',fontWeight:800,fontSize:'1.3rem',color:C.green400}}>${(totalPerVehicle+addonTotal+shieldMonthly)*fleetCount}/mo</div>
        </div>
        <div style={{marginTop:16,fontSize:'0.76rem',color:C.navy300,lineHeight:1.55}}>Final premium subject to underwriting review. Per-vehicle pricing varies by declared value, type, and model year. Shield waiver is not insurance and is billed by occurrence at $25/day, capped at $199/trip — shown here at the monthly cap as the high-end estimate.</div>
      </div>

      <div style={{marginTop:18,padding:18,background:C.grey50,fontSize:'0.86rem',color:C.grey700,lineHeight:1.6}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>
          <div><strong style={{display:'block',color:C.navy800,marginBottom:4}}>Applicant</strong>{owner.name||'Not provided'}<br/>{owner.email||''}<br/>{owner.phone||''}</div>
          <div><strong style={{display:'block',color:C.navy800,marginBottom:4}}>Entity Type</strong>{owner.entity||'Not selected'}<br/>{owner.regState&&`Registered in ${owner.regState}`}</div>
          <div><strong style={{display:'block',color:C.navy800,marginBottom:4}}>Fleet</strong>{vehicles.length} vehicle{vehicles.length===1?'':'s'} declared</div>
        </div>
      </div>
    </Section>

    <div style={{padding:16,background:C.amber50,border:`1px solid ${C.amber200}`,marginBottom:18,fontSize:'0.86rem',color:C.grey700,lineHeight:1.6}}>
      <strong style={{color:C.navy800}}>Submission Notice:</strong> By submitting this application you confirm all information is accurate to the best of your knowledge. North Arrow will review your application and respond within 1-3 business days. Coverage is bound only after underwriter approval and first-month payment.
    </div>
    <label style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:12}}>
      <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} style={{marginTop:4,accentColor:C.navy700,width:17,height:17,flexShrink:0}}/>
      <span style={{fontSize:'0.88rem',color:C.grey700,lineHeight:1.55}}>I agree to North Arrow's <a href="#" style={{color:C.navy700,textDecoration:'underline'}}>Terms of Service</a>, <a href="#" style={{color:C.navy700,textDecoration:'underline'}}>Privacy Policy</a>, and authorize North Arrow to obtain consumer reports including MVR, business credit, and insurance loss history.</span>
    </label>
  </>)
}

// ─── MAIN APPLICATION FORM ────────────────────────────────
// Tier mapping: Quote uses Bronze/Silver/Gold/Platinum; Application uses basic/standard/premium/platinum
const QUOTE_TIER_MAP={Bronze:'basic',Silver:'standard',Gold:'premium',Platinum:'platinum'}
// Vehicle category mapping: Quote rv_category 'towable'/'driveable' → Application type 'towable'/'driveable'
// Add-on key mapping
const ADDON_KEY_MAP={add_sli:'sli',add_personal_accident:'pai',add_personal_effects:'pec',add_roadside:'roadside'}

export default function ApplicationForm(){
  const[profile,setProfile]=useState(null)
  const[step,setStep]=useState(1)
  const[saved,setSaved]=useState(null)
  const[carriedQuote,setCarriedQuote]=useState(null)

  // Form state
  const[owner,setOwner]=useState({})
  const[prior,setPrior]=useState({})
  const[vehicles,setVehicles]=useState([])
  const[lien,setLien]=useState({})
  const[vCond,setVCond]=useState({})
  const[res,setRes]=useState({})
  const[renter,setRenter]=useState({})
  const[emp,setEmp]=useState({})
  const[maint,setMaint]=useState({})
  const[fleet,setFleet]=useState({})
  const[preChecks,setPreChecks]=useState({})
  const[tier,setTier]=useState('standard')
  const[addons,setAddons]=useState([])
  const[shield,setShield]=useState(false)
  const[terms,setTerms]=useState(false)
  const[submitted,setSubmitted]=useState(false)

  // On mount: check sessionStorage for quote data and pre-populate
  useEffect(()=>{
    try{
      const stored=sessionStorage.getItem('na_quote_data')
      if(!stored)return
      const data=JSON.parse(stored)
      // Stale check — only carry if less than 24 hours old
      if(!data.timestamp||Date.now()-data.timestamp>24*60*60*1000){
        sessionStorage.removeItem('na_quote_data')
        return
      }
      // Map vehicles from quote shape to application shape
      if(data.vehicles&&data.vehicles.length){
        const mapped=data.vehicles.map(v=>({
          year:String(v.vehicle_year||''),
          make:'',
          model:v.rv_type||'',
          value:String(v.replacement_value||''),
          length:'',
          vin:'',
          type:v.rv_category==='driveable'?'driveable':'towable',
          subtype:v.rv_type||'',
          state:v.vehicle_state||'',
          odometer:v.rv_category==='towable'?'':String(v.odometer_miles||''),
          quoteTier:v.coverage_tier||'',
        }))
        setVehicles(mapped)
      }
      // Pick most-common tier across vehicles for Step 5 default
      if(data.vehicles&&data.vehicles.length){
        const tierCount={}
        data.vehicles.forEach(v=>{
          if(v.coverage_tier)tierCount[v.coverage_tier]=(tierCount[v.coverage_tier]||0)+1
        })
        const top=Object.entries(tierCount).sort((a,b)=>b[1]-a[1])[0]
        if(top){
          const appTier=QUOTE_TIER_MAP[top[0]]
          if(appTier)setTier(appTier)
        }
      }
      // Union of all add-ons across vehicles
      if(data.vehicles&&data.vehicles.length){
        const addonSet=new Set()
        data.vehicles.forEach(v=>{
          Object.entries(ADDON_KEY_MAP).forEach(([qKey,aKey])=>{
            if(v[qKey])addonSet.add(aKey)
          })
        })
        setAddons(Array.from(addonSet))
      }
      // Carry operator info into prior insurance section
      if(data.operator?.has_prior_commercial_insurance!==undefined){
        setPrior({hasPrior:data.operator.has_prior_commercial_insurance,years:data.operator.years_in_operation})
      }
      // Save reference for the banner
      setCarriedQuote({
        vehicleCount:data.vehicles?.length||0,
        totalMonthly:data.summary?.totalMonthly||0,
        timestamp:data.timestamp,
      })
    }catch(e){
      console.warn('Could not read carried quote:',e)
    }
  },[])

  // Autosave indicator (triggers after Step 2 onwards)
  useEffect(()=>{
    if(step>=2&&profile){
      setSaved('saving')
      const t=setTimeout(()=>setSaved('saved'),700)
      return()=>clearTimeout(t)
    }
  },[step,owner,vehicles,res,renter,maint,fleet,preChecks,tier,addons,shield,profile])

  const steps=[
    {num:1,title:'Fleet Owner',desc:'Entity, contact, prior insurance',icon:Building2},
    {num:2,title:'Vehicles',desc:'Vehicle details, liens, condition',icon:Truck},
    {num:3,title:'Operations',desc:'Rental, renter, employee info',icon:Settings},
    {num:4,title:'Safety',desc:'Maintenance and safety systems',icon:Wrench},
    {num:5,title:'Coverage',desc:'Tier, add-ons, review, submit',icon:ShieldCheck},
  ]

  if(!profile){
    return(
      <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(120px,14vw,160px)',paddingBottom:40}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)'}}>
          <div style={{fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:C.navy300,marginBottom:12}}>Application</div>
          <h1 style={{color:C.white,marginBottom:8,fontFamily:'var(--font-display, Georgia)',fontSize:'clamp(2rem,4vw,3rem)',fontWeight:800,lineHeight:1.15}}>Apply for Coverage</h1>
          <p style={{color:C.navy200,fontSize:'1rem',marginBottom:0}}>Streamlined 5-step application. Save your progress, return anytime.</p>
        </div>
        <div style={{padding:'40px 0 80px',background:C.grey50,marginTop:40}}>
          <div style={{maxWidth:1200,margin:'0 auto',padding:'40px clamp(20px,4vw,40px)'}}>
            <ProfileGate onComplete={setProfile}/>
          </div>
        </div>
      </section>
    )
  }

  if(submitted){
    return(
      <section style={{minHeight:'100vh',background:`linear-gradient(135deg, ${C.green700} 0%, ${C.green600} 50%, ${C.navy700} 100%)`,paddingTop:'clamp(140px,16vw,180px)',paddingBottom:80,color:C.white}}>
        <div style={{maxWidth:680,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)',textAlign:'center'}}>
          <div style={{width:88,height:88,background:C.white,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 28px'}}><Check size={48} color={C.green600}/></div>
          <h1 style={{color:C.white,fontFamily:'var(--font-display, Georgia)',fontSize:'clamp(2rem,4vw,3rem)',fontWeight:800,marginBottom:16,lineHeight:1.15}}>Application Submitted</h1>
          <p style={{color:'rgba(255,255,255,0.9)',fontSize:'1.05rem',lineHeight:1.7,marginBottom:24}}>Thank you, {profile.name.split(' ')[0]}. Your application has been received. Our underwriting team will review your fleet details and respond within 1-3 business days.</p>
          <div style={{padding:'20px 28px',background:'rgba(255,255,255,0.08)',borderRadius:6,marginBottom:32,border:'1px solid rgba(255,255,255,0.12)'}}>
            <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.7)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:6}}>Your Application ID</div>
            <div style={{fontFamily:'monospace',fontSize:'1.4rem',fontWeight:700,letterSpacing:'0.1em'}}>{profile.appId}</div>
          </div>
          <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.9rem',marginBottom:24}}>A confirmation email has been sent to <strong style={{color:C.white}}>{profile.email}</strong>.</p>
        </div>
      </section>
    )
  }

  return(
    <>
      <section style={{background:`linear-gradient(135deg, ${C.navy800}, ${C.navy700})`,paddingTop:'clamp(120px,14vw,160px)',paddingBottom:40}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)'}}>
          {/* Two-step indicator */}
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:99,opacity:0.7}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:carriedQuote?C.green500:'rgba(255,255,255,0.15)',color:carriedQuote?C.white:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.78rem',fontWeight:800}}>
                {carriedQuote?<Check size={12}/>:'1'}
              </div>
              <span style={{fontSize:'0.82rem',fontWeight:700,color:'rgba(255,255,255,0.7)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Get Quote</span>
            </div>
            <div style={{width:28,height:1,background:'rgba(255,255,255,0.25)'}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',background:'rgba(76,192,126,0.15)',border:`1px solid ${C.green400}`,borderRadius:99}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:C.green500,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.78rem',fontWeight:800}}>2</div>
              <span style={{fontSize:'0.82rem',fontWeight:700,color:C.green400,letterSpacing:'0.06em',textTransform:'uppercase'}}>Submit Application</span>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:24,flexWrap:'wrap'}}>
            <div>
              <h1 style={{color:C.white,marginBottom:8,fontFamily:'var(--font-display, Georgia)',fontSize:'clamp(2rem,4vw,3rem)',fontWeight:800,lineHeight:1.15}}>Step 2 — Submit Your Application</h1>
              <p style={{color:C.navy200,fontSize:'1rem',marginBottom:0}}>Welcome back, {profile.name.split(' ')[0]}. Application <strong style={{fontFamily:'monospace',color:C.white}}>{profile.appId}</strong></p>
            </div>
            {saved&&<div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 14px',background:'rgba(255,255,255,0.08)',color:C.navy200,fontSize:'0.82rem',border:'1px solid rgba(255,255,255,0.12)',borderRadius:4}}>
              <Save size={13}/>{saved==='saving'?'Saving...':'All progress saved'}
            </div>}
          </div>
        </div>
      </section>

      {/* Carried-from-quote banner */}
      {carriedQuote&&carriedQuote.vehicleCount>0&&(
        <section style={{background:C.green50,borderBottom:`1px solid ${C.green100}`,padding:'14px 0'}}>
          <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:C.green600,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Check size={16}/>
            </div>
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontSize:'0.92rem',fontWeight:700,color:C.green700,marginBottom:2}}>Draft quote carried forward — finalize below</div>
              <div style={{fontSize:'0.84rem',color:C.grey700,lineHeight:1.5}}>{carriedQuote.vehicleCount} {carriedQuote.vehicleCount===1?'vehicle':'vehicles'} pre-loaded · ${Math.round(carriedQuote.totalMonthly).toLocaleString()}/mo preliminary estimate. Final premium is determined during underwriting review and may adjust based on inspection, MVR, loss history, and verified vehicle data.</div>
            </div>
          </div>
        </section>
      )}

      <section style={{background:C.grey50,padding:'clamp(40px,5vw,60px) 0 clamp(80px,10vw,120px)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,4vw,40px)',display:'grid',gridTemplateColumns:'260px 1fr',gap:32}} className="apply-grid">
          {/* SIDEBAR STEPPER */}
          <aside style={{position:'sticky',top:100,alignSelf:'start'}}>
            <div style={{padding:'14px 16px',background:C.navy900,color:C.white,marginBottom:6}}>
              <div style={{fontSize:'0.7rem',color:C.navy300,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:3}}>Application ID</div>
              <div style={{fontFamily:'monospace',fontWeight:700,fontSize:'0.92rem'}}>{profile.appId}</div>
            </div>
            {steps.map(s=>{
              const active=step===s.num,done=step>s.num
              return(
                <button type="button" key={s.num} onClick={()=>setStep(s.num)} style={{display:'flex',gap:14,padding:'14px 16px',width:'100%',cursor:'pointer',background:active?C.navy800:C.white,border:`1px solid ${active?C.navy800:C.grey200}`,borderTop:'none',marginBottom:0,textAlign:'left',transition:'all 0.15s'}}>
                  <div style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',background:active?C.green600:done?C.green100:C.grey100,color:active?C.white:done?C.green700:C.grey500,fontWeight:800,fontSize:'0.82rem',flexShrink:0,borderRadius:4}}>{done?<Check size={14}/>:s.num}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:'0.86rem',color:active?C.white:C.navy800,marginBottom:1}}>{s.title}</div>
                    <div style={{fontSize:'0.72rem',color:active?C.navy300:C.grey500,lineHeight:1.4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.desc}</div>
                  </div>
                </button>
              )
            })}
            <div style={{marginTop:18,padding:'0 4px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.76rem',fontWeight:700,marginBottom:6}}><span style={{color:C.grey500}}>Progress</span><span style={{color:C.green600}}>{Math.round(((step-1)/4)*100)}%</span></div>
              <div style={{height:5,background:C.grey200,overflow:'hidden',borderRadius:3}}><div style={{width:`${((step-1)/4)*100}%`,height:'100%',background:C.green600,transition:'width 0.3s'}}/></div>
            </div>
          </aside>

          {/* MAIN PANE */}
          <main style={{minWidth:0}}>
            <div style={{background:C.white,padding:'clamp(28px,4vw,44px)',border:`1px solid ${C.grey200}`}}>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:28,paddingBottom:22,borderBottom:`1px solid ${C.grey200}`}}>
                <div style={{width:42,height:42,background:C.navy800,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1rem',borderRadius:6}}>{step}</div>
                <div>
                  <h3 style={{color:C.navy800,margin:0,fontFamily:'var(--font-display, Georgia)',fontSize:'1.5rem',fontWeight:800}}>Step {step}: {steps[step-1].title}</h3>
                  <div style={{fontSize:'0.86rem',color:C.grey500,marginTop:3}}>{steps[step-1].desc}</div>
                </div>
              </div>

              {step===1&&<Step1 owner={owner} setOwner={setOwner} prior={prior} setPrior={setPrior}/>}
              {step===2&&<Step2 vehicles={vehicles} setVehicles={setVehicles} lien={lien} setLien={setLien} vCond={vCond} setVCond={setVCond}/>}
              {step===3&&<Step3 res={res} setRes={setRes} renter={renter} setRenter={setRenter} emp={emp} setEmp={setEmp}/>}
              {step===4&&<Step4 maint={maint} setMaint={setMaint} fleet={fleet} setFleet={setFleet} preChecks={preChecks} setPreChecks={setPreChecks}/>}
              {step===5&&<Step5 tier={tier} setTier={setTier} addons={addons} setAddons={setAddons} shield={shield} setShield={setShield} terms={terms} setTerms={setTerms} vehicles={vehicles} owner={owner}/>}

              <div style={{display:'flex',justifyContent:'space-between',marginTop:32,paddingTop:24,borderTop:`1px solid ${C.grey200}`,gap:14,flexWrap:'wrap'}}>
                <button type="button" onClick={()=>{step>1&&setStep(step-1);window.scrollTo(0,0)}} disabled={step===1} style={{padding:'12px 26px',fontWeight:700,cursor:step>1?'pointer':'not-allowed',background:'transparent',border:`1.5px solid ${step>1?C.grey300:C.grey200}`,color:step>1?C.grey700:C.grey300,borderRadius:6,display:'inline-flex',alignItems:'center',gap:6,fontSize:'0.9rem'}}><ArrowLeft size={15}/>Previous</button>
                {step<5?
                  <button type="button" onClick={()=>{setStep(step+1);window.scrollTo(0,0)}} style={{padding:'12px 28px',background:C.navy700,color:C.white,fontWeight:700,cursor:'pointer',border:'none',borderRadius:6,display:'inline-flex',alignItems:'center',gap:8,fontSize:'0.9rem'}}>Next Step<ArrowRight size={15}/></button>
                  :
                  <button type="button" disabled={!terms} onClick={()=>{setSubmitted(true);window.scrollTo(0,0)}} style={{padding:'14px 32px',background:terms?C.green600:C.grey300,color:C.white,fontWeight:700,cursor:terms?'pointer':'not-allowed',border:'none',borderRadius:6,display:'inline-flex',alignItems:'center',gap:8,fontSize:'0.95rem'}}><Send size={16}/>Submit Application</button>
                }
              </div>
            </div>
          </main>
        </div>
        <style>{`@media(max-width:880px){.apply-grid{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}
