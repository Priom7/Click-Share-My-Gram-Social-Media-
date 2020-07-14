import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const uploadTask = storage
        .ref(`images/${image.name}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress
          const progress = Math.round(
            (snapshot.bytesTransferred /
              snapshot.totalBytes) *
              100
          );
          setProgress(progress);
        },
        (error) => {
          //error function
          console.log(error);
          alert(error.message);
        },
        () => {
          //complete function
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              //post image inside
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: username,
              });
              setProgress(0);
              setCaption("");
              setImage(null);
            });
        }
      );
    } else {
      alert("Please Select An Image!!");
    }
  };

  return (
    <div className='imageUpload'>
      <div className='imageUpload_content'>
        <progress
          className='imageUpload_progress'
          value={progress}
          max='100'
        />
        <input
          className='imageUpload_caption'
          type='text'
          placeholder='Enter a caption...'
          onChange={(event) =>
            setCaption(event.target.value)
          }
          value={caption}
        />
        {/* <input
          className='custom-file-input'
          type='file'
          onChange={handleChange}
        /> */}

        <label class='filelabel'>
          <i class='fa fa-paperclip'></i>
          <span className='title'>Add Image</span>
          <input
            className='FileUpload1'
            id='FileInput'
            type='file'
            onChange={handleChange}
          />
        </label>
        {image && (
          <img
            className='imageUpload_preview'
            src={image}
            alt='Preview'
          ></img>
        )}
        <Button onClick={handleUpload}>
          <CloudUploadIcon style={{ color: "#deb887" }} />
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
