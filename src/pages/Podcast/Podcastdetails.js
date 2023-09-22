import React, { useEffect, useState } from "react";
import Innernav from "../../components/Navbar/Innernav";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

import Episodedetails from "../../components/Episodedetails";
import Audioplayer from "../../components/Audioplayer";

const Podcastdetails = () => {
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState({});
  const [episode, setEpisode] = useState({});
  const [audio, setAudio] = useState("");
  console.log("Podcast details", podcast)
  // console.log("Episode details", episode);

  const { id } = useParams();
  console.log("ID", id);

  useEffect(() => {

    async function getData() {
      try {
        const docRef = doc(db, "podcasts", id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setPodcast({ id: id, ...docSnap.data() });
        } else {
          console.log("No such document!")
          navigate("/podcast");
        }
      } catch (error) {
        console.log("Error", error);
        navigate("/podcast");
      }
    }

    if (id) {
      getData();
    }
  }, [id, navigate]);

  useEffect(() => {

    async function newnewEpisodes(){
      const q = query(collection(db, "podcasts", id, "episodes"));
  
      const querySnapshot = await getDocs(q);
      const episodeArray = [];
      querySnapshot.forEach((doc) => {
         episodeArray.push({id: doc.id, ...doc.data()})
       });
       setEpisode(episodeArray);
     }

    if (id) {
      newnewEpisodes();
    }
  }, [id] );


  return (
    <div>
      <Innernav />
      {podcast.id && (
        <div className="podacsts-details-page">
          <div className="top-podcast-details">
            <h1>{podcast.title}</h1>
            <button
              onClick={() => {
                navigate(`/podcast/${id}/create-episode`);
              }}
            >
              Create Episodes
            </button>
          </div>

          <div className="banner-image">
            <img src={podcast.bannerImage} alt="img" />
          </div>
          <div>
            <p>{podcast.description}</p>
          </div>
          <div>
            <h1>Episodes</h1>
            <div>{episode.length > 1 ?
            (
            <div>
              { episode.map((episode, index) =>{
                   return  <Episodedetails key={index} 
                             index={index + 1} 
                             title={episode.title}
                             description={episode.description}
                             audioFile={episode.audioFile} 
                             onClick={(file)=>setAudio(file)}
                             />
              })}
            </div>
             
            )
            :<p>Not found</p>
          }</div>
          </div>
        </div>
      )}

      { audio && <Audioplayer audioSrc={audio} image={podcast.displayImage} />}
    </div>
  );
};

export default Podcastdetails;
