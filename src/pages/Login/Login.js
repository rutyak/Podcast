import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { auth, db } from '../../firebase';
import { setUser } from '../../slice/userSlice';
import "./Login.css"
import { toast } from 'react-toastify';
import Innernav from '../../components/Navbar/Innernav';
import errorIcon from '../../components/Images/error.png'


const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    email: false,
    password: false,
  })

  async function handleLogin(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }
    setLoading(true);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      dispatch(setUser({
        name: userData.name,
        email: user.email,
        uid: user.uid,
      }));

      toast.success("Successfully logged in!!");
      navigate("/podcast");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password!!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Innernav />
      <div className='signup'>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder='Enter your email'
            onBlur={() => {
              setError({
                ...error,
                email: email.trim() === ''
              })
            }
             }
            required
          /><br />
          {error.email ? <p className='error'><img src={errorIcon} alt='img' /><p>Email is required!</p></p> : ''}
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder='Password'
            onBlur={() => {
              setError({
                ...error,
                password: password.trim() === ''
              })
            }}
            required
          /><br />
          {error.password ? <p className='error'><img src={errorIcon} alt='img' /><p>Password is required!</p></p> : ''}
          {/* loading when login */}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className='para'>Don't have an account? <Link to='/signup'>Signup</Link></p>
      </div>

    </>
  )
}

export default Login
