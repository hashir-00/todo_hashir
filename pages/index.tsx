import type { NextPage } from "next";
import LoadingButton from "@mui/lab/LoadingButton";
import { firestore, todosCollection } from "./constants/firebase";
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  limit,
  getDocs,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { updateDoc } from "@firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { deleteDoc } from "@firebase/firestore";

import {
  Box,
  Button,
  Checkbox,
  Container,
  Link,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  SnackbarOrigin,
  Stack,
  TextField,
  Typography,
  createSvgIcon,
  styled,
} from "@mui/material";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import router, { Router, useRouter } from "next/router";


//mui

const PlusIcon = createSvgIcon(
  // credit: plus icon from https://heroicons.com/
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>,
  "Plus"
);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//home

const Home: NextPage = () => {
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [did, setDid] = useState<boolean>(false); //edit state

  const [msg, setMsg] = useState<string>(""); // error
  const [loading, setLoading] = useState<boolean>(true);

  //alert
  const [open, setOpen] = React.useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    // get the todos

    getTodos();

    // reset loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getTodos = async () => {
    // construct a query to get up to 10 undone todos

    const todosQuery = query(
      todosCollection,
      where("done", "==", false),
      
    );
    // get the todos
    const querySnapshot = await getDocs(todosQuery);

    // map through todos adding them to an array
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    // set it to state
    await setTodos(result);
  };

  const updateTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `todos/${documentId}`);
    // update the doc by setting done to true
    await updateDoc(_todo, {
      done: true,
    });
    setMsg("Todo marked as done");
    setOpen(true);
    await getTodos();

    // retrieve todos

    //update alert
  };
  const deleteTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `todos/${documentId}`);
    // delete the doc
    await deleteDoc(_todo);
    setOpen(true);
    setMsg("Todo deleted");
    // retrieve todos
    await getTodos();
    //delete alert
  };

  return (
    <Container sx={{ minHeight: "100vh", background: "" }}>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
      <title>Todos app</title>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: "background.paper",
          boxShadow: 4,
          borderRadius: 5,
          paddingTop: "1%",
          
          width: "50%",
          margin: "auto", // Center the container horizontally
          marginTop: "5%", // Add margin top for the vertical spacing
        }}
      >
        <Stack direction="row" spacing={1}>
          <Typography variant="h6" gutterBottom>
            ADD
          </Typography>
          <Typography variant="h6" gutterBottom>
            YOUR
          </Typography>
          <Typography variant="h6" gutterBottom>
            TODOS
          </Typography>

            <Button
              sx={{ borderRadius: 3 }}
              variant="contained"
              endIcon={<PlusIcon sx={{ color: "black" }} />}
              onClick={() => {router.push("/addTodo")}}
           >
              Here
            </Button>
        
        </Stack>
        <Typography mt="10px" variant="subtitle2" gutterBottom color={"red"}>
          Todos Remaining {todos.length}
        </Typography>
      </Box>
      {did && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "5%",
          }}
        >
          <TextField label="title"></TextField>
          <TextField label="description"></TextField>
          <Button variant="contained"> Update</Button>
        </Box>
      )}

      <Box
        sx={{
          alignItems: "center",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              p: 1,
            }}
          >
            {" "}
            <LoadingButton loading size="large"></LoadingButton>
          </Box>
        ) : (
          todos.map((todo) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1%",
                }}
                key={todo.id}
              >
                {" "}
                <ListItem
                  sx={{
                    mt: 3,
                    boxShadow: 5,
                    borderRadius: 3,
                    backgroundColor: "ash",
                    width: "50%",
                  }}
                >
                  {" "}
                  <Checkbox onClick={() => updateTodo(todo.id)}></Checkbox>
                  <ListItemText
                    primary={todo.data().title}
                    secondary={todo.data().description}
                  ></ListItemText>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        setDid(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Stack>
                </ListItem>
              </Box>
            );
          })
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bottom: 0,
          left: 0,
          right: 0,
          position: "fixed",

          borderRadius: 2,

          p: 2,
        }}
      >
        <footer>
          <a href="#" rel="noopener noreferrer">
            Todos app
          </a>
        </footer>
      </Box>
    </Container>
  );
};
export default Home;
