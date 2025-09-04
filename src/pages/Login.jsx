import React, { useState } from 'react'
import { api, setToken } from '../lib/api'

export default function Login({ onLogin, go }){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')

  async function submit(e){
    e.preventDefault()
    setErr('')
    try{
      const res = await api.post('/auth/login', { email, password })
      setToken(res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      onLogin(res.user)
      go('browse')
    }catch(e){ setErr(e.message) }
  }

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <br/><br/>
      <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <br/><br/>
      <button className="btn">Login</button>
    </form>
  )
}
