import type { NextPage } from "next";
import Head from "next/head";
import LoadingButton from '@mui/lab/LoadingButton';
import styles from "../styles/Home.module.css";
import { firestore } from "./constants/firebase";
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
import { doc, orderBy } from "firebase/firestore";
import { deleteDoc } from "@firebase/firestore";

import { setDoc } from "firebase/firestore"; // for adding the Document to Collection


import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Icon,
  ListItem,
  ListItemText,
  Paper,
  SnackbarOrigin,
  Stack,
  ThemeProvider,
  createSvgIcon,
  styled,
} from "@mui/material";
import * as React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { timeStamp } from "console";
import moment from "moment";
import { text } from "stream/consumers";
import { get } from "http";

//mui

const Items = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
interface State extends SnackbarOrigin {
  open: boolean;
}


//home

const Home: NextPage = () => {
  const todosCollection = collection(firestore, "todos");
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [ctodos, completed] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message,setMessage] = useState<string>("");// message

  //mui buttons
  

 
  useEffect(() => {
    // get the todos

    getTodos();

    
    // reset loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const getTodosCompleted = async () => {
    
    
    
    // construct a query to get up to 10 undone todos
    const todosQuery = query(
      todosCollection,
      where("done", "==", true),
      limit(10)
    );
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



  const getTodos = async () => {
    // construct a query to get up to 10 undone todos
    const todosQuery = query(
      todosCollection,
      where("done", "==", false),
      limit(10)
    );
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

  const updateTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `todos/${documentId}`);
    // update the doc by setting done to true
    updateDoc(_todo, {
      done:true,
    });
   
    getTodos();
   
    // retrieve todos
   
   
   //update alert
  alert("Successfully Updated");
  };

  const deleteTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `todos/${documentId}`);
    // delete the doc
    await deleteDoc(_todo);

    // retrieve todos
    getTodos();
    //delete alert
   alert("Successfully Deleted");
  };

  return (
    
    <Container sx={{  minHeight:"100vh",background: "" }}>
      <title>Todos app</title>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          maxWidth: "30%",
          margin: "auto", // Center the container horizontally
          marginTop: "5%", // Add margin top for the vertical spacing
        }}
      >
        <Stack marginTop="2" direction="column" spacing={1}>
          <h2 id="add-todo">Add your Todos</h2>{" "}
          
          <a href="/add-todo">
            <Button variant="contained" endIcon={<PlusIcon />}>
              Here
            </Button>
          </a>
          <h6><b>Todos Remaining {todos.length}</b></h6>
        </Stack>
      </Box>
      
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
            <LoadingButton loading size="large" >
        
            </LoadingButton>
          </Box>
        ) : (
          todos.map((todo, index) => {
            return (
              <Box     sx={{display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom:"1%",
          }}  key={index}>
            
                {" "}
                <ListItem
                  sx={{ mt: 5, boxShadow: 5 }}
                  style={{ backgroundColor: "ash", width: "50%" }}
                >
                  
                  {" "}
                  <Checkbox onClick={() => updateTodo(todo.id)}></Checkbox>
                
                  <ListItemText
                    primary={todo.data().title}
                    secondary={todo.data().description}
                  ></ListItemText>
                  
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </Button>

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
          position:'fixed',
       
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
