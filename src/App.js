import React from "react";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import NotesList from "./component/NotesList";
import Search from "./component/Search";
import Header from "./component/Header";
import axios from "axios";

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: nanoid(),
      text: "This is my first note!",
      date: "15/04/2021",
    },
  ]);

  const getNotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get");
      const notes = response.data;
      setNotes(notes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getNotes();
  }, []);

  const addNote = async (text) => {
	console.log("here inside addNote");

    try {
      const response = await axios.post("http://localhost:5000/post", {
        id: nanoid(),
        text: text,
        date: new Date().toLocaleDateString(),
      });
      const note = response.data;
      setNotes([...notes, note]);

    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete?id=${id}`);
      const newNotes = notes.filter((note) => note.id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${darkMode && "dark-mode"}`}>
      <div className="container">
        <Header handleToggleDarkMode={setDarkMode} />
        <Search handleSearchNote={setSearchText} />
        <NotesList
          notes={notes.filter(note => note.text && note.text.includes(searchText))}
          handleAddNote={addNote}
          handleDeleteNote={deleteNote}
        />
      </div>
    </div>
  );
};

export default App;
