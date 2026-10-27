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
    greeting: 'Hi, I\u2019m Biswajit\u2019s AI assistant. Ask me about his skills, projects, internship, or how to get in touch.',
    placeholder: 'Type your question\u2026',
    chips: ['Who is Biswajit?', 'Skills & tech stack', 'Show me his projects', 'Education', 'How can I contact him?'],
    cv: 'cv.pdf',
    github: 'https://github.com/Biswajitpa',
    avatar: ''   // put your photo path here, e.g. 'assets/me.jpg' (leave empty to use the built-in human logo)
  };
  var user = window.BW_CHAT || {};
  for (var k in user) if (Object.prototype.hasOwnProperty.call(user, k)) CFG[k] = user[k];

  /* ---------- smart offline answers (used whenever /api/chat is unreachable) ---------- */
  var G = CFG.github;
  var EMAIL = 'pattanaikbiswajit07@gmail.com';
  var LI = 'https://www.linkedin.com/in/biswajit-pattanaik-3586b82b3';
  var KB = [
    { id: 'greet', k: ['hi', 'hii', 'hey', 'heyy', 'hello', 'hlo', 'hola', 'namaste', 'yo', 'good morning', 'good evening'],
      a: 'Hello! \ud83d\udc4b I can tell you about Biswajit\u2019s **projects, skills, education, internship, goals** or how to **contact** him. What would you like to know?' },
    { id: 'how', k: ['how are you', 'how r u', 'whats up', 'sup'], a: 'I\u2019m doing great, thanks for asking! \ud83d\ude0a Ask me anything about Biswajit\u2019s work.' },
    { id: 'thanks', k: ['thanks', 'thank you', 'thx', 'tysm', 'great', 'awesome', 'nice', 'cool', 'ok thanks'], a: 'You\u2019re welcome! Anything else you\u2019d like to know about Biswajit?' },
    { id: 'bye', k: ['bye', 'goodbye', 'see you', 'cya'], a: 'Bye! Thanks for visiting Biswajit\u2019s portfolio. \ud83d\udc4b' },
    { id: 'bot', k: ['who are you', 'who r u', 'who are u', 'are you ai', 'are you a bot', 'are you human', 'chatgpt', 'claude', 'your name', 'bot'],
      a: 'I\u2019m the AI assistant on Biswajit\u2019s portfolio. I answer questions about his projects, skills and background.' },
    { id: 'help', k: ['help', 'what can you do', 'options', 'menu', 'topics', 'what can i ask'],
      a: 'You can ask me about:\n- **Projects** (RYDEX, ResumeGenie, Rail Track AI, Vingo, MultiCart, AgriVision, Pneumonia.AI\u2026)\n- **Skills** & tech stack\n- **Education** & CGPA\n- **Internship** at East Coast Railway\n- **Courses**\n- **Career goals**\n- **Contact**, CV & GitHub' },
    { id: 'about', k: ['who is biswajit', 'who is he', 'about', 'introduce', 'intro', 'himself', 'summary', 'profile', 'biswajit', 'overview', 'describe'],
      a: 'Biswajit Pattanaik is a fourth-year **B.Tech student** and aspiring **software / AI engineer**. He learns by building: full-stack web apps, Generative AI tools, computer-vision models, IoT and embedded systems.',
      m: 'He studies at **CUTM, Bhubaneswar** (CGPA about 8.20) and completed a **Signal & Telecommunication internship at East Coast Railway** in June\u2013July 2026. His interests: **full-stack web, AI/ML & Generative AI, IoT/embedded, networking and system design**. Ask about his projects or skills for details.' },
    { id: 'name', k: ['name', 'called', 'pattanaik', 'pattanayak', 'full name'], a: 'His name is **Biswajit Pattanaik**.' },
    { id: 'edu', k: ['education', 'educational', 'degree', 'college', 'university', 'cgpa', 'btech', 'b.tech', 'study', 'studying', 'graduation', 'graduate', 'cutm', 'centurion', 'academic', 'academics', 'qualification', 'year', 'student', 'school', 'class 10', 'class 12'],
      a: '**B.Tech (fourth year)** at **Centurion University of Technology and Management (CUTM)**, Bhubaneswar, Odisha. CGPA is approximately **8.20**.',
      m: 'Earlier education: **Class 12** at Royal College of Science and Technology, Bhubaneswar, and **Class 10** at Saraswati Sishu Vidya Mandir, Jatani. He enjoys applying theory through real projects in software, AI/ML, IoT and networking.' },
    { id: 'skills', k: ['skills', 'skill', 'tech', 'technology', 'technologies', 'stack', 'languages', 'language', 'tools', 'expertise', 'good at', 'programming', 'know', 'proficient', 'strengths', 'python', 'cpp', 'c++'],
      a: '**Languages:** C, C++, Python, JavaScript, TypeScript, Java\n**Web:** React, Next.js, Node.js, Express, Flask, Tailwind, REST APIs, Socket.IO\n**Database:** MongoDB\n**AI/ML:** TensorFlow, Keras, Scikit-learn, CNNs, computer vision, Grad-CAM\n**GenAI:** Groq/Llama, Gemini, LangChain, LangGraph, RAG\n**IoT & hardware:** ESP32, Arduino, STM32, KiCad, MQTT\n**Other:** networking, AWS basics, system design',
      m: 'He has used or explored these at different levels. **Auth:** JWT, Google OAuth, OTP. **Deployment:** Git, GitHub, Vercel, Streamlit. **Concepts:** Docker, CI/CD, Kubernetes, microservices. Ask about a specific area for more.' },
    { id: 'web', k: ['web', 'frontend', 'front-end', 'backend', 'back-end', 'fullstack', 'full-stack', 'react', 'next', 'nextjs', 'node', 'express', 'flask', 'javascript', 'typescript', 'tailwind', 'html', 'css', 'website'],
      a: 'Web stack: **React, Next.js, Node.js, Express.js, Flask, TypeScript, Tailwind CSS, Vite**, REST APIs and **Socket.IO** for real-time features. Projects built with it: **RYDEX, Vingo, CartSphere/MultiCart** and **Virtual Courses**.' },
    { id: 'ai', k: ['ai', 'ml', 'machine', 'learning', 'artificial', 'genai', 'llm', 'rag', 'langchain', 'langgraph', 'tensorflow', 'keras', 'cnn', 'deep', 'neural', 'vision', 'computer vision', 'model', 'groq', 'gemini', 'prompt', 'classification', 'gradcam', 'grad-cam', 'embedding', 'embeddings', 'vector', 'agent', 'agents'],
      a: 'AI/ML: **TensorFlow, Keras, Scikit-learn, CNNs, transfer learning, computer vision, TensorFlow Lite, Grad-CAM**. Generative AI: **Groq/Llama, Gemini, prompt engineering, LangChain, LangGraph, RAG, AI agents**. Projects: **ResumeGenie AI, Rail Track Fault Detection, AgriVision AI, Pneumonia.AI, Dental Care 2.0**.' },
    { id: 'iot', k: ['iot', 'embedded', 'esp32', 'arduino', 'stm32', 'raspberry', 'sensor', 'sensors', 'hardware', 'robotics', 'robot', 'mqtt', 'microcontroller', 'microcontrollers', 'pcb', 'kicad', 'electronics', 'buck', 'axion'],
      a: 'IoT, embedded & electronics: **ESP32, Arduino, STM32**, sensors (DHT11, PIR, IR), UART/I2C/SPI, **MQTT**, and **KiCad PCB design**. Related projects: **ESP32 Wi-Fi CSI presence detection**, **KiCad buck converter (12V\u21925V)**, **Axion six-axis robot controller** and a smart agriculture robot concept. These are explored or concept-stage unless stated otherwise.' },
    { id: 'dsa', k: ['dsa', 'algorithm', 'algorithms', 'leetcode', 'coding', 'data structures', 'competitive', 'problem solving'],
      a: 'He is strengthening **DSA**: arrays, strings, searching/sorting, stacks, queues, linked lists, recursion, trees, graph traversal, dynamic programming and Kadane\u2019s algorithm, with time and space complexity analysis.' },
    { id: 'java', k: ['java', 'spring', 'springboot', 'oop'],
      a: '**Java:** he is interested in OOP and backend development and is learning **Spring Boot** and the Java ecosystem.' },
    { id: 'auth', k: ['auth', 'authentication', 'login', 'jwt', 'oauth', 'google login', 'otp', 'security', 'cookie', 'cookies'],
      a: 'Authentication: **JWT sessions, Google OAuth, OTP verification** and **role-based access control**. Used in projects like **RYDEX, Virtual Courses, MultiCart** and **Vingo**.' },
    { id: 'csi', k: ['csi', 'wifi', 'wi-fi', 'presence', 'channel state', 'human detection', 'motion detection'],
      a: '**ESP32 Wi-Fi CSI Human Presence Detection** explores detecting people indoors from Wi-Fi signal measurements on a low-cost ESP32. It is a concept / work in progress; it still needs data collection, calibration and comparison with PIR sensors.' },
    { id: 'db', k: ['database', 'databases', 'mongodb', 'mongo', 'sql', 'db'],
      a: 'Database: **MongoDB** (schemas, CRUD, data modelling), plus concepts like caching, replication and data consistency. He uses Cloudinary for media storage in some projects.' },
    { id: 'sd', k: ['system design', 'architecture', 'scalability', 'load balancing', 'caching', 'microservices', 'distributed', 'queue', 'queues', 'gateway', 'rate limiting', 'rate limit', 'message queue', 'replication', 'hld', 'lld'],
      a: 'System design topics he studies: **client-server architecture, API design, caching, database replication, load balancing, rate limiting, message queues, HLD/LLD and distributed systems fundamentals**.' },
    { id: 'net', k: ['networking', 'network', 'cisco', 'packet tracer', 'cloud', 'aws', 'docker', 'kubernetes', 'devops', 'dns', 'routing'],
      a: 'Networking & cloud: **Cisco Packet Tracer, IP addressing, routing, DNS**, plus **AWS fundamentals** and Docker/CI-CD/Kubernetes concepts. Project: **AI-Assisted Campus Network Monitoring**.' },
    { id: 'projects', k: ['projects', 'project', 'built', 'build', 'made', 'work', 'works', 'portfolio', 'apps', 'developed', 'created', 'applications'],
      a: 'Main projects:\n- **RYDEX** (ride-hailing platform)\n- **ResumeGenie AI** (GenAI career tool)\n- **Rail Track Fault Detection AI** (computer vision)\n- **Vingo** (food delivery)\n- **CartSphere / MultiCart** (multi-vendor e-commerce)\n- **AgriVision AI** (smart agriculture)\n- **Pneumonia.AI** (explainable X-ray analysis)\n- **Dental Care 2.0** and **Dental Appointment AI Agent**\n- Also: Virtual Courses, DiaVision AI, ESP32 CSI, KiCad buck converter, Axion, campus network monitoring\nAsk about any one for details.',
      m: 'Tell me a project name, for example: **RYDEX**, **ResumeGenie**, **Rail Track**, **Vingo**, **MultiCart**, **AgriVision**, **Pneumonia.AI**, **Dental Care**, **Virtual Courses**, **DiaVision**, **Axion** or **Network Monitoring**.' },
    { id: 'rydex', k: ['rydex', 'ride', 'rides', 'ride-hailing', 'ride hailing', 'taxi', 'cab', 'uber', 'ola', 'mobility', 'driver', 'passenger'],
      a: '**RYDEX** is a ride-hailing platform connecting passengers and drivers: OTP and Google login, JWT sessions, ride booking, fare estimation, map and GPS integration, driver allocation, OTP ride verification, payments and driver earnings analytics. Stack: **Next.js, React, Node.js**.',
      m: 'It uses graph-based routing and shortest-path concepts for driver proximity. Planned (not built yet): demand prediction, surge pricing, fraud detection, microservices, Kafka and Kubernetes.' },
    { id: 'rg', k: ['resumegenie', 'resume genie', 'resume analyzer', 'ats', 'cover letter', 'career assistant', 'career coach'],
      a: '**ResumeGenie AI** is a Generative AI career assistant. It audits resumes, gives an ATS-style matching score against a job description, writes tailored cover letters and offers career coaching. Built with **Python, Streamlit and Groq (Llama 3.3 70B)**.',
      m: 'It shows his experience with LLM API integration, prompt design and presenting AI output in a clean interface. Future ideas: resume version management, application tracking and skill-gap analysis.' },
    { id: 'rail', k: ['rail', 'railway', 'track', 'tracks', 'fault', 'defect', 'crack', 'efficientnet', 'bharatiya'],
      a: '**Bharatiya Rail Track Fault Detection AI** classifies railway track defects (cracks, rust, breaks) from images using **EfficientNetB3**, with a **Streamlit** app, **Grad-CAM** explanations and a **TensorFlow Lite** model. Reported accuracy is about **91.56%** (self-reported, still to be verified on the final test set).',
      m: 'Dataset: **3,439 training, 983 validation and 481 test images**. It is a learning project; model predictions cannot replace qualified railway inspection.' },
    { id: 'vingo', k: ['vingo', 'food', 'delivery', 'restaurant', 'zomato', 'swiggy'],
      a: '**Vingo** is a real-time food delivery platform for customers, shop owners and delivery partners, with Socket.IO live updates and Razorpay payments. Stack: **React, Vite, Node.js, Express, MongoDB, Socket.IO, Tailwind**.' },
    { id: 'mc', k: ['multicart', 'cartsphere', 'ecommerce', 'e-commerce', 'marketplace', 'vendor', 'shopping', 'multi-vendor'],
      a: '**CartSphere / MultiCart** is a multi-vendor e-commerce platform: vendor registration and approval, product approval, GST info, checkout and payments, Cash on Delivery and return-policy settings, admin moderation and sales dashboards. Stack: **Next.js, TypeScript, Tailwind, MongoDB, Razorpay, Cloudinary**.' },
    { id: 'vc', k: ['virtual courses', 'courses platform', 'online learning', 'lms', 'elearning'],
      a: '**Virtual Courses Platform** is an online-learning web app with Google sign-in, OTP verification, Cloudinary media, Razorpay payments and Gemini API integration.' },
    { id: 'dental', k: ['dental', 'dentist', 'appointment', 'appointments', 'langgraph', 'dental care', 'booking agent'],
      a: 'Two related AI projects: **Dental Appointment AI Agent** (LangChain + LangGraph; understands appointment requests, extracts details such as time and prepares a response) and **Dental Care 2.0** (multi-step LangGraph workflow with Pydantic validation and Pandas). Real booking needs a connected booking system, which is future work.' },
    { id: 'agri', k: ['agrivision', 'agri', 'agriculture', 'farm', 'farming', 'crop', 'smart agriculture', 'leaf', 'yield'],
      a: '**AgriVision AI** combines crop disease detection from leaf images, crop recommendation, yield prediction and an AI farming assistant (Groq-hosted Llama), with charts and PDF/CSV reports. Stack: **Python, Streamlit, Scikit-learn, TensorFlow/Keras, Plotly**. Models still need validation on independent data.' },
    { id: 'pneu', k: ['pneumonia', 'xray', 'x-ray', 'chest', 'medical', 'healthcare', 'diabetic', 'retinopathy', 'diavision', 'retina'],
      a: '**Pneumonia.AI** classifies chest X-rays with a **ResNet50** model, shows **Grad-CAM** heatmaps, uses **Gemini 2.5 Flash** for explanations and creates PDF reports (Flask). **DiaVision AI** is a diabetic retinopathy concept. Both are experimental and **not clinically validated**.' },
    { id: 'robot', k: ['axion', 'six-axis', 'robot arm', 'servo', 'buck converter', 'lm2596', 'agriculture robot'],
      a: 'Hardware concepts: **KiCad 12V\u21925V buck converter** (LM2596S-5.0), **Axion** six-axis robot controller (STM32F103C8T6, servos, IMUs, CAN, NRF24L01) and a **smart agriculture robot** idea. They are design/concept-stage; fabrication and validation are not claimed.' },
    { id: 'nm', k: ['network monitoring', 'intelligent network', 'campus network', 'monitoring'],
      a: '**AI-Assisted Campus Network Monitoring** models a university campus in **Cisco Packet Tracer** (academic blocks, admin/exam systems, hostels, data-centre servers, Wi-Fi access points). AI anomaly detection is planned work.' },
    { id: 'intern', k: ['internship', 'intern', 'east coast railway', 'ecor', 'signal', 'telecommunication', 'telecom', 'railways'],
      a: 'Biswajit interned at **East Coast Railway (Signal & Telecommunication Department)** in **June\u2013July 2026** (about one month), learning about railway signalling, communication networks, data transmission and technical troubleshooting. Ask him directly for specifics of his tasks.' },
    { id: 'cert', k: ['certificate', 'certifications', 'certification', 'courses taken', 'training', 'ibm', 'nptel', 'simplilearn', 'cttc', 'forage', 'deloitte', 'powerbi', 'power bi'],
      a: 'Learning history includes **IBM SkillsBuild (AI), GenAI Studio with Google Cloud, AWS Cloud Practitioner Essentials, Simplilearn SkillUp (DSA, Full-Stack, DevOps on AWS), NPTEL Intro to IoT (IIT Kharagpur), CTTC Bhubaneswar (C and PLC), Deloitte Data Analytics (Forage)** and more. Check his CV for the exact certificates.' },
    { id: 'ach', k: ['achievement', 'achievements', 'award', 'awards', 'won', 'win', 'winner', 'ieee', 'competition', 'hackathon', 'accomplishment', 'recognition'],
      a: 'He reports winning with the **AI Vehicle Black Box at IEEE Tech Spark 2.0**. Please check his CV for the full list of achievements.' },
    { id: 'exp', k: ['experience', 'experienced', 'employed', 'company', 'job experience', 'worked'],
      a: 'Biswajit has a one-month **internship at East Coast Railway (Signal & Telecommunication)**, plus hands-on **project experience** in AI, full-stack and IoT. He is looking for internship and entry-level roles.' },
    { id: 'goal', k: ['goal', 'goals', 'career', 'future', 'looking', 'hire', 'hiring', 'available', 'availability', 'opportunity', 'opportunities', 'recruit', 'recruiter', 'role', 'job', 'open to', 'plan', 'plans', 'ambition'],
      a: 'Biswajit wants to become a capable **software / AI engineer** who builds reliable applications. Target areas: **SDE, full-stack, AI/ML and Generative AI**, with an interest in IoT/embedded. He is **open to internships and entry-level opportunities**.',
      m: 'Focus areas: stronger DSA, backend and system design, deeper full-stack and AI skills, and real industry experience.' },
    { id: 'why', k: ['why', 'special', 'unique', 'different', 'best', 'strong', 'should i hire', 'advantage'],
      a: 'What stands out: he **builds complete, practical projects** across AI, full-stack and IoT, and cares about how systems work internally, not only how to use them. See his projects for proof.' },
    { id: 'contact', k: ['contact', 'email', 'mail', 'reach', 'linkedin', 'connect', 'message', 'social', 'get in touch', 'talk', 'phone', 'call', 'number'],
      a: 'You can reach Biswajit here:\n- **Email:** ' + EMAIL + '\n- **LinkedIn:** ' + LI + '\n- **GitHub:** ' + G },
    { id: 'cv', k: ['cv', 'resume', 'r\u00e9sum\u00e9', 'download'], a: 'You can download his CV here: ' + CFG.cv },
    { id: 'gh', k: ['github', 'git', 'repo', 'repository', 'repositories', 'source', 'code'], a: 'His GitHub: ' + G },
    { id: 'loc', k: ['where', 'location', 'city', 'based', 'live', 'lives', 'odisha', 'bhubaneswar', 'india', 'place'], a: 'Biswajit is based in **Odisha, India** (studying in Bhubaneswar).' },
    { id: 'personal', k: ['age', 'old', 'birthday', 'married', 'hobby', 'hobbies', 'family', 'girlfriend', 'salary', 'religion', 'backlog', 'attendance', 'interview', 'interviews'],
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
    return 'I may not have that detail, but I can help with Biswajit\u2019s **projects, skills, education, internship, goals** and **contact** info. Which one would you like?';
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
