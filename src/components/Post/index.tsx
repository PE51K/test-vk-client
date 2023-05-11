import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import {FavoriteBorderOutlined, FavoriteOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";

import styles from './Post.module.css';
import {UserInfo} from '../UserInfo';
import {PostSkeleton} from './Skeleton';
import {fetchLikePostFx, fetchRemovePostFx, fetchUnlikePostFx} from "../../effector";
import {PostProps} from "../../interfaces";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  viewsCount,
  likes,
  children,
  isFullPost,
  isLoading,
  isEditable,
  user,
  isAuth,
  currentUserId
  }: PostProps) => {
  const [likesCount, setLikesCount] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    if (likes && currentUserId) {
      setLikesCount(likes.length);
      setIsLiked(likes.includes(currentUserId));
    }
  }, [likes]);

  const onClickLike = () => {
    if(isAuth) {
      if (!isLiked && id && currentUserId) {
        fetchLikePostFx({ postId: id, userId: currentUserId }).finally();
        setIsLiked(!isLiked)
      } else if (isLiked && id && currentUserId) {
        fetchUnlikePostFx({ postId: id, userId: currentUserId }).finally();
        setIsLiked(!isLiked)
      }
    }
  }

  const onClickRemove = () => {
    if (window.confirm('Удалить пост?')) {
      if (id) fetchRemovePostFx(id).finally()
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
        <UserInfo {...user} additionalText={createdAt}/>
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
