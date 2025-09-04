import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function MyCoupons({ user }){
  const [list,setList] = useState([])
  const [form,setForm] = useState({ brand:'', title:'', code:'', discount:'', price:0, category:'other', description:'', expiry:'' })

  async function load(){
    const mine = await api.get('/coupons?q=&category=all')
    setList(mine.filter(c=>c.seller && c.seller._id===user.id))
  }
  useEffect(()=>{ load() },[])

  function update(k,v){ setForm(prev=>({...prev, [k]:v})) }

  async function submit(e){
    e.preventDefault()
    try{
      const payload = { ...form, expiry: new Date(form.expiry) }
      await api.post('/coupons', payload)
      setForm({ brand:'', title:'', code:'', discount:'', price:0, category:'other', description:'', expiry:'' })
      await load()
      alert('Coupon listed! (+1 credit awarded)')
    }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h2>My Coupons</h2>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col"><input className="input" placeholder="Brand" value={form.brand} onChange={e=>update('brand', e.target.value)} /></div>
          <div className="col"><input className="input" placeholder="Title" value={form.title} onChange={e=>update('title', e.target.value)} /></div>
        </div>
        <br/>
        <div className="row">
          <div className="col"><input className="input" placeholder="Code" value={form.code} onChange={e=>update('code', e.target.value)} /></div>
          <div className="col"><input className="input" placeholder="Discount (e.g., 20% OFF)" value={form.discount} onChange={e=>update('discount', e.target.value)} /></div>
        </div>
        <br/>
        <div className="row">
          <div className="col"><input type="number" className="input" placeholder="Price ($)" value={form.price} onChange={e=>update('price', e.target.value)} /></div>
          <div className="col">
            <select className="input" value={form.category} onChange={e=>update('category', e.target.value)}>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="beauty">Beauty</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <br/>
        <textarea className="input" placeholder="Description" value={form.description} onChange={e=>update('description', e.target.value)} />
        <br/><br/>
        <input type="date" className="input" value={form.expiry} onChange={e=>update('expiry', e.target.value)} />
        <br/><br/>
        <button className="btn">List Coupon</button>
      </form>

      <br/><hr/><br/>
      <div className="grid">
        {list.map(c=>(
          <div key={c._id} className="card">
            <div className="header"><strong>{c.title}</strong><span className="badge">{c.discount}</span></div>
            <div className="muted">Code: {c.code}</div>
            <div className="muted">Verified: {c.verified ? 'Yes' : 'No'}</div>
            <div className="muted">Expires: {new Date(c.expiry).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
