import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import {
  $authData,
  $isAuth,
  $posts,
  $postsFetchingStatus,
  fetchAuthMeFx,
  fetchUserPostsFx
} from "../effector";
import {useStore} from "effector-react";
import {useParams} from "react-router-dom";
import axios from "../axios";
import {UserInfoBlock} from "../components";

export const UserPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = React.useState()
  const [isUserDataLoading, setIsUserDataLoading] = React.useState(true)
  const [isCurrentUser, setIsCurrentUser] = React.useState(false)

  const posts = useStore($posts);
  const postsFetchingStatus = useStore($postsFetchingStatus)
  const isPostsLoading = postsFetchingStatus.fetchPosts === 'loading'

  const _id = useStore($authData)?._id;
  const isAuth = useStore($isAuth)

  React.useEffect(() => {
    axios.get(`/users/${id}`)
      .then(res => {
        setUserData(res.data)
        setIsUserDataLoading(false)
      })
      .catch(err => {
        console.warn(err)
        alert('Ошибка при получении данных пользователя')
      })
    fetchAuthMeFx().finally();
    // @ts-ignore
    fetchUserPostsFx(id).finally();
  }, [id, _id]);

  React.useEffect(() => {
    setIsCurrentUser(id === _id)
  }, [id, _id]);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Посты" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} id={undefined} title={undefined} createdAt={undefined}
                    imageUrl={undefined} user={undefined} viewsCount={undefined} likes={undefined}
                    children={undefined} isFullPost={undefined} isEditable={undefined} userId={undefined}
                    isAuth={undefined}/>
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `https://test-vk-server.onrender.com${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                likes={obj.likes}
                userId={_id}
                isAuth={isAuth}
                isEditable={_id === obj.user._id} children={undefined} isFullPost={undefined}
                isLoading={undefined}                    />
            ))}
        </Grid>
        <Grid xs={4} item>
          <UserInfoBlock userData={userData} isLoading={isUserDataLoading} isCurrentUser={isCurrentUser} isAuth={isAuth} CurrentUserId={_id}/>
        </Grid>
      </Grid>
    </>
  );
};