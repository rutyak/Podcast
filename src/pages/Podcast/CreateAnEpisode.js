import React, { useState } from 'react'
import Innernav from '../../components/Navbar/Innernav'
import FileInput from '../../components/FileInput';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import errorIcon from '../../components/Images/error.png'
import './CreateAnEpisode.css'

const CreateAnEpisode = () => {

  const { id } = useParams();  // it is used to get id from react 
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    title: false,
    desc: false,
    descriptionLength: false
  })

  async function handleSubmit() {
    setLoading(true);
    if (title && desc && audio && id) {
      try {
        const audioRef = ref(
          storage,
          `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
        ) // use to create storage path

        await uploadBytes(audioRef, audio); //audio uploading on audioRef path in storage

        const audioUrl = await getDownloadURL(audioRef); //converting  audio file into downloadable file

        const audioData = {
          title: title,
          description: desc,
          audioFile: audioUrl //uploafing from storage
        }

        await addDoc(
          collection(db, "podcasts", id, "episodes"), //use to create path for audio data
          audioData
        ) // adding doc to Database 

        toast.success("Uploaded !!");
        navigate(`/podcast/${id}`);  // after uploade going to podcast details page
        setAudio(null);
        setDesc("");
        setTitle("");
        setLoading(false);


      } catch (error) {
        toast.error(error.message);
        setLoading(false)
      }
    }
    else {
      toast.error("No such fill found!!")
      setLoading(false)
    }
  }

  function audioFileHandle(file) {
    setAudio(file);
  }
  return (
    <div>
      <Innernav />
      <div className='signup'>
        <h1>Create An Episode</h1>
        <div>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            onBlur={() => {
              setError({
                ...error,
                title: title.trim() === ''
              })
            }}
            placeholder="Episode title"
            required
          /><br></br>
          {error.title ? <p className='error'><img src={errorIcon} alt='img' /><p>Title is required</p></p> : ''}

          <textarea
            type="text"
            className="textarea"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            onBlur={() => {
              setError({
                ...error,
                desc: desc.trim() === ''
              })
            }}
            placeholder="Episode description"
            required
          /><br></br>
          {error.desc ? <p className='error'><img src={errorIcon} alt='img' /><p>Description is required</p></p> : ''}
          {(desc.replace(/\s/g, '').length < 40) && desc.trim()!= '' ? <p className='error'><img src={errorIcon} alt='img' /><p>Description must contain minimum 40 char</p></p> : ''}

          <FileInput
            accept="audio/*"
            id="banner-audio-file"
            text="Upload audio"
            fileFun={audioFileHandle}
          />

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Loading...' : 'Create Episode'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAnEpisode
