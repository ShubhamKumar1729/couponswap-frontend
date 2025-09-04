import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Swaps({ user }){
  const [all,setAll] = useState([])
  const [offer,setOffer] = useState('')
  const [request,setRequest] = useState('')

  async function load(){
    const res = await api.get('/swaps')
    setAll(res)
  }
  useEffect(()=>{ load() },[])

  async function create(e){
    e.preventDefault()
    try{
      await api.post('/swaps', { offeredCoupon: offer, requestedCoupon: request })
      setOffer(''); setRequest('')
      await load()
      alert('Swap requested!')
    }catch(e){ alert(e.message) }
  }

  async function respond(id, decision){
    try{
      await api.post(`/swaps/${id}/respond`, { decision })
      await load()
    }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h2>Swap / Exchange</h2>
      <p className="muted">Provide coupon IDs to swap directly.</p>
      <form onSubmit={create}>
        <div className="row">
          <div className="col"><input className="input" placeholder="Offered Coupon ID" value={offer} onChange={e=>setOffer(e.target.value)} /></div>
          <div className="col"><input className="input" placeholder="Requested Coupon ID" value={request} onChange={e=>setRequest(e.target.value)} /></div>
        </div>
        <br/>
        <button className="btn">Request Swap</button>
      </form>

      <br/><hr/><br/>
      {all.map(s=> (
        <div key={s._id} className="card">
          <div className="header"><strong>{s.status.toUpperCase()}</strong><span className="muted">{new Date(s.createdAt).toLocaleString()}</span></div>
          <div>Offered: {s.offeredCoupon?.title} | Requested: {s.requestedCoupon?.title}</div>
          <div className="muted">Requester: {s.requester?.name} → Responder: {s.responder?.name}</div>
          {s.status==='pending' && s.responder?._id===user.id && (
            <div className="row" style={{marginTop:8}}>
              <button className="btn" onClick={()=>respond(s._id,'accepted')}>Accept</button>
              <button className="btn" onClick={()=>respond(s._id,'rejected')}>Reject</button>
            </div>
          )}
        </div>
      ))}
      {all.length===0 && <div>No swaps yet.</div>}
    </div>
  )
}
