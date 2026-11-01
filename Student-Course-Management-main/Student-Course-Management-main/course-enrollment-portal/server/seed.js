const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_enrollment_db';

const initialCourses = [
  // ==================== 1. WEB DEVELOPMENT (4 COURSES) ====================
  {
    title: 'Full-Stack Web Development with React & Node.js',
    code: 'WEB-301',
    description: 'Master modern full-stack web engineering building REST APIs, authentication systems, and dynamic React single-page applications.',
    instructor: 'Prof. Sarah Jenkins',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '10 Weeks',
    credits: 4,
    capacity: 60,
    enrolledCount: 42,
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 10:00 AM - 11:30 AM',
    syllabus: [
      { week: 1, title: 'HTML5, CSS3 & Modern JavaScript (ES6+)', topics: 'Flexbox, Grid, Async/Await, Modules' },
      { week: 2, title: 'React Fundamentals & Component State', topics: 'JSX, Hooks (useState, useEffect), Props' },
      { week: 3, title: 'Node.js & Express REST API Architecture', topics: 'Routing, Middleware, Error Handling' },
      { week: 4, title: 'MongoDB & Mongoose Database Modeling', topics: 'Schemas, Models, CRUD Operations, Indexing' }
    ]
  },
  {
    title: 'Modern Front-End Engineering with Next.js & TypeScript',
    code: 'WEB-305',
    description: 'Build production-ready web applications with Server-Side Rendering (SSR), App Router, Tailwind CSS, and strict TypeScript types.',
    instructor: 'Elena Rostova',
    category: 'Web Development',
    level: 'Advanced',
    duration: '8 Weeks',
    credits: 4,
    capacity: 50,
    enrolledCount: 35,
    rating: 4.92,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 04:00 PM - 05:30 PM',
    syllabus: [
      { week: 1, title: 'TypeScript Deep Dive', topics: 'Generics, Interfaces, Utility types' },
      { week: 2, title: 'Next.js App Router Architecture', topics: 'Server Components, Client Components, Layouts' },
      { week: 3, title: 'API Routes & Server Actions', topics: 'Mutations, Caching, Revalidation' }
    ]
  },
  {
    title: 'Responsive Web Design & Tailwind CSS Mastery',
    code: 'WEB-110',
    description: 'Learn modern responsive layout design, animation systems, mobile-first design patterns, and utility-first styling with Tailwind CSS.',
    instructor: 'David Vance',
    category: 'Web Development',
    level: 'Beginner',
    duration: '6 Weeks',
    credits: 3,
    capacity: 70,
    enrolledCount: 58,
    rating: 4.85,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    schedule: 'Friday, 10:00 AM - 01:00 PM',
    syllabus: [
      { week: 1, title: 'HTML Structure & Semantic Tags', topics: 'SEO, Accessibility, ARIA landmark roles' },
      { week: 2, title: 'Tailwind CSS Grid & Flexbox Systems', topics: 'Breakpoints, Arbitrary values, Dark mode' }
    ]
  },
  {
    title: 'Vue.js 3 & Pinia Modern Web Architecture',
    code: 'WEB-202',
    description: 'Build high-performance web interfaces using Vue 3 Composition API, Pinia state management, and Vite build tooling.',
    instructor: 'Prof. Sarah Jenkins',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '7 Weeks',
    credits: 3,
    capacity: 45,
    enrolledCount: 29,
    rating: 4.82,
    thumbnail: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 01:00 PM - 02:30 PM',
    syllabus: [
      { week: 1, title: 'Vue 3 Reactive State & Ref', topics: 'Reactivity, Computed properties, Watchers' },
      { week: 2, title: 'Global State with Pinia Stores', topics: 'Actions, Getters, Store hydration' }
    ]
  },

  // ==================== 2. COMPUTER SCIENCE CORE (4 COURSES) ====================
  {
    title: 'Data Structures & Algorithmic Problem Solving',
    code: 'CS-201',
    description: 'Master essential algorithmic strategies (Graph traversal, Dynamic Programming, Binary Trees) for technical coding interviews.',
    instructor: 'Prof. Sarah Jenkins',
    category: 'Computer Science',
    level: 'Intermediate',
    duration: '10 Weeks',
    credits: 4,
    capacity: 70,
    enrolledCount: 54,
    rating: 4.92,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 02:00 PM - 03:30 PM',
    syllabus: [
      { week: 1, title: 'Big-O Notation & Time-Space Complexity', topics: 'Analysis of algorithms' },
      { week: 2, title: 'Arrays, Linked Lists, Stacks & Queues', topics: 'Pointers, Memory management' },
      { week: 3, title: 'Binary Trees & Graph Traversals', topics: 'DFS, BFS, Dijkstra algorithm' }
    ]
  },
  {
    title: 'Database Management Systems & NoSQL Architecture',
    code: 'CS-303',
    description: 'Study relational database design (ACID properties, B-Trees) alongside MongoDB document databases, indexing strategies, and Sharding.',
    instructor: 'Dr. Alex Rivera',
    category: 'Computer Science',
    level: 'Intermediate',
    duration: '8 Weeks',
    credits: 3,
    capacity: 55,
    enrolledCount: 44,
    rating: 4.87,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 11:00 AM - 12:30 PM',
    syllabus: [
      { week: 1, title: 'Relational Schema Normalization', topics: '1NF, 2NF, 3NF, BCNF' },
      { week: 2, title: 'MongoDB Document Modeling & Aggregation', topics: 'Indexes, Pipeline operators, Compass analysis' }
    ]
  },
  {
    title: 'Distributed Systems & Microservices Architecture',
    code: 'CS-420',
    description: 'Build fault-tolerant distributed systems, message queues (Kafka, RabbitMQ), consensus protocols (Raft), and gRPC microservices.',
    instructor: 'Marcus Brody',
    category: 'Computer Science',
    level: 'Advanced',
    duration: '12 Weeks',
    credits: 4,
    capacity: 40,
    enrolledCount: 28,
    rating: 4.91,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    schedule: 'Fri, 02:00 PM - 05:00 PM',
    syllabus: [
      { week: 1, title: 'CAP Theorem & Eventual Consistency', topics: 'Partitioning, Replication' },
      { week: 2, title: 'Microservices Communication', topics: 'gRPC, Protocol Buffers, REST vs Event-driven' }
    ]
  },
  {
    title: 'Computer Networks & Socket Programming',
    code: 'CS-204',
    description: 'Analyze TCP/IP layers, routing protocols (OSPF, BGP), DNS resolution, HTTP/3, and write C/Python network socket code.',
    instructor: 'Dr. Alex Rivera',
    category: 'Computer Science',
    level: 'Intermediate',
    duration: '8 Weeks',
    credits: 3,
    capacity: 50,
    enrolledCount: 38,
    rating: 4.83,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 09:00 AM - 10:30 AM',
    syllabus: [
      { week: 1, title: 'OSI Model & Packet Switching', topics: 'Ethernet, IP Addressing, Subnetting' },
      { week: 2, title: 'Transport Layer Protocols', topics: 'TCP 3-way handshake, UDP datagrams' }
    ]
  },

  // ==================== 3. DATA SCIENCE & AI (4 COURSES) ====================
  {
    title: 'Applied Machine Learning & Artificial Intelligence',
    code: 'AI-402',
    description: 'Explore core algorithms in supervised and unsupervised learning, deep neural networks, and computer vision with Python and PyTorch.',
    instructor: 'Dr. Michael Chang',
    category: 'Data Science & AI',
    level: 'Advanced',
    duration: '12 Weeks',
    credits: 4,
    capacity: 45,
    enrolledCount: 38,
    rating: 4.95,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 02:00 PM - 03:30 PM',
    syllabus: [
      { week: 1, title: 'Python for Data Science (NumPy & Pandas)', topics: 'Data preprocessing, feature engineering' },
      { week: 2, title: 'Supervised Learning Algorithms', topics: 'Linear Regression, Decision Trees, SVMs' },
      { week: 3, title: 'Neural Networks & PyTorch', topics: 'Backpropagation, Optimizers, Loss functions' }
    ]
  },
  {
    title: 'Deep Learning & Natural Language Processing (LLMs)',
    code: 'AI-505',
    description: 'Understand Transformer architectures, attention mechanisms, fine-tuning large language models (BERT, LLaMA), and RAG pipelines.',
    instructor: 'Dr. Michael Chang',
    category: 'Data Science & AI',
    level: 'Advanced',
    duration: '10 Weeks',
    credits: 4,
    capacity: 40,
    enrolledCount: 33,
    rating: 4.98,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 04:00 PM - 05:30 PM',
    syllabus: [
      { week: 1, title: 'Self-Attention & Transformers', topics: 'Multi-head attention, Positional encodings' },
      { week: 2, title: 'Retrieval Augmented Generation (RAG)', topics: 'Vector databases, LangChain, Embeddings' }
    ]
  },
  {
    title: 'Data Analytics & Visualization with Python & SQL',
    code: 'DS-201',
    description: 'Perform Exploratory Data Analysis (EDA), write complex SQL queries, and create interactive dashboards with Seaborn and Plotly.',
    instructor: 'Sophia Patel',
    category: 'Data Science & AI',
    level: 'Beginner',
    duration: '8 Weeks',
    credits: 3,
    capacity: 65,
    enrolledCount: 52,
    rating: 4.88,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 09:00 AM - 10:30 AM',
    syllabus: [
      { week: 1, title: 'SQL Joins, Aggregations & Window Functions', topics: 'PostgreSQL, Query optimization' },
      { week: 2, title: 'Data Wrangling with Pandas', topics: 'Cleaning missing values, Merging dataframes' }
    ]
  },
  {
    title: 'Computer Vision & Image Processing with OpenCV',
    code: 'AI-301',
    description: 'Build real-time object detection models, Convolutional Neural Networks (CNNs), YOLO object trackers, and face recognition systems.',
    instructor: 'Sophia Patel',
    category: 'Data Science & AI',
    level: 'Intermediate',
    duration: '8 Weeks',
    credits: 4,
    capacity: 45,
    enrolledCount: 31,
    rating: 4.86,
    thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 11:30 AM - 01:00 PM',
    syllabus: [
      { week: 1, title: 'Image Filtering & Edge Detection', topics: 'Sobel, Canny, Gaussian blur' },
      { week: 2, title: 'Convolutional Neural Networks (ResNet, VGG)', topics: 'Transfer learning, Classification' }
    ]
  },

  // ==================== 4. CLOUD & DEVOPS (4 COURSES) ====================
  {
    title: 'Cloud Architecture & DevOps with AWS & Docker',
    code: 'CLOUD-310',
    description: 'Learn containerization, Infrastructure as Code (Terraform), CI/CD pipelines, and cloud service deployment on Amazon Web Services.',
    instructor: 'David Vance',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    duration: '8 Weeks',
    credits: 3,
    capacity: 50,
    enrolledCount: 31,
    rating: 4.87,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 04:00 PM - 05:30 PM',
    syllabus: [
      { week: 1, title: 'Docker Containers & Multi-stage Builds', topics: 'Images, Containers, Docker Compose' },
      { week: 2, title: 'AWS EC2, S3, and VPC Networking', topics: 'Security Groups, Subnets, Gateways' }
    ]
  },
  {
    title: 'Kubernetes Administration & Cloud Native Deployment',
    code: 'CLOUD-405',
    description: 'Deploy, scale, and manage containerized workloads using Kubernetes clusters, Helm charts, Ingress controllers, and Prometheus monitoring.',
    instructor: 'David Vance',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    duration: '8 Weeks',
    credits: 4,
    capacity: 35,
    enrolledCount: 26,
    rating: 4.93,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
    schedule: 'Thu, 05:30 PM - 08:30 PM',
    syllabus: [
      { week: 1, title: 'Kubernetes Architecture & Pod Lifecycle', topics: 'Nodes, Control plane, Kubelet' },
      { week: 2, title: 'Deployments, Services & Ingress Routers', topics: 'Load Balancing, TLS Certificates' }
    ]
  },
  {
    title: 'CI/CD Pipelines & Terraform Infrastructure as Code',
    code: 'CLOUD-201',
    description: 'Automate software delivery pipelines using GitHub Actions, GitLab CI, and provision AWS/Azure infrastructure automatically with Terraform.',
    instructor: 'David Vance',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    duration: '6 Weeks',
    credits: 3,
    capacity: 50,
    enrolledCount: 37,
    rating: 4.84,
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 01:00 PM - 02:30 PM',
    syllabus: [
      { week: 1, title: 'GitHub Actions Workflows', topics: 'Triggers, Runners, Secrets, Artifacts' },
      { week: 2, title: 'Terraform HCL Syntax & State Management', topics: 'Providers, Modules, Remote state' }
    ]
  },
  {
    title: 'Site Reliability Engineering (SRE) & Observability',
    code: 'CLOUD-402',
    description: 'Implement Service Level Objectives (SLOs), error budgets, Prometheus metrics, Grafana dashboards, and distributed tracing with Jaeger.',
    instructor: 'David Vance',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    duration: '8 Weeks',
    credits: 4,
    capacity: 35,
    enrolledCount: 22,
    rating: 4.90,
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    schedule: 'Wed, 02:00 PM - 05:00 PM',
    syllabus: [
      { week: 1, title: 'SLIs, SLOs & Error Budget Math', topics: 'Availability metrics, Alerting thresholds' },
      { week: 2, title: 'Prometheus Metrics & PromQL Queries', topics: 'Counters, Gauges, Histograms' }
    ]
  },

  // ==================== 5. CYBERSECURITY (4 COURSES) ====================
  {
    title: 'Cybersecurity Fundamentals & Ethical Hacking',
    code: 'SEC-101',
    description: 'Understand vulnerability assessment, network penetration testing, cryptography standards, and secure application development.',
    instructor: 'Marcus Brody',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: '8 Weeks',
    credits: 3,
    capacity: 50,
    enrolledCount: 22,
    rating: 4.75,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 11:00 AM - 12:30 PM',
    syllabus: [
      { week: 1, title: 'Network Protocols & Threat Vectors', topics: 'TCP/IP, Wireshark packet capture' },
      { week: 2, title: 'Web Vulnerabilities (OWASP Top 10)', topics: 'SQL Injection, XSS, CSRF mitigations' }
    ]
  },
  {
    title: 'Applied Cryptography & Network Security',
    code: 'SEC-302',
    description: 'Deep dive into Public Key Infrastructure (PKI), AES encryption, RSA, Hashing functions (SHA-256), and TLS 1.3 handshake protocols.',
    instructor: 'Marcus Brody',
    category: 'Cybersecurity',
    level: 'Intermediate',
    duration: '8 Weeks',
    credits: 3,
    capacity: 40,
    enrolledCount: 30,
    rating: 4.89,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 01:00 PM - 02:30 PM',
    syllabus: [
      { week: 1, title: 'Symmetric & Asymmetric Encryption', topics: 'Ciphers, Key exchange, Diffie-Hellman' },
      { week: 2, title: 'Digital Signatures & Certificates', topics: 'Certificate Authorities, SSL/TLS validation' }
    ]
  },
  {
    title: 'Cloud Security & Identity Access Management (IAM)',
    code: 'SEC-404',
    description: 'Implement zero-trust security models, AWS IAM role policies, OAuth2 / OIDC authentication flows, and automated security auditing.',
    instructor: 'Marcus Brody',
    category: 'Cybersecurity',
    level: 'Advanced',
    duration: '8 Weeks',
    credits: 4,
    capacity: 35,
    enrolledCount: 25,
    rating: 4.91,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    schedule: 'Fri, 09:00 AM - 12:00 PM',
    syllabus: [
      { week: 1, title: 'Zero Trust Architecture', topics: 'Least privilege, Principle of minimum access' },
      { week: 2, title: 'OAuth2 & OpenID Connect', topics: 'Authorization code flow, JWT verification' }
    ]
  },
  {
    title: 'Digital Forensics & Malware Analysis',
    code: 'SEC-205',
    description: 'Analyze memory dumps, inspect reverse engineering binaries with Ghidra, track ransomware artifacts, and conduct incident response.',
    instructor: 'Marcus Brody',
    category: 'Cybersecurity',
    level: 'Intermediate',
    duration: '8 Weeks',
    credits: 3,
    capacity: 40,
    enrolledCount: 27,
    rating: 4.88,
    thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 03:00 PM - 04:30 PM',
    syllabus: [
      { week: 1, title: 'Memory Forensics with Volatility', topics: 'Process extraction, DLL injection analysis' },
      { week: 2, title: 'Static & Dynamic Malware Sandboxing', topics: 'API calls, Registry modifications' }
    ]
  },

  // ==================== 6. UI/UX DESIGN (4 COURSES) ====================
  {
    title: 'UI/UX Design Systems & Product Prototyping',
    code: 'DES-205',
    description: 'Design intuitive, accessibility-compliant user interfaces and master interactive wireframing, component libraries, and Figma design tokens.',
    instructor: 'Elena Rostova',
    category: 'UI/UX Design',
    level: 'Beginner',
    duration: '6 Weeks',
    credits: 3,
    capacity: 40,
    enrolledCount: 29,
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    schedule: 'Friday, 01:00 PM - 04:00 PM',
    syllabus: [
      { week: 1, title: 'User Research & Journey Mapping', topics: 'Personas, Wireframing, UX flows' },
      { week: 2, title: 'Figma Auto-Layout & Design Systems', topics: 'Components, Tokens, Color Palettes' }
    ]
  },
  {
    title: 'Advanced Interaction Design & Motion Graphics',
    code: 'DES-310',
    description: 'Create fluid micro-interactions, smooth UI animations, user testing protocols, and interactive prototypes for desktop and mobile apps.',
    instructor: 'Elena Rostova',
    category: 'UI/UX Design',
    level: 'Intermediate',
    duration: '6 Weeks',
    credits: 3,
    capacity: 35,
    enrolledCount: 24,
    rating: 4.94,
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a317272018a?w=600&auto=format&fit=crop&q=80',
    schedule: 'Wed, 05:00 PM - 08:00 PM',
    syllabus: [
      { week: 1, title: 'Principles of Motion in UI', topics: 'Easing curves, Staggered animations, Feedback' }
    ]
  },
  {
    title: 'User Research, Usability Testing & Information Architecture',
    code: 'DES-101',
    description: 'Conduct qualitative user interviews, usability testing sessions, card sorting, and structure logical sitemaps for enterprise software.',
    instructor: 'Elena Rostova',
    category: 'UI/UX Design',
    level: 'Beginner',
    duration: '6 Weeks',
    credits: 3,
    capacity: 50,
    enrolledCount: 39,
    rating: 4.82,
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
    schedule: 'Mon & Wed, 09:00 AM - 10:30 AM',
    syllabus: [
      { week: 1, title: 'User Interview Techniques', topics: 'Qualitative questions, Bias avoidance' },
      { week: 2, title: 'Card Sorting & Tree Testing', topics: 'Information architecture, Navigation hierarchy' }
    ]
  },
  {
    title: 'Mobile App Interface Design (iOS & Android)',
    code: 'DES-402',
    description: 'Design native mobile screens adhering to Apple Human Interface Guidelines (HIG) and Google Material Design 3 specifications.',
    instructor: 'Elena Rostova',
    category: 'UI/UX Design',
    level: 'Intermediate',
    duration: '6 Weeks',
    credits: 3,
    capacity: 45,
    enrolledCount: 31,
    rating: 4.89,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    schedule: 'Tue & Thu, 03:00 PM - 04:30 PM',
    syllabus: [
      { week: 1, title: 'iOS HIG vs Android Material Design 3', topics: 'Navigation bars, Floating action buttons' },
      { week: 2, title: 'Mobile Touch Gesture Interfaces', topics: 'Swipe actions, Pull to refresh, Haptics' }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log(' Cleared old collections...');

    // Create password hashes
    const salt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('student123', salt);
    const instructorPassword = await bcrypt.hash('instructor123', salt);

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: studentPassword,
        role: 'student',
        department: 'Computer Science',
        bio: 'Computer Science major interested in Web Development and AI.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      },
      {
        name: 'Sophia Patel',
        email: 'sophia@example.com',
        password: studentPassword,
        role: 'student',
        department: 'Data Analytics',
        bio: 'Passionate about machine learning and cloud technology.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia'
      },
      {
        name: 'Prof. Sarah Jenkins',
        email: 'sarah@university.edu',
        password: instructorPassword,
        role: 'instructor',
        department: 'Computer Science',
        bio: 'Senior Lecturer with 12+ years of industry software engineering experience.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      }
    ]);

    console.log(` Inserted ${users.length} sample users.`);

    // Insert exactly 24 courses
    const courses = await Course.insertMany(initialCourses);
    console.log(` Inserted EXACTLY ${courses.length} sample courses.`);

    // Create sample enrollments for student Alex Johnson
    const alex = users[0];
    const enrollments = await Enrollment.insertMany([
      {
        user: alex._id,
        course: courses[0]._id, // Web Dev
        status: 'Active',
        progress: 50,
        grade: 'In Progress'
      },
      {
        user: alex._id,
        course: courses[4]._id, // Data Structures
        status: 'Active',
        progress: 25,
        grade: 'In Progress'
      },
      {
        user: alex._id,
        course: courses[20]._id, // UI/UX Design
        status: 'Completed',
        progress: 100,
        grade: 'A'
      }
    ]);

    console.log(` Inserted ${enrollments.length} sample enrollments.`);

    console.log('\n DATABASE SEEDED SUCCESSFULLY WITH ALL 24 UNIQUE IMAGE COURSES!');
    console.log(' Credentials to test right away:');
    console.log('   Student Login:    alex@example.com / student123');
    console.log('   Instructor Login: sarah@university.edu / instructor123');
    console.log(' View in MongoDB Compass under database: course_enrollment_db\n');

    process.exit(0);
  } catch (err) {
    console.error(' Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
