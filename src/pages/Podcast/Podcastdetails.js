import React, { useEffect, useState } from "react";
import Innernav from "../../components/Navbar/Innernav";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db, auth } from "../../firebase";

import Episodedetails from "../../components/Episodedetails";
import Audioplayer from "../../components/Audioplayer";

const Podcastdetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [audio, setAudio] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function getPodcastDetails() {
      try {
        const docRef = doc(db, "podcasts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPodcast({ id: id, ...docSnap.data() });
          setIsOwner(docSnap.data().createdBy === auth.currentUser.uid);
        } else {
          console.log("No such document!");
          navigate("/podcast");
        }
      } catch (error) {
        console.log("Error fetching podcast details:", error);
        navigate("/podcast");
      }
    }

    async function getEpisodes() {
      try {
        const q = query(collection(db, "podcasts", id, "episodes"));
        const querySnapshot = await getDocs(q);
        const episodeArray = [];
        querySnapshot.forEach((doc) => {
          episodeArray.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodeArray);
      } catch (error) {
        console.log("Error fetching episodes:", error);
      }
    }

    if (id) {
      getPodcastDetails();
      getEpisodes();
    }
  }, [id, navigate]);

  let createEpisodeButton = null; // Variable to hold the JSX expression

  if (isOwner) { // Conditionally assign JSX expression
    createEpisodeButton = (
      <button
        onClick={() => {
          navigate(`/podcast/${id}/create-episode`);
        }}
      >
        Create Episode
      </button>
    );
  }

  return (
    <div>
      <Innernav />
      {podcast.id && (
        <div className="podacsts-details-page">
          <div className="top-podcast-details">
            <h1>{podcast.title}</h1>
            {createEpisodeButton} {/* Render the JSX expression */}
          </div>
          <div className="banner-image">
            <img src={podcast.bannerImage} alt="Podcast Banner" />
          </div>
          <div>
            <p>{podcast.description}</p>
          </div>
          <div>
            <h1>Episodes</h1>
            <div>
              {episodes.length > 0 ? (
                episodes.map((episode, index) => (
                  <Episodedetails
                    key={episode.id}
                    index={index + 1}
                    title={episode.title}
                    description={episode.description}
                    audioFile={episode.audioFile}
                    onClick={(file) => setAudio(file)}
                  />
                ))
              ) : (
                <p>No episodes found</p>
              )}
            </div>
          </div>
        </div>
      )}
      {audio && <Audioplayer audioSrc={audio} image={podcast.displayImage} />}
    </div>
  );
};

export default Podcastdetails;
