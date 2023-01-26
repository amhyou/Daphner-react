export const backend = "daphner.amhyou.com"

const url = "https://"+backend+"/api/"

export async function makePost(end,data,token=""){
    const req = await fetch(url+end,{
        method: 'POST',
        headers: token ? {
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + token
        }: {'Content-Type': 'application/json'} ,
        body: JSON.stringify(data)
    }).then(res => res.json())
    return req
}

export async function makeMedia(end,data,token=""){
    const req = await fetch(url+end,{
        method: 'POST',
        headers: token ? {
            'Authorization':'Bearer ' + token,
        }: {'Content-Type': 'multipart/form-data'} ,
        body: data
    }).then(res => res.json())
    return req
}

export async function makeGet(end,token=""){
    const req = await fetch(url+end,{
        method: "GET",
        headers: token ? {
            'Authorization':'Bearer ' + token
        } : {},
        
    }).then(res => res.json()).then(res => {
        if(res.code=="token_not_valid") localStorage.removeItem("token") 
        else return res})
    return req
}

export async function makeDelete(end,data,token=""){
    const req = await fetch(url+end,{
        method: 'Delete',
        headers: token ? {
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + token
        }: {'Content-Type': 'application/json'} ,
        body: JSON.stringify(data)
    }).then(res => res.json())
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
