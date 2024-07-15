// Import the Express framework
const express = require('express');

// Import the express-session middleware for session management
const session = require('express-session');

// Import body-parser to parse incoming request bodies
const bodyParser = require('body-parser');

// Create an instance of the Express application
const app = express();

// Set the port number for the server
const port = 3000;

// Middleware
// Use body-parser to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Configure and use session middleware
app.use(session({
    secret: 'your-secret-key', // Secret key used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized session
    cookie: { maxAge: 60000 } // Set cookie max age to 1 minute (60000 ms)
}));

// Simulated user database (in a real app, this would be a database)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Routes
// Define route for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the Session Demo');
});

// Define route for the login page
app.get('/login', (req, res) => {
    // Send HTML form for login
    res.send(`
        <h2>Login</h2>
        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Define route for handling login POST request
app.post('/login', (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;
    // Find user in the simulated database
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // If user found, set user ID in session and redirect to dashboard
        req.session.userId = user.id;
        res.redirect('/dashboard');
    } else {
        // If user not found, send error message
        res.send('Invalid username or password');
    }
});

// Define route for the dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.userId) {
        // If user is logged in (userId in session), show dashboard
        res.send(`
            <h2>Dashboard</h2>
            <p>Welcome User ${req.session.userId}</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        // If user is not logged in, redirect to login page
        res.redirect('/login');
    }
});

// Define route for logout
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            // If error in destroying session, redirect to home
            return res.redirect('/');
        }
        // If session successfully destroyed, send logout message
        res.send('You are logged out. <a href="/login">Login again</a>');
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});