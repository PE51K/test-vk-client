import React, {useState} from 'react';
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
  fetchFriendsPostsFx,
  fetchPostsFx
} from "../effector";
import {useStore} from "effector-react";

export const Home = () => {
    const isAuth = useStore($isAuth)
    const posts = useStore($posts);
    const userData = useStore($authData);
    const postsFetchingStatus = useStore($postsFetchingStatus)
    const isPostsLoading = postsFetchingStatus.fetchPosts === 'loading'

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
      setSelectedTab(newValue);
    };

    React.useEffect(() => {
      fetchAuthMeFx().finally();
      if (selectedTab === 0) {
        fetchPostsFx().finally();
      } else {
        fetchFriendsPostsFx().finally();
      }
    }, [selectedTab]);

    return (
        <>
          <Tabs
            style={{ marginBottom: 15 }}
            value={selectedTab}
            aria-label="basic tabs example"
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { backgroundColor: 'blue' } }}
          >
            <Tab label="Все посты" />
            {isAuth && <Tab label="Посты друзей" />}
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
                      userId={userData?._id}
                      isAuth={isAuth}
                      isEditable={userData?._id === obj.user._id} children={undefined} isFullPost={undefined}
                      isLoading={undefined}                    />
              ))}
            </Grid>
          </Grid>
        </>
  );
};
