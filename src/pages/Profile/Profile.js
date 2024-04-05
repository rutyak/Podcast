import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Innernav from '../../components/Navbar/Innernav';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import './Profile.css';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { setPodcasts } from '../../slice/podcastsSlice';
import Podcastcard from '../../components/Podcastcard';

const Profile = () => {

  const { id } = useParams();  // taking id
  const dispatch = useDispatch(); //initalizing dispatch
  const podcasts = useSelector((state) => state.podcasts.podcasts); // data from redux
  console.log("podcastsDataprofile: ", podcasts);
  let currentUser = auth.currentUser.uid; // current users id
  let podcastCreater = "";
  let src = "";


  // Create a reversed copy of the podcasts array
  const reversedPodcasts = [...podcasts].reverse(); // reverse because we need latest users details

  reversedPodcasts.forEach((podcast, i) => {
    if (i < reversedPodcasts.length - 1 && podcast.createdBy !== reversedPodcasts[i + 1].createdBy) { // checking if different creater found 
      src = reversedPodcasts[i + 1].profileImage; // Profile image of the new user
      console.log("profile of satyam", src);
      podcastCreater = reversedPodcasts[i + 1].createdBy; // Creator ID
      console.log("satyam uid", podcastCreater);
    }
  });


  const navigate = useNavigate();  // initializing navigation
  const user = useSelector((state) => state.user.user);  // user data from store
  console.log('user', user);




  useEffect(() => {
    if (id) {
      onSnapshot(                                   // it is a listener for changes in document
        query(collection(db, "podcasts")),          // podcast data path
        (querySnapshot) => {                        // callback of onSnapshot
          const podcastsData = [];                  // array for podcast data
          querySnapshot.forEach((doc) => {
            podcastsData.push({ id: doc.id, ...doc.data() })   // id and data
            // console.log(doc.id, " => ", doc.data());
          });
          dispatch(setPodcasts(podcastsData));   // saving in redux
        },
        (error) => {
          console.log("error", error);
        }
      );
    }

  }, [id, dispatch]) // execute when id load


  function handleLogout() {
    signOut(auth)      // use for log out 
      .then(() => {
        toast.success('User logged out!!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  function handleSub() {
    navigate("/subscriber")
  }

  function handleMyPod() {
    navigate("/podcast")
  }

  async function handleDelete(podcastId) {   // delete podcast
    try {
      await deleteDoc(doc(db, "podcasts", podcastId));
      toast.success('Podcast deleted successfully!');
    } catch (error) {
      toast.error('Error deleting podcast: ' + error.message);
    }
  }


  return (
    <div>
      <Innernav />
      <div className="profile">
        {user && user.name ? (
          <div>
            <div className="profile-top">
              <div className='email-name'>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <button onClick={handleLogout} >Logout</button>
            </div>
            <hr />
            <div className="profile-middle">
              <h3 style={{cursor: 'pointer'}} onClick={()=>navigate('/premium')}>Upgrade Membership</h3>
              <hr />
              <p onClick={handleSub} style={{cursor: 'pointer'}}>My Subscriptions</p>
              <p onClick={handleMyPod} style={{cursor: 'pointer'}}>My Podcasts</p>
              <hr />
            </div>
  
          {/* podcast history */}
          <div className='history'>
            <h2>Podcast History</h2>
            <div>
              {podcasts.length > 0 ? (    // when podcast data vailable
                <div className='cards'>
                  {podcasts.map((item) => {
                    if (item.createdBy === currentUser) {   // only showing the history of current user
                      return (
                        <>
                          <Podcastcard
                            key={item.id}
                            title={item.title}
                            displayImage={item.displayImage}
                            id={item.id} />
                          <button onClick={() => handleDelete(item.id)}>Delete podcast</button>
                        </>
                      )
                    }
                  })
                  }
                </div>
              ) : (<p>Not Found</p>)
              }
            </div>
          </div>
          </div>
        ) : (
          <div>Loading...</div> // Render a loading state if user object is null or doesn't have name property
        )}
      </div>
    </div>
  )
}

export default Profile;
