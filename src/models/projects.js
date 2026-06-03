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

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO public.project (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `
    UPDATE public.project
    SET
      title = $1,
      description = $2,
      location = $3,
      date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId,
    projectId
  ];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  return result.rows[0].project_id;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId,
  createProject,
  updateProject
};