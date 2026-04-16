document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    document.getElementById("currentYear").textContent = new Date().getFullYear();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Google Sheets Integration ──────────────────────────────────────
    // After deploying google_apps_script.gs as a Web App, paste the URL below.
    // See setup_google_sheets.md for the full step-by-step guide.
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRadoznCbtFEEZoLdYvxwgYT2jOo78QfmsL3UK_x2AMmnO2GC6xN7WamCMRD8ZhW0v/exec";
    // Example: "https://script.google.com/macros/s/AKfycb.../exec"

    const form        = document.getElementById("leadForm");
    const formMessage = document.getElementById("formMessage");
    const submitBtn   = document.getElementById("submitBtn");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // UI feedback
        formMessage.className  = "form-message";
        formMessage.textContent = "";
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Submitting…";
        submitBtn.disabled    = true;

        // Collect field values
        const data = {
            fullName : document.getElementById("fullName").value.trim(),
            phone    : document.getElementById("phone").value.trim(),
            email    : document.getElementById("email").value.trim(),
            city     : document.getElementById("city").value,
            workType : document.querySelector('input[name="workType"]:checked')?.value || ""
        };

        // Validation
        if (!data.fullName || !data.phone || !data.city || !data.workType) {
            showMessage("error", "Please fill in all required fields.");
            resetBtn(submitBtn, originalText);
            return;
        }

        if (!/^\d{10}$/.test(data.phone)) {
            showMessage("error", "Please enter a valid 10-digit phone number.");
            resetBtn(submitBtn, originalText);
            return;
        }

        // ── Submit to Google Sheets via POST ─────────────
        if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
            setTimeout(() => handleSuccess(submitBtn, originalText), 1200);
            return;
        }

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("city", data.city);
        formData.append("workType", data.workType);

        // Simple POST request avoids CORS preflight and works flawlessly with doPost in GS
        fetch(GOOGLE_SCRIPT_URL, { 
            method: "POST", 
            body: formData,
            mode: "no-cors" // Prevents strict CORS block on the browser end
        })
        .then(() => {
            handleSuccess(submitBtn, originalText);
        })
        .catch((err) => {
            console.error("Submission error:", err);
            showMessage("error", "Could not connect. Please try again.");
            resetBtn(submitBtn, originalText);
        });
    });

    function handleSuccess(btn, originalText) {
        showMessage("success", "✅ Application submitted! Our team will call you within 24 hours.");
        form.reset();
        resetBtn(btn, originalText);
    }

    function showMessage(type, text) {
        formMessage.className   = `form-message ${type}`;
        formMessage.textContent = text;
    }

    function resetBtn(btn, originalText) {
        btn.textContent = originalText;
        btn.disabled    = false;
    }
});
