import pool from './db.js';

export async function addVolunteer(userId, projectId) {
  const sql = `
    INSERT INTO volunteer (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING *;
  `;

  const result = await pool.query(sql, [userId, projectId]);

  return result.rows[0];
}

export async function removeVolunteer(userId, projectId) {
  const sql = `
    DELETE FROM volunteer
    WHERE user_id = $1
    AND project_id = $2
    RETURNING *;
  `;

  const result = await pool.query(sql, [userId, projectId]);

  return result.rows[0];
}

export async function isVolunteer(userId, projectId) {
  const sql = `
    SELECT *
    FROM volunteer
    WHERE user_id = $1
    AND project_id = $2;
  `;

  const result = await pool.query(sql, [userId, projectId]);

  return result.rows.length > 0;
}

// export async function getVolunteerProjects(userId) {
//   const sql = `
//     SELECT
//       p.project_id,
//       p.title,
//       p.project_date,
//       p.location,
//       o.organization_id,
//       o.organization_name
//     FROM volunteer v
//     JOIN project p
//       ON v.project_id = p.project_id
//     JOIN organization o
//       ON p.organization_id = o.organization_id
//     WHERE v.user_id = $1
//     ORDER BY p.project_date;
//   `;

//   const result = await pool.query(sql, [userId]);

//   return result.rows;
// }

export async function getVolunteerProjects(userId) {
  const sql = `
    SELECT
      p.project_id,
      p.title,
      p.date,
      p.location,
      o.organization_id,
      o.name AS organization_name
    FROM volunteer v
    JOIN project p
      ON v.project_id = p.project_id
    JOIN organization o
      ON p.organization_id = o.organization_id
    WHERE v.user_id = $1
    ORDER BY p.date;
  `;

  const result = await pool.query(sql, [userId]);

  return result.rows;
}