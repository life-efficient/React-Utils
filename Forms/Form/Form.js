import React, { useEffect, useState } from "react"
import { withTheme, Button, CircularProgress } from "@material-ui/core"
import { css, jsx } from "@emotion/core"
import { Redirect } from "react-router-dom"
import TextResponse from "./Fields/TextField"
import Password from "./Fields/Password"
import ConfirmPassword from "./Fields/ConfirmPassword"
/* @jsx jsx */

const getStyle = props => {
    return css`
        width: 100%;
        margin: 20px auto;
        width: 400px; 
        max-width: 80%;
        border-radius: 3px;
            
        position: relative;
        align-items: center;
        display: flex;
        // flex-direction: column;
        justify-content: center;
        background-color: ${props.theme.palette.primary.main};
        // background: linear-gradient(var(--color2), var(--color2g)); // doesn't work because forms have backgrounds and are placed on a panel in the login component so there is a color mismatch
        color: ${props.theme.palette.primary.contrastText};

        display: flex;
        flex-direction: row;
        overflow-y: auto;
        overflow-x: hidden;
        justify-content: left;

        .title {
            font-size: 30px;
            margin-bottom: 20px;
            font-weight: 900;
        }

        > .edit {
            position: absolute;
            height: 25px;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }

        .slide {
            min-width: 100%; 
            padding: 20px;
            transition-duration: 0.5s;
        }

        .form {

            > .btn-container {
                display: flex;
                justify-content: center;
                // margin: 0 100px;
            }
            
            .field {
                margin: 10px 0;
            }

            .error {
                font-size: 1.7rem;
                padding-bottom: 10px;
                color: #ff6666;
                font-weight: 900;
            }

            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active  {
                -webkit-box-shadow: 0 0 0 30px ${props.theme.palette.primary.main} inset !important;
                -webkit-text-fill-color: ${props.theme.palette.primary.contrastText};
            }

            .detail {
                font-size: 1.5rem;
                padding-bottom: 10px;
                font-weight: 300
            }

            .MuiFormControl-root.MuiTextField-root{
                label{
                    color: ${props.theme.palette.primary.contrastText};
                    font-size: 1.5rem;
                }
                input{
                    font-size: 1.6rem;
                    color: ${props.theme.palette.primary.contrastText};
                }
            }
        
            `
}

const Form = props => {

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
        <div css={getStyle(props)} >
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
                            <div css={css`display: flex; flex-direction: column;`}>
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