import React from "react"
import Form from "./Form/Form"
import { Auth } from "aws-amplify"
import { connect } from "react-redux"
import { makeStyles, withTheme } from "@material-ui/core"
import { POST } from "../utils"

const useStyles = makeStyles({
    root: {
        animationDuration: '1s',
        // animation-direction: normal;
        margin: 'auto',
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '80%',
        backgroundColor: 'black',//${props.theme.palette.primary.main};
        '& > div': {
            margin: '0px',
            maxWidth: '100%'
        }
    }
})

const Signup = props => {

    const classes = useStyles()

    return(
    <React.Fragment>
        <div css={classes.root} >
            <img src={props.logo} style={{height: '180px', margin: '20px'}} alt=""/>
            <Form 
                redirect='/app/creator'
                slides={[
                    {
                        title: 'Make an account',
                        questions: [
                            {
                                title: 'First name',
                                type: 'text',
                                id: 'forename',
                            },
                            {
                                title: 'Last name',
                                type: 'text',
                                id: 'surname',
                            },
                            {
                                title: 'Email',
                                type: 'email',
                                id: 'email',
                            },
                            {
                                id: 'password',
                                type: 'confirm-password',
                            }
                        ],
                        onSubmit: async (e) => {
                            console.log('signing up')
                            await Auth.signUp(e.email, e.password)
                        }
                    },
                    {
                        title: 'Confirm your email',
                        questions: [
                            {
                                title: 'Code',
                                id: 'code',
                                type: 'text',
                            }
                        ],
                        // detail: <div className="detail" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={()=> {Auth.resendSignUp(e.email).then(()=>console.log('resent successfully').catch((e)=>console.log(e)))}}>
                        //     Resend
                        // </div>,
                        onSubmit: async (e) => {
                            console.log('confirming and logging in')
                            await Auth.confirmSignUp(e.email, e.code)
                            await Auth.signIn(e.email, e.password)
                            const payload = {...e}
                            delete payload.password
                            delete payload['confirm-password']
                            delete payload.code
                            POST('teacher', payload)
                            // props.post_signup_fn ? await props.post_signup_fn(e):null
                        }
                    },
                ]}
            />
        </div>
    </React.Fragment>
    )
}

const mapStateToProps = (state) => {
  return {
    // logged_in: state.user.logged_in,
    logo: state.app.logo
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLogin: () => {
            dispatch({
                type: "LOG_IN"
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Signup))