const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'tasks.json');


const readData = () => {
   if (!fs.existsSync(dataPath)) return { users: [] };
   const jsonData = fs.readFileSync(dataPath);
   return JSON.parse(jsonData);
};

const writeData = (data) => {
   fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};




app.get('/getTasks', (req, res) => {
   const data = readData();
   res.json(data.users);
});


app.post('/saveTask', (req, res) => {
   const data = readData();
   data.users.push(req.body);
   writeData(data);
   res.status(201).send(req.body);
});

app.put('/updateTask', (req, res) => {
   const data = readData();
   const index = data.users.findIndex(task => task.id === req.body.id);
   
   if (index !== -1) {
       data.users[index] = req.body; 
       writeData(data);
       res.send(req.body);
   } else {
       res.status(404).send({ message: "Task not found" });
   }
});


app.delete('/deleteTask/:id', (req, res) => {
   const data = readData();
   
   const filteredUsers = data.users.filter(task => task.id !== parseInt(req.params.id));
   
   if (filteredUsers.length !== data.users.length) {
       writeData({ users: filteredUsers });
       res.status(204).send(); 
   } else {
       res.status(404).send({ message:"Task not found" });
   }
});


app.delete('/clearTasks', (req, res) => {
   writeData({ users : [] }); 
   res.status(204).send(); 
});


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));