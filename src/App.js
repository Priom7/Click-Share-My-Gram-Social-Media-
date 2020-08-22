import React, { useState, useEffect } from "react";
import logo from "./images/icon-black.png";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./App.css";
import Post from "./Post";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import Avatar from "@material-ui/core/Avatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InstagramEmbed from "react-instagram-embed";
import { storage } from "./firebase";
import firebase from "firebase";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import GroupIcon from "@material-ui/icons/Group";

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
    position: "absolute",
    width: 400,
    backgroundColor: "wheat",
    border: "1px solid wheat",
    borderRadius: "15px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // const handleUpload = () => {

  // };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      }
    );
    return () => {
      //preform clean up
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    //code
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    //code
    db.collection("users").onSnapshot((snapShot) => {
      setProfiles(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          profile: doc.data(),
        }))
      );
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        if (image) {
          const uploadTask = storage
            .ref(`images/${image.name}`)
            .put(image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              //progress
              const progress = Math.round(
                (snapshot.bytesTransferred /
                  snapshot.totalBytes) *
                  100
              );
              setProgress(progress);
            },
            (error) => {
              //error function
              console.log(error);
              alert(error.message);
            },
            () => {
              //complete function
              storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                  //post image inside
                  db.collection("users").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    imageUrl: url,
                    username: username,
                  });
                  setProgress(0);

                  setImage(null);
                });
            }
          );
        } else {
          alert("Please Select An Image!!");
        }
        return authUser.user.updateProfile({
          photoUrl: image,
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignin(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signUp'>
            {/* <center>
							<img src={logo} alt='Sharif' className='app_modalImage' />
						</center> */}
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='imageUpload'>
              <div className='imageUpload_content'>
                <progress
                  className='imageUpload_progress'
                  value={progress}
                  max='100'
                />

                <label class='filelabel'>
                  <i class='fa fa-paperclip'></i>
                  <span className='title'>Add Image</span>
                  <input
                    className='FileUpload1'
                    id='FileInput'
                    type='file'
                    onChange={handleChange}
                  />
                </label>
                {image && (
                  <img
                    className='imageUpload_preview'
                    src={image}
                    alt='Preview'
                  ></img>
                )}
              </div>
            </div>
            <Button type='submit' onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signUp'>
            {/* <center>
							<img src={logo} alt='Sharif' className='app_modalImage' />
						</center> */}
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className='app_header'>
        <img
          src={logo}
          alt='Md. Sharif Alam'
          className='app_headerImage'
        />
        <div className='app__headerIcons'>
          <HomeIcon></HomeIcon>
          <GroupIcon></GroupIcon>
          <ExploreIcon></ExploreIcon>
        </div>

        {user ? (
          <div className='app_loginContainer'>
            <div>{user.displayName}</div>
            {profiles.map(
              (loggedInUser) =>
                user?.displayName ===
                  loggedInUser?.profile.username && (
                  <Avatar
                    className='app_profileAvatar'
                    alt={loggedInUser.profile.username}
                    src={loggedInUser.profile.imageUrl}
                  />
                )
            )}
            <Button onClick={() => auth.signOut()}>
              <ExitToAppIcon
                style={{ color: "#deb887" }}
              ></ExitToAppIcon>
            </Button>
          </div>
        ) : (
          <div className='app_loginContainer'>
            <Button
              className='app__signInBtn'
              onClick={() => setOpenSignin(true)}
            >
              Sign In
            </Button>
            <Button
              className='app__signUpBtn'
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      {user?.displayName ? (
        profiles.map(
          (loggedInUser) =>
            user?.displayName ===
              loggedInUser?.profile?.username && (
              <ImageUpload
                username={user.displayName}
                userImage={loggedInUser?.profile?.imageUrl}
              />
            )
        )
      ) : (
        <h3 className='center'>Login to upload</h3>
      )}

      <div className='app_posts'>
        <div className='app_postLeft'>
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            );
          })}
        </div>
        <div className='app_postRight'>
          <InstagramEmbed
            url='https://www.instagram.com/p/CDyhAtQIcuj/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
