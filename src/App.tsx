import React from "react";
import {Route, Routes} from "react-router-dom";
import Container from "@mui/material/Container";

import {Header} from "./components";
import {Home, FullPost, Registration, AddPost, Login, UserPage} from "./pages";
import {fetchAuthMeFx} from "./effector";

function App() {
    React.useEffect(() => {
      fetchAuthMeFx().finally()
    }, [])

    return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/posts/:id"} element={<FullPost/>}/>
            <Route path={"/posts/:id/edit"} element={<AddPost/>}/>
            <Route path={"/add-post"} element={<AddPost/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/register"} element={<Registration/>}/>
            <Route path={"/users/:id"} element={<UserPage/>}/>
        </Routes>
      </Container>
    </>
    );
}

export default App;
