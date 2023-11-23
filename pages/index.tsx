import type { NextPage } from "next";
import LoadingButton from "@mui/lab/LoadingButton";
import { firestore, todosCollection } from "./utils/firebase";
import {
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { updateDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";
import { deleteDoc } from "@firebase/firestore";

import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import router from "next/router";
import { DATABASES } from "./constants/databases";
import { Alert, PlusIcon, TextareaAutosize } from "../styles/style";
//mui

//home

const Home: NextPage = () => {
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]); //todos mapping
  const [did, setDid] = useState<boolean>(false); //edit conditional render of edit textfields
  const [title, setTitle] = useState<string>(""); // title
  const [description, setDescription] = useState<string>(""); // description
  const [todoID, setTodoID] = useState<string>(""); // todoID
  const [boxColor, setBoxColor] = useState<string>(""); //box color
  const [colorType, setColorType] = useState<"error" | "success">(); //snackbar color
  const [msg, setMsg] = useState<string>(""); //snackbar message
  const [loading, setLoading] = useState<boolean>(true);
  const [disable, setDisable] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false); //alert

  //loading the items
  useEffect(() => {
    // get the todos

    getTodos();

    // reset loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  //alert related
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //edit todo
  const editTodo = async (documentId: string) => {
    //if empty throw an alert
    if (!title || !description) {
      return (
        setColorType("error"), setMsg("Please fill all fields"), setOpen(true)
      );
    }

    const _todo = doc(firestore, `${DATABASES.TODO}/${documentId}`);
    // update the doc by updating the fields
    updateDoc(_todo, {
      title: title,
      description: description,
    });
    //set alert color and message
    setColorType("success");
    setMsg("Todo Updated");
    setDisable(false);
    setBoxColor(""), setOpen(true);
    setDid(false);

    await getTodos();
    //reset the fields
    setTitle("");
    setDescription("");
  };

  //cancel edit
  const cancelEdit = () => {
    setMsg("Todo not updated"),
      setColorType("success"),
      setDisable(false),
      setTitle(""),
      setDescription(""),
      setOpen(true),
      setDid(false);
  };

  //get the todos
  const getTodos = async () => {
    // construct a query to get the undone todos

    const todosQuery = query(todosCollection, where("done", "==", false));
    // get the todos
    const querySnapshot = await getDocs(todosQuery);

    // map through todos adding them to an array
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });

    // set it to state
    setTodos(result);
  };

  //update todo
  const updateTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `${DATABASES.TODO}/${documentId}`);
    // update the doc by setting done to true
    await updateDoc(_todo, {
      done: true,
    });
    setMsg("Todo marked as done");
    setOpen(true);
    await getTodos();
  };

  //delete todo
  const deleteTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `${DATABASES.TODO}/${documentId}`); // delete the doc
    await deleteDoc(_todo);
    setOpen(true);
    setMsg("Todo deleted");
    // retrieve todos
    await getTodos();
    //delete alert
  };
  //change todo box color

  return (
    <Container sx={{ minHeight: "100vh" }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={colorType}>
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
            onClick={() => {
              router.push("/addTodo");
            }}
          >
            Here
          </Button>
        </Stack>
        <Typography mt="10px" variant="subtitle2" gutterBottom color={"red"}>
          Todos Remaining {todos.length}
        </Typography>
      </Box>
      {did && (
        <Box>
          <Stack
            direction="column"
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "5%",
            }}
          >
            <TextField
              label="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></TextField>
            <TextareaAutosize
              minRows={3}
              aria-label="empty textarea"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></TextareaAutosize>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1%",
            }}
          >
            <Button variant="contained" onClick={() => editTodo(todoID)}>
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => cancelEdit()}
            >
              cancel
            </Button>
          </Stack>
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
            <LoadingButton loading size="large"></LoadingButton>
          </Box>
        ) : (
          todos.map((todo) => {
            return (
              <Grid //container
                container
                spacing="2"
                sx={{
                  alignItems: "center",
                  justifyContent: "center",

                  p: 1,
                  margin: 2,
                  boxShadow: 5,
                  borderRadius: 3,
                }}
                key={todo.id}
              >
                <Grid //checkbox
                  item
                  xs={2}
                  md={2}
                >
                  <Checkbox
                    disabled={disable}
                    onClick={() => updateTodo(todo.id)}
                  ></Checkbox>
                </Grid>

                <Grid //data
                  item
                  xs={2}
                  md={2}
                >
                  <ListItemText
                    primary={todo.data().title}
                   
                    secondary={todo.data().description}
                  ></ListItemText>
                </Grid>

                <Grid //buttons
                  item
                  xs={2}
                  md={2}
                >
                  <Button
                    disabled={disable}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item xs={2} md={2}>
                  <Button
                    disabled={disable}
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setDid(true), setTodoID(todo.id), setDisable(true);
                    }}
                  >
                    Edit
                  </Button>
                </Grid>
              </Grid>
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
