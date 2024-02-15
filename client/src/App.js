import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';
import LoginForm from './Login.js'
import RegisterForm from './Register.js'

function App() {
  return (
    <div>
      <Helmet>
        <title>HatYai Journey</title>
      </Helmet>
      <Router>
        <div className="container">
          <Route path="/" component={LoginForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
        </div>
      </Router>
    </div>
  );
}

export default App;
