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

export { getAllProjects, getProjectsByOrganizationId };