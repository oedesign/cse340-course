import bcrypt from 'bcrypt';
import {
  createUser,
  authenticateUser
} from '../models/users.js';

const saltRounds = 10;

async function showUserRegistrationForm(req, res) {
  res.render('register', {
    title: 'Register'
  });
}

async function processUserRegistrationForm(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful.');

    res.redirect('/');
  } catch (error) {

    // PostgreSQL unique constraint violation
    if (error.code === '23505') {

      req.flash(
        'error',
        'An account with that email already exists.'
      );

      return res.render('register', {
        title: 'Register'
      });
    }

    next(error);
  }
}

const showLoginForm = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(
      email,
      password
    );

    if (user) {

      req.session.user = user;

      req.flash(
        'success',
        'Login successful!'
      );

      if (res.locals.NODE_ENV === 'development') {
        console.log('User logged in:', user);
      }

      return req.session.save(() => {
        res.redirect('/dashboard');
      });
    }

    req.flash(
      'error',
      'Invalid email or password.'
    );

    res.redirect('/login');

  } catch (error) {

    console.error(
      'Error during login:',
      error
    );

    req.flash(
      'error',
      'An error occurred during login.'
    );

    res.redirect('/login');
  }
};

const processLogout = (req, res) => {

  req.session.destroy((error) => {

    if (error) {
      console.error('Logout error:', error);
      return res.redirect('/');
    }

    res.redirect('/login');
  });
};

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash(
      'error',
      'You must be logged in to access that page.'
    );

    return res.redirect('/login');
  }

  next();
};

/**
 * Middleware factory to require a specific role
 *
 * @param {string} role
 * @returns {Function}
 */
const requireRole = (role) => {
  return (req, res, next) => {

    // Must be logged in first
    if (!req.session || !req.session.user) {
      req.flash(
        'error',
        'You must be logged in to access this page.'
      );

      return res.redirect('/login');
    }

    // Must have the required role
    if (req.session.user.role_name !== role) {
      req.flash(
        'error',
        'You do not have permission to access this page.'
      );

      return res.redirect('/');
    }

    next();
  };
};

const showDashboard = (req, res) => {
  const user = req.session.user;

  res.render('dashboard', {
    title: 'Dashboard',
    name: user.name,
    email: user.email
  });
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard
};