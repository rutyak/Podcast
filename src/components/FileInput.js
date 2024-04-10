import React, { useState } from 'react';
import './FileInput.css'

const FileInput = ({ accept, id, text, fileFun }) => {   // for image and audio inputs
  const [file, setFile] = useState(null);

  function onChange(e) {
    const selectedFile = e.target.files[0];   
    console.log(selectedFile);
    setFile(selectedFile ? selectedFile.name : null);   //  file name will display when file selected
    fileFun(selectedFile);  // passgin to fileFun
  }

  return (

    // css when file selected then border get highlighted
    <div className={`upload ${file ? 'active' : 'input-upload'} `}>    

      {/* // setting file name when selected */}
      <label htmlFor={id}>{file ? `${file}` : text}</label>   
      <input
        data-testid='input-file'
        type="file"
        accept={accept}
        id={id}
        style={{ display: 'none' }}
        onChange={onChange} 
      />
    </div>
  );
};

export default FileInput;
