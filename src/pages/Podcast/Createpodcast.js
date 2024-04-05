import React, { useState } from "react";
import Innernav from "../../components/Navbar/Innernav";
import FileInput from "../../components/FileInput";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import errorIcon from '../../components/Images/error.png'
import "./Createpodcast.css"

const Contact = () => {

  const navigator = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImg, setDisplayImg] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    title: false,
    desc: false,
    descriptionLength: false
  })
  async function handleSubmit() {
    setLoading(true);
    console.log(title);
    console.log(desc);
    console.log(displayImg);
    console.log(bannerImg);
    try {
      if (title && desc && displayImg && bannerImg && profileImg) {    
        //banner image
        const banner = ref(   
          storage,
          `podcast/${auth.currentUser.uid}/${Date.now()}`
        );          // storage needed for image objects. storage path creating here

        await uploadBytes(banner, bannerImg);     // uploading in storage
        const bannerImgUrl = await getDownloadURL(banner);

        //display image
        const display = ref(
          storage,
          `podcast/${auth.currentUser.uid}/${Date.now()}`
        );          // storage needed for image objects. storage path creating here
        await uploadBytes(display, displayImg);   // uploading in storage
        const displayImgUrl = await getDownloadURL(display);

        //profile image
        const profileRef = ref(
          storage,
          `podcast/${auth.currentUser.uid}/${Date.now()}`
        );          // storage needed for image objects. storage path creating here
        await uploadBytes(profileRef, profileImg);   // uploading in storage
        const profileUrl = await getDownloadURL(profileRef);   // downloadable link

        const podcastsData = {
          title: title,
          description: desc,
          bannerImage: bannerImgUrl,
          displayImage: displayImgUrl,
          profileImage: profileUrl,
          createdBy: auth.currentUser.uid,
        };

        const docRef = await addDoc(collection(db, "podcasts"), podcastsData);   // adding in database  not storing in redux because it will not a good approach

        console.log("docRef", docRef);
        setTitle("");    // reset all
        setDesc("");
        setBannerImg(null);
        setDisplayImg(null);
        setProfileImg(null);
        toast.success("Created successfully!!");
        navigator("/podcast")
        setLoading(false);
      }
    } catch (error) {
      console.log("Error",error)
      setLoading(false);
    }
  }

  return (
    <div>
      <Innernav />
      <div className="signup">
        <div>
          <h1>Create Podcast</h1>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            onBlur={()=>{
                setError({
                  ...error,
                  title: title.trim()===''
                })
            }}
            placeholder="Podcast title"
            required
          />
          <br></br>
          {error.title? <p className='error'><img src={errorIcon} alt='img' /><p>Title is required</p></p> : ''}
          <textarea
            className="textarea"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            onBlur={()=>{
              setError({
                ...error,
                desc: desc.trim()===''
              })
            }}
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
          {error.desc ? <p className='error'><img src={errorIcon} alt='img' /><p>Description is required</p></p> : ''}
          {(desc.replace(/\s/g,'').length < 40) && desc.trim()!='' ? <p className='error'><img src={errorIcon} alt='img' /><p>Description must contain minimum 40 char</p></p> : ''}

          <FileInput                     // input from fileInput
            accept="image/*"
            id="banner-image"
            text="Podcast image upload"
            fileFun={setDisplayImg}
          />

          <FileInput
            accept="image/*"
            id="small-banner-image"
            text="Banner image upload"
            fileFun={setBannerImg}
          />
       
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Create Podcast"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
