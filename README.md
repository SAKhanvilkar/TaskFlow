# Task Management API

A robust, production-ready RESTful API for managing personal tasks. This project features a custom auto-incrementing numeric ID system, secure JWT authentication, and built-in protection against common NoSQL vulnerabilities and request spamming.

## 🚀 Technologies Used

* **Runtime:** Node.js (v18+)
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Security:** JWT (Authentication), Bcrypt (Hashing), Express-Mongo-Sanitize, 


## 🛠️ Key Features

* **Numeric IDs:** Uses a Counter collection to provide human-readable IDs (1, 2, 3...) instead of just long ObjectIds.
* **Input Sanitization:** Protects against NoSQL injection by stripping prohibited characters from inputs.
* **JWT Authentication:** Uses jwt for the security


## Environmental variables
PORT,MONGO_URI,JWT_SECRET


## 📥 Installation & Setup

Follow these steps to get the project running locally:

###. Clone the Repository
```bash
git clone [https://github.com/SAKhanvilkar/TaskFlow](https://github.com/SAKhanvilkar/TaskFlow)
cd task-manager-api