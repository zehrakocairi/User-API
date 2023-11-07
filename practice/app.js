import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
  fs.readFile("data.json", "utf8", function (err, data) {
    const users = JSON.parse(data).users;
    if (users.length > 0) {
      return res.status(200).send(data);
    } else res.status(500).send("Users doesn't exist");
  });
});

app.get("/users/:id", (req, res) => {
  const userID = req.params.id;

  fs.readFile("data.json", "utf8", function (err, data) {
    const users = JSON.parse(data).users;
    const singleUser = users.filter((user) => user.id == userID);
    if (singleUser.length == 1) {
      return res.status(200).send(singleUser);
    } else res.status(500).send("user not found");
  });
});

app.post("/users", (req, res) => {
  const user = req.body;

  fs.readFile("data.json", "utf8", function (err, data) {
    const users = JSON.parse(data).users;
    users.push(user);

    fs.writeFile("data.json", JSON.stringify({ users: users }), (err) => {
      if (err) res.status(500).send("something bad happened");
      else {
        return res.status(200).send("user added succesfully");
      }
    });
  });
});

app.put("/users/:id", (req, res) => {
  const userID = req.params.id;

  fs.readFile("data.json", "utf8", function (err, data) {
    const users = JSON.parse(data).users;
    const userIndex = users.findIndex((user) => user.id == +userID);
    if (userIndex >= 0) {
      users.splice(userIndex, 1, req.body);

      fs.writeFile("data.json", JSON.stringify({ users: users }), (err) => {
        if (err) res.status(500).send("something bad happened");
        else {
          return res.status(200).send("user updated succesfully");
        }
      });
    } else res.status(500).send("user which will be updated couldn't find");
  });
});
app.patch("/users/:id", (req, res) => {
  const userID = req.params.id;
  const newContent = req.body;

  fs.readFile("data.json", "utf8", function (err, data) {
    const users = JSON.parse(data).users;
    const userToChange = users.find((user) => user.id == +userID);
    const newUsers = users.map((user) => {
      if (user.id === userToChange.id) {
        return { ...user, ...newContent };
      }
      return user;
    });

    fs.writeFile("data.json", JSON.stringify({ users: newUsers }), (err) => {
      if (err) res.status(500).send("something bad happened");
      else {
        return res.status(200).send("user updated succesfully");
      }
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const userID = req.params.id;

  fs.readFile("data.json", "utf8", function (err, data) {
    const users = JSON.parse(data).users;
    const newData = users.filter((user) => user.id !== +userID);

    fs.writeFile("data.json", JSON.stringify({ users: newData }), (err) => {
      if (err) res.status(500).send("something bad happened");
      else {
        return res.status(200).send("user deleted succesfully");
      }
    });
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("An error occured during your request. Please try again!");
});

export default app;
