import React from "react"
import TextField from '@material-ui/core/TextField';

export default (props) => <TextField className="field" variant="outlined" {...props} label={props.title} onChange={(e)=>props.handleChange(props.id, e.target.value)} />