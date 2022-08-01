import Nweet from "components/Nweet";
import { dbService, storageservice } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [fileString, setFileString] = useState("");
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
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>);
};
export default Home;