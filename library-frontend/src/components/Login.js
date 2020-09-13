import React, { useState, useEffect } from 'react'
import { useApolloClient, useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/queries'



const Login = ({setToken}) => {
    const [username, setUsername] = useState('Timotei')
    const [password, setPassword] = useState('TESTI')
    const [errorMsg, setErrorMsg] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)
    const client = useApolloClient()
    

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
          setErrorMsg(error.graphQLErrors[0].message)
          setTimeout(() => {
            setErrorMsg('')
          }, 5000);
        }
    })

    useEffect( () =>{
        console.log('login effect');
        
        if ( result.data) {
            try {
                const token = result.data.login.value
                setToken(token)
                localStorage.setItem('library-user-token', token)
                setLoggedIn(true)
            } catch (e) {
                console.log('err');
                setErrorMsg('Wrong credentials')
                setTimeout(() => {
                    setErrorMsg('')
                }, 5000);
            }
        }

    }, [result.data, setToken])

    if(!loggedIn && localStorage.getItem('library-user-token')){
        setLoggedIn(true)
    }

    const handleLogin = async () => {
        login({ variables: { username, password } })
    }

    const handleLogout = async () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
        setLoggedIn(false)
    }

    const displayValue = errorMsg ? 'inline-block' : 'none'

    if(loggedIn){
        return(
            <div style={{display: 'inline-block', paddingLeft: '18em'}} >
                <button 
                style={{ backgroundColor: 'lightblue'}}
                onClick={() => handleLogout()}
            >
                    Logout
            </button>
            </div>
        )
    }

    return(
        <div style={{display: 'inline-block', paddingLeft: '2em'}} >
            <input type="text" 
            placeholder='Username'
            value={username} 
            onChange={(event) => setUsername(event.target.value) } 
            />
            <input type="password" 
            placeholder='Password'
            value={password} 
            onChange={(event) => setPassword(event.target.value) } 
            />
            <button 
                style={{ backgroundColor: 'lightblue'}}
                onClick={() => handleLogin()}
            >
                    Login
            </button>
            <div  style={{ display: displayValue, paddingLeft: '1em',}}>
                <div style={{
                    display: 'inline-block',
                    color: 'white',
                    paddingLeft: '5px',
                    paddingRight: '5px',
                    backgroundColor: 'red',
                    border: '1px solid red',
                    borderRadius: '5px'
                }}>
                    {errorMsg}
                </div>
            </div>
        </div>
    )
}

export default Login