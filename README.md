# 📢 Distributed Notification System

A backend system that simulates a real-world distributed notification service similar to those used by large-scale applications (e.g., email, SMS, or push notification platforms).

This project demonstrates how notification requests are handled asynchronously using a producer–consumer architecture with retry mechanisms and a Dead Letter Queue (DLQ) for fault tolerance.

---

## 🚀 Why This Project Matters

Modern applications cannot send notifications synchronously due to scalability and reliability concerns.  
This system is designed to showcase how large-scale backend services:

- Decouple API requests from background processing
- Handle failures gracefully using retries and DLQ
- Maintain eventual consistency
- Use worker services for asynchronous execution

The goal of this project is to practice and demonstrate real-world **System Design and Backend Engineering concepts**.

---

## 🧠 Key Features

- ✅ REST API to create notification jobs  
- ✅ MongoDB persistence using Mongoose  
- ✅ Background Worker (Consumer) to process notifications  
- ✅ Retry mechanism for transient failures  
- ✅ Dead Letter Queue (DLQ) for permanently failed jobs  
- ✅ Simulated delivery failures for testing reliability  
- ✅ Clear job lifecycle: `pending → processing → sent / dlq`  

---

## 🏗️ Architecture

Client
|
v
Express API (Producer)
|
v
MongoDB (Job Store)
|
v
Worker Service (Consumer)
| |
v v
Sent Retry / DLQ

yaml
Copy code

---

## 🛠️ Tech Stack

- **Node.js & Express** – REST API  
- **MongoDB & Mongoose** – Persistence layer  
- **Background Worker** – Asynchronous job processing  
- **Postman / curl** – API testing  
- **MongoDB Compass** – Data inspection  

---

## 🔁 Notification Lifecycle

pending → processing → sent
↘ retry
pending → ... → dlq

yaml
Copy code

- Jobs are picked every few seconds by a worker
- Failed jobs are retried up to 3 times
- After 3 failures, jobs are moved to DLQ

---

## 📚 What I Learned From This Project

- Designing a producer–consumer architecture
- Implementing retry and failure handling logic
- Managing background workers
- Modeling job states in a database
- Understanding eventual consistency
- Building scalable backend workflows
- Applying system design concepts in code

---

## 🎯 Future Improvements

- Integrate message queue (Kafka / RabbitMQ / SQS)
- Add idempotency keys
- Add rate limiting
- Add exponential backoff retries
- Add Docker support
- Add monitoring & logging
- Add authentication and authorization
- Horizontal scaling with multiple workers

---

## 👨‍💻 Author

**Manikanta Kovvuri**  
Backend & System Design Enthusiast  

---
