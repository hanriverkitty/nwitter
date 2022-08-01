import { dbService, storageservice } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [fileString, setFileString] = useState("");

    const onChange = (event) => {
        const { target: { value }, } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        const { target: { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }, } = finishedEvent
            setFileString(result)
        }
        reader.readAsDataURL(theFile);
    };
    const onClearFile = () => setFileString("");
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }
        event.preventDefault();
        let fileUrl = "";
        if (fileString !== "") {
            const fileRef = storageservice.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await fileRef.putString(fileString, "data_url");
            fileUrl = await response.ref.getDownloadURL();
        }
        const nweetObj1 = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            fileUrl,
        };
        await dbService.collection("nweets").add(nweetObj1);
        setNweet("");
        setFileString("");
    };
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }} />

            {fileString && (<div className="factoryForm__attachment">
                <img
                    src={attachment}
                    style={{
                        backgroundImage: attachment,
                    }}
                />
                <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>)}
        </form>)
};
export default NweetFactory;