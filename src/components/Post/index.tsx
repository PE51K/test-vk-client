import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';

import styles from './Post.module.css';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import {Link} from "react-router-dom";
import {fetchLikePostFx, fetchRemovePostFx, fetchUnlikePostFx} from "../../effector";
import {FavoriteBorderOutlined, FavoriteOutlined, MonitorHeart} from "@mui/icons-material";

export const Post = ({
  // @ts-ignore
  id,// @ts-ignore
  title, // @ts-ignore
  createdAt, // @ts-ignore
  imageUrl,// @ts-ignore
  user,// @ts-ignore
  viewsCount,// @ts-ignore


  likes,// @ts-ignore
  userId,// @ts-ignore
  isAuth, // @ts-ignore

  children,// @ts-ignore
  isFullPost,// @ts-ignore
  isLoading,// @ts-ignore
  isEditable,// @ts-ignore
}) => {
  const [likesCount, setLikesCount] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    if (likes) {
      setLikesCount(likes.length);
      setIsLiked(likes.includes(userId));
    }
    console.log(userId)
    console.log(likes)
    console.log(isLiked)
  }, [likes]);

  const onClickLike = () => {
    if(isAuth) {
      if (!isLiked) {
        // @ts-ignore
        fetchLikePostFx({postId: id, userId: userId}).finally()
        setIsLiked(!isLiked)
      } else {
        // @ts-ignore
        fetchUnlikePostFx({postId: id, userId: userId}).finally()
        setIsLiked(!isLiked)
      }
    }
  }

  const onClickRemove = () => {
    if (window.confirm('Удалить пост?')) {
      fetchRemovePostFx(id).finally()
    }
  }

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} userId={user._id}/>
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              {isLiked ? (
                <FavoriteOutlined onClick={onClickLike}/>
              ) : (
                <FavoriteBorderOutlined onClick={onClickLike} />
              )}
              <span>{likesCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
