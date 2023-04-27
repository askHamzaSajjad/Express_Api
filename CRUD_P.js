const express = require('express');
const { readFile, updateFile,isValidData,appendData,userSchema } = require('./CRUD_promises');
const fs = require('fs');
// const { describe, it } = require('mocha');
const bodyparse = require('body-parser');
const app = express();
// app.use(express.json());
app.use(bodyparse.json());



const validateContentType = require('./middleware')

app.use(validateContentType)


// getapi
app.get('/getusers', (req, res) => {
  fs.readFile('users.json', (err, data) => {
    if (err) {
      reject(err);
    } else {
      data = (JSON.parse(data));
      return res.send(data);
    }
  });
  // if we want to make a promise
  // readFile()
  //   .then((data) => {
  //     return res.send(data);
  //   })
  //   .catch((err) => {
  //     return res.status(500).send(err);
  //   });
});
// =============================================================================================================================
// createuser 
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
app.post('/createusers', async (req, res) => {
  try {
    const { error, value } = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    }).validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(d => d.message).join('; ');
      return res.status(400).send({ message: errorMessage });
    }
    const users = JSON.parse(fs.readFileSync('users.json'));
    const newUser = { id: users.length + 1 ,...value};
    users.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.status(201).send(newUser);
  } 
  catch (error) 
  {
    console.error(error);
    res.status(400).send({ message: 'Error creating user' });
  }
});
// ============================================================================================================================

// update user

app.put('/updateusers/:id', async (req, res) => {
  try {
    const { error: validationError, value: userData } = Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
    }).min(1).validate(req.body, { abortEarly: false });
    if (validationError) {
      const errorMessage = validationError.details.map(d => d.message).join('; ');
      return res.status(400).send({ message: errorMessage });
    }

    const { id } = req.params;
    const users = JSON.parse(fs.readFileSync('users.json'));
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
      return res.status(404).send({ message: 'User not found' });
    }

    const existingUser = users[userIndex];
    const updatedUser = { ...existingUser, ...userData };
    users[userIndex] = updatedUser;
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.status(200).send(updatedUser);
  }
  catch (error) 
  {
    console.error(error);
    res.status(400).send({ message: 'Error updating user' });
  }
});
// =============================================================================================================================
// delete user
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = JSON.parse(fs.readFileSync('users.json'));
    console.log(users);
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
      return res.status(404).send({ message: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    // console.log(deletedUser);
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.status(200).send(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Error deleting user' });
  }
});



app.listen(9000, () => {
  console.log('Server started on port 9000');
});


module.exports = app

