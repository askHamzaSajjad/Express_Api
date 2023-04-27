const fs = require('fs');
const { resolve } = require('path');

// get api
function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}
// ========================================================

// createapi schemma
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const userSchema = {
  name: Joi.string().required(),
  email: Joi.string().email().required()
};
// ========================================================

// updateapi promise
function updateFile(data){
  return new Promise((resolve, reject) => {
    fs.writeFile('users.json', JSON.stringify(data), (err) => {
      if(err){
        reject(err);
      }else{
        resolve("File Written");
      }
    });
  });
}
// ======================================================

module.exports = {readFile,updateFile,userSchema};

