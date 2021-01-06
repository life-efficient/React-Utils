const { createMuiTheme } = require("@material-ui/core");

export default createMuiTheme({
    palette: {
        primary: {
            main: '#7755A0',
            light: '#f2f4f9',
            contrastText: "#ffffff"
        },
        secondary: {
            main: '#f2994a',
            contrastText: "#ffffff"
        }
    },
    typography:{
        fontSize: 20
    }
})