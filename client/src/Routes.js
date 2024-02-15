import { Switch } from "antd";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginForm from './Login.js'
import RegisterForm from './Register.js'
import HomeForm from './Home.js';

export const HYJRoutes = () => {
    return (
        <Router>
            <Switch>
                <Route path= "/">
                    <HomeForm />
                </Route>
                <Route path= "/login">
                    <LoginForm />
                </Route>
                <Route path= "/register">
                    <RegisterForm />
                </Route>
            </Switch>
        </Router>
    );
}