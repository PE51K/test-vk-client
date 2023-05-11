import React from 'react';
import {Link} from "react-router-dom";

import styles from './UserInfo.module.css';
import {UserInfoProps} from "../../interfaces";

export const UserInfo = ({
    _id,
    avatarUrl,
    fullName,
    additionalText,
  } : UserInfoProps) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <Link to={`/users/${_id}`}>
          <span className={styles.userName}>{fullName}</span>
        </Link>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
