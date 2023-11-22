import Head from "next/head";
import { useState } from "react";

import { doc, serverTimestamp, setDoc } from "firebase/firestore"; // for adding the Document to Collection
import { firestore } from "./utils/firebase"; // firestore instance
import SvgIcon from "@mui/material/SvgIcon";
import {
  Alert,
  Box,
  Button,
  Container,
  ListItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import React from "react";
import Link from "next/link";
import router, { Router } from "next/router";
import { DATABASES } from "./constants/databases";

const AddTodo = () => {
  const [title, setTitle] = useState<string>(""); // title
  const [description, setDescription] = useState<string>(""); // description

  const [Msg, setMsg] = useState<string>(""); // error
  const [error, setError] = useState<string>(""); // error
  const [colorType, setColorType] = useState<"error" | "success">(); // error

  //alert
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const addTodo = async () => {
    if (!title || !description) {
      // check for any null value

      return (
        setOpen(true), setMsg("Please fill all fields"), setColorType("error")
      );
    }
    // get the current timestamp
    const timestamp:string = Date.now().toString();
    const _todo = doc(firestore, `${DATABASES.TODO}/${timestamp}`);
    // structure the todo data
    const todoData = {
      title,
      description,
      done: false,
      timeStamps: serverTimestamp(),
    };
    try {
      //add the Document
      await setDoc(_todo, todoData);

      // Set success to trigger the useEffect

      setMsg("Todo added successfully");
      setColorType("success");

      setOpen(true);
      setTitle("");
      setDescription("");
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
      
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={colorType}
          sx={{ width: "100%" }}
        >
          {Msg}
        </Alert>
      </Snackbar>
      <Head>
        <title>Add todo</title>
        <meta name="description" content="" />
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
        <Typography variant="h4" gutterBottom>
          ADD YOUR TODOS
        </Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          <ListItem>
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              id="outlined-basic"
              label="Title"
              variant="outlined"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </ListItem>
          <ListItem>
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              id="outlined-basic"
              label="description"
              variant="outlined"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </ListItem>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <Button variant="contained" onClick={addTodo}>
              Submit
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                router.push("/");
              }}
              startIcon={
                <SvgIcon>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </SvgIcon>
              }
            >
              Return Home{" "}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AddTodo;
