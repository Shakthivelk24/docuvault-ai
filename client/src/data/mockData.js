// Realistic mock data so the frontend is fully demonstrable without a backend.
// Shapes mirror what the AWS backend (DynamoDB + Textract + Bedrock) will return.

export const FILE_TYPES = ['pdf', 'docx', 'txt', 'png', 'jpg']

export const STATUSES = {
  completed: 'completed',
  processing: 'processing',
  failed: 'failed',
}

// dates are anchored around "today" = 2026-08-24 for a realistic recent feel
export const mockDocuments = [
  {
    id: 'doc-aws-sec-arch',
    name: 'AWS Security Architecture.pdf',
    type: 'pdf',
    size: 2_517_000,
    uploadedAt: '2026-08-24T09:12:00Z',
    modifiedAt: '2026-08-24T09:20:00Z',
    owner: 'You',
    status: 'completed',
    favorite: true,
    pages: 24,
    summary:
      'A reference architecture for securing workloads on AWS. It walks through identity and access management with least-privilege IAM roles, network isolation using VPCs and security groups, encryption of data at rest with KMS and in transit with TLS, and centralized logging via CloudTrail and CloudWatch. The document closes with an incident-response runbook and a checklist mapped to the AWS Well-Architected security pillar.',
    keywords: ['AWS', 'IAM', 'KMS', 'VPC', 'Encryption', 'CloudTrail', 'Zero Trust'],
    classification: { label: 'Technical Document', confidence: 0.94 },
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-24T09:12:00Z' },
      { type: 'ai', label: 'AI processing completed', at: '2026-08-24T09:20:00Z' },
      { type: 'view', label: 'Document viewed', at: '2026-08-24T14:02:00Z' },
    ],
  },
  {
    id: 'doc-cloud-research',
    name: 'Research Paper - Cloud Computing.pdf',
    type: 'pdf',
    size: 3_930_000,
    uploadedAt: '2026-08-22T16:40:00Z',
    modifiedAt: '2026-08-22T16:52:00Z',
    owner: 'You',
    status: 'completed',
    favorite: false,
    pages: 41,
    summary:
      'A survey of modern cloud computing paradigms covering IaaS, PaaS, and serverless models. It compares elasticity and cost trade-offs across providers, examines multi-tenancy isolation, and reviews emerging patterns in edge computing and confidential computing. Benchmarks suggest serverless reduces idle cost but introduces cold-start latency for spiky workloads.',
    keywords: ['Cloud', 'Serverless', 'IaaS', 'PaaS', 'Edge', 'Multi-tenancy'],
    classification: { label: 'Research Paper', confidence: 0.91 },
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-22T16:40:00Z' },
      { type: 'ai', label: 'AI processing completed', at: '2026-08-22T16:52:00Z' },
    ],
  },
  {
    id: 'doc-project-docs',
    name: 'Project Documentation.docx',
    type: 'docx',
    size: 845_000,
    uploadedAt: '2026-08-21T11:05:00Z',
    modifiedAt: '2026-08-23T08:30:00Z',
    owner: 'You',
    status: 'completed',
    favorite: true,
    pages: 12,
    summary:
      'Internal engineering documentation for the SecureDocs platform. Describes the React frontend, the API gateway contract, and the planned data model in DynamoDB. Includes setup instructions, environment variables, and a roadmap for connecting Textract and Bedrock for document intelligence.',
    keywords: ['React', 'API', 'DynamoDB', 'Roadmap', 'Setup'],
    classification: { label: 'Internal Documentation', confidence: 0.88 },
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-21T11:05:00Z' },
      { type: 'ai', label: 'AI processing completed', at: '2026-08-21T11:14:00Z' },
      { type: 'edit', label: 'Renamed document', at: '2026-08-23T08:30:00Z' },
    ],
  },
  {
    id: 'doc-ml-research',
    name: 'Machine Learning Research.pdf',
    type: 'pdf',
    size: 5_240_000,
    uploadedAt: '2026-08-20T19:22:00Z',
    modifiedAt: '2026-08-20T19:41:00Z',
    owner: 'You',
    status: 'completed',
    favorite: false,
    pages: 33,
    summary:
      'An overview of transformer-based architectures and their application to document understanding. Covers attention mechanisms, fine-tuning versus retrieval-augmented generation, and evaluation strategies for summarization and question answering over long documents.',
    keywords: ['Machine Learning', 'Transformers', 'RAG', 'NLP', 'Summarization'],
    classification: { label: 'Research Paper', confidence: 0.96 },
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-20T19:22:00Z' },
      { type: 'ai', label: 'AI processing completed', at: '2026-08-20T19:41:00Z' },
    ],
  },
  {
    id: 'doc-devops',
    name: 'DevOps Implementation.pdf',
    type: 'pdf',
    size: 1_980_000,
    uploadedAt: '2026-08-19T13:15:00Z',
    modifiedAt: '2026-08-19T13:33:00Z',
    owner: 'You',
    status: 'processing',
    favorite: false,
    pages: 18,
    summary: null,
    keywords: [],
    classification: null,
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-19T13:15:00Z' },
      { type: 'ai', label: 'AI processing started', at: '2026-08-19T13:16:00Z' },
    ],
  },
  {
    id: 'doc-cloud-sec-guidelines',
    name: 'Cloud Security Guidelines.pdf',
    type: 'pdf',
    size: 1_120_000,
    uploadedAt: '2026-08-18T10:02:00Z',
    modifiedAt: '2026-08-18T10:12:00Z',
    owner: 'You',
    status: 'completed',
    favorite: false,
    pages: 15,
    summary:
      'Company guidelines for handling sensitive data in the cloud. Defines data-classification tiers, mandatory encryption standards, access-review cadence, and secure sharing rules. Emphasizes audit logging and the principle of least privilege for all service accounts.',
    keywords: ['Security', 'Compliance', 'Encryption', 'Access Control', 'Audit'],
    classification: { label: 'Policy Document', confidence: 0.9 },
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-18T10:02:00Z' },
      { type: 'ai', label: 'AI processing completed', at: '2026-08-18T10:12:00Z' },
    ],
  },
  {
    id: 'doc-architecture-diagram',
    name: 'System Architecture Diagram.png',
    type: 'png',
    size: 684_000,
    uploadedAt: '2026-08-17T15:48:00Z',
    modifiedAt: '2026-08-17T15:50:00Z',
    owner: 'You',
    status: 'completed',
    favorite: false,
    pages: 1,
    summary:
      'A system diagram showing the request flow from the React client through API Gateway and Lambda to DynamoDB, with documents stored in a private S3 bucket accessed via pre-signed URLs. Textract and Bedrock are shown as asynchronous processors triggered on upload.',
    keywords: ['Architecture', 'S3', 'Lambda', 'API Gateway', 'Bedrock'],
    classification: { label: 'Diagram', confidence: 0.82 },
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-17T15:48:00Z' },
      { type: 'ai', label: 'AI processing completed', at: '2026-08-17T15:50:00Z' },
    ],
  },
  {
    id: 'doc-meeting-notes',
    name: 'Sprint Planning Notes.txt',
    type: 'txt',
    size: 24_500,
    uploadedAt: '2026-08-16T09:00:00Z',
    modifiedAt: '2026-08-16T09:03:00Z',
    owner: 'You',
    status: 'failed',
    favorite: false,
    pages: 3,
    summary: null,
    keywords: [],
    classification: null,
    activity: [
      { type: 'upload', label: 'Document uploaded', at: '2026-08-16T09:00:00Z' },
      { type: 'ai', label: 'AI processing failed', at: '2026-08-16T09:03:00Z' },
    ],
  },
]

// A few canned Q&A pairs used by the mock askAI() to feel document-aware.
export const sampleQuestions = [
  'What are the main security risks?',
  'Summarize this in one sentence.',
  'What AWS services are mentioned?',
  'Who is the intended audience?',
]
