import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, storageservice } from "fbase";
import React, { useEffect, useState } from "react";
const Home = ({ userObj }) => {
    
    const [nweets, setNweets] = useState([]);
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



    return (
        <div>
            <NweetFactory userObj={userObj} />
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>);
};
export default Home;