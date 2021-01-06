/** @jsx jsx */
import React, { Component, useState, useEffect } from "react";
// import eye from "../images/see-icon.png"
import { Redirect } from "react-router-dom"
import { jsx, css, keyframes } from "@emotion/core"
import { Auth } from "aws-amplify"
import Navbar from "../Navbar"
import { makeid } from "../utils"
import Form from "./Form/Form"
import { withTheme } from "@material-ui/core"
import { connect } from "react-redux"

const getStyle = props => css`
  animation-duration: 1s;
  // animation-direction: normal;
  margin: auto;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 80%;
  background-color: ${props.theme.palette.primary.main};

  > div {
    margin: 0px;
    max-width: 100%;
  }
`

const Login = props => {
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [redirect, setRedirect] = useState(props.redirect)
    const [user, setUser] = useState(null)
    const [panel, setPanel] = useState('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [email, setEmail] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    useEffect(()=>{
        Auth.currentSession().then((creds)=>{
            setPanel('redirect-success')
        }).catch((err)=>{
            //console.log(err)
        });
    }, [])

    const handleSubmit = async event => {
        setLoading(true)
        // console.log('handling submit on panel:', state.panel)
        console.log(event)
        switch(panel) {
            case 'login': 
                try {
                    let user = await Auth.signIn(
                        event.email,
                        event.password
                    )
                    console.log('user:', user)
                    if (user.challengeName) {
                        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                            setUser(user)
                            setPanel("set-password")
                        }
                    }
                } 
                catch (err) {
                    console.error('error:', err)
                    if (err.name === "UserNotConfirmedException") {// if they haven't confirmed yet, 
                        Auth.resendSignUp(event.email)    // send them an email
                        props.openModal(     // prompt them to enter code
                        <Form
                            slides={[
                                {
                                    title: 'Confirm email',
                                    onSubmit: async (e) => {
                                        await Auth.confirmSignUp(event.email, e.code)     // confirm the code
                                        // console.log('confirmed')
                                        props.closeModal()   // close the modal
                                        // await Auth.signIn(event.email, event.password)
                                    },
                                    questions: [{title: 'code', type: 'text', id: 'code'}]
                                }
                            ]}
                        />
                        )
                    }
                    //   if (err.code === 'UserNotConfirmedException') {
                    if (err.code === 'UserNotFoundException') {
                        throw err
                    //     // The error happens if the user didn't finish the confirmation step when signing up
                    //     // In case you need to resend the code and confirm the user
                    //     // About how to resend the code and confirm the user, please check the signUp part
                    } 
                    else if (err.code === 'PasswordResetRequiredException') {
                        alert('pw reset not handled')
                    //     // The error happens when the password is reset in the Cognito console
                    //     // In case you need to call forgotPassword to reset the password
                    //     // Please check the Forgot Password part.
                    } 
                    else if (err.code === 'NotAuthorizedException') {
                        throw err
                    //     // The error happens when the incorrect password is provided
                    } 
                    else {
                        console.error(err);
                        alert('error not handled')
                    }
                }
                setLoading(false)
                setPanel('redirect-success')
                return
            case 'get-details':
                alert('get-details should be handled in the form as a prop')
                return
            case 'set-password':
                setLoading(true)
                // var user = await Auth.currentUserPoolUser() # TODO make work
                Auth.completeNewPassword(
                    user,
                    event.password
                )
                .then(() => setRedirect(props.from ? props.from : props.redirect ? props.redirect : '/'))
                break;
            default:
                return 
        }
    }
    
    const getPanel = () => {
        switch (panel) {
        case "login":
            return <Form
                redirect={redirect}
                slides={[
                    {
                        title: 'Log in',
                        subtitle: 'Please fill in this form to create an account',
                        onSubmit: handleSubmit,
                        questions:[
                            {
                                title: 'Email',
                                type: 'text',
                                id: 'email',
                            },
                            {
                                title: 'Password',
                                type: 'password',
                                id: 'password',
                            }
                        ],
                        detail: <div style={{textDecoration: 'underline', cursor: 'pointer', display: 'flex', justifyContent: 'space-between'}}>
                            <div onClick={()=>setPanel('get-details')}>
                                Forgot your details?
                            </div>
                            {
                                props.can_sign_up === false
                                ?
                                null
                                :
                                <div onClick={()=>setPanel('redirect')}>
                                    Sign up
                                </div>   
                            }
                        </div>
                    }
                ]}
            />
        case "set-password":
            return <Form slides={[
            {
                title: 'Set password',
                questions: [
                {
                    id: 'password',
                    type: 'confirm-password',
                }
                ],
                onSubmit: handleSubmit
            }
            ]}/>
        case "get-details":
            return <Form             
                slides={[
                {
                    title: 'Forgot your password?',
                    subtitle: 'Enter your email to get a confirmation code',
                    redirect: '/',
                    questions: [
                    {
                        title: 'Email',
                        type: 'text',
                        id: 'email'
                    },
                    ],
                    onSubmit: (e)=>{
                    console.log(e.email)
                    Auth.forgotPassword(e.email)
                    }
                },
                {
                    title: 'Enter code',
                    subtitle: 'Check the email you signed up with for the code',
                    questions: [
                    {title:'Code', type: 'text', id: 'code'},
                    {title: 'New password', type:'password', id:'new_password'},
                    ],
                    onSubmit: (e) => {
                    console.log('event:', e)
                    console.log('submitting:', e.email, e.code, e.new_password)
                    Auth.forgotPasswordSubmit(e.email, e.code, e.new_password)}
                }
                ]}
            />
        case 'redirect':
            return <Redirect to="/signup" />
        case 'redirect-success':
                return <Redirect to="/app" />
        default:
            return null
        }
    }

    return (
        <React.Fragment>
            <Navbar variant="teacher" col="dark"/>
            <div css={getStyle(props)} >
                <img src={props.logo} style={{height: '180px', margin: '20px'}} alt=""/>
                {getPanel()}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
  // console.log('state:', state)
  return {
    logo: state.app.logo
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => {
            dispatch({
                type: "CLOSE_MODAL",
            })
        },
        openModal: (content) => {
            dispatch({
                type: "OPEN_MODAL",
                content
            })
        }
    }
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Login))