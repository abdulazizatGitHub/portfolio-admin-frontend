# Authentication System Documentation

This document provides a technical overview of the security architecture and authentication flow implemented for the Portfolio Admin Dashboard.

## 🔐 Architecture Overview

The system uses a **JWT (JSON Web Token)** based authentication strategy, reinforced with **HttpOnly Cookies** to prevent Cross-Site Scripting (XSS) attacks.

### Key Components:

- **Access Token**: Short-lived JWT used for immediate authorization.
- **Refresh Token**: Longer-lived JWT used to transparently renew sessions.
- **HttpOnly Cookies**: Secure storage mechanism for tokens, inaccessible via client-side JavaScript.

---

## 🛠️ Backend Implementation

### 1. Token Management

Managed by `src/core/services/token.service.ts`, the system generates a dual-token pair upon successful authentication.

- **Storage**: Tokens are sent to the client via `res.cookie` with the following security flags:
  - `httpOnly: true`: Blocks JS access.
  - `secure: true`: (Production only) Ensures transmission over HTTPS.
  - `sameSite: 'lax'`: Protects against CSRF while allowing seamless redirects.

### 2. Authentication Middleware

The `authenticate` middleware in `src/api/middlewares/auth.middleware.ts` acts as the gatekeeper for private routes:

1.  Checks `req.cookies.accessToken` (Primary).
2.  Falls back to `Authorization: Bearer <token>` header (Secondary).
3.  Verifies the JWT and attaches the decrypted payload (`user.id`, `user.role`) to the `req` object.

### 3. Session Endpoints

- `POST /auth/login`: verifies credentials -> sets cookies -> returns limited user profile (Name, Email, Role).
- `POST /auth/refresh`: validates refresh cookie -> rotates BOTH tokens -> updates cookies.
- `POST /auth/logout`: explicitly clears both cookies via `res.clearCookie`.
- `GET /auth/me`: returns the profile of the current authenticated user.

---

## 💻 Frontend Implementation

### 1. Unified Auth Context

Managed by `src/lib/contexts/AuthContext.tsx`, providing a global `user` state and `isAuthenticated` boolean.

- **Initialization**: On boot, the app calls `/auth/me`. If a valid `accessToken` cookie exists, the user is automatically logged in.
- **Login/Logout**: Orchestrates the API calls, manages global loading states, and triggers success/error notifications using **Sonner Toasts**.

### 2. Automatic Token Refresh (Axios Interceptor)

Located in `src/lib/api/api.tsx`, the interceptor automatically handles expired sessions:

- If an API call returns `401 Unauthorized`, the interceptor transparently calls `/auth/refresh`.
- If the refresh succeeds, the original failing request is retried.
- If the refresh fails (i.e., session totally expired), the user is redirected to `/login`.

### 3. Route Protection

Implemented in `src/components/layout/AdminLayout.tsx`:

- Monitors the `isAuthenticated` state.
- If a user attempts to access an admin sub-page without a session, they are immediately redirected to `/login`.
- While the session is being verified, a high-fidelity loading spinner is displayed to prevent "UI flickering".

---

## 🛡️ Security Best Practices Followed

1.  **Strict Field Exposure**: The backend only returns essential user fields (`email`, `name`, `role`). Internal IDs and sensitive metadata are never leaked to the client.
2.  **Stateless Sessions**: The server doesn't store session state, making it horizontally scalable.
3.  **Cross-Origin Isolation**: CORS is strictly configured to only allow requests from the specific frontend origin with `credentials: true`.
4.  **Automatic Redirection**: Unauthorized requests are trapped both at the API level (interceptor) and the UI level (AdminLayout).
