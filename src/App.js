
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Createpodcast from './pages/Podcast/Createpodcast'
import Podcast from './pages/Podcast/Podcast';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { setUser } from './slice/userSlice';
import { useDispatch } from 'react-redux';
import Podcastdetails from './pages/Podcast/Podcastdetails';
import CreateAnEpisode from './pages/Podcast/CreateAnEpisode';
import Subscriber from './pages/Profile/Subscriber';
import Premium from './pages/Premium/Premium';
import Payment from './pages/Premium/Payment';

import PrivateRouter from './components/PrivateRouter'
import Downloaded from './pages/Premium/Downloaded';
import AccessPremium from './pages/Premium/AccessPremium';
const Profile = lazy(()=> import('./pages/Profile/Profile'))

function App() {

  const dispatch = useDispatch();
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: user.email,
                  uid: user.uid,
                })
              );
            }
          },
          (error) => {
            console.error("Error fetching user Data", error);
          }
        );

        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [dispatch]);


  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} /> 
          <Route element={<PrivateRouter />} >
            <Route path='/profile' element={<Suspense fallback={<div>Loading...</div>}><Profile/></Suspense>} />
            <Route path='/subscriber' element={<Subscriber />} />
            <Route path='/accesspremium' element={<AccessPremium />} />
            <Route path='/downloaded' element={<Downloaded />} />
            <Route path='/subscriber' element={<Subscriber />} />
            <Route path='/premium' element={<Premium />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/podcast' element={<Podcast />} />
            <Route path='/podcast/:id' element={<Podcastdetails />} />
            <Route path='/podcast/:id/create-episode' element={<CreateAnEpisode />} />
            <Route path='/createpodcast' element={<Createpodcast />} />
          </Route>
        </Routes>  
      </BrowserRouter>      
    </div>
  );
}

export default App;
