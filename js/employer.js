// js/employer.js
// Handles employer actions: posting jobs, editing, deleting, and viewing applications.

(() => {
    const JOBS_KEY = 'jobs';
    const APPS_KEY = 'applications';
    const load = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // ----- Post Job Form -----
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
        // If editing, pre‑fill fields
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('id');
        if (editId) {
            const job = load(JOBS_KEY).find(j => j.id === editId);
            if (job) {
                document.getElementById('title').value = job.title;
                document.getElementById('company').value = job.company;
                document.getElementById('location').value = job.location;
                document.getElementById('experience').value = job.experience;
                document.getElementById('salary').value = job.salary;
                document.getElementById('description').value = job.description;
            }
        }
        postJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const job = {
                id: editId || Date.now().toString(),
                title: document.getElementById('title').value.trim(),
                company: document.getElementById('company').value.trim(),
                location: document.getElementById('location').value.trim(),
                experience: Number(document.getElementById('experience').value),
                salary: Number(document.getElementById('salary').value),
                description: document.getElementById('description').value.trim()
            };
            const jobs = load(JOBS_KEY);
            const idx = jobs.findIndex(j => j.id === job.id);
            if (idx >= 0) {
                jobs[idx] = job; // update
            } else {
                jobs.push(job);
            }
            save(JOBS_KEY, jobs);
            alert('Job saved successfully');
            window.location.href = 'employer-dashboard.html';
        });
    }

    // ----- Employer Dashboard -----
    const renderEmployerJobs = () => {
        const container = document.getElementById('jobList');
        if (!container) return;
        const jobs = load(JOBS_KEY);
        container.innerHTML = '';
        jobs.forEach(job => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-3';
            const card = document.createElement('div');
            card.className = `card ${document.body.classList.contains('dark-mode') ? 'card-dark' : ''}`;
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                    <p class="card-text">Location: ${job.location}</p>
                    <p class="card-text">Experience: ${job.experience} yr(s)</p>
                    <p class="card-text">Salary: $${job.salary}</p>
                    <a href="post-job.html?id=${job.id}" class="btn btn-sm btn-outline-primary me-2">Edit</a>
                    <button class="btn btn-sm btn-outline-danger me-2 delete-btn" data-id="${job.id}">Delete</button>
                    <a href="employer-applications.html?jobId=${job.id}" class="btn btn-sm btn-success">View Applications</a>
                </div>`;
            col.appendChild(card);
            container.appendChild(col);
        });
        // Delete handler
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.dataset.id;
                if (confirm('Delete this job?')) {
                    const jobs = load(JOBS_KEY).filter(j => j.id !== id);
                    save(JOBS_KEY, jobs);
                    renderEmployerJobs();
                }
            }
        });
    };

    // ----- Employer Applications Page -----
    const renderApplications = () => {
        const params = new URLSearchParams(window.location.search);
        const jobId = params.get('jobId');
        const container = document.getElementById('applicationsContainer');
        if (!container) return;
        const apps = load(APPS_KEY).filter(a => a.jobId === jobId);
        if (!apps.length) {
            container.innerHTML = '<p>No applications yet.</p>';
            return;
        }
        const list = document.createElement('ul');
        list.className = 'list-group';
        apps.forEach(app => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `<strong>${app.fullName}</strong> – ${app.email}<br/>Status: ${app.status}`;
            list.appendChild(li);
        });
        container.appendChild(list);
    };

    // Init based on page
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('postJobForm')) {
            // post‑job page logic already runs above
        } else if (document.getElementById('jobList')) {
            renderEmployerJobs();
        } else if (document.getElementById('applicationsContainer')) {
            renderApplications();
        }
    });
})();