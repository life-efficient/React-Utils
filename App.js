import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import {ThemeProvider } from "@material-ui/core";
import { Provider } from "react-redux";
import store from "./store/store"
import amplifyConfig from "./config/Amplify.js"
import theme from "./theme"
import Amplify from "aws-amplify";
import Login from "./Forms/Login"
import Signup from "./Forms/Signup"
import ProtectedRoute from "./ProtectedRoute";

Amplify.configure(amplifyConfig)

export default () => {
    return (
        <ThemeProvider theme={theme} >
            <Provider store={store}>
                <Router>
                    <Switch>
                        {/* <ProtectedRoute path='/app' component={App} /> */}
                        {/* <Route path={['/loading', '/success', '/', '/login']} exact > */}
                        <Route path='/login' component={Login} />
                        <Route path='/signup' component={Signup} />
                        <Route path='/' render={() => 'not found.'} />
                    </Switch>
                </Router>
            </Provider>
        </ThemeProvider>
    )
}