// js/auth.js
// Handles candidate and employer authentication, registration, and password reset (client‑side only).

(() => {
    const CANDIDATES_KEY = 'candidates'; // array of {email, fullName, password, phone, location, experience}
    const EMPLOYERS_KEY = 'employers';   // array of {email, company, password}

    const load = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // ----- Candidate -----
    // Ensure at least one demo candidate for quick login
    const ensureDefaultCandidate = () => {
        const candidates = load(CANDIDATES_KEY);
        if (!candidates.length) {
            candidates.push({email: 'demo@candidate.com', fullName: 'Demo Candidate', password: 'demo123', phone: '', location: '', experience: ''});
            save(CANDIDATES_KEY, candidates);
        }
    };
    ensureDefaultCandidate();
    const candidateRegisterForm = document.getElementById('candidateRegisterForm');
    if (candidateRegisterForm) {
        candidateRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirmPassword').value;
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            const candidates = load(CANDIDATES_KEY);
            if (candidates.some(c => c.email === email)) {
                alert('Email already registered');
                return;
            }
            candidates.push({email, fullName, password, phone: '', location: '', experience: ''});
            save(CANDIDATES_KEY, candidates);
            alert('Registration successful. Please log in.');
            window.location.href = 'candidate-login.html';
        });
    }

    // Profile edit handling (candidate)
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const candidate = JSON.parse(localStorage.getItem('candidate') || '{}');
            if (!candidate.email) {
                alert('No logged‑in candidate');
                return;
            }
            candidate.fullName = document.getElementById('fullName').value.trim();
            candidate.phone = document.getElementById('phone').value.trim();
            candidate.location = document.getElementById('location').value.trim();
            candidate.experience = document.getElementById('experience').value.trim();
            // Update in global list
            const candidates = load(CANDIDATES_KEY);
            const idx = candidates.findIndex(c => c.email === candidate.email);
            if (idx >= 0) candidates[idx] = candidate; else candidates.push(candidate);
            save(CANDIDATES_KEY, candidates);
            localStorage.setItem('candidate', JSON.stringify(candidate));
            alert('Profile updated');
            window.location.href = 'candidate-dashboard.html';
        });
    }

    const candidateLoginForm = document.getElementById('candidateLoginForm');
    if (candidateLoginForm) {
        candidateLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const candidates = load(CANDIDATES_KEY);
            const user = candidates.find(c => c.email === email && c.password === password);
            if (!user) {
                alert('Invalid credentials');
                return;
            }
            localStorage.setItem('candidate', JSON.stringify(user));
            window.location.href = 'candidate-dashboard.html';
        });
    }

    // Forgot password (dummy – just shows a message)
    const forgotPwdForm = document.getElementById('forgotPwdForm');
    if (forgotPwdForm) {
        forgotPwdForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const candidates = load(CANDIDATES_KEY);
            const exists = candidates.some(c => c.email === email);
            const msgDiv = document.getElementById('resetMsg');
            if (exists) {
                msgDiv.textContent = 'Password reset link sent (simulated).';
            } else {
                msgDiv.textContent = 'Email not found.';
            }
        });
    }

    // ----- Employer -----
    const employerLoginForm = document.getElementById('employerLoginForm');
    if (employerLoginForm) {
        employerLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const employers = load(EMPLOYERS_KEY);
            const user = employers.find(c => c.email === email && c.password === password);
            if (!user) {
                alert('Invalid credentials');
                return;
            }
            localStorage.setItem('employer', JSON.stringify(user));
            window.location.href = 'employer-dashboard.html';
        });
    }

    // Employer registration is optional; for demo we seed a default employer if none exist.
    const ensureDefaultEmployer = () => {
        const employers = load(EMPLOYERS_KEY);
        if (!employers.length) {
            employers.push({email: 'demo@company.com', company: 'Demo Corp', password: 'demo123'});
            save(EMPLOYERS_KEY, employers);
        }
    };
    ensureDefaultEmployer();
})();