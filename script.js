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
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwRadoznCbtFEEZoLdYvxwgYT2jOo78QfmsL3UK_x2AMmnO2GC6xN7WamCMRD8ZhW0v/exec";

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

        // ── Submit via hidden iframe (handles Google's 302 redirect properly) ──
        submitViaIframe(data, submitBtn, originalText);
    });

    function submitViaIframe(data, btn, originalText) {
        // Create a unique iframe name
        const iframeName = "hidden_iframe_" + Date.now();

        // Create hidden iframe
        const iframe = document.createElement("iframe");
        iframe.name = iframeName;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        // Create a temporary form that submits to the iframe
        const tempForm = document.createElement("form");
        tempForm.method = "POST";
        tempForm.action = GOOGLE_SCRIPT_URL;
        tempForm.target = iframeName; // Submit into the hidden iframe
        tempForm.style.display = "none";

        // Add all fields as hidden inputs
        for (const key in data) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            tempForm.appendChild(input);
        }

        document.body.appendChild(tempForm);

        // Listen for iframe load (means Google processed the request)
        iframe.addEventListener("load", function () {
            handleSuccess(btn, originalText);

            // Cleanup after a short delay
            setTimeout(() => {
                document.body.removeChild(iframe);
                document.body.removeChild(tempForm);
            }, 500);
        });

        // Handle errors with a timeout fallback
        setTimeout(() => {
            // If iframe is still around after 10s, assume success anyway
            // (cross-origin iframes don't always fire load reliably)
            if (document.body.contains(iframe)) {
                handleSuccess(btn, originalText);
                try {
                    document.body.removeChild(iframe);
                    document.body.removeChild(tempForm);
                } catch (e) {}
            }
        }, 10000);

        // Submit the form
        tempForm.submit();
    }

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
