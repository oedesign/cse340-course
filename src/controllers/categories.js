import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByServiceProjectId,
  createCategory,
  updateCategory,
  updateCategoryAssignments
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';

const validateCategoryName = (name) => {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Category name is required.');
  } else {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      errors.push('Category name must be at least 3 characters.');
    }

    if (trimmedName.length > 100) {
      errors.push('Category name must be 100 characters or less.');
    }
  }

  return errors;
};

const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.render('categories', {
      title: 'Service Categories',
      categories
    });
  } catch (error) {
    next(error);
  }
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      return next(error);
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
      title: category.name,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
};

const showNewCategoryForm = (req, res) => {
  res.render('new-category', {
    title: 'Create New Category',
    errors: [],
    formData: {
      name: ''
    }
  });
};

const processNewCategoryForm = async (req, res, next) => {
  try {
    const name = req.body.name;
    const errors = validateCategoryName(name);

    if (errors.length > 0) {
      return res.status(400).render('new-category', {
        title: 'Create New Category',
        errors,
        formData: {
          name
        }
      });
    }

    await createCategory(name.trim());

    req.flash('success', 'Category created successfully.');

    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      return next(error);
    }

    res.render('edit-category', {
      title: 'Edit Category',
      errors: [],
      category
    });
  } catch (error) {
    next(error);
  }
};

const processEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const name = req.body.name;
    const errors = validateCategoryName(name);

    if (errors.length > 0) {
      return res.status(400).render('edit-category', {
        title: 'Edit Category',
        errors,
        category: {
          category_id: categoryId,
          name
        }
      });
    }

    const updatedCategory = await updateCategory(categoryId, name.trim());

    if (!updatedCategory) {
      const error = new Error('Category not found');
      error.status = 404;
      return next(error);
    }

    req.flash('success', 'Category updated successfully.');

    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    next(error);
  }
};

const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
      const error = new Error('Project not found');
      error.status = 404;
      return next(error);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    res.render('assign-categories', {
      title: 'Assign Categories to Project',
      projectId,
      projectDetails,
      categories,
      assignedCategories
    });
  } catch (error) {
    next(error);
  }
};

const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
      ? selectedCategoryIds
      : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm
};