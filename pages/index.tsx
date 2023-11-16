import type { NextPage } from "next";
import Head from "next/head";
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
import { doc } from "firebase/firestore";
import { deleteDoc } from "@firebase/firestore";

import { setDoc } from "firebase/firestore"; // for adding the Document to Collection

const Home: NextPage = () => {
  const todosCollection = collection(firestore, "todos");
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
 
  

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
    await updateDoc(_todo, {
      done: true,
    });
    // retrieve todos
    getTodos();
    //update alert
    alert("Todo updated successfully");
  };

 

  const deleteTodo = async (documentId: string) => {
    // create a pointer to the Document id
    const _todo = doc(firestore, `todos/${documentId}`);
    // delete the doc
    await deleteDoc(_todo);
    
   

    // retrieve todos
    getTodos();
    //delete alert
    alert("Todo deleted successfully");
  
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Todos app</title>
        <meta name="description" content="Next.js firebase todos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Todos app</h1>
        <div className={styles.grid}>
        <div className={styles.card}>
           
              <h2 id="add-todo">
                Add your Todos  <button><a href="/add-todo">here</a></button>
              </h2>
            </div>
          {
            
          loading ? (
            <div className={styles.card}>
              <h2>Loading</h2>
            </div>
          ) : (
            todos.map((todo, index) => {
              return (
                <div className={styles.card} key={index}>
                  <h1>{todo.data().title}</h1>
                  <p>{todo.data().description}</p>
                  <div className={styles.cardActions}>
                    <button type="button" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                    <button type="button" onClick={() => updateTodo(todo.id)}>
                      Mark as done
                    </button>
                    
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Todos app
        </a>
      </footer>
    </div>
  );
};
export default Home;
function setDescription(value: string): void {
  throw new Error("Function not implemented.");
}

