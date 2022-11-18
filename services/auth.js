const url = "http://127.0.0.1:8000/api/"

export async function makePost(end,data){
    const req = await fetch(url+end,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    return req
}

export async function makeGet(end){
    const req = await fetch(url+end).then(res => res.json())
    return req
}

export default async function getToken(user,pass){
    const logins = {email: user, password: pass}
    const rez = await makePost('token',logins)
    return rez
}

export async function signup(name,user,pass){
    const logins = {name:name, email: user, password: pass}
    const rez = await makePost('createuser',logins)
    return rez
}