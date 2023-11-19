import Navbar from 'components/Navbar';
import Home from 'pages/Home';
import Lists from 'pages/Lists';
import Menu from 'pages/Menu';
import MovieDetails from 'pages/MovieDetails';
import ProfileEdit from 'pages/ProfileEdit';
import ProfileView from 'pages/ProfileView';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const Routes = () => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/menu" exact>
        <Menu />
      </Route>
      <Route path="/menu/movie:movieId">
        <MovieDetails />
      </Route>
      <Route path="/lists">
        <Lists />
      </Route>
      <Route path="/profileView">
        <ProfileView />
      </Route>
      <Route path="/profileEdit">
        <ProfileEdit />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Routes;
