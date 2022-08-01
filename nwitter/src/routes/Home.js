import Nweet from "components/Nweet";
import { dbService, storageservice } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid/v4";
const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [fileString, setFileString] = useState();
    // const getNweets = async () => {
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setNweets((prev) => [nweetObject, ...prev]);
    //     });
    // };
    useEffect(() => {
        // getNweets();
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        storageservice.ref().child(`${userObj.uid}/`)
        /* await dbService.collection("nweets").add({
             text: nweet,
             createdAt: Date.now(),
             creatorId: userObj.uid,
 
         });
         setNweet("");*/
    };
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
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" />
                {fileString && (<div>
                    <img src={fileString} width="50px" height="50px" />
                    <button onClick={onClearFile}>Clear</button>
                </div>)}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>);
};
export default Home;