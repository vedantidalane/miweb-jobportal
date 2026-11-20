// home.js – Handles homepage interactive features (hero search, featured jobs & newsletter)

document.addEventListener('DOMContentLoaded', () => {
    const JOBS_KEY = 'jobs';
    const SAVED_KEY = 'savedJobs';

    // Seed jobs if empty
    if (!localStorage.getItem(JOBS_KEY)) {
        const defaultJobs = [
            { id:'1',  title:'Java Developer',         company:'Infosys',       location:'Bangalore',     experience:3, salary:900000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-15', description:'Design and develop robust Java applications for enterprise clients. Work with Spring Boot, Microservices, and REST APIs.' },
            { id:'2',  title:'Frontend Developer',      company:'TCS',           location:'Hyderabad',     experience:2, salary:800000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-14', description:'Build responsive, modern UIs using React.js, HTML5, CSS3 and Bootstrap. Collaborate with UX designers and backend teams.' },
            { id:'3',  title:'Python Developer',        company:'Wipro',         location:'Pune',          experience:2, salary:750000,  category:'Software Development',           type:'Full-time',  posted:'2024-11-13', description:'Develop backend services and automation scripts using Python, Django and Flask. Experience with REST APIs required.' },
            { id:'4',  title:'Data Analyst',            company:'Accenture',     location:'Mumbai',        experience:1, salary:600000,  category:'Data Science',                   type:'Full-time',  posted:'2024-11-12', description:'Analyze large datasets to derive business insights. Work with SQL, Excel, Tableau, and Python for data visualization.' },
            { id:'5',  title:'UI/UX Designer',          company:'Capgemini',     location:'Chennai',       experience:2, salary:700000,  category:'UI/UX Design',                   type:'Full-time',  posted:'2024-11-11', description:'Create wireframes, prototypes, and high-fidelity designs using Figma and Adobe XD. Conduct user research and usability testing.' },
            { id:'6',  title:'Software Engineer',       company:'Deloitte',      location:'Delhi',         experience:3, salary:1100000, category:'Software Development',           type:'Full-time',  posted:'2024-11-10', description:'Build and maintain scalable cloud-based solutions. Strong knowledge of AWS, Node.js, and microservices architecture required.' }
        ];
        localStorage.setItem(JOBS_KEY, JSON.stringify(defaultJobs));
    }

    // Hero search
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const keyword = encodeURIComponent(document.getElementById('searchKeyword')?.value.trim() || '');
            const location = encodeURIComponent(document.getElementById('searchLocation')?.value.trim() || '');
            const category = encodeURIComponent(document.getElementById('searchCategory')?.value || '');
            let url = 'jobs.html';
            const params = [];
            if (keyword) params.push(`q=${keyword}`);
            if (location) params.push(`loc=${location}`);
            if (category) params.push(`cat=${category}`);
            if (params.length) url += '?' + params.join('&');
            window.location.href = url;
        });
    }

    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMsg = document.getElementById('newsletterMsg');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newsletterMsg.textContent = 'Please enter a valid email address.';
                newsletterMsg.className = 'text-danger mt-2';
                return;
            }
            let subs = JSON.parse(localStorage.getItem('newsletterSubs') || '[]');
            if (!subs.includes(email)) {
                subs.push(email);
                localStorage.setItem('newsletterSubs', JSON.stringify(subs));
            }
            newsletterMsg.textContent = 'Thank you for subscribing to CareerConnect updates!';
            newsletterMsg.className = 'text-success mt-2';
            newsletterForm.reset();
        });
    }

    // Render Featured Jobs
    const featuredContainer = document.getElementById('featuredJobs');
    if (featuredContainer) {
        const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
        const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
        const displayJobs = jobs.slice(0, 6);

        featuredContainer.innerHTML = displayJobs.map(job => {
            const isSaved = saved.includes(job.id);
            const salaryLPA = job.salary ? (job.salary / 100000).toFixed(1) + ' LPA' : 'Best in Industry';
            return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 job-card border-0 shadow-sm p-3">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary bg-opacity-10 text-primary">${job.type || 'Full-time'}</span>
                            <button class="btn btn-sm btn-link text-muted p-0 home-save-btn ${isSaved ? 'text-danger' : ''}" data-id="${job.id}">
                                <i class="fas fa-heart ${isSaved ? 'text-danger' : ''}"></i>
                            </button>
                        </div>
                        <h5 class="card-title fw-bold mb-1">${job.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted small"><i class="fas fa-building me-1"></i>${job.company}</h6>
                        <p class="card-text small text-muted mb-3">
                            <i class="fas fa-map-marker-alt me-1 text-primary"></i>${job.location} &bull; 
                            <i class="fas fa-rupee-sign me-1 text-success"></i>${salaryLPA}
                        </p>
                        <div class="mt-auto d-flex gap-2">
                            <a href="job-details.html?id=${job.id}" class="btn btn-outline-primary btn-sm flex-grow-1">Details</a>
                            <button class="btn btn-primary btn-sm flex-grow-1 home-apply-btn" data-id="${job.id}">Apply</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Attach Save button handler
        featuredContainer.querySelectorAll('.home-save-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.id;
                let currentSaved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
                if (currentSaved.includes(jobId)) {
                    currentSaved = currentSaved.filter(id => id !== jobId);
                    btn.classList.remove('text-danger');
                    btn.querySelector('i').classList.remove('text-danger');
                } else {
                    currentSaved.push(jobId);
                    btn.classList.add('text-danger');
                    btn.querySelector('i').classList.add('text-danger');
                }
                localStorage.setItem(SAVED_KEY, JSON.stringify(currentSaved));
            });
        });

        // Attach Apply button handler with auth guard
        featuredContainer.querySelectorAll('.home-apply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const jobId = btn.dataset.id;
                const candidate = JSON.parse(localStorage.getItem('candidate') || 'null');
                if (!candidate) {
                    localStorage.setItem('redirectAfterLogin', `apply-job.html?id=${jobId}`);
                    window.location.href = 'candidate-login.html';
                    return;
                }
                window.location.href = `apply-job.html?id=${jobId}`;
            });
        });
    }
});
