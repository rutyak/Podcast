import React, { useState } from 'react'
import Innernav from '../../components/Navbar/Innernav';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "../../firebase"
import {
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux'
import { setUser } from '../../slice/userSlice';
import { toast } from 'react-toastify';
import errorIcon from '../../components/Images/error.png'


function Signup() {

  let dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    email: false,
    name: false,
    password: false,
    cpassword: false
  })

  async function handlesignup(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    const validationErrors = validateInputs();
    if (validationErrors.length === 0) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

        await Promise.all([
          setDoc(doc(db, "users", user.uid), { name: name, email: user.email, uid: user.uid }),
          dispatch(setUser({ name: name, email: user.email, uid: user.uid }))
        ]);

        toast.success("User successfully registered!!");
        navigate("/podcast");
      } catch (error) {
        console.error(error);
        toast.error("Failed to register user. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      validationErrors.forEach(error => toast.error(error));
      setLoading(false);
    }
  }

  function validateInputs() {
    const errors = [];

    if (password !== cpassword) {
      errors.push("Passwords do not matching!!");
    }
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long!!");
    }

    return errors;
  }

  return (
    <div>
      <Innernav />
      <div className='signup'>
        <form onSubmit={(e) => handlesignup(e)}>
          <h1>Signup</h1>
          <input
            type='text'
            name='name'
            onChange={(e) => setName(e.target.value)}
            value={name}
            onBlur={() => {
              setError({
                ...error,
                name: name.trim() === ''
              })
            }}
            placeholder='Enter your name'
            required
          /><br />
          {error.name ? <p className='error'><img src={errorIcon} alt='img' /><p>Name is required!</p></p> : ''}
          <input
            type='email'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            onBlur={() => {
              setError({
                ...error,
                email: email.trim() === ''
              })
            }
            }
            placeholder='Enter your email'
            required
          /><br />
          {error.email ? <p className='error'><img src={errorIcon} alt='img' /><p>Email is required!</p></p> : ''}

          <input
            type='password'
            name='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            onBlur={() => {
              setError({
                ...error,
                password: password.trim() === ''
              })
            }}
            placeholder='Password'
            required
          /><br />
          {error.password ? <p className='error'><img src={errorIcon} alt='img' /><p>Password is required!</p></p> : ''}
          <input
            type='password'
            name='confirmPassword'
            onChange={(e) => setCpassword(e.target.value)}
            value={cpassword}
            onBlur={() => {
              setError({
                ...error,
                cpassword: cpassword.trim() === ''
              })
            }}
            placeholder='Confirm password'
            required
          /><br />
          {error.cpassword ? <p className='error'><img src={errorIcon} alt='img' /><p>Password is required!</p></p> : ''}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Signup"}
          </button>
        </form>
        <p className='para'>Already have an account? <Link to='/login'>Login</Link></p>
      </div>

    </div>
  )
}

export default Signup
