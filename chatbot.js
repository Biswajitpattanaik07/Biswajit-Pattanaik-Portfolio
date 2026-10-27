/*!
 * Portfolio AI chatbot widget (drop-in, no dependencies)
 * Add before </body>:   <script src="chatbot.js" defer></script>
 * Optional config (put BEFORE the script tag):
 *   <script>window.BW_CHAT = { api: '/api/chat', chips: ['Skills','Projects'] };</script>
 */
(function () {
  'use strict';
  if (window.__bwChat) return;
  window.__bwChat = true;

  var CFG = {
    api: '/api/chat',
    title: 'Ask Biswajit\u2019s AI',
    sub: 'AI assistant \u00b7 usually replies in seconds',
    greeting: 'Hi, I\u2019m Biswajit\u2019s AI assistant. Ask me about his skills, projects, or how to get in touch.',
    placeholder: 'Type your question\u2026',
    chips: ['Who is Biswajit?', 'Skills & tech stack', 'Show me his projects', 'Education', 'How can I contact him?'],
    cv: 'cv.pdf',
    github2: 'https://github.com/Biswajitpa',
    email: 'pattanaikbiswajit07@gmail.com',
    linkedin: 'https://www.linkedin.com/in/biswajit-pattanaik-3586b82b3',
    instagram: 'https://www.instagram.com/_pattanaik_07',
    github: 'https://github.com/Biswajitpattanaik07',
    avatar: ''   // put your photo path here, e.g. 'assets/me.jpg' (leave empty to use the built-in human logo)
  };
  var user = window.BW_CHAT || {};
  for (var k in user) if (Object.prototype.hasOwnProperty.call(user, k)) CFG[k] = user[k];

  /* ---------- smart offline answers (used whenever /api/chat is unreachable) ---------- */
  var G = CFG.github;
  var KB = [
    { id: 'greet', k: ['hi', 'hii', 'hey', 'heyy', 'hello', 'hlo', 'hola', 'namaste', 'yo', 'good morning', 'good evening'],
      a: 'Hello! \ud83d\udc4b I can tell you about Biswajit\u2019s **projects, skills, education, achievements, goals** or how to **contact** him. What would you like to know?' },
    { id: 'how', k: ['how are you', 'how r u', 'whats up', 'sup'], a: 'I\u2019m doing great, thanks for asking! \ud83d\ude0a Ask me anything about Biswajit\u2019s work.' },
    { id: 'thanks', k: ['thanks', 'thank you', 'thx', 'tysm', 'great', 'awesome', 'nice', 'cool', 'ok thanks'], a: 'You\u2019re welcome! Anything else you\u2019d like to know about Biswajit?' },
    { id: 'bye', k: ['bye', 'goodbye', 'see you', 'cya'], a: 'Bye! Thanks for visiting Biswajit\u2019s portfolio. \ud83d\udc4b' },
    { id: 'bot', k: ['who are you', 'who r u', 'who are u', 'are you ai', 'are you a bot', 'are you human', 'chatgpt', 'claude', 'your name', 'bot'],
      a: 'I\u2019m the AI assistant on Biswajit\u2019s portfolio. I answer questions about his projects, skills and background.' },
    { id: 'help', k: ['help', 'what can you do', 'options', 'menu', 'topics', 'what can i ask'],
      a: 'You can ask me about:\n- **Projects** (ResumeGenie, Rail Track AI, MultiCart, Vingo, Vehicle Black Box\u2026)\n- **Skills** & tech stack\n- **Education** & CGPA\n- **Achievements**\n- **Career goals** & availability\n- **Contact**, CV & GitHub' },
    { id: 'about', k: ['who is biswajit', 'who is he', 'about', 'introduce', 'intro', 'himself', 'summary', 'profile', 'biswajit', 'overview', 'describe'],
      a: 'Biswajit Pattanaik is a final-year **B.Tech student** and aspiring **software / AI engineer**. He learns by building: full-stack web apps, Generative AI tools, computer-vision models and IoT systems.',
      m: 'He is studying at **CUTM, Bhubaneswar** (CGPA about 8.20). His interests: **full-stack web, AI/ML & Generative AI, IoT/embedded, networking and system design**. He wants to understand how systems work inside, and build useful products. Ask about his projects or skills for details.' },
    { id: 'name', k: ['name', 'called', 'pattanaik', 'pattanayak', 'full name'], a: 'His name is **Biswajit Pattanaik** (also spelled Pattanayak).' },
    { id: 'edu', k: ['education', 'educational', 'degree', 'college', 'university', 'cgpa', 'btech', 'b.tech', 'study', 'studying', 'graduation', 'graduate', 'cutm', 'centurion', 'marks', 'academic', 'academics', 'qualification', 'year', 'student'],
      a: '**B.Tech (final year)** at **Centurion University of Technology and Management (CUTM)**, Bhubaneswar, Odisha. CGPA is approximately **8.20**.',
      m: 'Academic interests: computer science, software engineering, AI/ML, embedded systems and networking. He prefers learning concepts by applying them in real projects.' },
    { id: 'skills', k: ['skills', 'skill', 'tech', 'technology', 'technologies', 'stack', 'languages', 'language', 'tools', 'expertise', 'good at', 'programming', 'know', 'proficient', 'strengths', 'python', 'cpp', 'c++'],
      a: '**Languages:** C++, Java, Python, JavaScript, TypeScript\n**Web:** React, Next.js, Node.js, Express, Tailwind, REST APIs, Socket.IO\n**Databases:** MongoDB, PostgreSQL, MySQL, Redis, Firebase\n**AI/ML:** TensorFlow, CNNs, computer vision, LLMs, RAG, LangChain\n**IoT:** ESP32, Arduino, STM32, Raspberry Pi, MQTT\n**Other:** networking, AWS basics, system design',
      m: 'More detail: **GenAI** tools he lists include RAG pipelines, OpenAI, Gemini, OpenRouter, Ollama, LangChain and prompt engineering. **Hardware & DevOps:** embedded systems, IoT/IIoT, robotics, PCB design, sensors. **System design:** distributed systems, microservices, caching (Redis), load balancing, message queues, API gateways, scalability. **Tools:** Git, Postman, Azure. Also: C, Flask, scikit-learn, Keras, Gemini API, LangGraph, KiCad. He has used or explored these at different levels. Ask about a specific one.' },
    { id: 'web', k: ['web', 'frontend', 'front-end', 'backend', 'back-end', 'fullstack', 'full-stack', 'react', 'next', 'nextjs', 'node', 'express', 'javascript', 'typescript', 'tailwind', 'html', 'css', 'website'],
      a: 'Web stack: **React, Next.js, Node.js, Express.js, TypeScript, Tailwind CSS, Vite**, REST APIs and **Socket.IO** for real-time features. Projects built with it: **MultiCart** and **Vingo**.' },
    { id: 'ai', k: ['ai', 'ml', 'machine', 'learning', 'artificial', 'genai', 'llm', 'langchain', 'tensorflow', 'cnn', 'deep', 'neural', 'vision', 'computer vision', 'model', 'groq', 'prompt', 'svm', 'support vector', 'classification', 'overfitting', 'precision', 'recall', 'transformer', 'transformers', 'deep learning', 'llmops', 'evaluation'],
      a: 'AI/ML: **TensorFlow, CNNs (EfficientNet), SVM, computer vision, TensorFlow Lite**, model evaluation (precision, recall, F1). Generative AI: **LLM APIs (Groq/Llama), prompt engineering, LangChain, RAG** (chunking, embeddings, vector search). Projects: **ResumeGenie AI** and **Rail Track Fault Detection AI**.' },
    { id: 'iot', k: ['iot', 'embedded', 'esp32', 'arduino', 'stm32', 'raspberry', 'sensor', 'sensors', 'hardware', 'robotics', 'mqtt', 'microcontroller', 'microcontrollers'],
      a: 'IoT & embedded: **ESP32, Arduino, STM32, Raspberry Pi**, sensors (IR, PIR, DHT11, soil moisture), UART/I2C/SPI, **MQTT**, PWM and relays. Related project: **AI Vehicle Black Box**. He has also explored **ESP32 Wi-Fi CSI** presence detection.' },
    { id: 'dsa', k: ['dsa', 'algorithm', 'algorithms', 'leetcode', 'coding', 'data structures', 'competitive', 'problem solving'],
      a: 'He practises **DSA in C++**: arrays, strings, hash maps, two pointers, sliding window, linked lists, stacks/queues, trees, graphs (DFS/BFS) and dynamic programming, with time and space complexity analysis.' },
    { id: 'java', k: ['java', 'spring', 'springboot', 'maven', 'jpa', 'oop', 'hibernate'],
      a: '**Java:** OOP, collections, exception handling and backend development, including **Spring Boot, Maven, dependency injection (IoC) and JPA/ORM** (learning level).' },
    { id: 'auth', k: ['auth', 'authentication', 'login', 'jwt', 'firebase', 'oauth', 'google login', 'security', 'cookie', 'cookies'],
      a: 'Authentication: **JWT and cookie-based sessions, Firebase / Google login**, password hashing and role-based access. Used in projects like **ExamNotes AI**, **MultiCart** and **Vingo**.' },
    { id: 'rydex', k: ['rydex', 'ride', 'rides', 'ride-hailing', 'ridehailing', 'taxi', 'cab', 'uber', 'ola', 'mobility', 'passenger', 'driver', 'drivers'],
      a: '**RYDEX** is a ride-hailing platform connecting passengers and drivers: OTP + Google login (JWT), ride booking with fare estimation, map and routing concepts, driver allocation, real-time ride status, payments and driver earnings analytics. Stack: **Next.js, React, Node.js**.',
      m: 'Ideas like ML demand prediction, surge pricing, fraud detection, microservices and Kafka/Kubernetes are future plans, not implemented yet.' },
    { id: 'dentalcare', k: ['dental care', 'dentalcare', 'dental care 2.0', 'grok', 'pydantic'],
      a: '**Dental Care 2.0** is an AI dental appointment workflow built with **LangGraph, LangChain, Grok-related integration and Pydantic**. A real booking needs a connected booking system, which is a planned improvement.' },
    { id: 'school', k: ['school', 'class 10', '10th', '12th', 'class 12', 'higher secondary', 'secondary', 'matriculation', 'intermediate', 'royal college', 'jatani', 'saraswati', 'schooling'],
      a: '**Class 10:** Saraswati Sishu Vidya Mandir, Jatani, Odisha\n**Class 12:** Royal College of Science and Technology, Bhubaneswar\n**B.Tech:** Centurion University (CUTM), Bhubaneswar' },
    { id: 'snapcart', k: ['snapcart', 'snap cart'],
      a: '**SnapCart** is a multi-role commerce and delivery application built with **Next.js, TypeScript, Node.js, Express, MongoDB and Razorpay**.' },
    { id: 'dental', k: ['dental', 'appointment', 'appointments', 'booking', 'langgraph', 'dentist'],
      a: '**Dental Appointment AI Agent** is an AI-agent workflow that routes **booking, cancellation and rescheduling** requests, built with **LangGraph and LangChain**.' },
    { id: 'diavision', k: ['diavision', 'retinopathy', 'retina', 'retinal', 'diabetic', 'diabetes'],
      a: '**DiaVision AI** is a **diabetic retinopathy (retinal image) analysis** concept using deep learning. It is experimental and not clinically validated.' },
    { id: 'pneumonia', k: ['pneumonia', 'xray', 'x-ray', 'chest', 'resnet', 'resnet50', 'reportlab', 'medical', 'gradcam', 'grad-cam', 'healthcare'],
      a: '**Pneumonia.AI** is an explainable chest X-ray analysis app: a **ResNet50** classifier with **Grad-CAM heatmaps**, a **Flask** web app, **Gemini 2.5 Flash** explanations and **PDF reports**. It is experimental and not a substitute for medical diagnosis.' },
    { id: 'vcourses', k: ['virtual courses', 'virtual course', 'lms', 'learning platform', 'online learning', 'otp'],
      a: '**Virtual Courses** is an online learning platform with login, **Google sign-in, OTP verification, Cloudinary media, Razorpay payments** and **Gemini API** integration.' },
    { id: 'pcb', k: ['pcb', 'kicad', 'buck', 'lm2596', 'axion', 'robot controller', 'stm32f103', 'circuit', 'schematic'],
      a: 'PCB designs (KiCad, design concepts, not yet fabricated or tested):\n- **LM2596 buck converter** (12 V to 5 V)\n- **Axion six-axis robot controller** (STM32F103C8T6, servo outputs, I2C IMU headers, CAN, USB-UART)' },
    { id: 'mlops', k: ['mlops', 'llmops', 'mlflow', 'docker', 'cicd', 'ci/cd', 'vercel', 'render', 'atlas', 'fastapi', 'devops'],
      a: 'Deployment: he has used **Vercel, Render and MongoDB Atlas**, and **Streamlit** for AI apps. **MLOps / LLMOps** (MLflow, Docker, FastAPI, GitHub Actions, monitoring) is on his learning roadmap, not claimed as implemented.' },
    { id: 'agents', k: ['agent', 'agents', 'agentic', 'tool calling', 'multi-agent'],
      a: 'AI agents: he built the **Dental Appointment AI Agent** with **LangGraph / LangChain** and has studied tool calling, routing and agent evaluation.' },
    { id: 'examnotes', k: ['examnotes', 'exam notes', 'notes', 'exam', 'educational'],
      a: '**ExamNotes AI** is an educational AI web app with a **React + Vite** frontend, a **Node/Express** backend and **Firebase / Google authentication** with cookie-based JWT sessions.' },
    { id: 'csi', k: ['csi', 'wifi', 'wi-fi', 'presence', 'channel state', 'human detection', 'motion detection'],
      a: 'He has explored an **ESP32 Wi-Fi CSI human-presence detection** idea: using Wi-Fi channel measurements to detect movement indoors on a low-cost student budget. It is an explored project direction, and it needs careful calibration and testing to be reliable.' },
    { id: 'db', k: ['database', 'databases', 'mongodb', 'mongo', 'sql', 'mysql', 'postgres', 'postgresql', 'redis', 'firebase', 'db'],
      a: 'Databases: **MongoDB, PostgreSQL, MySQL, Redis, Firebase** and SQL. He also uses Cloudinary for media storage.' },
    { id: 'sd', k: ['system design', 'architecture', 'scalability', 'load balancing', 'caching', 'microservices', 'distributed', 'queue', 'queues', 'sharding', 'gateway', 'rate limiting', 'rate limit', 'ratelimit', 'message queue', 'replication', 'fixed window', 'leaky bucket'],
      a: 'System design topics he studies: **load balancing, caching (Redis), database sharding/replication, message queues, rate limiting (fixed window, sliding window log, leaky bucket), microservices, API gateways, distributed systems and scalability**.' },
    { id: 'net', k: ['networking', 'network', 'cisco', 'packet tracer', 'cloud', 'aws', 'azure', 'kubernetes', 'dns', 'routing'],
      a: 'Networking & cloud: **Cisco Packet Tracer, IP addressing/subnetting, DNS, routing**, plus **AWS (S3, VPC), Kubernetes/EKS and Azure** concepts. Project: **Intelligent Network Monitoring**.' },
    { id: 'projects', k: ['projects', 'project', 'built', 'build', 'made', 'work', 'works', 'portfolio', 'apps', 'developed', 'created', 'applications'],
      a: 'Main projects:\n- **RYDEX** (ride-hailing platform)\n- **ResumeGenie AI** (Generative AI career tool)\n- **Rail Track Fault Detection AI** (computer vision)\n- **AgriVision AI** (smart agriculture)\n- **Pneumonia.AI** (explainable X-ray analysis)\n- **Vingo** (food delivery) and **MultiCart** (multi-vendor e-commerce)\n- **Dental Care 2.0** / **Dental Appointment AI Agent** (LangGraph)\n- **Virtual Courses**, **SnapCart**, **ExamNotes AI**, **DiaVision AI**\n- Hardware: **AI Vehicle Black Box**, **ESP32 Wi-Fi CSI**, **KiCad PCB designs**, **Axion robot controller**\nAsk about any one for details.',
      m: 'Tell me a project name for details, for example: **RYDEX**, **ResumeGenie**, **Rail Track**, **AgriVision**, **Pneumonia.AI**, **Vingo**, **MultiCart**, **Dental Care**, **Black Box** or **PCB**.' },
    { id: 'rg', k: ['resumegenie', 'resume genie', 'resume analyzer', 'ats', 'cover letter', 'career assistant', 'career coach'],
      a: '**ResumeGenie AI** is a Generative AI career assistant. It analyses and audits resumes, estimates an ATS-style matching score, writes AI cover letters and gives career coaching. Built with **Python, Streamlit and Groq-hosted Llama models**.',
      m: 'It has a dashboard that brings the tools together. It shows his experience with LLM API integration, structuring multiple AI features and presenting AI output in a clean UI.' },
    { id: 'rail', k: ['rail', 'railway', 'track', 'tracks', 'fault', 'defect', 'crack', 'efficientnet', 'bharatiya'],
      a: '**Bharatiya Rail Track Fault Detection AI** classifies railway track defects (cracks, rust, breaks) from images using a **CNN with EfficientNetB3**, with a **Streamlit** app. He reports about **91.56% accuracy** and an F1-score of 0.9155 (self-reported experimental results).',
      m: 'Dataset: about **3,439 training, 983 validation and 481 test images**. A key challenge was model size, so he converted the large H5 model to **TensorFlow Lite**. Enhancements he has considered: a dashboard, PDF report, admin login and an AI chatbot. It is a learning project, not certified for real railway safety use.' },
    { id: 'mc', k: ['multicart', 'cartsphere', 'ecommerce', 'e-commerce', 'marketplace', 'vendor', 'shopping', 'multi-vendor'],
      a: '**MultiCart / CartSphere** is a multi-vendor e-commerce platform with customers, vendors and admins. Features: vendor and product approval, GST info, carts and orders, cash-on-delivery and return-policy settings, payments, analytics and admin dashboards. Stack: **Next.js, TypeScript, Tailwind, MongoDB, Razorpay, Cloudinary**.' },
    { id: 'vingo', k: ['vingo', 'food', 'delivery', 'restaurant', 'zomato', 'swiggy'],
      a: '**Vingo** is a food delivery platform with three roles: customers, shop owners and delivery partners. It has order tracking and real-time updates. Stack: **React, Vite, Node.js, Express, MongoDB, Socket.IO, Tailwind, Razorpay**.' },
    { id: 'agri', k: ['agrivision', 'agri', 'agriculture', 'farm', 'farming', 'crop', 'smart agriculture', 'farmer', 'yield'],
      a: '**AgriVision AI** is a smart agriculture app: **crop disease detection** from leaf images, **crop recommendation**, **yield prediction** and an **AI farming assistant** (Groq-hosted Llama), with charts and PDF/CSV reports. Stack: **Python, Streamlit, scikit-learn, TensorFlow/Keras, Plotly**.',
      m: 'The models still need validation on independent datasets and different crops and conditions before real farming use.' },
    { id: 'agrirobot', k: ['agriculture robot', 'agri robot', 'smart agriculture robot', 'farming robot', 'farm robot'],
      a: '**Smart Agriculture Robot** is a concept combining robotics, sensors and computer vision for farm tasks. Final hardware and capabilities are not confirmed yet.' },
    { id: 'bb', k: ['black box', 'blackbox', 'vehicle', 'car', 'accident', 'tech spark', 'techspark'],
      a: '**AI Vehicle Black Box** combines sensors, embedded hardware and AI for vehicle safety. He reports winning with it at **IEEE Tech Spark 2.0**.' },
    { id: 'nm', k: ['network monitoring', 'intelligent network', 'campus network', 'monitoring'],
      a: '**AI-assisted Campus Network Monitoring** is a concept modelled in **Cisco Packet Tracer** (academic blocks, admin/exam systems, hostels, data-center servers, Wi-Fi access points). AI anomaly detection is planned work.' },
    { id: 'ach', k: ['achievement', 'achievements', 'award', 'awards', 'won', 'win', 'winner', 'ieee', 'competition', 'hackathon', 'accomplishment', 'recognition'],
      a: 'He reports **winning with the AI Vehicle Black Box at IEEE Tech Spark 2.0**. For certificates and courses, ask me about his **certifications**.' },
    { id: 'cert', k: ['certificate', 'certificates', 'certification', 'certifications', 'course', 'courses completed', 'ibm', 'nptel', 'simplilearn', 'infosys', 'skillsbuild', 'aws certified', 'training', 'learning programs'],
      a: 'Learning programs he reports: **IBM SkillsBuild** (AI Fundamentals, Web Development), **NPTEL / IIT Kharagpur** (Introduction to IoT), **Infosys Springboard** (Robotics), **Simplilearn** (DSA in Python, Generative AI on Google Cloud, DevOps on AWS, Prompt Engineering, AWS Cloud Practitioner Essentials, Full Stack), plus **Tata GenAI Analytics** and **Deloitte Data Analytics** job simulations. Check his CV for details.' },
    { id: 'exp', k: ['experience', 'experienced', 'intern', 'internship', 'ecor', 'east coast', 'railnet', 'railway internship', 'east coast railway', 'employed', 'company', 'job experience', 'worked'],
      a: 'Biswajit is a final-year student. He reports a one-month **internship at East Coast Railway (ECoR), Signal & Telecommunication dept** (June to July 2026), covering networking, data communication, Linux, wireless and RailNet. He also has hands-on **project experience** (AI, full-stack and IoT), and he is looking for **internship / entry-level roles**.' },
    { id: 'goal', k: ['goal', 'goals', 'career', 'future', 'looking', 'hire', 'hiring', 'available', 'availability', 'opportunity', 'opportunities', 'recruit', 'recruiter', 'role', 'job', 'open to', 'plan', 'plans', 'ambition'],
      a: 'Biswajit wants to grow as a **software / AI engineer**, building where software meets intelligent systems. His main interests are **software engineering, AI/ML, Generative AI (RAG, LLM evaluation, agents)**, and he also explores IoT, robotics and embedded roles. He is **open to internships and entry-level opportunities**.',
      m: 'Focus areas: stronger DSA and system design, deeper full-stack and AI skills, a solid portfolio and real industry experience.' },
    { id: 'why', k: ['why', 'special', 'unique', 'different', 'best', 'strong', 'should i hire', 'advantage'],
      a: 'What stands out: he **builds complete, practical projects** across AI, full-stack and IoT, and cares about how systems work internally, not only how to use them. See his projects for proof.' },
    { id: 'phone', k: ['phone', 'mobile', 'whatsapp', 'call', 'cell', 'telephone'],
      a: 'A phone number is not listed here. The best way to reach Biswajit is email: **' + CFG.email + '** or LinkedIn: ' + CFG.linkedin },
    { id: 'rag', k: ['rag', 'retrieval', 'ragas', 'chunking', 'embedding', 'embeddings', 'vector search', 'vector database', 'semantic search', 'rerank', 'reranking'],
      a: '**RAG (Retrieval-Augmented Generation)** means the app first searches documents for relevant passages and gives them to an LLM, so answers are grounded in real sources. Biswajit has studied the full pipeline: **chunking, embeddings, vector search (FAISS, Chroma, pgvector), reranking and evaluation** (Precision@K, faithfulness, RAGAS).' },
    { id: 'contact', k: ['contact', 'email', 'mail', 'reach', 'linkedin', 'connect', 'message', 'social', 'get in touch', 'talk', 'instagram', 'insta', 'gmail', 'social media'],
      a: 'You can reach Biswajit here:\n- **Email:** ' + CFG.email + '\n- **LinkedIn:** ' + CFG.linkedin + '\n- **GitHub:** ' + G + '\n- **Instagram:** ' + CFG.instagram },
    { id: 'cv', k: ['cv', 'resume', 'r\u00e9sum\u00e9', 'download'], a: 'You can download his CV here: ' + CFG.cv },
    { id: 'gh', k: ['github', 'git', 'repo', 'repository', 'repositories', 'source', 'code'], a: 'His GitHub:\n- ' + G + '\n- ' + CFG.github2 },
    { id: 'loc', k: ['where', 'location', 'city', 'based', 'live', 'lives', 'odisha', 'bhubaneswar', 'india', 'place'], a: 'Biswajit is based in **Bhubaneswar, Odisha, India**.' },
    { id: 'personal', k: ['age', 'old', 'birthday', 'married', 'hobby', 'hobbies', 'family', 'girlfriend', 'salary', 'religion', 'backlog', 'attendance', 'marks', 'erp', 'csm', 'weighbridge', 'interview', 'interviews'],
      a: 'I only have his professional details here. Ask me about his projects, skills, education or goals!' }
  ];
  (function () {                                   // specific topics win ties over broad ones
    var broad = { about: 1, edu: 1, skills: 1, projects: 1, goal: 1, why: 1, exp: 1 };
    KB = KB.filter(function (e) { return !broad[e.id]; }).concat(KB.filter(function (e) { return broad[e.id]; }));
  })();
  var byId = {}; KB.forEach(function (e) { byId[e.id] = e; });
  var STOP = 'his her he him she the a an of about me tell give show please pls plz some on and can you i want to know need is are what whats wat r u do does did how who which any there this that it in for with'.split(' ');
  var VAGUE = 'details detail more explain elaborate continue info information further'.split(' ');
  var lastId = '';

  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9+#.\-\s]/g, ' ').replace(/\.+(\s|$)/g, ' ').replace(/\s+/g, ' ').trim(); }
  function lev(a, b) {
    var m = a.length, n = b.length, i, j, d = [];
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function tokScore(t, k) {                      // typo-tolerant word match
    if (t === k) return 2;
    if (k.length >= 4 && t.length >= 4) {
      var sh = Math.min(t.length, k.length), lg = Math.max(t.length, k.length);
      if ((t.indexOf(k) === 0 || k.indexOf(t) === 0) && (sh >= 5 || sh / lg >= 0.7)) return 2;
      if (lev(t, k) <= (k.length > 6 ? 2 : 1)) return 1.5;
    }
    return 0;
  }
  function offlineReply(q) {
    var n = norm(q), toks = n.split(' ').filter(Boolean), best = null, bs = 0;
    var core = toks.filter(function (t) { return STOP.indexOf(t) < 0; });
    // vague follow-up such as "details" / "tell me more"
    var hasVague = toks.some(function (t) { return VAGUE.indexOf(t) >= 0; });
    if (hasVague && core.every(function (t) { return VAGUE.indexOf(t) >= 0; })) {
      var le = byId[lastId];
      if (le && le.m) return le.m;
      return byId.projects.m;
    }
    KB.forEach(function (e) {
      var s = 0;
      e.k.forEach(function (k) { if (k.indexOf(' ') >= 0 && n.indexOf(k) >= 0) s += 3; });
      core.forEach(function (t) {
        if (VAGUE.indexOf(t) >= 0) return;
        var top = 0;
        e.k.forEach(function (k) { if (k.indexOf(' ') < 0) top = Math.max(top, tokScore(t, k)); });
        s += top;
      });
      if (s > bs) { bs = s; best = e; }
    });
    if (best) {
      var again = best.id === lastId && best.m;  // asked the same thing twice: give the extra detail
      lastId = best.id;
      return again ? best.m : best.a;
    }
    return 'I may not have that detail, but I can help with Biswajit\u2019s **projects, skills, education, achievements, goals** and **contact** info. Which one would you like?';
  }

  /* ---------- styles ---------- */
  var css = [
    '#bwc,#bwc *{box-sizing:border-box}',
    '#bwc{text-align:left;--a:#00f260;--b:#0575e6;--bg:#070b11;--fg:#e6edf3;--mut:#7d8a98;--line:rgba(255,255,255,.09);position:fixed;z-index:9000;right:0;bottom:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg)}',
    '#bwc button{font:inherit;color:inherit}',
    '#bwcFab{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;',
    '  background:linear-gradient(135deg,var(--b),var(--a));box-shadow:0 10px 30px rgba(0,242,96,.28),0 4px 12px rgba(0,0,0,.5);transition:transform .2s,opacity .2s;-webkit-tap-highlight-color:transparent}',
    '#bwcFab:hover{transform:scale(1.07)}#bwcFab:focus-visible{outline:3px solid #fff;outline-offset:3px}',
    '#bwcFab{padding:3px}#bwcFab svg,#bwcFab img{width:100%;height:100%;display:block;border-radius:50%;object-fit:cover;background:#0b1a2b}',
    '.bwcDot{position:absolute;right:1px;bottom:1px;width:14px;height:14px;border-radius:50%;background:var(--a);border:2.5px solid #070b11;box-shadow:0 0 8px var(--a)}',
    '#bwcFab::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--a);animation:bwcPulse 2.4s ease-out infinite}',
    '@keyframes bwcPulse{from{transform:scale(1);opacity:.7}to{transform:scale(1.55);opacity:0}}',
    '#bwc.open #bwcFab{opacity:0;pointer-events:none;transform:scale(.6)}',
    '#bwcTip{position:fixed;right:max(86px,calc(env(safe-area-inset-right) + 86px));bottom:max(30px,calc(env(safe-area-inset-bottom) + 30px));background:var(--bg);border:1px solid var(--line);color:var(--fg);font-size:13px;padding:8px 12px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.45);opacity:0;transform:translateX(8px);transition:.3s;pointer-events:none;white-space:nowrap}',
    '#bwcTip.show{opacity:1;transform:none}',
    '#bwcPanel{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));width:min(390px,calc(100vw - 36px));height:min(600px,calc(100vh - 36px));height:min(600px,calc(100dvh - 36px));',
    '  display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--line);border-radius:18px;overflow:hidden;',
    '  box-shadow:0 30px 80px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.6),0 0 50px rgba(0,242,96,.07);',
    '  opacity:0;transform:translateY(16px) scale(.97);transform-origin:100% 100%;visibility:hidden;transition:opacity .22s,transform .22s,visibility .22s}',
    '#bwc.open #bwcPanel{opacity:1;transform:none;visibility:visible}',
    '.bwcHead{flex:none;display:flex;align-items:center;gap:12px;padding:12px 14px;padding-top:max(12px,env(safe-area-inset-top));background:linear-gradient(180deg,#111923,#0b1118);border-bottom:1px solid var(--line)}',
    '.bwcAv{width:42px;height:42px;border-radius:50%;padding:2px;background:linear-gradient(135deg,var(--b),var(--a));flex:none;position:relative}',
    '.bwcAv svg,.bwcAv img{width:100%;height:100%;display:block;border-radius:50%;object-fit:cover;background:#0b1a2b}',
    '.bwcAv i{position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:50%;background:var(--a);border:2px solid #0b1118}',
    '.bwcT{flex:1;min-width:0}.bwcT b{display:block;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bwcT span{display:block;font-size:11.5px;color:var(--mut);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bwcX{flex:none;width:40px;height:40px;border:0;border-radius:10px;background:transparent;cursor:pointer;display:grid;place-items:center;color:var(--mut);-webkit-tap-highlight-color:transparent}',
    '.bwcX:hover{background:rgba(255,255,255,.07);color:#fff}.bwcX:focus-visible{outline:2px solid var(--a)}',
    '.bwcX svg{width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round}',
    '#bwcMsgs{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}',
    '.bwcM{max-width:86%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.5;overflow-wrap:anywhere;animation:bwcIn .25s ease both}',
    '@keyframes bwcIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '.bwcM.bot{align-self:flex-start;background:#121b26;border:1px solid var(--line);border-bottom-left-radius:5px}',
    '.bwcM.me{align-self:flex-end;background:linear-gradient(135deg,var(--b),#0a8f9c);color:#fff;border-bottom-right-radius:5px;white-space:pre-wrap}',
    '.bwcM a{color:#5ec8ff;text-decoration:underline;text-underline-offset:2px}.bwcM b{color:#fff}',
    '.bwcM code{background:rgba(255,255,255,.09);padding:1px 5px;border-radius:5px;font-size:.9em}',
    '.bwcM ul{margin:.3em 0;padding-left:1.2em}.bwcM p{margin:0}.bwcM p+p,.bwcM p+ul,.bwcM ul+p{margin-top:.5em}',
    '.bwcTyp{display:flex;gap:4px;padding:13px 15px}.bwcTyp i{width:7px;height:7px;border-radius:50%;background:var(--mut);animation:bwcDot 1.2s infinite}',
    '.bwcTyp i:nth-child(2){animation-delay:.15s}.bwcTyp i:nth-child(3){animation-delay:.3s}',
    '@keyframes bwcDot{0%,60%,100%{transform:none;opacity:.4}30%{transform:translateY(-4px);opacity:1}}',
    '#bwcChips{flex:none;display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 10px}',
    '#bwcChips button{border:1px solid rgba(0,242,96,.35);background:rgba(0,242,96,.06);color:#c9ffe0;border-radius:99px;padding:8px 13px;font-size:13px;cursor:pointer;min-height:36px;-webkit-tap-highlight-color:transparent;transition:.15s}',
    '#bwcChips button:hover{background:rgba(0,242,96,.16)}',
    '#bwcForm{flex:none;display:flex;align-items:flex-end;gap:8px;padding:10px 12px;padding-bottom:max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--line);background:#0b1118}',
    '#bwcIn{flex:1;min-width:0;resize:none;border:1px solid var(--line);background:#0f1620;color:var(--fg);border-radius:14px;padding:11px 13px;font-size:16px;line-height:1.35;font-family:inherit;max-height:110px;outline:none;-webkit-appearance:none}',
    '#bwcIn:focus{border-color:rgba(0,242,96,.55);box-shadow:0 0 0 3px rgba(0,242,96,.12)}#bwcIn::placeholder{color:#5d6b79}',
    '#bwcSend{flex:none;width:44px;height:44px;border:0;border-radius:50%;cursor:pointer;display:grid;place-items:center;background:linear-gradient(135deg,var(--b),var(--a));-webkit-tap-highlight-color:transparent;transition:opacity .15s,transform .15s}',
    '#bwcSend:disabled{opacity:.4;cursor:not-allowed}#bwcSend:not(:disabled):hover{transform:scale(1.06)}#bwcSend svg{width:20px;height:20px;fill:none;stroke:#04100a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '.bwcFoot{flex:none;text-align:center;font-size:10.5px;color:#4d5a67;padding:0 10px 8px;background:#0b1118}',
    /* phones: full-screen sheet */
    '@media(max-width:520px){',
    '  #bwcPanel{right:0;left:0;top:0;bottom:auto;width:100%;height:100vh;height:100dvh;border-radius:0;border:0;transform:translateY(24px)}',
    '  #bwcTip{display:none}',
    '  .bwcM{font-size:15px;max-width:90%}',
    '}',
    '@media(max-height:430px) and (orientation:landscape){#bwcPanel{width:min(420px,60vw);right:0;left:auto}.bwcFoot{display:none}#bwcChips{display:none}}',
    '@media(prefers-reduced-motion:reduce){#bwcFab::after,.bwcTyp i{animation:none}#bwcPanel,#bwcFab,.bwcM{transition:none;animation:none}}',
    'html.bwcLock{overflow:hidden}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  function avatar(id) {
    if (CFG.avatar) return '<img src="' + CFG.avatar.replace(/"/g, '') + '" alt="" width="48" height="48">';
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bwcg' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b3d6e"/><stop offset="1" stop-color="#0a6b57"/></linearGradient></defs>' +
      '<circle cx="24" cy="24" r="24" fill="url(#bwcg' + id + ')"/>' +
      '<path d="M6 48c1-9 8.5-13.5 18-13.5S41 39 42 48z" fill="#0c1624"/>' +
      '<path d="M18.5 36.5L24 42l5.5-5.5" fill="#e9f6ff"/>' +
      '<path d="M20 29.5h8v5.5c-2.6 2.2-5.4 2.2-8 0z" fill="#e9b88f"/>' +
      '<ellipse cx="24" cy="21.5" rx="8.2" ry="9" fill="#f6cfa9"/>' +
      '<path d="M15.6 21.5c-.9-8 4-12.2 9.4-12 5.2.2 9.3 4.4 7.6 12.2-.8-3.8-2.6-5.9-5.4-6.7-3 1.2-8 1.2-11.6 6.5z" fill="#171b26"/>' +
      '<ellipse cx="20.7" cy="22.6" rx="1.05" ry="1.35" fill="#171b26"/><ellipse cx="27.3" cy="22.6" rx="1.05" ry="1.35" fill="#171b26"/>' +
      '<path d="M20.8 26.4c1.9 1.7 4.5 1.7 6.4 0" fill="none" stroke="#b5654a" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M14.6 21.5a9.4 9.4 0 0 1 18.8 0" fill="none" stroke="#00f260" stroke-width="1.6" stroke-linecap="round"/>' +
      '<rect x="12.6" y="20.5" width="3.4" height="6" rx="1.7" fill="#00f260"/><rect x="32" y="20.5" width="3.4" height="6" rx="1.7" fill="#00f260"/>' +
      '<path d="M33.7 26.5c0 3-3 4.2-6.2 4.2" fill="none" stroke="#00f260" stroke-width="1.3" stroke-linecap="round"/><circle cx="27" cy="30.7" r="1.3" fill="#e9f6ff"/></svg>';
  }
  var ICON_BOT = '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9.5 16.5h5"/><circle cx="12" cy="3.5" r="1"/></svg>';
  var ICON_CHAT = '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01"/></svg>';
  var root = document.createElement('div');
  root.id = 'bwc';
  root.innerHTML =
    '<div id="bwcTip">Ask me anything \ud83d\udc4b</div>' +
    '<button id="bwcFab" type="button" aria-label="Open AI chat assistant" aria-haspopup="dialog" aria-expanded="false">' + avatar('f') + '<i class="bwcDot"></i></button>' +
    '<section id="bwcPanel" role="dialog" aria-modal="false" aria-label="AI chat assistant">' +
      '<header class="bwcHead"><div class="bwcAv">' + avatar('h') + '<i></i></div>' +
        '<div class="bwcT"><b></b><span></span></div>' +
        '<button class="bwcX" type="button" aria-label="Close chat"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>' +
      '<div id="bwcMsgs" role="log" aria-live="polite"></div>' +
      '<div id="bwcChips"></div>' +
      '<form id="bwcForm" autocomplete="off">' +
        '<textarea id="bwcIn" rows="1" maxlength="500" aria-label="Your message"></textarea>' +
        '<button id="bwcSend" type="submit" aria-label="Send message" disabled><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>' +
      '</form>' +
      '<div class="bwcFoot">AI can make mistakes. Check important details.</div>' +
    '</section>';
  document.body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var fab = $('#bwcFab'), panel = $('#bwcPanel'), msgs = $('#bwcMsgs'), chips = $('#bwcChips'),
      form = $('#bwcForm'), input = $('#bwcIn'), send = $('#bwcSend'), tip = $('#bwcTip');
  $('.bwcT b').textContent = CFG.title;
  $('.bwcT span').textContent = CFG.sub;
  input.placeholder = CFG.placeholder;

  /* ---------- helpers ---------- */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(text) {
    var h = esc(text);
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
         .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
         .replace(/(https?:\/\/[^\s<)]+[^\s<).,;!?])/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    var out = [], list = false;
    h.split('\n').forEach(function (line) {
      var m = line.match(/^\s*[-*\u2022]\s+(.*)/);
      if (m) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + m[1] + '</li>'); }
      else { if (list) { out.push('</ul>'); list = false; } if (line.trim()) out.push('<p>' + line + '</p>'); }
    });
    if (list) out.push('</ul>');
    return out.join('');
  }
  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }
  function add(role, text, save) {
    var d = document.createElement('div');
    d.className = 'bwcM ' + (role === 'user' ? 'me' : 'bot');
    if (role === 'user') d.textContent = text; else d.innerHTML = fmt(text);
    msgs.appendChild(d);
    scrollDown();
    if (save !== false) { history.push({ role: role, content: text }); persist(); }
    return d;
  }

  /* ---------- state (kept for the browser tab only) ---------- */
  var history = [], busy = false, KEY = 'bwChatHistory';
  function persist() { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-30))); } catch (e) {} }
  function restore() {
    try { var s = JSON.parse(sessionStorage.getItem(KEY) || '[]'); if (Array.isArray(s)) return s; } catch (e) {}
    return [];
  }

  /* ---------- open / close ---------- */
  var isOpen = false, mq = window.matchMedia('(max-width:520px)'), vv = window.visualViewport;
  function fit() {                                   // keeps the sheet above the on-screen keyboard
    if (isOpen && mq.matches && vv) { panel.style.height = vv.height + 'px'; panel.style.top = vv.offsetTop + 'px'; }
    else { panel.style.height = ''; panel.style.top = ''; }
  }
  function open() {
    if (isOpen) return; isOpen = true;
    root.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); tip.classList.remove('show');
    if (mq.matches) document.documentElement.classList.add('bwcLock');
    fit(); scrollDown();
    if (!mq.matches) setTimeout(function () { input.focus(); }, 250);
  }
  function close() {
    if (!isOpen) return; isOpen = false;
    root.classList.remove('open'); fab.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('bwcLock'); fit(); fab.focus({ preventScroll: true });
  }
  fab.addEventListener('click', open);
  $('.bwcX').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });
  if (vv) { vv.addEventListener('resize', function () { fit(); scrollDown(); }); vv.addEventListener('scroll', fit); }
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
    if (!mq.matches) document.documentElement.classList.remove('bwcLock'); else if (isOpen) document.documentElement.classList.add('bwcLock'); fit();
  });

  /* ---------- input ---------- */
  function sync() { send.disabled = busy || !input.value.trim(); input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; }
  input.addEventListener('input', sync);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : submit(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
  function submit() { var t = input.value.trim(); if (!t || busy) return; input.value = ''; sync(); ask(t); }

  CFG.chips.forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = c;
    b.addEventListener('click', function () { ask(c); }); chips.appendChild(b);
  });

  /* ---------- talk to the backend ---------- */
  function ask(text) {
    if (busy) return; busy = true; sync();
    chips.style.display = 'none';
    add('user', text);
    var typing = document.createElement('div');
    typing.className = 'bwcM bot bwcTyp'; typing.innerHTML = '<i></i><i></i><i></i>';
    msgs.appendChild(typing); scrollDown();

    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 25000);
    fetch(CFG.api, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-10) }), signal: ctl ? ctl.signal : undefined
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j && j.error || 'http ' + r.status); return j; }); })
      .then(function (j) { if (!j.reply) throw new Error('empty'); return j.reply; })
      .catch(function (err) {
        var msg = String(err && err.message || '');
        try { console.warn('[chatbot] /api/chat failed, using offline answers:', msg); } catch (e) {}
        if (/Too many/i.test(msg)) return msg;           // show rate-limit text as is
        return offlineReply(text);                       // anything else: graceful offline answer
      })
      .then(function (reply) {
        clearTimeout(timer); typing.remove(); add('assistant', reply);
      })
      .then(function () { busy = false; sync(); if (!mq.matches) input.focus(); });
  }

  /* ---------- boot ---------- */
  history = restore();
  if (history.length) { history.forEach(function (m) { add(m.role, m.content, false); }); chips.style.display = 'none'; }
  else add('assistant', CFG.greeting, false);
  setTimeout(function () { if (!isOpen && !history.length) { tip.classList.add('show'); setTimeout(function () { tip.classList.remove('show'); }, 5000); } }, 3500);
})();
