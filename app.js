import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import morgan from "morgan";
import passport from "passport";
import mongoose from 'mongoose';
import passportJs from "./config/passport.js";
import methodOverride from "method-override";
import { engine } from "express-handlebars";
import routes from './routes/index.js';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import session from 'express-session';
import helperHbs from './helpers/hbs.js';
// import * as connectMongo from 'connect-mongo';

import path from 'path';
import { fileURLToPath } from 'url';
// Load config

dotenv.config({ path: './config/config.env' });

//passport config
passportJs(passport);
connectDB();

const app = express();
// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override
app.use(methodOverride((req, res)=> {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}))

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//Handlebars helpers
const { formatDate, truncate, stripTags ,editIcon , select} = helperHbs;

//Handlebars
app.engine('.hbs', engine({ helpers: { formatDate, truncate, stripTags, editIcon, select},defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');
// app.set('views', './views');
// Sessions
// const MongoStore = connectMongo(session);
app.use(session({
    // store: new MongoStore({ mongooseConnection: mongoose.connection  }),
    secret: 'storybooks',
    resave: false,
    saveUninitialized: false,
}))
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global var

app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//Static folder
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/stories', storiesRoutes);

const PORT= process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})
