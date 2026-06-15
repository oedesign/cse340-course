CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');








CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);



-- ========================================
-- Insert sample data: Service Projects
-- ========================================

INSERT INTO project (organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders projects
(1, 'Community Center Renovation', 'Help repair and repaint rooms in a local community center.', 'Downtown Community Center', '2026-06-05'),
(1, 'Neighborhood Playground Repair', 'Assist with fixing playground equipment and cleaning the play area.', 'Westside Neighborhood Park', '2026-06-12'),
(1, 'School Desk Assembly', 'Build and arrange desks for classrooms at a local school.', 'Lincoln Primary School', '2026-06-19'),
(1, 'Public Bench Installation', 'Install new benches in public spaces for community use.', 'Riverside Walkway', '2026-06-26'),
(1, 'Home Repair Support Day', 'Support basic repair work for selected homes in the community.', 'Northside Housing Area', '2026-07-03'),

-- GreenHarvest Growers projects
(2, 'Urban Garden Cleanup', 'Remove weeds, clear garden beds, and prepare soil for planting.', 'GreenHarvest Community Garden', '2026-06-07'),
(2, 'Vegetable Planting Day', 'Plant vegetables and herbs in community garden plots.', 'Eastside Urban Farm', '2026-06-14'),
(2, 'Composting Workshop Support', 'Help set up materials and assist participants during a composting workshop.', 'GreenHarvest Training Center', '2026-06-21'),
(2, 'Food Sustainability Fair', 'Support booths and educational activities about local food sustainability.', 'City Event Hall', '2026-06-28'),
(2, 'Garden Harvest Distribution', 'Sort and distribute harvested produce to local families.', 'GreenHarvest Storage Shed', '2026-07-05'),

-- UnityServe Volunteers projects
(3, 'Charity Food Drive', 'Collect, sort, and package donated food items for local families.', 'UnityServe Main Office', '2026-06-08'),
(3, 'Community Clothing Sorting', 'Sort donated clothes and prepare them for distribution.', 'Hope Donation Center', '2026-06-15'),
(3, 'Senior Center Visit', 'Assist with activities and provide support during a senior center visit.', 'Oakview Senior Center', '2026-06-22'),
(3, 'Local Shelter Meal Service', 'Help prepare and serve meals at a local shelter.', 'Downtown Shelter Kitchen', '2026-06-29'),
(3, 'Volunteer Orientation Event', 'Help welcome and register new volunteers for upcoming service activities.', 'UnityServe Training Room', '2026-07-06');









CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO category (name)
VALUES
    ('Education'),
    ('Health'),
    ('Community Cleanup'),
    ('Food Support');

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4);










 -- ========================================
-- Roles Table
-- ========================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');








-- ========================================
-- Users Table
-- ========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE volunteer (
    volunteer_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    UNIQUE(user_id, project_id)
);