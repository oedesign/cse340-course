import db from './db.js';

export const getAllCategories = async () => {
    try {
        const query = `
            SELECT name
            FROM category
            ORDER BY name;
        `;

        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error getting categories:', error);
        throw error;
    }
};