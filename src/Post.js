import React, { useState, useEffect } from "react";
import "./Post.css";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

function Post({
  postId,
  user,
  username,
  caption,
  imageUrl,
}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => doc.data())
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    //code
    db.collection("users").onSnapshot((snapShot) => {
      setUserImages(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          profile: doc.data(),
        }))
      );
    });
  }, []);
  console.log(userImages);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setComment("");
  };

  return (
    <div className='post'>
      <div className='post_header'>
        {userImages.map(
          (userImage) =>
            username === userImage?.profile.username && (
              <Avatar
                className='post_avatar'
                alt={username}
                src={userImage?.profile?.imageUrl}
              />
            )
        )}

        <h3>{username}</h3>
      </div>
      <img
        className='post_image'
        src={imageUrl}
        alt={caption}
      />
      <h4 className='post_text'>
        <strong>{username}: </strong>
        {caption}
      </h4>
      <div className='post_comments'>
        {comments.map((comment) => {
          return (
            <div className='post__comments'>
              <div>
                {userImages.map(
                  (userImage) =>
                    comment.username ===
                      userImage?.profile.username && (
                      <Avatar
                        className='post_avatar'
                        alt={username}
                        src={userImage?.profile?.imageUrl}
                      />
                    )
                )}
              </div>
              <div>
                <p>
                  <strong>{comment.username} </strong>{" "}
                  {comment.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {user && (
        <form className='post_commentBox'>
          <input
            className='post_input'
            type='text'
            placeholder='Add a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='post_button'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
