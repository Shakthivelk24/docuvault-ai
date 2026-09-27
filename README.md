# 🔐 DocuVault AI — Secure DevOps Pipeline

> A secure, cloud-ready document management system with an automated DevSecOps CI/CD pipeline using GitHub Actions, Docker, Trivy, Semgrep, TruffleHog, AWS IAM, and Amazon ECR.

---

## 📌 Project Overview

**DocuVault AI** is a secure AI-powered cloud document management system designed to allow users to upload, manage, and process documents securely.

The project follows a **DevSecOps approach**, integrating security checks directly into the CI/CD pipeline.

The current pipeline automatically:

- Builds the frontend
- Builds and validates the backend
- Scans dependencies
- Scans the repository for exposed secrets
- Performs Static Application Security Testing (SAST)
- Builds Docker images
- Scans Docker images for vulnerabilities
- Authenticates with AWS using GitHub OIDC
- Pushes verified Docker images to Amazon ECR

The next deployment stage is Kubernetes.

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      Developer       │
                         │      Git Push        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     GitHub Repo      │
                         │  Shakthivelk24/      │
                         │    docuvault-ai      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       GitHub Actions         │
                    │                              │
                    │  Frontend CI                 │
                    │  Backend CI                  │
                    │  npm Audit                   │
                    │  TruffleHog                  │
                    │  Semgrep SAST                │
                    │  Docker Build                │
                    │  Trivy Image Scan            │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │    GitHub OIDC       │
                         │         ↓            │
                         │     AWS IAM Role     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Amazon ECR       │
                         │                      │
                         │  docuvault-client    │
                         │  docuvault-server    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Kubernetes       │
                         │      (Next Stage)    │
                         └──────────────────────┘
```
## 🚀 DevSecOps Pipeline

The current pipeline consists of the following stages:
```
Code Push
   │
   ▼
Frontend CI
   │
   ├── npm ci
   ├── npm audit
   └── npm run build
   │
   ▼
Backend CI
   │
   ├── npm ci
   └── npm audit
   │
   ▼
Secret Scanning
   │
   └── TruffleHog
   │
   ▼
SAST
   │
   └── Semgrep
   │
   ▼
Docker Build
   │
   ├── Frontend Image
   └── Backend Image
   │
   ▼
Container Security
   │
   └── Trivy
   │
   ▼
GitHub OIDC
   │
   ▼
AWS IAM
   │
   ▼
Amazon ECR
   │
   ├── docuvault-client
   └── docuvault-server
```

## 🛠️ Technology Stack

### Frontend

- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 🔐 Clerk Authentication
- 📡 Axios
- 🟨 JavaScript

### Backend

- 🟢 Node.js
- 🚀 Express.js
- 🟨 JavaScript
- 🔐 Clerk
- ☁️ AWS SDK
- 🔗 REST APIs
- 📡 Server-Sent Events (SSE)

### AWS Services

- 🪣 Amazon S3
- 🗄️ Amazon DynamoDB
- ⚡ AWS Lambda
- 📦 Amazon ECR
- 🔐 AWS IAM
- 🔑 AWS OIDC Integration

### Security & DevSecOps

- ⚙️ GitHub Actions
- 🔑 GitHub OIDC
- 🔍 TruffleHog
- 🛡️ Semgrep
- 🔎 Trivy
- 🐳 Docker
- 🔐 npm Audit

### AI

- 🤖 Google Gemini API
## 🔒 Security Controls

### 1. Dependency Security

The pipeline performs dependency vulnerability scanning using:

```
npm audit --audit-level=high
```
This is executed for both:

Frontend <br>
Backend

### 2. Secret Scanning

The repository is scanned using TruffleHog.
```
uses: trufflesecurity/trufflehog@main
```
The pipeline uses:
```
--only-verified
```
to identify verified secrets.

Sensitive credentials such as:

- AWS secret keys 
- Gemini API keys
- Clerk secret keys <br>
are not stored directly in source code.

### 3. Static Application Security Testing

The project uses Semgrep for SAST.

Current rules:
```
p/javascript
p/security-audit
```
Semgrep analyzes the application source code for potential security issues.
### 4. Docker Image Security

Both Docker images are scanned using Trivy.

#### Frontend
```
docuvault-client:<commit-sha>
```
#### Backend
```
docuvault-server:<commit-sha>
```
The pipeline checks for:
```
HIGH
CRITICAL
```
severity vulnerabilities.

The workflow is configured with:
```
exit-code: '1'
```
Therefore, a detected HIGH or CRITICAL vulnerability can stop the pipeline

## 🐳 Docker Images

The project contains separate Dockerfiles.
```
docker/
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
│
└── backend/
    └── Dockerfile
```
#### Frontend

The frontend is built using a multi-stage Docker build.

The production container uses Nginx.
```
React
  ↓
Node.js Build
  ↓
Production Build
  ↓
Nginx
```
#### Backend

The backend is containerized separately.
```
Node.js
   ↓
Express
   ↓
Docker
```

## ☁️ AWS Infrastructure
### AWS Region

The DevSecOps container infrastructure uses:
The DevSecOps container infrastructure uses:
```
ap-south-1
```
AWS region:
```
Asia Pacific (Mumbai)
```
## 📦 Amazon ECR
Two private ECR repositories are used.
#### Frontend
```
docuvault-client
```
#### Backend
```
docuvault-server
```
Both repositories use:
```
Private repository
Immutable image tags
AES-256 encryption
```
## 🔑 GitHub OIDC Authentication
The pipeline does not use long-lived AWS access keys.
Instead, GitHub Actions authenticates to AWS using:
```
GitHub OIDC
       ↓
AWS IAM
       ↓
Temporary AWS credentials
       ↓
Amazon ECR
```
#### IAM role:
```
DocuVaultGitHubActionsECRRole
```
This role is restricted to the GitHub repository:
```
Shakthivelk24/docuvault-ai
```
and the **main** branch.
## 🏷️ Docker Image Tagging
Docker images are tagged using the GitHub commit SHA:
```
${{ github.sha }}
```
Example:
```
docuvault-client:8f42a91...
```
and:
```
docuvault-server:8f42a91...
```
This provides unique image versions for each commit. <br>
Because the ECR repositories use immutable tags, the pipeline does not repeatedly overwrite the latest tag.
## 📁 Project Structure
```
docuvault-ai/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── docker/
│   ├── frontend/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   │
│   └── backend/
│       └── Dockerfile
│
├── k8s/
│   ├── namespace.yaml
│   ├── client-deployment.yaml
│   ├── client-service.yaml
│   ├── server-deployment.yaml
│   ├── server-service.yaml
│   └── secrets.yaml
│
├── .github/
│   └── workflows/
│       └── secure-devops.yml
│
├── .gitignore
└── README.md
```
The k8s/ directory contains the Kubernetes deployment configuration being prepared for the next stage.

## ⚙️ GitHub Actions Workflow
The workflow is located at:
```
.github/workflows/secure-devops.yml
```
The workflow runs on:
```
main
develop
```
and pull requests targeting these branches.
## 🔄 Pipeline Trigger
#### Push to main
A push to **main** runs the complete pipeline.
```
Git Push
   ↓
CI
   ↓
Security
   ↓
Docker Build
   ↓
Trivy
   ↓
AWS OIDC
   ↓
ECR Push
```
#### Push to develop
A push to **develop** runs the CI and security pipeline.

ECR publishing is restricted to main.
#### Pull Request
Pull requests run the validation and security checks.

Images are not pushed to ECR from pull requests.
## 🧪 Local Development
#### Frontend
```
cd client
npm install
npm run dev
```
The frontend runs using Vite.
#### Backend
```
cd server
npm install
npm run dev
```
The backend runs using Node.js and Express.

## 🎯 Project Objectives

The main objectives of DocuVault AI are:

- 🔐 Build a secure cloud document management system
- 👤 Implement user authentication
- 🪣 Store documents securely in Amazon S3
- 🗄️ Store document metadata in DynamoDB
- ⚡ Automate document processing using AWS Lambda
- 🤖 Implement AI-powered document analysis
- 🔔 Implement real-time notifications
- 🐳 Containerize frontend and backend applications
- ⚙️ Implement automated CI/CD
- 🛡️ Implement DevSecOps security checks
- 🔍 Detect secrets before deployment
- 🔎 Perform static code security analysis
- 🐳 Scan Docker images for vulnerabilities
- 🔑 Authenticate GitHub Actions with AWS using OIDC
- 📦 Store container images securely in Amazon ECR
- ☸️ Deploy the application using Kubernetes
# 🔮 Future Enhancements

Planned improvements include:

- ☸️ Kubernetes deployment
- ☁️ AWS EKS deployment
- 🔄 Automated ECR-to-Kubernetes deployment
- 🔐 Kubernetes security policies
- 🛡️ Container runtime security
- 📊 Prometheus monitoring
- 📈 Grafana dashboards
- 📝 Centralized logging
- 🚨 Automated vulnerability reporting
- 🤖 Advanced AI document analysis
- 📄 Document text extraction
- 🔎 Improved document search
- ⚖️ Production-grade load balancing
- 🔄 Automated rollback strategy
# 📈 DevSecOps Pipeline Status

| Component | Status |
|---|:---:|
| React Frontend | ✅ |
| Node.js Backend | ✅ |
| Clerk Authentication | ✅ |
| Amazon S3 | ✅ |
| DynamoDB | ✅ |
| AWS Lambda | ✅ |
| Gemini AI Integration | ✅ |
| Docker | ✅ |
| GitHub Actions | ✅ |
| npm Audit | ✅ |
| TruffleHog | ✅ |
| Semgrep | ✅ |
| Trivy | ✅ |
| GitHub OIDC | ✅ |
| AWS IAM | ✅ |
| Amazon ECR | ✅ |
| Kubernetes Manifests | 🚧 |
| Kubernetes Deployment | 🚧 |
| AWS EKS | 🚧 |
| Prometheus | 🚧 |
| Grafana | 🚧 |
# 👨‍💻 Author

**Shakthi Vel K**

Computer Science Engineering Student

### 🔗 GitHub

https://github.com/Shakthivelk24

### 📦 Project Repository

https://github.com/Shakthivelk24/docuvault-ai

# 📄 License

This project is developed for educational, academic, and project demonstration purposes.

### One important point

I intentionally marked **Kubernetes deployment, EKS, Prometheus, and Grafana as 🚧** because you haven't completed those parts yet. Your **GitHub Actions → Trivy → OIDC → IAM → ECR pipeline is already completed successfully**, so those are marked `✅`.

