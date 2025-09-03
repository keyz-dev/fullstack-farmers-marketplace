# Unified Application System

## Overview

This system consolidates farmer and delivery agent applications into a single unified `Application` model, providing better admin management, consistent application lifecycle, and easier maintenance.

## Key Benefits

1. **Single Admin Dashboard**: All applications in one place
2. **Consistent Workflow**: Same status tracking and review process
3. **Better Maintainability**: One model instead of two
4. **Scalability**: Easy to add new application types
5. **Unified Reporting**: Single source of truth for analytics

## Architecture

### Models

#### Application Model

- **Unified Schema**: Handles both farmer and delivery agent data
- **Type-specific Fields**: Separate fields for each application type
- **Common Fields**: Shared fields like documents, payment methods, admin review
- **Status Management**: Draft → Pending → Under Review → Approved/Rejected

#### User Model

- **Role Management**: Supports all application states
- **Email Verification**: Built-in verification system
- **Auth Integration**: JWT-based authentication

### Services

#### ApplicationService

- **Application Initiation**: Creates draft applications
- **Application Submission**: Converts drafts to pending applications
- **Status Management**: Handles application lifecycle
- **Admin Operations**: Review, approve, reject applications

#### RegistrationService

- **User Registration**: Creates new user accounts
- **Application Initiation**: Starts application process
- **Validation**: Ensures data integrity

### Controllers

#### Auth Controller

- **Unified Login**: Handles all user types
- **Application Context**: Returns application status with login
- **Google OAuth**: Social login integration
- **Email Verification**: Secure account activation

#### Application Controller

- **CRUD Operations**: Full application management
- **Admin Review**: Application approval/rejection
- **Status Updates**: Application lifecycle management

#### Registration Controller

- **User Onboarding**: Complete registration flow
- **Application Initiation**: Start application process
- **Requirements**: Get application requirements

## Application Flow

### 1. User Registration

```
POST /v2/api/registration/client
POST /v2/api/registration/farmer
POST /v2/api/registration/delivery-agent
```

### 2. Application Initiation

- Creates user account
- Creates draft application
- Sets user role to `incomplete_farmer` or `incomplete_delivery_agent`

### 3. Application Completion

- User fills out application details
- Uploads required documents
- Submits for review

### 4. Admin Review

- Admin reviews application
- Approves, rejects, or requests changes
- Updates user role accordingly

## API Endpoints

### Authentication

- `POST /v2/api/auth/login` - User login
- `POST /v2/api/auth/google-login` - Google OAuth login
- `POST /v2/api/auth/google-signup` - Google OAuth signup
- `POST /v2/api/auth/verify-email` - Email verification
- `POST /v2/api/auth/forgot-password` - Password reset
- `POST /v2/api/auth/reset-password` - Set new password

### Applications

- `GET /v2/api/applications` - Get all applications (admin)
- `GET /v2/api/applications/my` - Get user's applications
- `GET /v2/api/applications/:id` - Get specific application
- `POST /v2/api/applications/farmer` - Submit farmer application
- `POST /v2/api/applications/delivery-agent` - Submit delivery agent application
- `PUT /v2/api/applications/:id/review` - Review application (admin)

### Registration

- `POST /v2/api/registration/client` - Register client
- `POST /v2/api/registration/farmer` - Initiate farmer registration
- `POST /v2/api/registration/delivery-agent` - Initiate delivery agent registration
- `GET /v2/api/registration/requirements/:type` - Get requirements
- `GET /v2/api/registration/eligibility/:type` - Check eligibility

## User Roles

- `client` - Basic customer
- `incomplete_farmer` - Farmer with draft application
- `pending_farmer` - Farmer with submitted application
- `farmer` - Approved farmer
- `incomplete_delivery_agent` - Delivery agent with draft application
- `pending_delivery_agent` - Delivery agent with submitted application
- `delivery_agent` - Approved delivery agent
- `admin` - System administrator

## Application Statuses

- `draft` - Initial state, user can edit
- `pending` - Submitted for review
- `under_review` - Admin is reviewing
- `approved` - Application accepted
- `rejected` - Application denied
- `suspended` - Temporarily suspended

## Migration

The system includes a migration script to move existing data from separate `Farmer` and `DeliveryAgent` models to the unified `Application` model.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification
- Role-based access control
- Input validation and sanitization

## Future Enhancements

- Support for additional application types (vendor, partner, etc.)
- Advanced analytics and reporting
- Bulk operations for admins
- Application templates
- Automated approval workflows
