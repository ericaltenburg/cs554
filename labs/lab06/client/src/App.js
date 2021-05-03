import './App.css';
import HomeFeed from './components/HomeFeed';
import BinFeed from './components/BinFeed';
import MyFeed from './components/MyFeed';
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider
} from '@apollo/client';
import {
    BrowserRouter as Router,
    Route,
    NavLink
} from "react-router-dom";
import NewPost from './components/NewPost';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: 'http://localhost:4000'
    })
  });
  

function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
            <div className="App">
                <header className="App-Header">
                    <h1 className="App-title">Bintrest</h1>
                    <nav>
                        <NavLink className="showlink" to="/my-bin">
                            my bin
                        </NavLink> 

                        <NavLink className="showlink" to="/">
                            images
                        </NavLink>

                        <NavLink className="showlink" to="/my-posts">
                            my posts
                        </NavLink>
                    </nav>
                </header>
                <br />
                <br />
                <div className="App-body">
                    <Route path="/my-bin">
                        <BinFeed />
                    </Route>
                    <Route exact path="/">
                        <HomeFeed />
                    </Route>
                    <Route path="/my-posts">
                        <MyFeed />
                    </Route>
                    <Route path="/new-post">
                        <NewPost />
                    </Route>
                </div>
            </div>
        </Router>
    </ApolloProvider>
  );
}

export default App;
