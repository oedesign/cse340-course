import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO public.users
    (role_id, name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id;
  `;

  const queryParams = [
    1,
    name,
    email,
    passwordHash
  ];

  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      r.role_name
    FROM users u
    JOIN roles r
      ON u.role_id = r.role_id
    WHERE u.email = $1
  `;

  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const passwordMatches = await verifyPassword(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    return null;
  }

  delete user.password_hash;

  return user;
};

/**
 * Get all users with their roles
 */
const getAllUsers = async () => {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      r.role_name
    FROM users u
    JOIN roles r
      ON u.role_id = r.role_id
    ORDER BY u.name;
  `;

  const result = await db.query(query);

  return result.rows;
};

export {
  createUser,
  authenticateUser,
  getAllUsers
};