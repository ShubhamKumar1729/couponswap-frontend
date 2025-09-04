import React, { useState } from 'react'
import { api } from '../lib/api'

function CouponCard({ c, user, onBought }){
  async function buyCredits(){
    try{
      await api.post(`/coupons/${c._id}/buy/credits`, {})
      alert('Purchased with credits!')
      onBought && onBought()
    }catch(e){ alert(e.message) }
  }
  async function buyCash(){
    try{
      await api.post(`/coupons/${c._id}/buy/cash`, {})
      alert('Purchased (simulated cash)!')
      onBought && onBought()
    }catch(e){ alert(e.message) }
  }

  return (
    <div className="card">
      <div className="header">
        <strong>{c.brand}</strong>
        <span className="badge">{c.discount}</span>
      </div>
      <div style={{fontWeight:700}}>{c.title}</div>
      <div className="muted">{c.description}</div>
      <div className="muted">Seller: {c.seller?.name || '—'} • Rating: {c.ratingAvg?.toFixed(1) || 0}★</div>
      <div className="muted">Expires: {new Date(c.expiry).toLocaleDateString()}</div>
      <br/>
      {!c.sold ? (
        <div className="row">
          <button className="btn" onClick={buyCredits}>Buy with 1 credit</button>
          <button className="btn" onClick={buyCash}>Buy for ${c.price || 0}</button>
        </div>
      ) : <div className="muted">Sold / Swapped</div>}
    </div>
  )
}

export default function Browse({ coupons, user, onBought }){
  return (
    <div className="grid">
      {coupons.map(c=><CouponCard key={c._id} c={c} user={user} onBought={onBought} />)}
      {coupons.length===0 && <div>No coupons found.</div>}
    </div>
  )
}
