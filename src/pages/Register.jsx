import React, { useState } from 'react'
import { api, setToken } from '../lib/api'

export default function Register({ onRegister, go }){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')

  async function submit(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await api.post('/auth/register', { name, email, password })
      setToken(res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      onRegister(res.user)
      go('browse')
    }catch(e){ setErr(e.message) }
  }

  return (
    <form onSubmit={submit}>
      <h2>Sign Up</h2>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <input className="input" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
      <br/><br/>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <br/><br/>
      <input type="password" className="input" placeholder="Password (min 6)" value={password} onChange={e=>setPassword(e.target.value)} />
      <br/><br/>
      <button className="btn">Create Account</button>
    </form>
  )
}
