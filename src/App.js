import React, { Component } from "react";
import Header from "./Header.js";
import NotesList from "./NotesList.js";

/* This container component manages all of the state 
for this application, delegating rendering logic to 
presentational components. */
class App extends Component {
  state = {
    notes: [
      {
        id: Date.now(),
        title: "",
        description: "",
        doesMatchSearch: true,
      },
    ],
    searchText: "",
  };
  addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true,
    };
    const newNotes = [newNote, ...this.state.notes];
    this.setState({ notes: newNotes });
  };

  onType = (editMeId, updatedKey, updatedValue) => {
    // editMeId == id of the note that is edited
    // updatedKey == title or description field
    // updatedValue == value of title or description
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id !== editMeId) {
        return note;
      } else {
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });
    this.setState({ notes: updatedNotes });
  };

  onSearch = (text) => {
    /* toggle the doesMatchSearch boolean value of each sticky
    note when the user types in the search field.
    set the doesMatchSearch value to true for a sticky note if
    it's title or description matches the search string. */
    const newSearchText = text.toLowerCase();
    const updatedNotes = this.state.notes.map((note) => {
      if (!newSearchText) {
        /* If the search field is empty, then
      we set the doesMatchSearch value for every note to true. */
        note.doesMatchSearch = true;
        return note;
      } else {
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch;
        return note;
      }
    });
    this.setState({
      searchText: newSearchText,
      notes: updatedNotes,
    });
  };

  removeNote = (noteId) => {
    const updatedNotes = this.state.notes.filter((note) => note.id !== noteId);
    this.setState({ notes: updatedNotes });
  };

  componentDidUpdate() {
    const stringifiedNotes = JSON.stringify(this.state.notes);
    localStorage.setItem("savedNotes", stringifiedNotes);
  }

  componentDidMount() {
    const stringifedNotes = localStorage.getItem("savednotes");
    if (stringifedNotes) {
      const saveNotes = JSON.parse(stringifedNotes);
      this.setStaate({ notes: savedNotes });
    }
  }

  render() {
    return (
      <div>
        <Header
          searchText={this.state.searchText}
          addNote={this.addNote}
          onSearch={this.onSearch}
        />
        <NotesList
          removeNote={this.removeNote}
          onType={this.onType}
          notes={this.state.notes}
        />
      </div>
    );
  }
}

export default App;
