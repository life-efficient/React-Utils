import React, { useState } from "react"
import Password from "./Password"
import TextResponse from "./TextField"

const ConfirmPassword = props => {
    const [hidden, setHidden] = useState(true)
    return <>
        <Password {...props} title='Password' setHidden={()=>setHidden(!hidden)} />
        <TextResponse {...props} type={hidden ? 'password' : 'text'} value={props.confirm_value} className="field" variant="outlined" id='confirm-password' title='Confirm password'/>
    </>
}

export default ConfirmPassword