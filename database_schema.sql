-- =============================================
-- Base de données : Verdant Presence Pulse
-- Création des tables et relations
-- Compatible PostgreSQL
-- =============================================

-- Désactiver temporairement les contraintes de clé étrangère
SET session_replication_role = 'replica';

-- =============================================
-- Table : departments
-- =============================================
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_departments_name UNIQUE (name)
);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Table : users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
    position VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Inactive')),
    join_date DATE,
    avatar VARCHAR(500),
    department_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE SET NULL
);

-- Ajout de la contrainte de clé étrangère pour manager_id dans departments
ALTER TABLE departments
ADD CONSTRAINT fk_departments_manager 
FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- Création du trigger pour mettre à jour updated_at sur departments
CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Création du trigger pour mettre à jour updated_at sur users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : attendances
-- =============================================
CREATE TABLE IF NOT EXISTS attendances (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('Present', 'Late', 'Absent')),
    work_hours DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_attendances_employee_date UNIQUE (employee_id, date),
    CONSTRAINT fk_attendances_employee FOREIGN KEY (employee_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Création du trigger pour mettre à jour updated_at sur attendances
CREATE TRIGGER update_attendances_updated_at
BEFORE UPDATE ON attendances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : leave_requests
-- =============================================
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Vacation', 'Sick Leave', 'Personal', 'Other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    applied_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER,
    approved_on TIMESTAMP WITH TIME ZONE,
    half_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_approver FOREIGN KEY (approved_by) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Création du trigger pour mettre à jour updated_at sur leave_requests
CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : absences
-- =============================================
CREATE TABLE IF NOT EXISTS absences (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Sick Leave', 'Personal', 'Unplanned')),
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Justified', 'Pending', 'Unjustified')),
    document VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_absences_employee FOREIGN KEY (employee_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Création du trigger pour mettre à jour updated_at sur absences
CREATE TRIGGER update_absences_updated_at
BEFORE UPDATE ON absences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : reports
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    generated_by INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed')),
    parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_generated_by FOREIGN KEY (generated_by) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Création du trigger pour mettre à jour updated_at sur reports
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : notifications
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'Info' CHECK (type IN ('Info', 'Warning', 'Success', 'Error')),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Création du trigger pour mettre à jour updated_at sur notifications
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : validation_workflows
-- =============================================
CREATE TABLE IF NOT EXISTS validation_workflows (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('Leave', 'Expense', 'Other')),
    request_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    comments TEXT,
    action_date TIMESTAMP WITH TIME ZONE,
    step_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_validation_workflows_approver FOREIGN KEY (approver_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Création du trigger pour mettre à jour updated_at sur validation_workflows
CREATE TRIGGER update_validation_workflows_updated_at
BEFORE UPDATE ON validation_workflows
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : system_settings
-- =============================================
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_system_settings_key UNIQUE (setting_key)
);

-- Création du trigger pour mettre à jour updated_at sur system_settings
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Table : audit_logs
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Création du trigger pour mettre à jour updated_at sur audit_logs
CREATE TRIGGER update_audit_logs_updated_at
BEFORE UPDATE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Fonctions et déclencheurs
-- =============================================

-- Fonction pour mettre à jour automatiquement les champs updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer les heures travaillées
CREATE OR REPLACE FUNCTION calculate_work_hours()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_out_time IS NOT NULL AND NEW.check_in_time IS NOT NULL THEN
        NEW.work_hours := EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 3600.0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour déterminer automatiquement le statut de présence
CREATE OR REPLACE FUNCTION determine_attendance_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in_time IS NULL AND NEW.check_out_time IS NULL THEN
        NEW.status := 'Absent';
    ELSIF EXTRACT(HOUR FROM NEW.check_in_time) >= 9 THEN
        NEW.status := 'Late';
    ELSE
        NEW.status := 'Present';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Table : dashboard_widgets
-- =============================================
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    widget_type VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dashboard_widgets_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Table : user_sessions
-- Pour le suivi des sessions utilisateur
-- =============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_sessions_token UNIQUE (token)
);



-- =============================================
-- Déclencheurs (triggers)
-- =============================================

-- Déclencheurs pour updated_at
CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at
BEFORE UPDATE ON attendances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON leave_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_absences_updated_at
BEFORE UPDATE ON absences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_validation_workflows_updated_at
BEFORE UPDATE ON validation_workflows
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_widgets_updated_at
BEFORE UPDATE ON dashboard_widgets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at
BEFORE UPDATE ON user_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Déclencheur pour dashboard_widgets
CREATE TRIGGER update_dashboard_widgets_updated_at
BEFORE UPDATE ON dashboard_widgets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Déclencheur pour calculer automatiquement les heures travaillées
CREATE TRIGGER trg_calculate_work_hours
BEFORE INSERT OR UPDATE OF check_in_time, check_out_time ON attendances
FOR EACH ROW
EXECUTE FUNCTION calculate_work_hours();

-- Déclencheur pour déterminer automatiquement le statut de présence
CREATE TRIGGER trg_determine_attendance_status
BEFORE INSERT OR UPDATE OF check_in_time, check_out_time ON attendances
FOR EACH ROW
EXECUTE FUNCTION determine_attendance_status();

-- =============================================
-- Index pour améliorer les performances
-- =============================================

-- Pour la table attendances
CREATE INDEX idx_attendances_employee_date ON attendances(employee_id, date);

-- Pour la table leave_requests
CREATE INDEX idx_leave_requests_employee_status ON leave_requests(employee_id, status);

-- Pour la table notifications
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at);

-- Pour la table user_sessions

-- Index pour la table leave_requests
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- Index pour la table absences
CREATE INDEX idx_absences_employee ON absences(employee_id);
CREATE INDEX idx_absences_date ON absences(date);

-- Index pour la table notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- Index pour la table user_sessions
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);

-- =============================================
-- Insertion des données initiales
-- =============================================

-- Insertion d'un département par défaut
INSERT INTO departments (name, description) 
VALUES ('Ressources Humaines', 'Département des ressources humaines')
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- Insertion d'un administrateur par défaut (mot de passe: admin123)
-- Note: Dans une application réelle, le mot de passe doit être hashé
INSERT INTO users (email, password, name, role, position, department_id, status, join_date)
VALUES (
    'admin@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- mot de passe: admin123
    'Administrateur',
    'admin',
    'Responsable RH',
    (SELECT id FROM departments WHERE name = 'Ressources Humaines' LIMIT 1),
    'Active',
    CURRENT_DATE
)
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    position = EXCLUDED.position,
    department_id = EXCLUDED.department_id,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;

-- Mise à jour du manager du département RH
-- Vérifier si la contrainte existe déjà avant de la créer
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'fk_departments_manager' AND conrelid = 'departments'::regclass
    ) THEN
        ALTER TABLE departments
        ADD CONSTRAINT fk_departments_manager 
        FOREIGN KEY (manager_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- Mettre à jour le manager
UPDATE departments
SET manager_id = (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1)
WHERE name = 'Ressources Humaines';

-- Insertion des paramètres système par défaut
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('company_name', 'Verdant Presence Pulse', 'Nom de l''entreprise', TRUE),
('work_hours_per_day', '8', 'Nombre d''heures de travail par jour', TRUE),
('work_days_per_week', '5', 'Nombre de jours de travail par semaine', TRUE),
('annual_leave_days', '25', 'Nombre de jours de congé annuel par défaut', TRUE),
('sick_leave_days', '15', 'Nombre de jours de congé maladie par an', TRUE),
('notification_enabled', 'true', 'Activer les notifications', TRUE)
ON CONFLICT (setting_key) DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public,
    updated_at = CURRENT_TIMESTAMP;

-- =============================================
-- =============================================
-- Déclencheurs (triggers) pour la gestion des mises à jour
-- =============================================
-- Tous les déclencheurs nécessaires ont déjà été créés plus haut dans le script
-- avec la syntaxe PostgreSQL appropriée

-- =============================================
-- Vues utiles pour les rapports
-- =============================================

-- Vue pour le résumé des présences
CREATE OR REPLACE VIEW vw_attendance_summary AS
SELECT 
    u.id AS user_id,
    u.name AS employee_name,
    u.email,
    d.name AS department,
    COUNT(a.id) AS total_days,
    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS days_present,
    SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS days_late,
    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS days_absent,
    COALESCE(SUM(a.work_hours), 0) AS total_hours_worked
FROM 
    users u
LEFT JOIN 
    attendances a ON u.id = a.employee_id
LEFT JOIN
    departments d ON u.department_id = d.id
GROUP BY 
    u.id, u.name, u.email, d.name;

-- Vue pour les demandes de congé en attente
CREATE OR REPLACE VIEW vw_pending_leave_requests AS
SELECT 
    lr.*,
    u.name AS employee_name,
    u.email AS employee_email,
    d.name AS department_name,
    a.name AS approver_name
FROM 
    leave_requests lr
JOIN 
    users u ON lr.employee_id = u.id
LEFT JOIN 
    departments d ON u.department_id = d.id
LEFT JOIN 
    users a ON lr.approved_by = a.id
WHERE 
    lr.status = 'Pending';

-- =============================================
-- Fin du script de création de la base de données
-- =============================================
