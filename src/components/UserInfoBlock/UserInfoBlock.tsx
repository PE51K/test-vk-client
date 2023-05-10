import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { SideBlock } from "../SideBlock";
import styles from "../UserInfo/UserInfo.module.css";
import Button from "@mui/material/Button";
import axios from "../../axios";


export const UserInfoBlock = ({   // @ts-ignore
                                userData, isLoading, isCurrentUser, isAuth, CurrentUserId }) => {
  const [isFriend, setIsFriend] = React.useState(false);

  const onClickAddFriends = () => {
    axios.post(`/users/${userData._id}/friends`)
      .then(() => {
        userData.friends.push(CurrentUserId)
        setIsFriend(true)
      })
      .catch(err => {
        console.warn(err)
        alert('Ошибка при добавлении в друзья')
      })
  }

  const onClickRemoveFriends = () => {
    axios.delete(`/users/${userData._id}/friends`)
      .then(() => {
        userData.friends = userData.friends.filter((id: any) => id !== CurrentUserId)
        setIsFriend(false)
      })
      .catch(err => {
        console.warn(err)
        alert('Ошибка при удалении из друзей')
      })
  }

  React.useEffect(() => {
    setIsFriend(userData?.friends.includes(CurrentUserId))
  })


  return (
    <SideBlock title="Информация">
      {isLoading ? <Skeleton width={100} /> : (
        <div>
          <img className={styles.avatar} src={userData.avatarUrl || '/noavatar.png'} alt={''} />
          <p>Full Name: {userData.fullName}</p>
          <p>Age: {userData.age}</p>
          <p>City Name: {userData.cityName}</p>
          {isCurrentUser || !isAuth ? (
            <></>
          ) : isFriend ? (
            <Button onClick={onClickRemoveFriends} variant="contained" color="error">
              Удалить из друзей
            </Button>
          ) : (
            <Button onClick={onClickAddFriends} variant="contained" color="success">
              Добавить в друзья
            </Button>
          )}
        </div>
      )}
    </SideBlock>
  );
};
