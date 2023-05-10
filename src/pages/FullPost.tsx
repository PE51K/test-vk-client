import React from "react";

import { Post } from "../components/Post";
import {useParams} from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import {useStore} from "effector-react";
import {$isAuth, $postsFetchingStatus} from "../effector";

export const FullPost = () => {
    const isAuth = useStore($isAuth)
    const [data, setData] = React.useState()
    const [isLoading, setLoading] = React.useState(true)
    const {id} = useParams()
    const postsFetchingStatus = useStore($postsFetchingStatus)

    React.useEffect(() => {
        axios.get(`/posts/${id}`)
            .then(res => {
                setData(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.warn(err)
                alert('Ошибка при получении статьи')
            })
    }, [postsFetchingStatus])

    if (isLoading) {
        return <Post isLoading={isLoading} id={undefined} title={undefined} createdAt={undefined} imageUrl={undefined}
                     user={undefined} viewsCount={undefined} likes={undefined} children={undefined}
                     isFullPost={undefined} isEditable={undefined} userId={undefined} isAuth={undefined}/>
    }

  return (
    <>
      <Post
        // @ts-ignore
        id = {data._id}
        // @ts-ignore
        title = {data.title}
        // @ts-ignore
        imageUrl= {data.imageUrl?`https://test-vk-server.onrender.com${data.imageUrl}`:''}
        // @ts-ignore
        user = {data.user}
        // @ts-ignore
        createdAt={data.createdAt}
        // @ts-ignore
        viewsCount={data.viewsCount}
        // @ts-ignore
        likes={data.likes}
        // @ts-ignore
        userId={data.user._id}
        // @ts-ignore
        isAuth={isAuth}
        // @ts-ignore
        tags={data.tags}
        isFullPost
      >
          <ReactMarkdown // @ts-ignore
          children={data.text}/>
      </Post>
    </>
    );
};
