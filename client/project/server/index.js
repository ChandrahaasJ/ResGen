import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create default user
const createDefaultUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('pass*1', salt);
  return {
    id: 1,
    username: 'cj',
    email: 'cj@example.com',
    password: hashedPassword,
    createdAt: new Date()
  };
};

// In-memory database for demonstration purposes
let users = [];
const schemas = new Map(); // Store schemas by userId

// Initialize default user
(async () => {
  const defaultUser = await createDefaultUser();
  users.push(defaultUser);
})();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key', // Use a proper secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CSRF protection middleware
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = Math.random().toString(36).substring(2, 15);
  }
  
  // Skip CSRF check for GET requests and CSRF token endpoint
  if (req.method === 'GET' || req.path === '/api/csrf-token') {
    return next();
  }
  
  const csrfToken = req.headers['csrf-token'];
  
  if (!csrfToken || csrfToken !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }
  
  next();
});

// CSRF Token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken });
});

// Schema status endpoint
app.get('/api/schema-status', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const hasSchema = schemas.has(req.session.userId);
  res.json({
    success: true,
    hasSchema
  });
});

// Signup endpoint
app.post('/signup/resGen', async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;
    
    // Server-side validation
    const errors = {};
    
    // Check if passwords match
    if (password !== confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    // Check password requirements
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      errors.password = 'Password must be at least 8 characters with 1 number and 1 special character';
    }
    
    // Check for existing user
    const existingUser = users.find(user => 
      user.username === username || user.email === email
    );
    
    if (existingUser) {
      if (existingUser.username === username) {
        errors.username = 'Username already exists';
      }
      if (existingUser.email === email) {
        errors.email = 'Email already exists';
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    // Store user in our "database"
    users.push(newUser);
    
    // Create session
    req.session.userId = newUser.id;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      redirectUrl: '/dashboard'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Login endpoint
app.post('/login/resGen', async (req, res) => {
  try {
    const { username_or_email, password } = req.body;
    
    // Find user
    const user = users.find(user => 
      user.username === username_or_email || user.email === username_or_email
    );
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
        errors: { general: 'Invalid username/email or password' }
      });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
        errors: { general: 'Invalid username/email or password' }
      });
    }
    
    // Create session
    req.session.userId = user.id;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      redirectUrl: '/dashboard'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Create Schema endpoint
app.post('/createSchema', upload.array('certifications'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const userId = req.session.userId;

    // Check if user already has a schema
    if (schemas.has(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Schema already exists for this user'
      });
    }

    const projects = JSON.parse(req.body.projects || '[]');
    const achievements = JSON.parse(req.body.achievements || '[]');
    
    // Process certification files
    const certifications = req.files.map((file, index) => ({
      title: req.body[`certification_title_${index}`],
      filePath: file.path
    }));

    // Store the schema
    const schema = {
      projects,
      achievements,
      certifications,
      createdAt: new Date()
    };

    schemas.set(userId, schema);

    res.status(201).json({
      success: true,
      message: 'Schema created successfully'
    });
  } catch (error) {
    console.error('Create schema error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Append Schema endpoint
app.post('/appendSchema', upload.array('certifications'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const userId = req.session.userId;
    const schemaType = req.headers['schema-type'];
    
    let existingSchema = schemas.get(userId) || {
      projects: [],
      achievements: [],
      certifications: []
    };

    switch (schemaType) {
      case 'Proj':
        const projects = JSON.parse(req.body.projects || '[]');
        existingSchema.projects = [...existingSchema.projects, ...projects];
        break;

      case 'Ache':
        const achievements = JSON.parse(req.body.achievements || '[]');
        existingSchema.achievements = [...existingSchema.achievements, ...achievements];
        break;

      case 'Cert':
        const newCertifications = req.files.map((file, index) => ({
          title: req.body[`certification_title_${index}`],
          filePath: file.path
        }));
        existingSchema.certifications = [...existingSchema.certifications, ...newCertifications];
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid schema type'
        });
    }

    // Update the schema
    schemas.set(userId, existingSchema);

    res.status(200).json({
      success: true,
      message: 'Schema updated successfully'
    });
  } catch (error) {
    console.error('Append schema error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Protected route example
app.get('/api/user', (req, res) => {
  // Check if user is authenticated
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
  
  // Find user
  const user = users.find(user => user.id === req.session.userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Return user data without password
  const { password, ...userData } = user;
  res.json({
    success: true,
    user: userData
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});