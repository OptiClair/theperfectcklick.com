document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".contact-form");
    const header = document.querySelector(".main-header");

    // AUTO YEAR
    document.querySelectorAll("#year").forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // SMOOTH SCROLL
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.hash !== "") {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // HEADER EFFECT
    window.addEventListener("scroll", () => {
        if (header) {
            header.style.boxShadow = window.scrollY > 50
                ? "0 4px 20px rgba(0,0,0,0.1)"
                : "none";
        }
    });

    // ================================
    // LEAD SCORING
    // ================================
    function getLeadScore(service, message) {
        let score = 0;
        if (service.includes("Wedding")) score += 50;
        if (message.length > 20) score += 20;
        return score;
    }

    function getTag(score) {
        if (score >= 60) return "HOT";
        if (score >= 30) return "WARM";
        return "COLD";
    }

    // ================================
    // FOLLOW-UP SYSTEM (NEW 🔥)
    // ================================
    function saveLeadHistory(data) {
        let leads = JSON.parse(localStorage.getItem("leads")) || [];
        leads.push({ ...data, time: new Date() });
        localStorage.setItem("leads", JSON.stringify(leads));
    }

    function scheduleFollowUp(data) {
        setTimeout(() => {
            const msg = `Hi ${data.name}, just following up on your ${data.service} enquiry. Let me know if you're interested.`;

            console.log("Follow-up Reminder:", msg);

            alert("Follow-up reminder: Check your leads!");
        }, 60000); // demo: 1 min (real me 24hr use karo)
    }

    // ================================
    // CLOSING HELPER (NEW 🔥)
    // ================================
    function generateClosingMsg(tag) {
        if (tag === "HOT") {
            return "We have limited slots available. Let's confirm your booking today.";
        }
        if (tag === "WARM") {
            return "Would you like to see packages and pricing options?";
        }
        return "Let me know if you need any details 😊";
    }

    // ================================
    // FORM SYSTEM
    // ================================
    if (form) {

        let isSubmitting = false;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            if (isSubmitting) return;

            const btn = form.querySelector("button");
            btn.disabled = true;
            btn.textContent = "Sending...";

            const data = {
                name: document.getElementById("name").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                service: document.getElementById("service").value || "Not specified",
                date: document.getElementById("date").value || "Not specified",
                message: document.getElementById("message").value.trim() || "No message"
            };

            // VALIDATION
            const phoneRegex = /^[6-9]\d{9}$/;

            if (!data.name || !data.phone) {
                alert("Name And Phone Must required ");
                return reset();
            }

            if (!phoneRegex.test(data.phone)) {
                alert("Enter Valid phone number");
                return reset();
            }

            const score = getLeadScore(data.service, data.message);
            const tag = getTag(score);

            data.tag = tag;

            isSubmitting = true;

            try {
                await fetch("PASTE_YOUR_WEB_APP_URL_HERE", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                // SAVE HISTORY
                saveLeadHistory(data);

                // FOLLOW-UP TRIGGER
                scheduleFollowUp(data);

                // CLOSING MESSAGE
                const closing = generateClosingMsg(tag);

                const msg = `🔥 ${tag} LEAD
Name: ${data.name}
Phone: ${data.phone}
Service: ${data.service}

${closing}`;

                window.open(`https://wa.me/917974630966?text=${encodeURIComponent(msg)}`, "_blank");

                alert(`Lead saved (${tag})`);
                form.reset();

            } catch (err) {

                window.open(`https://wa.me/917974630966?text=Hello I want details`, "_blank");
                alert("Network issue");

            } finally {
                reset();
            }

            function reset() {
                btn.disabled = false;
                btn.textContent = "Send Enquiry";
                isSubmitting = false;
            }
        });
    }

});