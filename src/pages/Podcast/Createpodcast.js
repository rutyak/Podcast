import React, { useState } from "react";
import Innernav from "../../components/Navbar/Innernav";
import FileInput from "../../components/FileInput";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import errorIcon from '../../components/Images/error.png'
import "./Createpodcast.css"

const CreatePodcast = () => {
  const navigator = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImg, setDisplayImg] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    title: false,
    desc: false,
  });

  async function handleSubmit() {
    setLoading(true);

    try {
      if (title && desc && displayImg && bannerImg) {
        const bannerRef = ref(storage, `podcast/${auth.currentUser.uid}/${Date.now()}`);
        await uploadAndAddToBatch(bannerRef, bannerImg);

        const displayRef = ref(storage, `podcast/${auth.currentUser.uid}/${Date.now()}`);
        await uploadAndAddToBatch(displayRef, displayImg);

        const podcastsData = {
          title: title,
          description: desc,
          bannerImage: await getDownloadURL(bannerRef),
          displayImage: await getDownloadURL(displayRef),
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, "podcasts"), podcastsData);

        setTitle("");
        setDesc("");
        toast.success("Podcast created successfully!!");
        navigator("/podcast");
      }
    } catch (error) {
      console.error("Error creating podcast:", error);
      toast.error("Failed to create podcast. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadAndAddToBatch(ref, file) {
    await uploadBytes(ref, file);
  }

  return (
    <div>
      <Innernav />
      <div className="signup">
        <div>
          <h1>Create Podcast</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setError({ ...error, title: title.trim() === '' })}
            placeholder="Podcast title"
            required
          />
          {error.title && <p className='error'><img src={errorIcon} alt='img' /><p>Title is required</p></p>}
          <textarea
            className="textarea"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={() => setError({ ...error, desc: desc.trim() === '' })}
            placeholder="Podcast description"
            required
            style={{
              height: '100px',
              marginBottom: '1rem',
              resize: 'none',
              paddingLeft: '0.5rem',
              paddingTop: '0.5rem',
              width: '87%',
              borderRadius: '0.3rem',
              background: 'color: var(--secondary-inputs)'
            }}
          ></textarea>
          {error.desc && <p className='error'><img src={errorIcon} alt='img' /><p>Description is required</p></p>}
          {(desc.replace(/\s/g, '').length < 40) && desc.trim()!= '' ? <p className='error'><img src={errorIcon} alt='img' /><p>Description must contain minimum 40 char</p></p> : ''}
          <FileInput
            accept="image/*"
            id="banner-image"
            text="Podcast image upload"
            fileFun={setBannerImg}
          />
          <FileInput
            accept="image/*"
            id="small-banner-image"
            text="Banner image upload"
            fileFun={setDisplayImg}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Create Podcast"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePodcast;
