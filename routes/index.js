var express = require('express');
var router = express.Router();
var moment = require('moment');
moment.locale('en'); //for setting locale time

// Logged In Users
var loggedInUsers = [];

/* Logged out user from server. */
function logOutUser(user) {
  let arr = loggedInUsers.filter(function (ele) {
    return ele != user;
  });
  loggedInUsers = arr;
}

/* GET Login page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET Sign UP page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', {
    title: 'SignUp'
  });
});

/* GET home page. */
router.get('/home', function (req, res, next) {
  let userName = req.query.user ? encodeURIComponent(req.query.user) : '';
  if (userName && userName != null) {
    if (loggedInUsers.find(u => u === userName)) {
      res.render('home', { title: 'Check List',  userName: userName });
    } else {
      res.render('login', { title: 'Login', message: 'Error logging in' });
    }
  } else {
    res.render('login', { title: 'Login', message: 'Error logging in' });
  }
});

/* Log Out. */
router.get('/logout', function (req, res, next) {
  let userName = req.query.user ? encodeURIComponent(req.query.user) : '';
  logOutUser(userName);
  res.render('login', {
    title: 'Login',
    message: 'Log out successfully.'
  });
});

// Registered Users array
var users = [{
    "id": 1,
    "user": "Admin",
    "password": "Admin"
  }
];

// All users tasks
var tasks = [{
    "id": 1,
    "user": "Admin",
    "status": false,
    "onDate": "2019-03-02 12:10 pm",
    "task": "Complete Node"
  }
];

//get all tasks of all users
router.get('/api/tasks', (req, res) => {
  res.status(200).send({
    "success": "true",
    "data": tasks
  });
})

// getting task by task id
router.get('/api/tasks/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let task = [];
  let chk = 0;
  tasks.forEach(element => {
    if (element.id === id) {
      task.push(element);
      chk = 1;
    }
  });

  if (chk == 1) {
    res.status(200).send({
      "success": "true",
      "data": task
    });
  }
})

//Getting user tasks by userName
router.get('/api/usertasks/:user', (req, res) => {
  let user = req.params.user;
  let task = [];
  let chk = 0;
  let iteration = 0;
  tasks.forEach(element => {
    if (element.user === user) {
      task.push(element);
      chk = 1;
    }
    iteration++;
  });


  if (chk == 1) {
    res.status(200).send({
      "success": "true",
      "data": task
    });
  } else if (iteration >= tasks.length) {
    res.status(200).send({
      "success": "true",
      "data": []
    });
  }
})

router.post('/api/addUserTask', (req, res) => {
  let userName = req.body.userName;
  let task = req.body.task;
  let userTasks = [];
  if (userName && task) {
    tasks.push({
      "id": tasks.length + 1,
      "user": userName,
      "status": false,
      "onDate": moment().parseZone().format("YYYY-MM-DD HH:mm"),
      "task": task
    });
    userTasks = tasks.filter(ele => ele.user === userName);

    res.status(200).send({
      "success": "true",
      "data": userTasks
    });
  } else {
    res.send({
      "error": "not a valid request"
    });
  }
})

//Delete user task by username and task id
router.get('/api/deleteTask/:id/:user', (req, res) => {
  let taskId = parseInt(req.params.id);
  let userName = req.params.user;
  let userTasks = [];
  if (userName && taskId) {
    tasks = tasks.filter(ele => ele.id !== taskId);
    setTimeout(() => {
      userTasks = tasks.filter(ele => ele.user === userName);
      res.status(200).send({
        "success": "true",
        "data": userTasks
      });
    }, 4000);
  } else {
    res.send({
      "error": "not a valid request"
    });
  }
})

//Delete all tasks of a user by userName
router.get('/api/deleteAllUserTask/:user', (req, res) => {
  let userName = req.params.user;
  let userTasks = [];
  if (userName) {
    tasks.forEach((val, inx) => {
      if (val.user == userName) {
        delete tasks[inx];
      }
    });
    setTimeout(() => {
      userTasks = tasks.filter(ele => ele.user === userName);
      res.status(200).send({
        "success": "true",
        "data": userTasks
      });
    }, 4000);
  } else {
    res.send({
      "error": "not a valid request"
    });
  }
})

//Mark task as done by task id and userName
router.get('/api/doneTask/:id/:user', (req, res) => {
  let taskId = parseInt(req.params.id);
  let userName = req.params.user;
  let userTasks = [];
  let task = [];
  if (userName && taskId) {
    tasks.forEach(elem => {
      if (elem.user === userName && elem.id === taskId) {
        elem.status = true;
        task.push(elem);
      } else {
        task.push(elem);
      }
    })
    setTimeout(() => {
      tasks = task;
      userTasks = tasks.filter(ele => ele.user === userName);
      res.status(200).send({
        "success": "true",
        "data": userTasks
      });
    }, 4000);
  } else {
    res.send({
      "error": "not a valid request"
    });
  }
})

//get user by user id
router.get('/api/user/:id', (req, res) => {
  let usrId = parseInt(req.params.id);
  let user = [];
  let chk = 0;
  users.forEach(element => {
    if (element.id === usrId) {
      user.push(element);
      chk = 1;
    }
  });

  if (chk == 1) {
    res.status(200).send({
      "success": "true",
      "data": user
    });
  }
})

//Check if user registered
router.post('/api/isUserRegistered', (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let user = [];
  if (userName && password) {
    let chk = 0;
    users.forEach(element => {
      if (element.user === userName && element.password === password) {
        chk = 1;
        user.push(element);
        loggedInUsers.push(userName);
      }
    });
    setTimeout(() => {
      if (chk) {
        res.status(200).send({
          "success": "true",
          "data": user
        });
      } else {
        res.status(200).send({
          "error": "user not present "
        });
      }
    }, 4000);
  } else {
    res.send({
      "error": "not a valid request"
    });
  }
})

//Register user
router.post('/api/registerUser', (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let email = req.body.email ? req.body.email : '';
  let user = [];

  if (userName && password) {
    let chk = 0;
    users.forEach(element => {
      if (element.user === userName || (element.user === userName && element.password === password)) {
        chk = 1;
      }
    });
    setTimeout(() => {
      if (chk >= 1) {
        res.status(406).send({
          "error": "Not Acceptable, user already exist."
        });
      } else {
        users.push({
          "id": user.length + 1,
          "user": userName,
          "password": password,
          "email": email
        });
        res.status(200).send({
          "success": "true",
          "data": "User registered on server"
        });
      }
    }, 4000);
  } else {
    res.status(500).send({
      "error": "Server Error occured"
    });
  }
})

//Get all users
router.get('/api/users', (req, res) => {
  res.status(200).send({
    "success": "true",
    "data": users
  });
})

//get users by userId
router.get('/api/users/:userID', (req, res) => {
  let userID = parseInt(req.params.userID);
  let user = [];
  if (userID) {
    user = users.filter(u => u.id === userID);
    if (user.length > 0) {
      res.status(200).send({
        "success": "true",
        "data": user
      });
    } else {
      res.status(403).send({
        "error": "Invalid user"
      });
    }
  } else {
    res.status(403).send({
      "error": "Invalid request"
    });
  }
})

module.exports = router;