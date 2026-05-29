import db from './db.js';

const getAllProjects = async () => {
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
    JOIN public.organization o
    ON p.organization_id = o.organization_id
    ORDER BY p.date;
  `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      date AS raw_date,
      TO_CHAR(date, 'FMMonth DD, YYYY') AS project_date
    FROM public.project
    WHERE organization_id = $1
    ORDER BY date;
  `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (numberOfProjects) => {
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
    JOIN public.organization o
    ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date
    LIMIT $1;
  `;

  const queryParams = [numberOfProjects];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (id) => {
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
    JOIN public.organization o
    ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const queryParams = [id];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.name
    FROM public.category c
    JOIN public.project_category pc
    ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId
};