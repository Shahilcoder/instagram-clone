import React, { useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from "@material-ui/core";

import './App.css';
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user has logged in
        console.log(authUser.displayName);
        setUser(authUser);
      } else {
        // the user has logged out
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions before it fires again
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  }, []);

  const signUp = (event) => {
    // event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({
        displayName: username,
      });
    })
    .catch(error => alert(error.message));

    setOpen(false);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));

    setOpenSignIn(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => {setOpen(false)}}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              <br />
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <br />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <br />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <br />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => {setOpenSignIn(false)}}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              <br />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <br />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <br />
              <Button type="submit" onClick={signIn}>Sign in</Button>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        {
          posts.map(({id, post}) => <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption}/>)
        }
      </div>

      {user ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3 className="sorry">Sign Up or Login to Upload Content</h3>
      )}

    </div>
  );
}

export default App;
