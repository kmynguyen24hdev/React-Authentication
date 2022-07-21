import React, { useCallback, useEffect, useState } from 'react';

let logoutTimer;
const AuthContext = React.createContext() // init context

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingTime =adjExpirationTime  - currentTime;

    return remainingTime;
}

//Truy xuất token đã lưu trữ
const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationTime)

    if(remainingTime <= 3600) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken()
    let initialToken
    if(tokenData) {
        initialToken = tokenData.token
    }
    
    // luu tru token trong trinh duyet local storage
    //const initToken = localStorage.getItem('token')

    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token

    const logoutHandler = useCallback(() => {
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')

        if(logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, []) 

    // thoi gian het han
    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('expirationTime', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime)
    }

    useEffect(() => {
        if(tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler,tokenData.duration)
        }
    },[tokenData,logoutHandler])

    const conTextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={conTextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;