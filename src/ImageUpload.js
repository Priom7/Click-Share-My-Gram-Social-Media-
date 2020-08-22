import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ImageIcon from "@material-ui/icons/Image";
import "./ImageUpload.css";

function ImageUpload({ username, userImage }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
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
  console.log(image);
  return (
    <div className='imageUpload'>
      <div className='imageUpload__left'>
        <img src={userImage} alt={username}></img>
        <h3 className='imageUpload__username'>
          {username}
        </h3>
      </div>
      <div className='imageUpload__right'>
        <div className='imageUpload_content'>
          {image && (
            <progress
              className='imageUpload_progress'
              value={progress}
              max='100'
            />
          )}
          <input
            className='imageUpload_caption'
            type='text'
            placeholder={`Enter caption, ${username} ?`}
            onChange={(event) =>
              setCaption(event.target.value)
            }
            value={caption}
          />
          <div className='imageUpload__options'>
            <div className='imageUpload__addImage'>
              <label className='filelabel'>
                <i class='fa fa-paperclip'></i>
                <ImageIcon></ImageIcon>
                <span className='title'>Add Image</span>
                <input
                  className='FileUpload1'
                  id='FileInput'
                  type='file'
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='imageUpload__uploadBtn'>
              <Button onClick={handleUpload}>
                <CloudUploadIcon
                  style={{ color: "#deb887" }}
                />

                <span style={{ color: "wheat" }}>
                  Upload
                </span>
              </Button>
            </div>
          </div>
          {image && (
            <img
              className='imageUpload_preview'
              src={previewUrl}
              alt='Preview'
            ></img>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
