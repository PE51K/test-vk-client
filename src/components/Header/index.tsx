import React from 'react';
import Button from '@mui/material/Button';

import styles from './Header.module.css';
import Container from '@mui/material/Container';
import {Link} from "react-router-dom";
import {$authData, $isAuth, logoutFx} from "../../effector";
import {useStore} from "effector-react";

export const Header = () => {
  const isAuth = useStore($isAuth)
  const authDataId = useStore($authData)?._id

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      logoutFx(undefined).finally();
      window.localStorage.removeItem('token')
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Добавить пост</Button>
                </Link>
                <Link to={`/users/${authDataId}`}>
                  <Button variant="contained">Моя страница</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
