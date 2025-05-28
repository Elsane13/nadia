# Modèle Logique de Données (MLD) - Verdant Presence Pulse

## Vue d'ensemble
Ce document présente la structure logique de la base de données pour le système de gestion de présence AttendEase, traduite à partir du MCD en tables relationnelles.

## Schéma relationnel

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BASE DE DONNÉES VERDANT PRESENCE PULSE             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────────────────────────────────────────┐
│   departments   │       │                     users                           │
├─────────────────┤       ├─────────────────────────────────────────────────────┤
│ id (PK)         │◄──────┤ id (PK)                                             │
│ name            │  1:N  │ email (UNIQUE)                                      │
│ description     │       │ password_hash                                       │
│ manager_id (FK) │       │ name                                                │
│ created_at      │       │ role (admin/employee)                               │
│ updated_at      │       │ position                                            │
└─────────────────┘       │ phone                                               │
                          │ location                                            │
                          │ status (active/inactive)                            │
                          │ join_date                                           │
                          │ avatar_url                                          │
                          │ department_id (FK)                                  │
                          │ created_at                                          │
                          │ updated_at                                          │
                          └─────────────────────────────────────────────────────┘
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          │        │               │               │        │
                          ▼        ▼               ▼               ▼        ▼
          ┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │    attendances      │ │  leave_requests │ │    absences     │ │  notifications  │
          ├─────────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
          │ id (PK)             │ │ id (PK)         │ │ id (PK)         │ │ id (PK)         │
          │ employee_id (FK)    │ │ employee_id (FK)│ │ employee_id (FK)│ │ recipient_id(FK)│
          │ date                │ │ type            │ │ date            │ │ sender_id (FK)  │
          │ check_in_time       │ │ start_date      │ │ type            │ │ type            │
          │ check_out_time      │ │ end_date        │ │ reason          │ │ title           │
          │ status              │ │ days            │ │ status          │ │ message         │
          │ work_hours          │ │ reason          │ │ document_url    │ │ status          │
          │ notes               │ │ status          │ │ created_at      │ │ priority        │
          │ created_at          │ │ applied_on      │ │ updated_at      │ │ created_at      │
          │ updated_at          │ │ approved_by (FK)│ └─────────────────┘ │ read_at         │
          └─────────────────────┘ │ approved_on     │                     └─────────────────┘
                                  │ half_day        │
                                  │ created_at      │     ┌─────────────────────┐
                                  │ updated_at      │     │validation_workflows │
                                  └─────────────────┘     ├─────────────────────┤
                                           │              │ id (PK)             │
                                           ▼              │ entity_type         │
                                  ┌─────────────────┐     │ entity_id           │
                                  │     reports     │     │ current_step        │
                                  ├─────────────────┤     │ validator_id (FK)   │
                                  │ id (PK)         │     │ status              │
                                  │ type            │     │ comments            │
                                  │ period_start    │     │ validated_at        │
                                  │ period_end      │     │ created_at          │
                                  │ generated_by(FK)│     │ updated_at          │
                                  │ generated_at    │     └─────────────────────┘
                                  │ data (JSON)     │
                                  │ created_at      │     ┌─────────────────┐ ┌─────────────────┐
                                  │ updated_at      │     │ system_settings │ │dashboard_widgets│
                                  └─────────────────┘     ├─────────────────┤ ├─────────────────┤
                                                          │ id (PK)         │ │ id (PK)         │
                                           ┌─────────────────┐ setting_key     │ │ user_id (FK)    │
                                           │   audit_logs    │ setting_value   │ │ widget_type     │
                                           ├─────────────────┤ category        │ │ title           │
                                           │ id (PK)         │ description     │ │ configuration   │
                                           │ user_id (FK)    │ data_type       │ │ position_x      │
                                           │ action          │ is_editable     │ │ position_y      │
                                           │ entity_type     │ updated_by (FK) │ │ width           │
                                           │ entity_id       │ updated_at      │ │ height          │
                                           │ old_values      │ └─────────────────┘ │ is_visible      │
                                           │ new_values      │                     │ created_at      │
                                           │ ip_address      │                     │ updated_at      │
                                           │ user_agent      │                     └─────────────────┘
                                           │ created_at      │
                                           └─────────────────┘
```

## Tables de la base de données

### 1. Table `users`
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    position VARCHAR(255),
    phone VARCHAR(20),
    location VARCHAR(255),
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    join_date DATE,
    avatar VARCHAR(500),
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### 2. Table `departments`
```sql
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (manager_id) REFERENCES users(id)
);
```

### 3. Table `attendances`
```sql
CREATE TABLE attendances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('Present', 'Late', 'Absent') DEFAULT 'Present',
    work_hours DECIMAL(4,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_date (employee_id, date)
);
```

### 4. Table `leave_requests`
```sql
CREATE TABLE leave_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    type ENUM('Vacation', 'Sick Leave', 'Personal', 'Other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_on DATE NOT NULL,
    approved_by INT,
    approved_on DATE,
    half_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    CHECK (end_date >= start_date),
    CHECK (days > 0)
);
```

### 5. Table `absences`
```sql
CREATE TABLE absences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    type ENUM('Sick Leave', 'Personal', 'Unplanned') NOT NULL,
    reason TEXT,
    status ENUM('Justified', 'Pending', 'Unjustified') DEFAULT 'Pending',
    document VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_absence_date (employee_id, date)
);
```

### 6. Table `reports`
```sql
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('Weekly', 'Monthly', 'Custom') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    generated_by INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (generated_by) REFERENCES users(id),
    CHECK (period_end >= period_start)
);
```

### 7. Table `notifications`
```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_id INT NOT NULL,
    sender_id INT,
    type ENUM('Leave_Request', 'Absence_Alert', 'System_Update', 'Reminder') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Unread', 'Read', 'Archived') DEFAULT 'Unread',
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_recipient_status (recipient_id, status),
    INDEX idx_created_at (created_at)
);
```

### 8. Table `validation_workflows`
```sql
CREATE TABLE validation_workflows (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('leave_request', 'absence', 'overtime') NOT NULL,
    entity_id INT NOT NULL,
    current_step INT DEFAULT 1,
    total_steps INT DEFAULT 1,
    validator_id INT,
    status ENUM('Pending', 'In_Progress', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    comments TEXT,
    validated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (validator_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_validator_status (validator_id, status)
);
```

### 9. Table `system_settings`
```sql
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    category ENUM('General', 'Attendance', 'Leave', 'Notification') DEFAULT 'General',
    description TEXT,
    data_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    is_editable BOOLEAN DEFAULT TRUE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category)
);
```

### 10. Table `audit_logs`
```sql
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action ENUM('Create', 'Update', 'Delete', 'Login', 'Logout', 'Approve', 'Reject') NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_action (user_id, action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);
```

### 11. Table `dashboard_widgets`
```sql
CREATE TABLE dashboard_widgets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    widget_type ENUM('Attendance_Summary', 'Leave_Requests', 'Quick_Stats', 'Calendar', 'Notifications') NOT NULL,
    title VARCHAR(255) NOT NULL,
    configuration JSON,
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    width INT DEFAULT 1,
    height INT DEFAULT 1,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_visible (user_id, is_visible)
);
```

## Index pour optimisation des performances

```sql
-- Index sur les tables principales
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_attendances_employee_date ON attendances(employee_id, date);
CREATE INDEX idx_attendances_date ON attendances(date);
CREATE INDEX idx_attendances_status ON attendances(status);

CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);

CREATE INDEX idx_absences_employee_date ON absences(employee_id, date);
CREATE INDEX idx_absences_status ON absences(status);

CREATE INDEX idx_reports_generated_by ON reports(generated_by);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);
```

## Vues pour faciliter les requêtes

### Vue des employés avec département
```sql
CREATE VIEW employee_details AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.position,
    u.phone,
    u.location,
    u.status,
    u.join_date,
    d.name as department_name,
    d.id as department_id
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
WHERE u.role = 'employee';
```

### Vue des présences avec détails employé
```sql
CREATE VIEW attendance_details AS
SELECT 
    a.id,
    a.date,
    a.check_in_time,
    a.check_out_time,
    a.status,
    a.work_hours,
    a.notes,
    u.name as employee_name,
    u.email as employee_email,
    d.name as department_name
FROM attendances a
JOIN users u ON a.employee_id = u.id
LEFT JOIN departments d ON u.department_id = d.id;
```

### Vue des demandes de congé avec détails
```sql
CREATE VIEW leave_request_details AS
SELECT 
    lr.id,
    lr.type,
    lr.start_date,
    lr.end_date,
    lr.days,
    lr.reason,
    lr.status,
    lr.applied_on,
    lr.approved_on,
    lr.half_day,
    emp.name as employee_name,
    emp.email as employee_email,
    emp.id as employee_id,
    mgr.name as approved_by_name,
    d.name as department_name
FROM leave_requests lr
JOIN users emp ON lr.employee_id = emp.id
LEFT JOIN users mgr ON lr.approved_by = mgr.id
LEFT JOIN departments d ON emp.department_id = d.id;
```

### Vue des statistiques départementales
```sql
CREATE VIEW department_stats AS
SELECT 
    d.id,
    d.name as department_name,
    COUNT(DISTINCT u.id) as total_employees,
    COUNT(DISTINCT CASE WHEN a.status = 'Present' THEN a.employee_id END) as present_today,
    COUNT(DISTINCT CASE WHEN a.status = 'Absent' THEN a.employee_id END) as absent_today,
    COUNT(DISTINCT CASE WHEN lr.status = 'Pending' THEN lr.id END) as pending_leaves
FROM departments d
LEFT JOIN users u ON d.id = u.department_id
LEFT JOIN attendances a ON u.id = a.employee_id AND a.date = CURDATE()
LEFT JOIN leave_requests lr ON u.id = lr.employee_id AND lr.status = 'Pending'
GROUP BY d.id, d.name;
```

### Vue du tableau de bord administrateur
```sql
CREATE VIEW admin_dashboard AS
SELECT 
    'summary' as widget_type,
    JSON_OBJECT(
        'total_employees', (SELECT COUNT(*) FROM users WHERE role = 'employee'),
        'present_today', (SELECT COUNT(DISTINCT employee_id) FROM attendances WHERE date = CURDATE() AND status = 'Present'),
        'pending_leaves', (SELECT COUNT(*) FROM leave_requests WHERE status = 'Pending'),
        'pending_workflows', (SELECT COUNT(*) FROM validation_workflows WHERE status = 'Pending'),
        'unread_notifications', (SELECT COUNT(*) FROM notifications WHERE status = 'Unread')
    ) as data;
```

### Vue des notifications en attente
```sql
CREATE VIEW pending_notifications AS
SELECT 
    n.id,
    n.title,
    n.message,
    n.type,
    n.priority,
    n.created_at,
    u_recipient.name as recipient_name,
    u_sender.name as sender_name,
    n.related_entity_type,
    n.related_entity_id
FROM notifications n
JOIN users u_recipient ON n.recipient_id = u_recipient.id
LEFT JOIN users u_sender ON n.sender_id = u_sender.id
WHERE n.status = 'Unread'
ORDER BY 
    CASE n.priority 
        WHEN 'Urgent' THEN 1
        WHEN 'High' THEN 2
        WHEN 'Medium' THEN 3
        WHEN 'Low' THEN 4
    END,
    n.created_at DESC;
```

### Vue des workflows de validation
```sql
CREATE VIEW validation_queue AS
SELECT 
    vw.id,
    vw.entity_type,
    vw.entity_id,
    vw.current_step,
    vw.total_steps,
    vw.status,
    vw.created_at,
    u_validator.name as validator_name,
    CASE vw.entity_type
        WHEN 'leave_request' THEN (SELECT CONCAT(u.name, ' - ', lr.type) FROM leave_requests lr JOIN users u ON lr.employee_id = u.id WHERE lr.id = vw.entity_id)
        WHEN 'absence' THEN (SELECT CONCAT(u.name, ' - ', ab.type) FROM absences ab JOIN users u ON ab.employee_id = u.id WHERE ab.id = vw.entity_id)
        ELSE 'Unknown'
    END as entity_description
FROM validation_workflows vw
LEFT JOIN users u_validator ON vw.validator_id = u_validator.id
WHERE vw.status IN ('Pending', 'In_Progress')
ORDER BY vw.created_at ASC;
```

## Triggers pour automatisation

### Calcul automatique des heures travaillées
```sql
DELIMITER //
CREATE TRIGGER calculate_work_hours
    BEFORE UPDATE ON attendances
    FOR EACH ROW
BEGIN
    IF NEW.check_in_time IS NOT NULL AND NEW.check_out_time IS NOT NULL THEN
        SET NEW.work_hours = TIME_TO_SEC(TIMEDIFF(NEW.check_out_time, NEW.check_in_time)) / 3600;
    END IF;
END//
DELIMITER ;
```

### Détermination automatique du statut de présence
```sql
DELIMITER //
CREATE TRIGGER set_attendance_status
    BEFORE INSERT ON attendances
    FOR EACH ROW
BEGIN
    IF NEW.check_in_time IS NULL THEN
        SET NEW.status = 'Absent';
    ELSEIF NEW.check_in_time > '08:15:00' THEN
        SET NEW.status = 'Late';
    ELSE
        SET NEW.status = 'Present';
    END IF;
END//
DELIMITER ;
```

### Calcul automatique des jours de congé
```sql
DELIMITER //
CREATE TRIGGER calculate_leave_days
    BEFORE INSERT ON leave_requests
    FOR EACH ROW
BEGIN
    IF NEW.half_day = TRUE THEN
        SET NEW.days = 0.5;
    ELSE
        SET NEW.days = DATEDIFF(NEW.end_date, NEW.start_date) + 1;
    END IF;
END//
DELIMITER ;
```

## Procédures stockées utiles

### Génération de rapport mensuel
```sql
DELIMITER //
CREATE PROCEDURE GenerateMonthlyReport(
    IN report_month INT,
    IN report_year INT,
    IN generated_by_user INT
)
BEGIN
    DECLARE report_data JSON;
    
    SELECT JSON_OBJECT(
        'total_employees', COUNT(DISTINCT u.id),
        'total_present_days', COUNT(CASE WHEN a.status IN ('Present', 'Late') THEN 1 END),
        'total_absent_days', COUNT(CASE WHEN a.status = 'Absent' THEN 1 END),
        'average_work_hours', AVG(a.work_hours),
        'department_stats', JSON_ARRAYAGG(
            JSON_OBJECT(
                'department', d.name,
                'attendance_rate', 
                COUNT(CASE WHEN a.status IN ('Present', 'Late') THEN 1 END) * 100.0 / COUNT(*)
            )
        )
    ) INTO report_data
    FROM users u
    LEFT JOIN attendances a ON u.id = a.employee_id 
        AND MONTH(a.date) = report_month 
        AND YEAR(a.date) = report_year
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE u.role = 'employee';
    
    INSERT INTO reports (type, period_start, period_end, generated_by, data)
    VALUES (
        'Monthly',
        DATE(CONCAT(report_year, '-', LPAD(report_month, 2, '0'), '-01')),
        LAST_DAY(DATE(CONCAT(report_year, '-', LPAD(report_month, 2, '0'), '-01'))),
        generated_by_user,
        report_data
    );
END//
DELIMITER ;
```

## Contraintes d'intégrité supplémentaires

```sql
-- Contrainte pour éviter les conflits de présence/absence
ALTER TABLE attendances ADD CONSTRAINT chk_valid_times 
CHECK (check_out_time IS NULL OR check_in_time IS NULL OR check_out_time > check_in_time);

-- Contrainte pour les rôles d'approbation
ALTER TABLE leave_requests ADD CONSTRAINT chk_approver_role
CHECK (approved_by IS NULL OR 
       (SELECT role FROM users WHERE id = approved_by) = 'admin');

-- Contrainte pour éviter l'auto-approbation
ALTER TABLE leave_requests ADD CONSTRAINT chk_no_self_approval
CHECK (employee_id != approved_by);
```

## Données de référence

```sql
-- Insertion des départements par défaut
INSERT INTO departments (name, description) VALUES
('Engineering', 'Équipe de développement et technique'),
('Marketing', 'Équipe marketing et communication'),
('HR', 'Ressources humaines'),
('Finance', 'Équipe financière et comptabilité'),
('Operations', 'Opérations et logistique');

-- Insertion de l'utilisateur admin par défaut
INSERT INTO users (email, password, name, role, position, status, join_date) VALUES
('admin@example.com', '$2b$10$hashedpassword', 'Admin User', 'admin', 'HR Director', 'Active', CURDATE());
```

## Optimisations et bonnes pratiques

1. **Partitioning** : Considérer le partitioning de la table `attendances` par date pour améliorer les performances
2. **Archivage** : Mettre en place une stratégie d'archivage pour les données anciennes (> 2 ans)
3. **Backup** : Sauvegardes régulières avec point de restauration
4. **Monitoring** : Surveillance des performances des requêtes fréquentes
5. **Sécurité** : Chiffrement des mots de passe et données sensibles
