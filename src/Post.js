import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import { db } from "./firebase";

function Post({postId, user, username, imageUrl, caption}) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            username: user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="User"
                    src="/static/images/avatar/1.png"
                />
                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt="" />

            <h4 className={`post__text ${comments.length > 0 && " with_border"}`}><b>{username}: </b> {caption}</h4>
            
            {comments.length > 0 && (
                <div className="post__comments">
                    {
                        comments.map(comment => {
                            return (
                                <div className="post__comment"><strong>{comment.username}</strong> {comment.text}</div>
                            )
                        })
                    }
                </div>
            )}
            
            {user && (
                <form className="post__commentBox">
                    <input 
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post;