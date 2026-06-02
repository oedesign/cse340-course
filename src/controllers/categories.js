import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

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
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      return next(error);
    }

    res.render('category', {
      title: category.name,
      category,
      projects
    });
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
  showAssignCategoriesForm,
  processAssignCategoriesForm
};