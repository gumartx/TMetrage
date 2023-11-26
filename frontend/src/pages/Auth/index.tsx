import { ReactComponent as LoginImg } from 'assets/images/login.svg';
import "./styles.css";
import { Route, Switch } from 'react-router-dom';
import Navbar from 'pages/Home/Navbar';
import Login from './LoginCard';
import Signup from './SignupCard';
import Recover from './RecoverCard';

const Auth = () => {

    return(
        <>
        <Navbar />
        <div className="auth-container">
            <div className="auth-banner-container">
                <h1>Organize seus filmes no TMétrage</h1>
                <p>Faça parte da comunidade</p>
                <LoginImg />
            </div>
            <div className="auth-form-container">
                <Switch>
                    <Route path="/auth/login" exact>
                        <Login />
                    </Route>
                    <Route path="/auth/signup">
                        <Signup />
                    </Route>
                    <Route path="/auth/recover">
                        <Recover />
                    </Route>
                </Switch>
            </div>
        </div>
        </>
    );

}

export default Auth;