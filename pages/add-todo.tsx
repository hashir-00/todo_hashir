import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { doc } from "@firebase/firestore"; // for creating a pointer to our Document
import { setDoc } from "firebase/firestore"; // for adding the Document to Collection
import { firestore } from "./constants/firebase"; // firestore instance
import SvgIcon from "@mui/material/SvgIcon";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  ListItem,
  ListItemText,
  Snackbar,
  SnackbarOrigin,
  TextField,
} from "@mui/material";


import { useRouter } from 'next/router';
import React from "react";

interface State extends SnackbarOrigin {
  open: boolean;
}


const AddTodo: NextPage = () => {
  const [title, setTitle] = useState<string>(""); // title
  const [description, setDescription] = useState<string>(""); // description

  const [error, setError] = useState<string>(""); // error

  const [message, setMessage] = useState<string>(""); // message
  const router = useRouter();

  const addTodo = async () => {
    if (!title || !description) {
      // check for any null value
      return alert("All fields are required");
    }
    // get the current timestamp
    const timestamp: string = Date.now().toString();
    // create a pointer to our Document
    const _todo = doc(firestore, `todos/${timestamp}`);
  
    // structure the todo data
    const todoData = {
      title,
      description,
      done: false,
      timestamp,
    };
    try {
      //add the Document
      await setDoc(_todo, todoData);

      //alert the message
      alert("Successfully Added");
    
  
     
      //reset fields
      
      // Force refresh the page
      router.reload();
     
    } catch (error) {
      //show an error message
      setError("An error occurred while adding todo");
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
     // avoid default behaviour
     
  };

  return (
    <Container>
      <Head>
        <title>Add todo</title>
        <meta name="description" content="Next.js firebase todos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Add todo</h1>
      </Box>

      <form onSubmit={handleSubmit}>
        <ListItem>
          {" "}
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            id="outlined-basic"
            label="Title"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
          />
        </ListItem>
        <ListItem>
          {" "}
          <TextField
            sx={{ mt: 1 }}
            fullWidth
            id="outlined-basic"
            label="description"
            variant="outlined"
            onChange={(e) => setDescription(e.target.value)}
          />{" "}
        </ListItem>
        <Box sx={{  display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center", 
          gap:3}}>
          <Button variant="contained" onClick={addTodo}>
            Submit 
          </Button>

          
          
      

          <a href="/">
            <Button
              variant="contained"
              startIcon={
                <SvgIcon>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </SvgIcon>
              }
            >
              Return Home{" "}
            </Button>{" "}
          </a>
        </Box>/
      
      </form>
    </Container>
  );
};


export default AddTodo;
