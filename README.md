# **DevsCorner Authentication API**

**A robust and secure Node.js-based backend for handling user authentication in DevsCorner. This system includes signup, login, logout, password reset, and email verification using OTPs. Built using Express, MongoDB, JWT, Bcrypt, and Nodemailer.**

---

## **🧠 Tech Stack**

* **Runtime: Node.js**
* **Framework: Express.js**
* **Database: MongoDB (Mongoose)**
* **Authentication: JWT (Access, Refresh, OTP, Password Reset Tokens)**
* **Encryption: bcrypt, crypto**
* **Email: Nodemailer**

---

## **📁 File Structure Overview**

```
├── controller
│   └── authController.js        # All auth route handlers
├── service
│   └── authService.js          # Business logic for auth
├── repository
│   └── authRepository.js       # MongoDB interaction layer
├── utils
│   ├── otpGenerator.js         # Secure OTP generator
│   ├── isUrlReachable.js       # Utility to test URLs
│   ├── isValidLocation.js      # Validates location via Google Maps API
│   └── responseHelper.js       # Handles success/error response formats
├── config
│   ├── serverConfig.js         # Environment configuration
│   └── nodemailerConfig.js     # Nodemailer transporter configuration
├── schema
│   └── userSchema.js           # Mongoose schema for users
```

---

## 🔐 Routes Breakdown

Each route summary includes:

* 📬 Endpoint + Method
* 📦 Request (body, headers, cookies)
* ✅ Validation rules
* 🔄 Internal Logic
* 📄 Description

---

### 1. `POST /api/v1/auth/signup/initiate`

📬 Request Body:

```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "userName": "string"
}
```

✅ Validation:

* Email: required, valid format, must be unique
* Password:

  * Minimum 8 characters
  * At least one uppercase, one lowercase, one digit, and one special character
* userName:

  * Must be unique
  * Only letters, digits, underscores allowed (Regex: `/^[a-zA-Z0-9_]+$/`)

🔄 Flow:

1. Check DB for existing `email` or `userName`
2. If both are unique, generate OTP
3. Send OTP via email
4. Return `otpVerificationToken` (signed JWT with user info + OTP)

📄 Summary: Initiates registration by verifying uniqueness and sending OTP.

---

### 2. `POST /api/v1/auth/signup/verify`

📬 Headers:

* `Authorization: Bearer <otpVerificationToken>`

📬 Request Body:

```json
{
  "otp": "string"
}
```

✅ Validation:

* OTP must be exactly 6 digits
* Token must be valid and unexpired

🔄 Flow:

1. Decode JWT to extract signup data
2. Match OTP
3. Hash password and save new user in DB

📄 Summary: Finalizes signup and stores user securely after OTP verification.

---

### 3. `POST /api/v1/auth/login`

📬 Request Body:

```json
{
  "identifier": "string",
  "password": "string"
}
```

✅ Validation:

* `identifier`: valid userName or email must exist
* Password must match stored hash (bcrypt)

🔄 Flow:

1. Find user by `identifier`
2. Verify password
3. Issue access and refresh tokens
4. Send access token in body, refresh token in HttpOnly cookie

📄 Summary: Authenticates the user and issues tokens.

---

### 4. `POST /api/v1/auth/logout`

📬 Cookies:

* `refreshToken` (HttpOnly)

🔄 Flow:

1. Clears the cookie containing refresh token

📄 Summary: Logs the user out by removing session token.

---

### 5. `POST /api/v1/auth/forgotPassword`

📬 Request Body:

```json
{
  "identifier": "string"
}
```

✅ Validation:

* `identifier` must match existing user’s email or userName

🔄 Flow:

1. Find user
2. Generate OTP
3. Hash and store OTP
4. Send OTP via email
5. Return `otpVerificationToken`

📄 Summary: Begins password reset by sending a one-time code.

---

### 6. `POST /api/v1/auth/resetPassword`

📬 Headers:

* `Authorization: Bearer <otpVerificationToken>`

📬 Request Body:

```json
{
  "otp": "string"
}
```

✅ Validation:

* Token must be valid and unexpired
* OTP must match hashed OTP in DB

🔄 Flow:

1. Verify OTP and user from token
2. Invalidate OTP
3. Return `passwordResetToken`

📄 Summary: Validates OTP and allows password change.

---

### 7. `POST /api/v1/auth/updatePassword`

📬 Headers:

* `Authorization: Bearer <passwordResetToken>`

📬 Request Body:

```json
{
  "password": "string"
}
```

✅ Validation:

* Password:

  * Minimum 8 characters
  * At least one uppercase, one lowercase, one digit, one special character
* Token must be valid

🔄 Flow:

1. Decode token and find user
2. Hash new password
3. Update DB

📄 Summary: Changes password securely after OTP is verified.

---

## 🔒 Security Notes

* OTPs and tokens are short-lived and hashed
* Strong validation for `password` and `userName`
* bcrypt for password hashing
* Secure cookie usage for refresh tokens

---
## ⚙️ Environment Variables (`.env`)

Vist: https://github.com/Dhiraj-4/DevsCorner_frontend to clone the frontend,

will make the frontend live when the project once its stabilizes.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dhiraj-4/DevsCorner_backend
cd DevsCorner_backend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment

---

## ⚙️ .env Configuration

Create a `.env` file with:

```env
PORT=8080
MONGO_URL=
SMTP_USER=
SMTP_PASS=
OTP_SECRET_KEY=
ACCESS_SECRET_KEY=
REFRESH_SECRET_KEY=
PASSWORD_SECRET_KEY=
NODE_ENV=
GOOGLE_API_KEY=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```
---

### 4. Start development server

```bash
npm start
# or
yarn start
```

---

## 📡 API Integration

* All auth-related routes (signup, login, password reset) are fully connected to DevsCorner’s frontend UI.
* Uses secure token-based password reset system.
* Axios and cors is used for API communication.

---

## 📌 Next Goals

* 💬 Real-time Chat with WebSocket
* 📹 Video Calling with WebRTC
* 📄 Resume Upload Features

---

## 🤝 Contributing

Feel free to fork the repo and submit PRs once the project stabilizes.

---

## 📄 License

I don't know by me i guess
---

## 👤 Author

Made by [Dhiraj Londhe](https://github.com/Dhiraj-4)

```