const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function setToken(t){
  if (t) localStorage.setItem('token', t)
}

export function getToken(){
  return localStorage.getItem('token')
}

async function request(path, opts={}){
  const headers = {'Content-Type':'application/json', ...(opts.headers||{})}
  const t = getToken()
  if (t) headers['Authorization'] = 'Bearer ' + t
  const res = await fetch(BASE + path, { ...opts, headers })
  if (!res.ok){
    const e = await res.json().catch(()=>({error: 'Request failed'}))
    throw new Error(e.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  get: (p)=>request(p),
  post: (p, body)=>request(p,{ method:'POST', body: JSON.stringify(body)})
}
