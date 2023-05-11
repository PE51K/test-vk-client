import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import {Navigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useStore} from "effector-react";

import styles from './Registration.module.css';
import {$isAuth, fetchRegisterFx} from '../../effector'
import {AuthResponse} from "../../interfaces";
import {FormValues} from "../../types";

export const Registration = () => {
  const isAuth = useStore($isAuth)

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
  }} = useForm<FormValues>({
      defaultValues: {
        email: '',
        password: '',
        fullName: '',
        cityName: '',
        age: undefined,
      },
      mode: 'onChange',
    })

  const onSubmit = async (values: any) => {
    try {
      const data: AuthResponse | null | undefined = await fetchRegisterFx(values);
      if (!data) {
        alert('Не удалось зарегистрироваться')
      } else if ('token' in data) {
        window.localStorage.setItem('token', data.token)
      }
    } catch (error) {
      console.error(error)
      alert('Не удалось авторизоваться')
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error = {Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', {required: 'Укажите полное имя'})}
        className={styles.field} label="Полное имя" fullWidth
        />

        <TextField
          error = {Boolean(errors.age?.message)}
          helperText={errors.age?.message}
          {...register('age', {required: 'Укажите возраст'})}
          className={styles.field} label="Возраст" fullWidth
        />

        <TextField
          error = {Boolean(errors.cityName?.message)}
          helperText={errors.cityName?.message}
          {...register('cityName', {required: 'Укажите название города'})}
          className={styles.field} label="Город" fullWidth
        />

        <TextField
          error = {Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register('email', {required: 'Укажите почту'})}
        className={styles.field} label="E-Mail" fullWidth
        />

        <TextField
          error = {Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {...register('password', {required: 'Укажите пароль'})}
        className={styles.field} label="Пароль" fullWidth
        />

        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};