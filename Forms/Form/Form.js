import React, { useEffect, useState } from "react"
import { withTheme, Button, CircularProgress, makeStyles } from "@material-ui/core"
import { Redirect } from "react-router-dom"
import TextResponse from "./Fields/TextField"
import Password from "./Fields/Password"
import ConfirmPassword from "./Fields/ConfirmPassword"

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: '20px auto',
        width: '400px',
        maxWidth: '80%',
        borderRadius: '3px',
            
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        // flex-direction: column;
        justifyContent: 'center',
        backgroundColor: 'lightgrey', //${props.theme.palette.primary.main};
        // background: linear-gradient(var(--color2), var(--color2g)); // doesn't work because forms have backgrounds and are placed on a panel in the login component so there is a color mismatch
        color: 'black',//${props.theme.palette.primary.contrastText};

        display: 'flex',
        flexDirection: 'row',
        overflowY: 'auto',
        overflowX: 'hidden',
        justifyContent: 'left',

        '& .title': {
            fontSize: '30px',
            marginBottom: '20px',
            fontWeight: '900'
        },

        '& > .edit': {
            position: 'absolute',
            height: '25px',
            right: '10px',
            top: '10px',
            cursor: 'pointer'
        },

        '& .slide': {
            minWidth: '100%',
            padding: '20px',
            transitionDuration: '0.5s',
            boxSizing: 'border-box'
        },

        '& .form': {
            '& > .btn-container': {
                display: 'flex',
                justifyContent: 'center'
                // margin: 0 100px;
            },
            
            '& .field': {
                margin: '10px 0'
            },

            '& .error': {
                fontSize: '1.7rem',
                paddingBottom: '10px',
                color: '#ff6666',
                fontWeight: '900'
            },

            // '& input:-webkit-autofill',
            // input:-webkit-autofill:hover, 
            // input:-webkit-autofill:focus, 
            // input:-webkit-autofill:active  {
            //     -webkit-box-shadow: 0 0 0 30px ${props.theme.palette.primary.main} inset !important;
            //     -webkit-text-fill-color: ${props.theme.palette.primary.contrastText};
            // }

            '& .detail': {
                fontSize: '1.5rem',
                paddingBottom: '10px',
                fontWeight: '300'
            },

            '& .MuiFormControl-root.MuiTextField-root': {
                '& label': {
                    color: 'black',//${props.theme.palette.primary.contrastText};
                    fontSize: '1.5rem'
                },
                '& input': {
                    fontSize: '1.6rem',
                    color: 'black',//${props.theme.palette.primary.contrastText};
                }
            }
        }
    }
})

const Form = props => {
    const classes = useStyles()

    const [responses, setResponses] = useState({})
    const [slide_idx, setSlideIdx] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const handleChange = (id, value) => {
        setResponses({...responses, [id]: value})
    }
    
    const validate = () => true

    const submit = async () => {
        if (validate()) {      // do basic validation based on field type
            setLoading(true)
            let onSubmit = props.slides[slide_idx].onSubmit
            try {
                if (onSubmit) {
                    let e = {}
                    for (var k in responses) {
                        if (responses[k] == '') {continue} // remove empty responses
                        e[k] = responses[k]
                    }
                    await onSubmit(e)
                }                  // validate + do extra stuff
                console.log('both internal and external validation successful')
                setSlideIdx(slide_idx + 1)
            }
            catch (error) {
                console.debug('An external error occured:', error)
                setError(error.message)
            }
            setLoading(false)
        }
        else {
            console.debug('internal validation failed')
        }
    }

    useEffect(()=>{ // initialise responses
        props.slides.map(s=>s.questions).flat().forEach(q=>{
            responses[q.id] = q.default || ''
            if (q.type == 'confirm-password') {
                responses['confirm-password'] = ''
            }
        })
    }, [])

    useEffect(()=>console.log(responses), [responses])

    if (slide_idx > props.slides.length - 1) { // if finished
        if (props.redirect) {
            console.log('redirecting to:', props.redirect)
            return <Redirect to={props.redirect}/>
        }
        else {
            if (props.stay) {setSlideIdx(slide_idx - 1)} // stay on last slide
            else {return null}
        }
    }

    return <React.Fragment>
        <div className={classes.root} >
            {
                props.slides.map((s) => {              // map question slides to that form slide
                    // console.log('question slide:', s)
                    return <React.Fragment>  
                    <div className="slide" style={{transform: `translateX(-${100 * slide_idx}%)`}}>
                        <div className="form" >
                            <div style={{fontSize: '30px', marginBottom: '20px', fontWeight: '900'}}>
                                {s.title}
                                <div className='detail'>
                                    {s.subtitle}
                                </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            {
                                s.questions.map((q) => {                         // map question slide (list of objects) to the questions
                                    if (Object.keys(q).includes('conditional')) { // if question is conditional on some other response
                                        if (responses[q.conditional.id] != q.conditional.value) {// if condition not satisfied
                                            return null // don't render it
                                        }
                                    }
                                    q = {...q, value: responses[q.id]}
                                    switch (q.type) {
                                        case "text":
                                            return <TextResponse {...q} handleChange={handleChange} />
                                        // case "number":
                                        //     return <TextResponse {...q} handleChange={handleNumChange} />
                                        // case "phone-number":
                                        //     return <TextResponse {...q} handleChange={handleNumChange} /> 
                                        case "email":
                                            return <TextResponse {...q} handleChange={handleChange}/>
                                        case "password":
                                            return <Password {...q} handleChange={handleChange}/>
                                        case "confirm-password":
                                            return <ConfirmPassword {...q} confirm_value={responses[`confirm-password`]} handleChange={handleChange}/>
                                        // case "dropdown":
                                        //     return <DropDown {...q} handleChange={handleOptionChange} />
                                        // // case "location":
                                        // //     return <LocationField />
                                        // case "date":
                                        //     return <DateField {...q} handleChange={(e)=>{handleDateChange(e, q.id)}} />
                                        // case "time":
                                        //     return <Time {...q} handleChange={(e)=>{handleTimeChange(e, q.id)}} />
                                        // case "file":
                                        //     return <FileUpload {...q} handleChange={handleCustomChange}/>
                                        // case "image":
                                        //     return <FileUpload {...q} handleChange={handleCustomChange}/>
                                        // case "rating":
                                        //     return <RatingField {...q} handleChange={handleRatingChange} />
                                        // case "colour-picker":
                                        //     return <ColourPicker {...q} handleChange={handleCustomChange} />
                                        default:
                                            return `${q.type} IS NOT A VALID QUESTION TYPE`
                                    }
                                })
                            }
                            </div>
                            <div className="error">
                                {error}
                            </div>
                            <div className='detail'>
                                {s.detail}
                            </div>

                            <div className="btn-container">
                                <Button color="secondary" size="large" variant="contained" className="submit" text='Submit' onClick={submit} >
                                    {
                                        loading ? <CircularProgress/> : 
                                        props.submit_label ? props.submit_label : 'Submit'
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                    </React.Fragment>
                })
            }
        </div>
    </React.Fragment>
}

export default withTheme(Form)