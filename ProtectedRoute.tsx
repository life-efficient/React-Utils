import React, { useState, useEffect } from "react"
import { Route, Redirect } from "react-router-dom"
import { Auth } from "aws-amplify"

interface ProtectedRouteProps {
    to: string;
    component: React.FC
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {

    const [ready, setReady] = useState(false)
    const [session, setSession] = useState()

    useEffect(()=>{
        Auth.currentSession()
            .then((sess: any) => {if (sess) {setSession(sess)}})
            .then(() => {
                console.log('GOT SESSION');
                setReady(true)
            })
            .catch((err) => {
                console.log('ERROR GETTING SESSION:', err);
                setReady(true)
            })
    }, [])


    const { component: Component, ...rest } = props
    if (ready) {
        console.log('sess:', session)
        if (session) {
            return <Route {...rest} component={Component} />
        }
        else {
            return <Redirect to='/login' />
        }
    }
    else {
        return null
    }
}

export default ProtectedRoute