# 🛡️ EtherTrust (SWE 10)

EtherTrust is a decentralized lending platform that enables users to act as **borrowers** and **lenders** in a secure, transparent, and blockchain-powered ecosystem. Built as a full-stack web application with Ethereum smart contracts, EtherTrust offers features like wallet-based login, loan management, and secure identity handling.

This project was developed in an Agile environment as part of the SWE 10 course, completed by a team of four engineers over multiple sprints.

---

## 🧠 Project Goals

- Connect borrowers and lenders using Ethereum smart contracts
- Provide a secure login system with JWT token authentication
- Store and manage loans in a structured NoSQL database
- Offer a frontend dashboard for both borrowers and lenders
- Make loans transparent, immutable, and blockchain-verifiable

---

## 👥 Our Team

| Name     | Role                                 |
|----------|--------------------------------------|
| Anthony  | Backend Developer / Project Manager  |
| John     | Frontend Developer / Scrum Master    |
| Jack     | Frontend Developer                   |
| Semyon   | Backend Developer                    |

---

## 🔧 How to Run the Project

### 🖼️ Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

### 🖥️ Backend (Node.js + Express)

```bash
cd backend
npm install
npm start
```

Runs on: `http://localhost:3000`

Be sure to configure your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## ⚙️ Technologies Used

### 🧩 Backend

- Node.js
- Express.js
- MongoDB (Local → MongoDB Atlas)
- bcryptjs
- jsonwebtoken (JWT)
- dotenv
- CORS

### 💻 Frontend

- React (with Vite)
- Axios
- Manual form handling (currently minimal UI)
- JWT-based token storage

### 🔗 Blockchain Integration

- Solidity (Smart Contract)
- Ethers.js
- Alchemy
- Sepolia Ethereum Testnet

---

## 🔐 Authentication Flow

1. User submits login credentials via POST `/api/users/login`
2. Backend queries MongoDB for the user
3. Password is compared using bcrypt
4. If valid, JWT token is generated (valid for 1 hour)
5. Token and user info returned to client for secure access

---

## 🧠 Smart Contract Integration

- Smart contract written in **Solidity**
- Test environment: **Sepolia**
- Ethereum test wallet funded with mock ETH
- Alchemy used for blockchain connectivity
- Ethers.js handles deployment and interaction from backend

---

## 🛠️ Planned Improvements

- 🌐 Move off localhost and deploy backend (e.g., AWS, Render)
- ☁️ Use MongoDB Atlas instead of local DB
- 🔐 Strengthen web token security
- ⚖️ Add legal contract phrasing to blockchain terms
- ❗ Improve backend error handling for better frontend response
- 🧪 Add automated frontend tests

---

## 📝 License

This project is licensed under the MIT License.  
Feel free to fork, contribute, and build upon it!

---


