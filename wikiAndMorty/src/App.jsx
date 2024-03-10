import React, { useEffect, useState } from "react";
import './App.css'
import Character from './components/Characters'
import Loader from "./components/Loader";
import { getCharacters } from "./utils/api";
import { supabase } from "./utils/client";

function App() {
  const [characters, setCharacters] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({ title: "", content: ""});
  const [title, setTitle] = useState("CHARACTERS"); // Estado para el título

  useEffect(() => {
    getCharacters()
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (characters !== null) {
      fetchPosts();
    }
  }, [characters]);

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select();
    setPosts(data);
    console.log("data: ", data);
  }

  async function createPost() {
    try {
      await supabase
        .from('posts')
        .insert([
          { title: post.title, content: post.content }
        ])
        .single();
      setPost({ title: "", content: ""});
      fetchPosts();
    } catch (error) {
      console.error("Error de autorización al crear un nuevo post:", error);
      // Agrega tu lógica de manejo de errores aquí, como mostrar un mensaje de error al usuario.
    }
  }

  // Función para cambiar el título según el clic en los spans
  function changeTitle(newTitle) {
    setTitle(newTitle);
  }

  return (
    <main>
      <div className="userAccess">
        <button className="userBtn" onClick={createPost}>Sign In </button>
        <button className="userBtn" onClick={createPost}>Register</button>
        <span> soon... </span>
      </div>
      <h1 className="page-title">WICKY AND MORTY</h1>
      <div className="menu">
        <span className="click" onClick={() => changeTitle("LOCATIONS (soon...)")}>Locations</span>
        <span className="click" onClick={() => changeTitle("CHARACTERS")}>Characters</span>
        <span className="click" onClick={() => changeTitle("EPISODES (soon...)")}>Episodes</span>
      </div>
      <h2>{title}</h2> {/* Utiliza el estado title para mostrar el título dinámico */}
      <div className="form">
        <p>Insert your comment here</p>
        <input placeholder="Title" value={post.title} onChange={e => setPost({ ...post, title: e.target.value })} />
        <input placeholder="Content" value={post.content} onChange={e => setPost({ ...post, content: e.target.value })} />
        <button onClick={createPost}>Create Post</button>
        {
          posts.map(post => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))
        }
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error" dangerouslySetInnerHTML={{ __html: error }} />
      ) : (
        <Character characters={characters} />
      )}
    </main>
  )
}

export default App;
