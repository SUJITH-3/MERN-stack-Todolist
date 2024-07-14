import "./App.css"
import { useEffect, useState } from "react";
import * as React from 'react';
import Container from '@mui/material/Container';
import { Button, TextField } from "@mui/material";
import axios from "axios"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
function App() {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [items, setItems] = useState([])
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [editId, setEditId] = useState(-1)
  const [updatedTitle, setUpdatedTitle] = useState("")
  const [updatedDesc, setUpdatedDesc] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    if (title.trim() !== "" && desc.trim() !== "") {
      let data = { title: title, description: desc }
      await axios.post(`http://localhost:4000/todos`, data)
        .then((res) => {
          setItems((prev) => {
            return [...prev, { title: title, description: desc, _id: res.data._id }]
          })
          setMsg("Todo item created successfully")
          setTitle("")
          setDesc("")
          setTimeout(() => setMsg(""), 2000)
        })
        .catch((err) => {
          console.log(err)
          setErr("Unable to create")
        })
    }
  }

  const getItems = async () => {
    await axios.get(`http://localhost:4000/todos`)
      .then(res => setItems(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getItems();
  }, [])


  const handleEdit = (element) => {
    setEditId(element._id)
    setUpdatedTitle(element.title)
    setUpdatedDesc(element.description)
  }

  const handleUpdate = async () => {
    setErr("")
    if (updatedTitle.trim() !== "" && updatedDesc.trim() !== "") {
      let data = { title: updatedTitle, description: updatedDesc }
      await axios.put(`http://localhost:4000/todos/${editId}`, data)
        .then((res) => {
          let updatedTodos = items.map((list) => {
            if (list._id === editId) {
              list.title = updatedTitle
              list.description = updatedDesc
            }
            return list
          })
          setItems(updatedTodos)
          setMsg("Todo item updated successfully")
          setUpdatedTitle("")
          setUpdatedDesc("")
          setTimeout(() => { setMsg("") }, 2000)
          setEditId(-1)
        })
        .catch((err) => {
          console.log(err)
          setErr("Unable to create")
        })
    }
  }
  const handleCancel = () => {
    setEditId(-1)
  }
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/todos/${id}`)
      .then((res) => {
        const remaingItems = items.filter((item) => item._id !== id)
        setItems(remaingItems)

      })
      .catch(err => console.log(err))
  }

  return (
    <Container maxWidth="lg" sx={{ border: "2px solid black", boxShadow: " rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;", height: "100%" }} >
      <div className="title">
        <h1>Todo List</h1>
      </div>
      {msg && <p className="succ">{msg}</p>}
      <form className="inputs" onSubmit={handleSubmit}>
        <TextField id="title-input" label="Title" className="input input1" variant="outlined"
          size="small" onChange={(e) => { setTitle(e.target.value) }} value={title} />
        <TextField id="desc-input" className="input input2" label="Description" variant="outlined"
          size="small" onChange={(e) => { setDesc(e.target.value) }} value={desc} />
        <Button variant="contained" color="success" size="small" type="submit">submit</Button>
      </form>
      {err && <p className="err">{err}</p>}
      <div className="tasks">
        <div className="title">
          <h1>Tasks</h1>
        </div>
        <List >
          {items.map((element) =>
            <ListItem sx={{ position: "relative", border: "1px solid black", boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset", marginBottom: "10px", wordBreak: "break-word" }} key={element.id} >
              {editId == -1 || editId != element._id ?
                <div className="list-item">
                  <ListItemText secondary={element.title} />
                  <ListItemText primary={element.description} />
                </div> : <div className="update-field"><TextField id="title-input" label="Title" className="input input1" variant="outlined"
                  size="small" onChange={(e) => { setUpdatedTitle(e.target.value) }} value={updatedTitle} />
                  <TextField id="desc-input" className="input input2" label="Description" variant="outlined"
                    size="small" onChange={(e) => { setUpdatedDesc(e.target.value) }} value={updatedDesc} />
                </div>
              }
              {editId == -1 || editId != element._id ?
                <div className="Edit_delete">
                  <IconButton aria-label="edit" size="large" edge="end" onClick={() => handleEdit(element)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton aria-label="delete" size="large" edge="end" onClick={() => handleDelete(element._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
                :
                <div className="flex-icon">
                  <IconButton aria-label="update" size="large" edge="end" onClick={handleUpdate}>
                    <TaskAltIcon color="success" />
                  </IconButton>
                  <IconButton aria-label="cancel" size="large" edge="end" onClick={handleCancel}>
                    <CancelOutlinedIcon color="error" />
                  </IconButton>
                </div>
              }
            </ListItem>
          )}
        </List>
      </div >
    </Container >

  )
}


export default App;
