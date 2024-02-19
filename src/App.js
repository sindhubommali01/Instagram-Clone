import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core';
import ImgUpload from './ImgUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

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
  const [open , setOpen] = useState(false);
  const [openSignIn , setOpenSignIn] = useState(false);
  const [email , setEmail] = useState('');
  const [username , setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [user , setUser] = useState(null);
  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);  
        setUser(authUser);
        if(authUser.displayName){

        }else{
          return authUser.updateProfile({
            displayName: username,
          });
        }
      }else{
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  },[user , username]);

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map(doc=> ({
          id: doc.id, 
          post: doc.data()
        })
      ));
    })
  },[]);

  const signUp = (event) =>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email , password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email , password)
    
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (

    <div className="app">
      <Modal
        open={open}
        onClose={()=> setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className = "app__signUp">
          <center>
            <img className="app__headerimage" alt="" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"></img>
          </center>
            <Input
            type='text'
            placeholder='username'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
            type='email'
            placeholder='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className = "app__signUp">
        <center>
          <img className="app__headerimage" alt="" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" />
         </center>
          <Input
          type='email'
          placeholder='email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <Input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <Button type="submit"   onClick={signIn}>Sign In</Button>
        
          </form>
        </div>
      </Modal>
      
      <div className="app__header">
        {/* <img
          className="app__headerimage" 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        /> */}
        <h1>Instagram</h1>
        {user ? (
            <Button onClick ={()=>auth.signOut()}>Logout</Button>
            ): (
            <div className = "app__loginContainer">
              <Button onClick ={()=>setOpenSignIn(true)}>Sign In</Button>
              <Button onClick ={()=>setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      {/* {
        posts.map(({id, post})=>(
          <Post key={id} username={post.username} caption={post.caption} imgUrl={post.imgUrl}/>
        ))
      } */}

        <div className= 'app__posts'>
          <div className = "app__postsLeft">

            {posts.map( ({id , post})  => (
              <Post
                key = {id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imgUrl={post.imgUrl}
              />
            ))}
          </div>
          <div className = "app_postsRight">
            <InstagramEmbed
              url='https://instagr.am/p/Zw9o4/'
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

      {user?.displayName ? (<ImgUpload username= {user.displayName} />):(<h3>Sorry you need to login !!</h3>)}
    </div>

  );
}
export default App;

  // {
  //   username: "justin",
  //   caption: "wow this works",
  //   imgUrl: "https://res.cloudinary.com/practicaldev/image/fetch/s--JIe3p0M4--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/093ewdrgyf1kedlhzs51.png" 
  // },
  // {
  //   username: "cats",
  //   caption: "yup it does",
  //   imgUrl: "https://media.wired.com/photos/5ed06ca9fbf7b2147038a8a9/master/w_2560%2Cc_limit/Gear-New-Pet-1168772154.jpg"
  // },
  // {
  //   username: "tanmay",
  //   caption: "AWESOME",
  //   imgUrl: "https://www.cdc.gov/healthypets/images/pets/cute-dog-headshot.jpg"
  // }