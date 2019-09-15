const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const decorator = require("./database/decorator");
const session = require("express-session");
const exphbs = require("express-handlebars");
const userRouter = require("./routes/user");
const galleryRouter = require("./routes/gallery");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

const PORT = 8080;
const saltRounds = 12;
const User = require("./database/models/User");

require("dotenv").config();

const client = redis.createClient({ url: process.env.REDIS_URL });
const app = express();

app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(decorator);
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs"); //uses res.render()
app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize()); //starts up passport and sets up middleware
app.use(passport.session()); //current session we are using

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login.html");
  }
}

// handles login authentication
passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then(user => {
        console.log(user);

        if (user === null) {
          return done(null, false, { message: "bad username or password" });
        } else {
          user = user.toJSON();

          bcrypt.compare(password, user.password).then(res => {
            // Happy route: username exists, password matches
            if (res) {
              return done(null, user); // this is the 'user' that goes to passport.serializeUser
            }
            // Error Route: Username exists, password does not match
            else {
              return done(null, false, { message: "bad username or password" });
            }
          });
        }
      })
      .catch(err => {
        console.log("error: ", err);
        return done(err);
      });
  })
);

// user comes from database then return the session object
passport.serializeUser(function(user, done) {
  console.log("serializing");

  return done(null, { id: user.id, username: user.username });
});

//comes back to website with a cookie
passport.deserializeUser(function(user, done) {
  console.log("deserializing");
  console.log(user);
  return done(null, user);
});

app.use(
  "/login",
  passport.authenticate("local", {
    successRedirect: "gallery",
    failureRedirect: "/login.html"
  })
);

app.post("/register", (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
    } // return 500

    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      } // return 500

      return new User({
        username: req.body.username,
        password: hash
      })
        .save()
        .then(user => {
          console.log(user);
          return res.redirect("/login.html");
        })
        .catch(err => {
          console.log(err);
          return res.send("Error creating account");
        });
    });
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

app.get("/", (req, res) => {
  res.redirect("gallery");
});

app.use("/user", userRouter);
app.use("/gallery", galleryRouter);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
