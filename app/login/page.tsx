"use client";

import { useState, useEffect } from "react"; {/*Importamos las librerias..*/}

interface LoginRequest{
       username: string;
       password: string;
       csrfToken: string;
}

export default function Login (){ 

{/*Definimos los hooks Principales de nuestro login*/}
 const [username, setUsername] = useState(''); {/*El use state recibe una cadena vacia*/ }
 const [password, setPassword] = useState('');
 const [csrfToken, setCsrfToken] = useState('');

 useEffect(() => { {/*Es una funcion Asincrona que utiliza el hook useEffect que va obtener un Toke CSRF desde el servidor*/ }
       const getCsrfToken = async () =>{
              const response = await fetch('http://localhost:3000/csrf-token');
              const data = await response.json();
              setCsrfToken(data.csrfToken);
       }
       getCsrfToken();
 }, []);

 const handleSubmit = async (e: React.FormEvent) =>{
       e.preventDefault();
       try{
       const request: LoginRequest = {username, password, csrfToken};
       const response = await fetch('http://localhost:3000/login', {
              method: 'POST',
              headers:{
                     'Content-Type': 'application/json'
              },
              body: JSON.stringify(request)
       });
       const data = await response.json();
       if(data.error){
              alert(data.error);
              return;
              //Agregar manejo de errores en caso de que el login falle.
       }
       alert('Login successful');
       } catch (error) {
              alert('Login failed');
       }
 } 

 return (
       <div>
         <h2>Login</h2>
         <form onSubmit = {handleSubmit}>
              <div>
                     <label htmlFor ="username">Usuario: </label> {/*El htmlFor es para que se asocie un valor*/}
                     <input type="text" id="username" onChange={(e) => setUsername(e.target.value)}required autoFocus/>
              </div>
              <div>
                     <label htmlFor="password">Contraseña: </label>
                     <input type="password" id="password" onChange={(e => setPassword(e.target.value))} required/>
              </div>
              <input type="hidden" id="csrfToken" value={csrfToken} />    {/* */}
              <button type="submit">Iniciar Sesion</button>
         </form>
       </div>
 );
};     