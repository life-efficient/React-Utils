import React, { useState } from "react"
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextResponse from "./TextField"

const Password = props => {
    const [hidden, setHidden] = useState(true)
    return <TextResponse
        {...props}
        type={hidden ? 'password' : 'text'}
        InputProps={{
            endAdornment: <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={()=>{
                        setHidden(!hidden)
                        if (props.setHidden) {
                            props.setHidden(!hidden) // for toggling hidden in ConfirmPassword component
                        }
                    }}
                >
                    {hidden ? <Visibility /> : <VisibilityOff />}
                </IconButton>
            </InputAdornment>
        }}
    />
}

export default Password