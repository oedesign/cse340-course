import db from './db.js';

const getAllCategories = async () => {
  const query = `
    SELECT
      category_id,
      name
    FROM public.category
    ORDER BY name;
  `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryDetails = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      name
    FROM public.category
    WHERE category_id = $1;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date AS raw_date,
      TO_CHAR(p.date, 'FMMonth DD, YYYY') AS project_date,
      o.name AS organization_name
    FROM public.project p
    JOIN public.project_category pc
    ON p.project_id = pc.project_id
    JOIN public.organization o
    ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.date;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

export {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId
};