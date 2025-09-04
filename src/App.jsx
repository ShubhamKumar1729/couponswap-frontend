import React, { useEffect, useState } from 'react'
import { api, setToken, getToken } from './lib/api'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import MyCoupons from './pages/MyCoupons'
import Swaps from './pages/Swaps'

export default function App(){
  const [user,setUser] = useState(null)
  const [tab,setTab] = useState('browse')
  const [query,setQuery] = useState('')
  const [category,setCategory] = useState('all')
  const [coupons,setCoupons] = useState([])

  useEffect(()=>{
    const t = getToken()
    if (t) setUser(JSON.parse(localStorage.getItem('user')))
  },[])

  useEffect(()=>{
    loadCoupons()
  },[query,category])

  async function loadCoupons(){
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (category) params.append('category', category)
    const res = await api.get('/coupons?'+params.toString())
    setCoupons(res)
  }

  function logout(){
    localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null)
  }

  return (
    <div className="container">
      <div className="card" style={{marginBottom:16}}>
        <div className="header">
          <div className="logo">CouponSwap</div>
          <div className="nav">
            <button className="btn" onClick={()=>setTab('browse')}>Browse</button>
            {user && <button className="btn" onClick={()=>setTab('my')}>My Coupons</button>}
            {user && <button className="btn" onClick={()=>setTab('swaps')}>Swaps</button>}
            {!user && <button className="btn" onClick={()=>setTab('login')}>Login</button>}
            {!user && <button className="btn" onClick={()=>setTab('register')}>Sign Up</button>}
            {user && <button className="btn" onClick={logout}>Logout</button>}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input className="input" placeholder="Search coupons..." value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
          <div className="col">
            <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="all">All</option>
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
      </div>

      <div className="card">
        {tab==='browse' && <Browse coupons={coupons} user={user} onBought={loadCoupons} />}
        {tab==='login' && <Login onLogin={setUser} go={(t)=>setTab(t)} />}
        {tab==='register' && <Register onRegister={setUser} go={(t)=>setTab(t)} />}
        {tab==='my' && user && <MyCoupons user={user} />}
        {tab==='swaps' && user && <Swaps user={user} />}
        {!user && (tab==='my' || tab==='swaps') && <div>Please login first.</div>}
      </div>
    </div>
  )
}
