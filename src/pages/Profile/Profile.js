import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Innernav from '../../components/Navbar/Innernav';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import './Profile.css';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, query, getDocs} from 'firebase/firestore';
import { setPodcasts } from '../../slice/podcastsSlice';
import Podcastcard from '../../components/Podcastcard';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const podcasts = useSelector((state) => state.podcasts.podcasts);
  const currentUser = auth.currentUser.uid;
  let podcastCreater = "";
  let src = "";

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "podcasts"));
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      } catch (error) {
        console.log("Error fetching podcasts: ", error);
      }
    };

    fetchData();
  }, [dispatch]);

  function handleLogout() {
    signOut(auth)
      .then(() => {
        toast.success('User logged out!!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  function handleSub() {
    navigate("/subscriber");
  }

  function handleMyPod() {
    navigate("/podcast");
  }

  async function handleDelete(podcastId) {
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
                {podcasts.length > 0 ? (
                  <div className='cards'>
                    {podcasts.map((item) => {
                      if (item.createdBy === currentUser) {
                        return (
                          <div className='indi-card'>
                          <React.Fragment key={item.id}>
                            <Podcastcard
                              title={item.title}
                              displayImage={item.displayImage}
                              id={item.id}
                            />
                            <button onClick={() => handleDelete(item.id)}>Delete podcast</button>
                          </React.Fragment>
                          </div>
                        )
                      }
                    })}
                  </div>
                ) : (
                  <p>Not Found</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}

export default Profile;
