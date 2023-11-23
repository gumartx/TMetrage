import Navbar from 'components/Navbar';
import Home from 'pages/Home';
import ListDetails from 'pages/ListDetails';
import Lists from 'pages/Lists';
import Menu from 'pages/Menu';
import MovieDetails from 'pages/MovieDetails';
import ProfileEdit from 'pages/ProfileEdit';
import ProfileView from 'pages/ProfileDetails';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Form from 'pages/Lists/Form';

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
      <Route path="/menu/:movieId">
        <MovieDetails />
      </Route>
      <Route path="/lists" exact>
        <Lists />
      </Route>
      <Route path="/lists/:listId" exact>
        <ListDetails />
      </Route>
      <Route path="/lists/:listId/:movieId" exact>
        <MovieDetails />
      </Route>
      <Route path="/list/form" exact>
        <Form />
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
