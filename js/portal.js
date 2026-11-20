// js/portal.js – CareerConnect client-side logic (ES6)

(() => {
    const JOBS_KEY  = 'jobs';
    const SAVED_KEY = 'savedJobs';
    const APPS_KEY  = 'applications';

    const load = key => JSON.parse(localStorage.getItem(key) || '[]');
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // ─── Sample Jobs ────────────────────────────────────────────────────────
    const seedJobs = () => {
        if (load(JOBS_KEY).length) return;
        const jobs = [
            { id:'1',  title:'Java Developer',         company:'Infosys',       location:'Bangalore',     experience:3, salary:900000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-15', description:'Design and develop robust Java applications for enterprise clients. Work with Spring Boot, Microservices, and REST APIs.' },
            { id:'2',  title:'Frontend Developer',      company:'TCS',           location:'Hyderabad',     experience:2, salary:800000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-14', description:'Build responsive, modern UIs using React.js, HTML5, CSS3 and Bootstrap. Collaborate with UX designers and backend teams.' },
            { id:'3',  title:'Python Developer',        company:'Wipro',         location:'Pune',          experience:2, salary:750000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-13', description:'Develop backend services and automation scripts using Python, Django and Flask. Experience with REST APIs required.' },
            { id:'4',  title:'Data Analyst',            company:'Accenture',     location:'Mumbai',        experience:1, salary:600000,  category:'Data Science',                   type:'Full-time',  posted:'2024-11-12', description:'Analyze large datasets to derive business insights. Work with SQL, Excel, Tableau, and Python for data visualization.' },
            { id:'5',  title:'UI/UX Designer',          company:'Capgemini',     location:'Chennai',       experience:2, salary:700000,  category:'UI/UX Design',                   type:'Full-time',  posted:'2024-11-11', description:'Create wireframes, prototypes, and high-fidelity designs using Figma and Adobe XD. Conduct user research and usability testing.' },
            { id:'6',  title:'Software Engineer',       company:'Deloitte',      location:'Delhi',         experience:3, salary:1100000, category:'Software Development',           type:'Full-time',  posted:'2024-11-10', description:'Build and maintain scalable cloud-based solutions. Strong knowledge of AWS, Node.js, and microservices architecture required.' },
            { id:'7',  title:'Data Scientist',          company:'HCL',           location:'Noida',         experience:3, salary:1200000, category:'Data Science',                   type:'Full-time',  posted:'2024-11-09', description:'Build ML models for predictive analytics using Python, TensorFlow, and Scikit-learn. Experience with NLP is a plus.' },
            { id:'8',  title:'DevOps Engineer',         company:'Tech Mahindra', location:'Bangalore',     experience:4, salary:1300000, category:'Software Development',           type:'Full-time',  posted:'2024-11-08', description:'Manage CI/CD pipelines, containerization with Docker & Kubernetes, and cloud infrastructure on AWS or Azure.' },
            { id:'9',  title:'Marketing Manager',       company:'Amazon India',  location:'Remote',        experience:5, salary:1500000, category:'Marketing',                      type:'Full-time',  posted:'2024-11-07', description:'Lead digital marketing campaigns, SEO/SEM strategy, and brand development. Manage a team of marketing professionals.' },
            { id:'10', title:'HR Executive',            company:'Flipkart',      location:'Bangalore',     experience:1, salary:400000,  category:'Human Resources',                type:'Full-time',  posted:'2024-11-06', description:'Handle end-to-end recruitment, onboarding, employee engagement, and payroll processing.' },
            { id:'11', title:'Sales Executive',         company:'Reliance Jio',  location:'Mumbai',        experience:1, salary:350000,  category:'Sales & Business Development',   type:'Full-time',  posted:'2024-11-05', description:'Drive B2B sales, manage key accounts, and meet monthly revenue targets in the telecom sector.' },
            { id:'12', title:'Customer Support Lead',   company:'HDFC Bank',     location:'Chennai',       experience:3, salary:550000,  category:'Customer Support',               type:'Full-time',  posted:'2024-11-04', description:'Oversee customer service operations, resolve escalations, and train support staff. Banking domain experience preferred.' },
            { id:'13', title:'React Developer',         company:'Cognizant',     location:'Hyderabad',     experience:2, salary:850000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-03', description:'Develop scalable React.js web applications. Experience with Redux, REST APIs, and unit testing (Jest) required.' },
            { id:'14', title:'Finance Analyst',         company:'Mindtree',      location:'Pune',          experience:2, salary:650000,  category:'Finance & Accounting',           type:'Full-time',  posted:'2024-11-02', description:'Perform financial modelling, budgeting, forecasting, and variance analysis. Experience with SAP or Oracle Finance is preferred.' },
            { id:'15', title:'Full Stack Developer',    company:'L&T Technology', location:'Delhi',        experience:4, salary:1400000, category:'Software Development',           type:'Full-time',  posted:'2024-11-01', description:'Work on end-to-end product development using MERN stack. Collaborate with cross-functional teams in an Agile environment.' },
            { id:'16', title:'Android Developer',       company:'Infosys',       location:'Bangalore',     experience:2, salary:800000,  category:'Software Development',           type:'Full-time',  posted:'2024-10-31', description:'Develop and maintain Android applications using Java/Kotlin. Experience with Retrofit, Room, and MVVM architecture required.' },
            { id:'17', title:'Business Analyst',        company:'TCS',           location:'Mumbai',        experience:3, salary:950000,  category:'Sales & Business Development',   type:'Full-time',  posted:'2024-10-30', description:'Gather requirements, create BRDs, and liaise between business stakeholders and technical teams.' },
            { id:'18', title:'Data Engineer',           company:'Wipro',         location:'Remote',        experience:3, salary:1100000, category:'Data Science',                   type:'Remote',     posted:'2024-10-29', description:'Design and maintain data pipelines using Apache Spark, Kafka, and Databricks. Experience with BigQuery or Snowflake is a plus.' },
            { id:'19', title:'Content Writer',          company:'Accenture',     location:'Remote',        experience:1, salary:300000,  category:'Marketing',                      type:'Remote',     posted:'2024-10-28', description:'Write engaging content for blogs, case studies, and social media. SEO knowledge and excellent communication skills required.' },
            { id:'20', title:'Junior Developer',        company:'Capgemini',     location:'Noida',         experience:0, salary:400000,  category:'Software Development',           type:'Internship', posted:'2024-10-27', description:'Entry-level role for fresh graduates. Work on real projects with guidance from senior developers. Good in JavaScript.' },
        ];
        save(JOBS_KEY, jobs);
    };

    // ─── Render Job Cards ────────────────────────────────────────────────────
    const PAGE_SIZE = 6;

    const renderJobs = (jobs, page = 1) => {
        const container = document.getElementById('jobCardsContainer');
        const noResults = document.getElementById('noResults');
        const resultCount = document.getElementById('resultCount');
        if (!container) return;

        const saved = load(SAVED_KEY);
        const start = (page - 1) * PAGE_SIZE;
        const pageJobs = jobs.slice(start, start + PAGE_SIZE);

        if (!jobs.length) {
            container.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            if (resultCount) resultCount.textContent = 'No jobs found';
            renderPagination(0, 1);
            return;
        }
        if (noResults) noResults.style.display = 'none';
        if (resultCount) resultCount.textContent = `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, jobs.length)} of ${jobs.length} jobs`;

        container.innerHTML = pageJobs.map(job => {
            const isSaved = saved.includes(job.id);
            const salaryLPA = (job.salary / 100000).toFixed(1);
            return `
            <div class="job-card p-4 shadow-sm">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge bg-primary bg-opacity-10 text-primary job-badge">${job.type}</span>
                            <span class="badge bg-secondary bg-opacity-10 text-secondary job-badge">${job.category}</span>
                        </div>
                        <h5 class="fw-bold mb-1">${job.title}</h5>
                        <p class="text-muted mb-2 small">
                            <i class="fas fa-building me-1"></i>${job.company} &nbsp;|&nbsp;
                            <i class="fas fa-map-marker-alt me-1"></i>${job.location} &nbsp;|&nbsp;
                            <i class="fas fa-briefcase me-1"></i>${job.experience === 0 ? 'Fresher' : job.experience + '+ yrs'} &nbsp;|&nbsp;
                            <i class="fas fa-rupee-sign me-1"></i>${salaryLPA} LPA
                        </p>
                        <p class="text-muted small mb-3">${job.description.substring(0, 120)}...</p>
                        <div class="d-flex gap-2 flex-wrap">
                            <a href="job-details.html?id=${job.id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-eye me-1"></i>View Details
                            </a>
                            <button class="btn btn-outline-success btn-sm apply-now-btn" data-id="${job.id}">
                                <i class="fas fa-paper-plane me-1"></i>Apply Now
                            </button>
                        </div>
                    </div>
                    <div class="ms-3 d-flex flex-column align-items-end gap-2">
                        <button class="btn btn-sm btn-outline-secondary save-btn ${isSaved ? 'saved' : ''}" data-id="${job.id}" title="${isSaved ? 'Remove from saved' : 'Save job'}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <small class="text-muted">${job.posted}</small>
                    </div>
                </div>
            </div>`;
        }).join('');

        renderPagination(jobs.length, page);
        // Reattach save button listeners
        container.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleSave(btn.dataset.id));
        });
        // Apply Now – auth guard
        container.querySelectorAll('.apply-now-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const candidate = JSON.parse(localStorage.getItem('candidate') || 'null');
                if (!candidate) {
                    const applyUrl = `apply-job.html?id=${btn.dataset.id}`;
                    localStorage.setItem('redirectAfterLogin', applyUrl);
                    window.location.href = 'candidate-login.html';
                    return;
                }
                window.location.href = `apply-job.html?id=${btn.dataset.id}`;
            });
        });
    };

    // ─── Pagination ──────────────────────────────────────────────────────────
    let currentPage = 1;
    let currentJobs = [];

    const renderPagination = (total, current) => {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        const totalPages = Math.ceil(total / PAGE_SIZE);
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }
        let html = '';
        html += `<li class="page-item ${current === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${current - 1}">«</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item ${i === current ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        html += `<li class="page-item ${current === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${current + 1}">»</a></li>`;
        pagination.innerHTML = html;
        pagination.querySelectorAll('a[data-page]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const pg = parseInt(a.dataset.page);
                if (pg >= 1 && pg <= totalPages) {
                    currentPage = pg;
                    renderJobs(currentJobs, currentPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    };

    // ─── Filters ─────────────────────────────────────────────────────────────
    const applyFilters = (page = 1) => {
        let jobs = load(JOBS_KEY);

        const keyword = document.getElementById('searchInput')?.value.trim().toLowerCase();
        if (keyword) jobs = jobs.filter(j =>
            j.title.toLowerCase().includes(keyword) ||
            j.company.toLowerCase().includes(keyword) ||
            j.description.toLowerCase().includes(keyword) ||
            j.category.toLowerCase().includes(keyword)
        );

        const locInput = document.getElementById('locationInput')?.value.trim().toLowerCase();
        if (locInput) jobs = jobs.filter(j => j.location.toLowerCase().includes(locInput));

        const cat = document.getElementById('categoryFilter')?.value;
        if (cat) jobs = jobs.filter(j => j.category === cat);

        const exp = document.getElementById('experienceFilter')?.value;
        if (exp !== '' && exp !== undefined && exp !== null) jobs = jobs.filter(j => j.experience >= Number(exp));

        const sal = document.getElementById('salaryFilter')?.value;
        if (sal) jobs = jobs.filter(j => j.salary >= Number(sal));

        // Job type checkboxes
        const checkedTypes = [...document.querySelectorAll('#jobTypeFilters input:checked')].map(cb => cb.value);
        if (checkedTypes.length) jobs = jobs.filter(j => checkedTypes.includes(j.type));

        // Sort
        const sort = document.getElementById('sortFilter')?.value;
        if (sort === 'salary_high') jobs.sort((a, b) => b.salary - a.salary);
        else if (sort === 'salary_low') jobs.sort((a, b) => a.salary - b.salary);
        else jobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));

        currentJobs = jobs;
        currentPage = page;
        renderJobs(jobs, page);
    };

    const clearAllFilters = () => {
        ['searchInput','locationInput'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        ['categoryFilter','experienceFilter','salaryFilter','sortFilter'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
        document.querySelectorAll('#jobTypeFilters input').forEach(cb => cb.checked = false);
        applyFilters();
    };

    // ─── Save / Unsave ────────────────────────────────────────────────────────
    const toggleSave = id => {
        let saved = load(SAVED_KEY);
        if (saved.includes(id)) saved = saved.filter(i => i !== id);
        else saved.push(id);
        save(SAVED_KEY, saved);
        applyFilters(currentPage);
    };

    // ─── Job Details ─────────────────────────────────────────────────────────
    const loadJobDetails = () => {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) return;
        const job = load(JOBS_KEY).find(j => j.id === id);
        const container = document.getElementById('jobDetailContainer');
        if (!job || !container) return;
        const salaryLPA = (job.salary / 100000).toFixed(1);
        const isSaved = load(SAVED_KEY).includes(id);
        container.innerHTML = `
            <div class="card border-0 shadow-sm p-4">
                <span class="badge bg-primary bg-opacity-10 text-primary mb-2 d-inline-block">${job.type}</span>
                <h2 class="fw-bold">${job.title}</h2>
                <h5 class="text-muted mb-3">${job.company}</h5>
                <div class="row g-3 mb-4">
                    <div class="col-md-3"><div class="p-3 bg-light rounded text-center"><i class="fas fa-map-marker-alt text-primary mb-1 d-block"></i><small class="text-muted">Location</small><div class="fw-semibold">${job.location}</div></div></div>
                    <div class="col-md-3"><div class="p-3 bg-light rounded text-center"><i class="fas fa-briefcase text-primary mb-1 d-block"></i><small class="text-muted">Experience</small><div class="fw-semibold">${job.experience === 0 ? 'Fresher' : job.experience + '+ yrs'}</div></div></div>
                    <div class="col-md-3"><div class="p-3 bg-light rounded text-center"><i class="fas fa-rupee-sign text-primary mb-1 d-block"></i><small class="text-muted">Salary</small><div class="fw-semibold">${salaryLPA} LPA</div></div></div>
                    <div class="col-md-3"><div class="p-3 bg-light rounded text-center"><i class="fas fa-tag text-primary mb-1 d-block"></i><small class="text-muted">Category</small><div class="fw-semibold">${job.category}</div></div></div>
                </div>
                <h5 class="fw-bold">Job Description</h5>
                <p class="text-muted">${job.description}</p>
                <div class="d-flex gap-2 mt-4">
                    <button class="btn btn-primary" id="applyDetailBtn" data-id="${job.id}"><i class="fas fa-paper-plane me-2"></i>Apply Now</button>
                    <button class="btn btn-outline-secondary" id="saveDetailBtn">
                        <i class="fas fa-heart me-1"></i>${isSaved ? 'Saved' : 'Save Job'}
                    </button>
                    <a href="jobs.html" class="btn btn-outline-primary"><i class="fas fa-arrow-left me-1"></i>Back to Jobs</a>
                </div>
            </div>`;
        document.getElementById('saveDetailBtn').addEventListener('click', function () {
            toggleSave(id);
            const saved = load(SAVED_KEY).includes(id);
            this.innerHTML = `<i class="fas fa-heart me-1"></i>${saved ? 'Saved' : 'Save Job'}`;
        });
        document.getElementById('applyDetailBtn').addEventListener('click', function () {
            const candidate = JSON.parse(localStorage.getItem('candidate') || 'null');
            if (!candidate) {
                localStorage.setItem('redirectAfterLogin', `apply-job.html?id=${id}`);
                window.location.href = 'candidate-login.html';
                return;
            }
            window.location.href = `apply-job.html?id=${id}`;
        });
    };

    // ─── Candidate Dashboard ─────────────────────────────────────────────────
    const populateDashboard = () => {
        const candidate = JSON.parse(localStorage.getItem('candidate') || '{}');
        const nameSpan = document.getElementById('candidateName');
        if (nameSpan) nameSpan.textContent = candidate.fullName || 'Candidate';
        const savedList = document.getElementById('savedJobsList');
        if (savedList) {
            const allJobs = load(JOBS_KEY);
            const savedIds = load(SAVED_KEY);
            savedList.innerHTML = savedIds.length
                ? savedIds.map(id => { const j = allJobs.find(x => x.id === id); return j ? `<li class="list-group-item">${j.title} – ${j.company}</li>` : ''; }).join('')
                : '<li class="list-group-item text-muted">No saved jobs yet.</li>';
        }
        const appsList = document.getElementById('recentAppsList');
        if (appsList) {
            const apps = load(APPS_KEY).slice(-5).reverse();
            appsList.innerHTML = apps.length
                ? apps.map(a => `<li class="list-group-item">${a.title} at ${a.company || ''} – <span class="badge bg-info">${a.status}</span></li>`).join('')
                : '<li class="list-group-item text-muted">No applications yet.</li>';
        }
    };

    // ─── Event Listeners ─────────────────────────────────────────────────────
    const attachListeners = () => {
        // Search & filters
        document.getElementById('searchBtn')?.addEventListener('click', () => applyFilters());
        document.getElementById('searchInput')?.addEventListener('keyup', e => { if (e.key === 'Enter') applyFilters(); });
        document.getElementById('locationInput')?.addEventListener('keyup', e => { if (e.key === 'Enter') applyFilters(); });
        ['categoryFilter','experienceFilter','salaryFilter','sortFilter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => applyFilters());
        });
        document.querySelectorAll('#jobTypeFilters input').forEach(cb => cb.addEventListener('change', () => applyFilters()));
        document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);
        document.getElementById('clearFilters2')?.addEventListener('click', clearAllFilters);

        // Job details page
        if (document.getElementById('jobDetailContainer')) loadJobDetails();

        // Dashboard
        if (document.getElementById('candidateName')) populateDashboard();

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', e => {
            e.preventDefault();
            localStorage.removeItem('candidate');
            localStorage.removeItem('employer');
            window.location.href = 'index.html';
        });
    };

    // ─── Init ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        seedJobs();
        attachListeners();
        if (document.getElementById('jobCardsContainer')) applyFilters();
    });
})();
