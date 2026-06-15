import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm
} from './controllers/organizations.js';

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
} from './controllers/projects.js';

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from './controllers/categories.js';

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage
} from './controllers/users.js';

import {
  volunteerForProject,
  removeVolunteerFromProject
} from './controllers/volunteers.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

/* Admin Only - Organizations */
router.get(
  '/new-organization',
  requireRole('admin'),
  showNewOrganizationForm
);

router.post(
  '/new-organization',
  requireRole('admin'),
  organizationValidation,
  processNewOrganizationForm
);

router.get(
  '/edit-organization/:id',
  requireRole('admin'),
  showEditOrganizationForm
);

router.post(
  '/edit-organization/:id',
  requireRole('admin'),
  organizationValidation,
  processEditOrganizationForm
);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

/* Volunteer Routes */
router.get(
  '/project/:id/volunteer',
  requireLogin,
  volunteerForProject
);

router.get(
  '/project/:id/remove-volunteer',
  requireLogin,
  removeVolunteerFromProject
);

/* Admin Only - Projects */
router.get(
  '/new-project',
  requireRole('admin'),
  showNewProjectForm
);

router.post(
  '/new-project',
  requireRole('admin'),
  projectValidation,
  processNewProjectForm
);

router.get(
  '/edit-project/:id',
  requireRole('admin'),
  showEditProjectForm
);

router.post(
  '/edit-project/:id',
  requireRole('admin'),
  projectValidation,
  processEditProjectForm
);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

/* Admin Only - Categories */
router.get(
  '/new-category',
  requireRole('admin'),
  showNewCategoryForm
);

router.post(
  '/new-category',
  requireRole('admin'),
  processNewCategoryForm
);

router.get(
  '/edit-category/:id',
  requireRole('admin'),
  showEditCategoryForm
);

router.post(
  '/edit-category/:id',
  requireRole('admin'),
  processEditCategoryForm
);

router.get(
  '/assign-categories/:projectId',
  requireRole('admin'),
  showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  requireRole('admin'),
  processAssignCategoriesForm
);

/* User Registration Routes */
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

/* User Login Routes */
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

/* Protected Dashboard Route */
router.get(
  '/dashboard',
  requireLogin,
  showDashboard
);

/* Admin Only - Users Page */
router.get(
  '/users',
  requireRole('admin'),
  showUsersPage
);

router.get('/test-error', testErrorPage);

export default router;