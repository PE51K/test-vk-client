import React from 'react';
import styles from './UserInfo.module.css';
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";


export const UserInfo = ({
    // @ts-ignore
    avatarUrl, // @ts-ignore
    fullName, // @ts-ignore
    additionalText, //@ts-ignore
    userId
  }) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <Link to={`/users/${userId}`}>
          <span className={styles.userName}>{fullName}</span>
        </Link>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
