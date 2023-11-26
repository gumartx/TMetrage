import Navbar from 'components/Navbar';
import Home from 'pages/Home';
import ListDetails from 'pages/ListDetails';
import Lists from 'pages/Lists';
import Menu from 'pages/Menu';
import MovieDetails from 'pages/MovieDetails';
import ProfileDetails from 'pages/ProfileDetails';
import ProfileView from 'pages/ProfileView';
import ProfileEdit from 'pages/ProfileDetails/ProfileEdit';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Form from 'pages/Lists/Form';
import Graphic from 'pages/Graphic';
import Auth from 'pages/Auth';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Redirect from="/auth" to ="/auth/login" exact/>
      <Route path="/auth">
        <Auth />
      </Route>
      <Route path="/menu" exact>
        <Navbar />
        <Menu />
      </Route>
      <Route path="/menu/:movieId">
        <Navbar />
        <MovieDetails />
      </Route>
      <Route path="/lists" exact>
        <Navbar />
        <Lists />
      </Route>
      <Route path="/lists/:listId" exact>
        <Navbar />
        <ListDetails />
      </Route>
      <Route path="/lists/:listId/chart">
        <Navbar />
        <Graphic />
      </Route>
      <Route path="/lists/:listId/:movieId" exact>
        <Navbar />
        <MovieDetails />
      </Route>
      <Route path="/list/form" exact>
        <Navbar />
        <Form />
      </Route>
      <Route path="/profileDetails">
        <Navbar />
        <ProfileDetails />
      </Route>
      <Route path="/profileView">
        <Navbar />
        <ProfileView />
      </Route>
      <Route path="/profileEdit">
        <Navbar />
        <ProfileEdit />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Routes;
