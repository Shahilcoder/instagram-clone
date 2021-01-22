import React, { useState, useEffect } from "react";
import { Button, Input, LinearProgress } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import './MediaUpload.css';

function MediaUpload({username}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState('');

    useEffect(() => {
        if (media && media.type.match('image.*')) {
            setMediaType('image');
        } else if (media && media.type.match('video.*')) {
            setMediaType('video');
        }
    }, [media]);

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setMedia(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        // based on file type, store the file in the images or video folder
        const uploadTask = storage.ref(`media/${media.name}`).put(media);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            error => {
                // Error function...
                console.log(error);
            },
            () => {
                // complete function...
                storage
                    .ref("media")
                    .child(media.name)
                    .getDownloadURL()
                    .then(url => {
                        // post media inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            mediaUrl: url,
                            mediaType: mediaType,
                            username: username
                        });
                    });

                    setProgress(0);
                    setCaption("");
                    setMedia(null);
            }
        )
    };

    return (
        <div className="mediaupload">
            <h3>Upload Yours</h3>
            <LinearProgress variant="determinate" className="mediaupload__progress" value={progress} />
            <Input 
                className="mediaupload__input"
                type="text"
                placeholder="Enter a caption..."
                value={caption}
                onChange={event => setCaption(event.target.value)} 
            />
            <input type="file" accept="image/*, video/*" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    );
}

export default MediaUpload;