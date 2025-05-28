# Modèle Conceptuel de Données (MCD) - Verdant Presence Pulse

## Vue d'ensemble
Ce système de gestion de présence (AttendEase) permet de gérer les employés, leur présence, leurs congés et absences avec des rapports détaillés.

## Entités principales

### 1. UTILISATEUR (USER)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - email (unique, obligatoire)
  - password (obligatoire)
  - name (obligatoire)
  - role (admin/employee)
  - position (poste occupé)
  - phone
  - location
  - status (Active/On Leave/Inactive)
  - joinDate (date d'embauche)
  - avatar

### 2. DÉPARTEMENT (DEPARTMENT)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - name (nom du département)
  - description
  - manager_id (référence vers USER)

### 3. PRÉSENCE (ATTENDANCE)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - employee_id (référence vers USER)
  - date (date de présence)
  - check_in_time (heure d'arrivée)
  - check_out_time (heure de départ)
  - status (Present/Late/Absent)
  - work_hours (heures travaillées)
  - notes
  - created_at
  - updated_at

### 4. DEMANDE_CONGÉ (LEAVE_REQUEST)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - employee_id (référence vers USER)
  - type (Vacation/Sick Leave/Personal/Other)
  - start_date (date de début)
  - end_date (date de fin)
  - days (nombre de jours)
  - reason (motif)
  - status (Pending/Approved/Rejected)
  - applied_on (date de demande)
  - approved_by (référence vers USER - admin)
  - approved_on (date d'approbation)
  - half_day (booléen)

### 5. ABSENCE (ABSENCE)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - employee_id (référence vers USER)
  - date (date d'absence)
  - type (Sick Leave/Personal/Unplanned)
  - reason (motif)
  - status (Justified/Pending/Unjustified)
  - document (fichier justificatif)
  - created_at
  - updated_at

### 6. RAPPORT (REPORT)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - type (Weekly/Monthly/Custom)
  - period_start
  - period_end
  - generated_by (référence vers USER)
  - generated_at
  - data (données JSON du rapport)

### 7. NOTIFICATION (NOTIFICATION)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - recipient_id (référence vers USER)
  - sender_id (référence vers USER)
  - type (Leave_Request/Absence_Alert/System_Update/Reminder)
  - title (titre de la notification)
  - message (contenu du message)
  - status (Unread/Read/Archived)
  - priority (Low/Medium/High/Urgent)
  - related_entity_type (leave_request/absence/attendance)
  - related_entity_id (ID de l'entité liée)
  - created_at
  - read_at

### 8. VALIDATION_WORKFLOW (VALIDATION_WORKFLOW)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - entity_type (leave_request/absence/overtime)
  - entity_id (ID de l'entité à valider)
  - current_step (étape actuelle du workflow)
  - total_steps (nombre total d'étapes)
  - validator_id (référence vers USER - validateur actuel)
  - status (Pending/In_Progress/Approved/Rejected/Cancelled)
  - comments (commentaires du validateur)
  - validated_at
  - created_at
  - updated_at

### 9. PARAMETRE_SYSTEME (SYSTEM_SETTING)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - key (clé du paramètre)
  - value (valeur du paramètre)
  - category (General/Attendance/Leave/Notification)
  - description (description du paramètre)
  - data_type (string/integer/boolean/json)
  - is_editable (booléen)
  - updated_by (référence vers USER)
  - updated_at

### 10. AUDIT_LOG (AUDIT_LOG)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - user_id (référence vers USER)
  - action (Create/Update/Delete/Login/Logout)
  - entity_type (user/attendance/leave_request/etc.)
  - entity_id (ID de l'entité affectée)
  - old_values (anciennes valeurs JSON)
  - new_values (nouvelles valeurs JSON)
  - ip_address
  - user_agent
  - created_at

### 11. DASHBOARD_WIDGET (DASHBOARD_WIDGET)
- **Identifiant** : id (clé primaire)
- **Attributs** :
  - user_id (référence vers USER)
  - widget_type (Attendance_Summary/Leave_Requests/Quick_Stats/Calendar)
  - title (titre du widget)
  - configuration (configuration JSON)
  - position_x (position horizontale)
  - position_y (position verticale)
  - width (largeur)
  - height (hauteur)
  - is_visible (booléen)
  - created_at
  - updated_at

## Relations

### Relations principales :

1. **USER appartient à DÉPARTEMENT** (1:N)
   - Un utilisateur appartient à un département
   - Un département peut avoir plusieurs utilisateurs

2. **USER enregistre PRÉSENCE** (1:N)
   - Un utilisateur peut avoir plusieurs enregistrements de présence
   - Chaque présence appartient à un seul utilisateur

3. **USER fait DEMANDE_CONGÉ** (1:N)
   - Un utilisateur peut faire plusieurs demandes de congé
   - Chaque demande appartient à un seul utilisateur

4. **USER (admin) approuve DEMANDE_CONGÉ** (1:N)
   - Un admin peut approuver plusieurs demandes
   - Chaque demande est approuvée par un seul admin

5. **USER déclare ABSENCE** (1:N)
   - Un utilisateur peut déclarer plusieurs absences
   - Chaque absence appartient à un seul utilisateur

6. **USER génère RAPPORT** (1:N)
   - Un utilisateur (admin) peut générer plusieurs rapports
   - Chaque rapport est généré par un seul utilisateur

7. **USER reçoit/envoie NOTIFICATION** (1:N)
   - Un utilisateur peut recevoir plusieurs notifications
   - Un utilisateur peut envoyer plusieurs notifications
   - Chaque notification a un destinataire et un expéditeur

8. **VALIDATION_WORKFLOW valide DEMANDE_CONGÉ/ABSENCE** (1:1)
   - Chaque demande de congé ou absence peut avoir un workflow de validation
   - Chaque workflow est lié à une seule entité

9. **USER valide VALIDATION_WORKFLOW** (1:N)
   - Un utilisateur (admin) peut valider plusieurs workflows
   - Chaque workflow est validé par un seul utilisateur

10. **USER configure PARAMETRE_SYSTEME** (1:N)
    - Un utilisateur (admin) peut modifier plusieurs paramètres
    - Chaque paramètre est modifié par un seul utilisateur

11. **USER génère AUDIT_LOG** (1:N)
    - Un utilisateur peut générer plusieurs logs d'audit
    - Chaque log est associé à un seul utilisateur

12. **USER personnalise DASHBOARD_WIDGET** (1:N)
    - Un utilisateur peut avoir plusieurs widgets sur son tableau de bord
    - Chaque widget appartient à un seul utilisateur

## Contraintes métier

### Contraintes d'intégrité :
- Un employé ne peut pas avoir deux enregistrements de présence pour la même date
- Les dates de fin de congé doivent être postérieures aux dates de début
- Seuls les administrateurs peuvent approuver les demandes de congé
- Un employé ne peut pas être présent et absent le même jour
- Les heures de sortie doivent être postérieures aux heures d'entrée

### Règles métier :
- Status "Late" si l'heure d'arrivée > 08:15
- Calcul automatique des heures travaillées
- Notification automatique pour les demandes de congé en attente
- Génération automatique de rapports mensuels
- Archivage des données après 2 ans
- Seuls les administrateurs peuvent accéder aux workflows de validation
- Notifications automatiques lors des changements de statut des demandes
- Audit automatique de toutes les actions administratives
- Paramètres système modifiables uniquement par les super-administrateurs
- Dashboard personnalisable selon le rôle utilisateur
- Workflow de validation configurable selon le type de demande
- Notifications en temps réel pour les actions critiques
- Sauvegarde automatique des configurations de dashboard
- Expiration automatique des notifications après 30 jours
- Validation obligatoire pour les congés de plus de 5 jours

## Schéma conceptuel

```
┌─────────────────┐       ┌─────────────────────────────────────────────────────┐
│   DÉPARTEMENT   │       │                 UTILISATEUR                         │
├─────────────────┤       ├─────────────────────────────────────────────────────┤
│ • id (PK)       │◄──────┤ • id (PK)       • role          • status           │
│ • name          │  1,1  │ • email         • position      • joinDate         │
│ • description   │       │ • password      • phone         • avatar           │
│ • manager_id    │       │ • name          • location      • department_id    │
└─────────────────┘       └─────────────────────────────────────────────────────┘
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          │            │           │           │            │
                          ▼            ▼           ▼           ▼            ▼
              ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
              │    PRÉSENCE     │ │ DEMANDE_CONGÉ   │ │    ABSENCE      │ │  NOTIFICATION   │
              ├─────────────────┤ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
              │ • id (PK)       │ │ • id (PK)       │ │ • id (PK)       │ │ • id (PK)       │
              │ • employee_id   │ │ • employee_id   │ │ • employee_id   │ │ • recipient_id  │
              │ • date          │ │ • type          │ │ • date          │ │ • sender_id     │
              │ • check_in_time │ │ • start_date    │ │ • type          │ │ • type          │
              │ • check_out_time│ │ • end_date      │ │ • reason        │ │ • title         │
              │ • status        │ │ • days          │ │ • status        │ │ • message       │
              │ • work_hours    │ │ • reason        │ │ • document      │ │ • status        │
              │ • notes         │ │ • status        │ └─────────────────┘ │ • priority      │
              └─────────────────┘ │ • applied_on    │                     └─────────────────┘
                                  │ • approved_by   │
                                  │ • approved_on   │                     ┌─────────────────┐
                                  │ • half_day      │                     │VALIDATION_WORKFLOW│
                                  └─────────────────┘                     ├─────────────────┤
                                           │                              │ • id (PK)       │
                                           ▼                              │ • entity_type   │
                                  ┌─────────────────┐                     │ • entity_id     │
                                  │     RAPPORT     │                     │ • current_step  │
                                  ├─────────────────┤                     │ • validator_id  │
                                  │ • id (PK)       │                     │ • status        │
                                  │ • type          │                     │ • comments      │
                                  │ • period_start  │                     └─────────────────┘
                                  │ • period_end    │
                                  │ • generated_by  │     ┌─────────────────┐ ┌─────────────────┐
                                  │ • generated_at  │     │PARAMETRE_SYSTEME│ │DASHBOARD_WIDGET │
                                  │ • data          │     ├─────────────────┤ ├─────────────────┤
                                  └─────────────────┘     │ • id (PK)       │ │ • id (PK)       │
                                                          │ • key           │ │ • user_id       │
                                           ┌─────────────────┐ • value         │ │ • widget_type   │
                                           │   AUDIT_LOG     │ • category      │ │ • title         │
                                           ├─────────────────┤ • description   │ │ • configuration │
                                           │ • id (PK)       │ • data_type     │ │ • position_x    │
                                           │ • user_id       │ • updated_by    │ │ • position_y    │
                                           │ • action        │ └─────────────────┘ │ • is_visible    │
                                           │ • entity_type   │                     └─────────────────┘
                                           │ • entity_id     │
                                           │ • old_values    │
                                           │ • new_values    │
                                           │ • ip_address    │
                                           └─────────────────┘
```

## Cardinalités

```
USER (1,N) ----appartient---- (0,1) DÉPARTEMENT
USER (1,N) ----enregistre---- (0,N) PRÉSENCE
USER (1,N) ----demande---- (0,N) DEMANDE_CONGÉ
USER (1,1) ----approuve---- (0,N) DEMANDE_CONGÉ
USER (1,N) ----déclare---- (0,N) ABSENCE
USER (1,1) ----génère---- (0,N) RAPPORT
```

## Attributs dérivés
- **work_hours** dans PRÉSENCE (calculé à partir de check_in_time et check_out_time)
- **days** dans DEMANDE_CONGÉ (calculé à partir de start_date et end_date)
- **weekly_hours** et **monthly_hours** (agrégation des heures de présence)
- **attendance_percentage** (calculé sur une période donnée)
