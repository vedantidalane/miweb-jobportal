// home.js – Handles homepage interactive features (hero search & newsletter)

document.addEventListener('DOMContentLoaded', () => {
    // Hero search
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const keyword = encodeURIComponent(document.getElementById('searchKeyword').value.trim());
            const location = encodeURIComponent(document.getElementById('searchLocation').value.trim());
            const category = encodeURIComponent(document.getElementById('searchCategory').value);
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
            // Simple email regex validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newsletterMsg.textContent = 'Please enter a valid email address.';
                newsletterMsg.className = 'text-danger';
                return;
            }
            // Simulate subscription (store in localStorage)
            let subs = JSON.parse(localStorage.getItem('newsletterSubs') || '[]');
            if (!subs.includes(email)) {
                subs.push(email);
                localStorage.setItem('newsletterSubs', JSON.stringify(subs));
            }
            newsletterMsg.textContent = 'Thank you for subscribing!';
            newsletterMsg.className = 'text-success';
            newsletterForm.reset();
        });
    }

    // Render Featured Jobs (simple random selection)
    const featuredContainer = document.getElementById('featuredJobs');
    if (featuredContainer && window.JobsData) {
        const jobs = window.JobsData; // assume data.js exposes this
        // Shuffle and pick first 6
        const shuffled = jobs.slice().sort(() => 0.5 - Math.random()).slice(0, 6);
        featuredContainer.innerHTML = shuffled.map(job => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 job-card">
                    <div class="card-body">
                        <h5 class="card-title">${job.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>
                        <p class="card-text"><i class="fas fa-map-marker-alt me-1"></i>${job.location}<br>
                        <i class="fas fa-dollar-sign me-1"></i>${job.salary}</p>
                        <a href="job-details.html?id=${job.id}" class="btn btn-primary btn-sm me-2">View Details</a>
                        <button class="btn btn-outline-secondary btn-sm save-btn" data-id="${job.id}"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
            </div>`).join('');
        // Attach save toggle handler
        featuredContainer.querySelectorAll('.save-btn').forEach(btn => {
            const jobId = btn.getAttribute('data-id');
            btn.addEventListener('click', () => {
                // Toggle saved job in localStorage (same logic as jobs page)
                let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
                if (saved.includes(jobId)) {
                    saved = saved.filter(id => id !== jobId);
                } else {
                    saved.push(jobId);
                }
                localStorage.setItem('savedJobs', JSON.stringify(saved));
                btn.classList.toggle('active');
            });
        });
    }
});
