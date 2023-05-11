import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {useStore} from "effector-react";
import {useNavigate, Navigate, useParams} from "react-router-dom";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.css';
import axios from "../../axios";
import {$isAuth} from "../../effector";
import {SMDEOptions} from "../../interfaces";

export const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuth = useStore($isAuth)
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const isEditing = Boolean(id)

  const handleChangeFile = async (event: any) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке изображения')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value: any) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const { data } = isEditing ? await axios.patch(`/posts/${id}`, {
        title,
        text,
        imageUrl
      }) : await axios.post('/posts', {
        title,
        text,
        imageUrl
      })
      const _id = isEditing ? id : data._id
      navigate(`/posts/${_id}`)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при опубликовании статьи')
    }
  }

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
        .then(res => {
          setTitle(res.data.title)
          setText(res.data.text)
          setImageUrl(res.data.imageUrl)
        })
        .catch((err) => {
          console.warn(err)
          alert('Ошибка при получении статьи')
        })
    }
  }, [])

  const options: SMDEOptions = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );


  const handleClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  if(!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={handleClick} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:5000${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value = {title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options as any}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};