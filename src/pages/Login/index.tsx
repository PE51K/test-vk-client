import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.css";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import {useStore} from 'effector-react';
import {$isAuth, fetchAuthFx} from '../../effector'
import {AuthResponse} from "../../interfaces";

export const Login = () => {
  const isAuth = useStore($isAuth)

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }} = useForm({
      defaultValues: {
        email: '',
        password: '',
      },
      mode: 'onChange',
  })

  const onSubmit = async (values: any) => {
    try {
      const data: AuthResponse | undefined = await fetchAuthFx(values)
      if (!data) {
        alert('Не удалось авторизоваться')
      } else {
        window.localStorage.setItem('token', data.token)
      }
    } catch (error) {
      console.error(error);
      alert('Не удалось авторизоваться');
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error = {Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Укажите почту'})}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error = {Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {required: 'Укажите пароль'})}
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};