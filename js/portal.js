// js/portal.js
// Refactored Job Portal client‑side logic (vanilla ES6)
// Handles job data, filters, pagination, saving, details, dashboard, and logout.

(() => {
    const JOBS_KEY = 'jobs';
    const SAVED_KEY = 'savedJobs';
    const APPS_KEY = 'applications';

    // ---------- Local Storage helpers ----------
    const load = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // ---------- Sample data ----------
    const seedJobs = () => {
        if (load(JOBS_KEY).length === 0) {
            const sample = [
                {id: '1', title: 'Frontend Developer', company: 'TechStars', location: 'New York', experience: 2, salary: 75000, description: 'Develop and maintain web applications using React.'},
                {id: '2', title: 'Backend Engineer', company: 'DataWorks', location: 'San Francisco', experience: 3, salary: 95000, description: 'Build scalable APIs with Node.js and Express.'},
                {id: '3', title: 'UI/UX Designer', company: 'Creative Labs', location: 'Remote', experience: 1, salary: 65000, description: 'Design user‑friendly interfaces and improve UX.'},
                {id: '4', title: 'Full Stack Developer', company: 'Innovate Ltd.', location: 'Chicago', experience: 4, salary: 105000, description: 'Work on both front‑end and back‑end technologies.'},
                {id: '5', title: 'DevOps Engineer', company: 'CloudOps', location: 'Austin', experience: 3, salary: 90000, description: 'Maintain CI/CD pipelines and cloud infrastructure.'}
            ];
            save(JOBS_KEY, sample);
        }
    };

    // ---------- Rendering ----------
    const renderJobs = (jobs, page = 1, pageSize = 5) => {
        const container = document.getElementById('jobCardsContainer');
        if (!container) return;
        container.innerHTML = '';
        const start = (page - 1) * pageSize;
        const pageJobs = jobs.slice(start, start + pageSize);
        pageJobs.forEach(job => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            const card = document.createElement('div');
            card.className = `card job-card ${document.body.classList.contains('dark-mode') ? 'card-dark' : ''}`;
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                    <p class="card-text">${job.location}</p>
                    <p class="card-text">Experience: ${job.experience} yr(s)</p>
                    <p class="card-text">Salary: $${job.salary}</p>
                    <a href="job-details.html?id=${job.id}" class="btn btn-sm btn-primary me-2">Details</a>
                    <button class="btn btn-sm btn-outline-secondary save-btn" data-id="${job.id}">
                        ${load(SAVED_KEY).includes(job.id) ? 'Unsave' : 'Save'}
                    </button>
                </div>`;
            col.appendChild(card);
            container.appendChild(col);
        });
        renderPagination(jobs.length, page, pageSize);
    };

    const renderPagination = (total, current, pageSize) => {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        pagination.innerHTML = '';
        const totalPages = Math.ceil(total / pageSize);
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === current ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(li);
        }
    };

    // ---------- Filters ----------
    const applyFiltersAndRender = (page = 1) => {
        let jobs = load(JOBS_KEY);
        const search = document.getElementById('searchInput')?.value.trim().toLowerCase();
        if (search) {
            jobs = jobs.filter(j => j.title.toLowerCase().includes(search) || j.company.toLowerCase().includes(search));
        }
        const loc = document.getElementById('locationFilter')?.value;
        if (loc) jobs = jobs.filter(j => j.location === loc);
        const exp = document.getElementById('experienceFilter')?.value;
        if (exp) jobs = jobs.filter(j => j.experience == exp);
        const sal = document.getElementById('salaryFilter')?.value;
        if (sal) jobs = jobs.filter(j => j.salary >= Number(sal));
        renderJobs(jobs, page);
    };

    const populateFilters = () => {
        const jobs = load(JOBS_KEY);
        const locSelect = document.getElementById('locationFilter');
        const expSelect = document.getElementById('experienceFilter');
        const salSelect = document.getElementById('salaryFilter');
        if (locSelect) {
            const locations = [...new Set(jobs.map(j => j.location))];
            locSelect.innerHTML = '<option value="">All Locations</option>' + locations.map(l => `<option>${l}</option>`).join('');
        }
        if (expSelect) {
            const experiences = [...new Set(jobs.map(j => j.experience))].sort((a,b)=>a-b);
            expSelect.innerHTML = '<option value="">All Experience</option>' + experiences.map(e => `<option>${e}</option>`).join('');
        }
        if (salSelect) {
            const salaries = [50000,80000,100000];
            salSelect.innerHTML = '<option value="">All Salaries</option>' + salaries.map(s => `<option value="${s}">${s/1000}k+</option>`).join('');
        }
    };

    // ---------- Save / Unsave ----------
    const toggleSave = (id) => {
        const saved = load(SAVED_KEY);
        const newSaved = saved.includes(id) ? saved.filter(i => i !== id) : [...saved, id];
        save(SAVED_KEY, newSaved);
        applyFiltersAndRender();
    };

    // ---------- Job Details ----------
    const loadJobDetails = () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) return;
        const job = load(JOBS_KEY).find(j => j.id === id);
        if (!job) return;
        const container = document.getElementById('jobDetailContainer');
        if (!container) return;
        container.innerHTML = `
            <h2>${job.title}</h2>
            <h4>${job.company}</h4>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Experience Required:</strong> ${job.experience} yr(s)</p>
            <p><strong>Salary:</strong> $${job.salary}</p>
            <p>${job.description}</p>
            <a href="apply-job.html?id=${job.id}" class="btn btn-success me-2">Apply</a>
            <button class="btn btn-outline-secondary" id="saveDetailBtn">${load(SAVED_KEY).includes(id) ? 'Unsave' : 'Save'}</button>
        `;
        document.getElementById('saveDetailBtn').addEventListener('click', () => toggleSave(id));
    };

    // ---------- Candidate Dashboard ----------
    const populateDashboard = () => {
        const nameSpan = document.getElementById('candidateName');
        const savedList = document.getElementById('savedJobsList');
        const appsList = document.getElementById('recentAppsList');
        const candidate = JSON.parse(localStorage.getItem('candidate') || '{}');
        if (nameSpan) nameSpan.textContent = candidate.fullName || 'Candidate';
        if (savedList) {
            const saved = load(SAVED_KEY);
            const allJobs = load(JOBS_KEY);
            savedList.innerHTML = saved.map(id => {
                const j = allJobs.find(job => job.id === id);
                return `<li class="list-group-item">${j?.title || 'Unknown'} at ${j?.company || ''}</li>`;
            }).join('');
        }
        if (appsList) {
            const apps = load(APPS_KEY).slice(-5).reverse();
            appsList.innerHTML = apps.map(a => `<li class="list-group-item">Applied to ${a.title} – ${a.status}</li>`).join('');
        }
    };

    // ---------- Event Listeners ----------
    const attachListeners = () => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.addEventListener('input', () => applyFiltersAndRender());
        const locSelect = document.getElementById('locationFilter');
        const expSelect = document.getElementById('experienceFilter');
        const salSelect = document.getElementById('salaryFilter');
        [locSelect, expSelect, salSelect].forEach(el => {
            if (el) el.addEventListener('change', () => applyFiltersAndRender());
        });
        const container = document.getElementById('jobCardsContainer');
        if (container) {
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('save-btn')) {
                    toggleSave(e.target.dataset.id);
                }
            });
        }
        if (document.getElementById('jobDetailContainer')) loadJobDetails();
        if (document.getElementById('candidateName')) populateDashboard();
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('candidate');
                localStorage.removeItem('employer');
                window.location.href = 'index.html';
            });
        }
    };

    // ---------- Init ----------
    document.addEventListener('DOMContentLoaded', () => {
        seedJobs();
        populateFilters();
        attachListeners();
        applyFiltersAndRender();
    });
})();
