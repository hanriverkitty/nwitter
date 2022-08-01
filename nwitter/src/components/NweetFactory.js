import { dbService, storageservice } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";

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
    const onClearFile = () => setFileString(null);
    const onSubmit = async (event) => {
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
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet" />
            {fileString && (<div>
                <img src={fileString} width="50px" height="50px" />
                <button onClick={onClearFile}>Clear</button>
            </div>)}
        </form>)
};
export default NweetFactory;