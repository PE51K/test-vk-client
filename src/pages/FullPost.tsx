import React from "react";
import {useParams} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {useStore} from "effector-react";

import {$isAuth, $postsFetchingStatus} from "../effector";
import {Post} from "../components";
import axios from "../axios";
import {FullPostProps} from "../interfaces";

export const FullPost = () => {
    const isAuth = useStore($isAuth)
    const [data, setData] = React.useState<FullPostProps | undefined>(undefined)
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

    if (isLoading || !data) {
        return <Post isLoading={isLoading}
                     id={undefined}
                     title={undefined}
                     createdAt={undefined}
                     imageUrl={undefined}
                     user={undefined}
                     viewsCount={undefined}
                     likes={undefined}
                     children={undefined}
                     isFullPost={undefined}
                     isEditable={undefined}
                     isAuth={undefined}
                     currentUserId={undefined}
        />
    }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `https://test-vk-server.onrender.com${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        likes={data.likes}
        currentUserId={data.user._id}
        isAuth={isAuth}
        isFullPost={true}
        isLoading={false}
        isEditable={false}
      >
          <ReactMarkdown children={data.text}/>
      </Post>
    </>
    );
};
