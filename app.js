/* ==========================================================================
   Portfolio Contact Form — Web3Forms integration
   ========================================================================== */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "d0f25210-1bf2-40e6-a63a-d287cb6bb589";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("portfolioContactForm");
    const successState = document.getElementById("successState");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");
    const btnIcon = document.getElementById("btnIcon");
    const successCheck = document.getElementById("successCheck");
    const typingTarget = document.getElementById("typingTarget");

    if (!form) return;

    let typingTimer = null;

    /* ---------- Submit handler ---------- */
    form.addEventListener("submit", async (e) => {
        // Stop the browser's native POST (this is what caused the
        // "Form must include access_key" error page).
        e.preventDefault();

        const formData = new FormData(form);

        // .set() overwrites any hidden inputs with the same name (no duplicates)
        formData.set("access_key", WEB3FORMS_ACCESS_KEY);
        formData.set("from_name", "Portfolio Contact Form");
        formData.set("subject", "🚀 New Portfolio Message!");

        const nameInput = (formData.get("name") || "Friend").toString().trim();

        if (typingTarget) typingTarget.textContent = "";
        setLoadingState();

        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
            });

            let data = {};
            try {
                data = await response.json();
            } catch (_) {
                /* response was not JSON */
            }

            if (response.ok && data.success !== false) {
                showSuccess(nameInput);
                form.reset();
            } else {
                alert(
                    "Submission error: " +
                        (data.message || "Please check your details and try again.")
                );
                resetButtonState();
            }
        } catch (error) {
            console.error("Form submission failed:", error);
            alert("Network error. Please check your connection and try again.");
            resetButtonState();
        }
    });

    /* ---------- UI state helpers ---------- */
    function setLoadingState() {
        submitBtn.disabled = true;
        btnText.textContent = "Sending...";
        if (btnIcon) {
            btnIcon.className = "fa-solid fa-spinner animate-spin text-[10px]";
        }
    }

    function resetButtonState() {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = "Send Message";
        if (btnIcon) btnIcon.className = "fa-solid fa-paper-plane text-[10px]";
    }

    function showSuccess(name) {
        // Fade the form out
        form.classList.remove("opacity-100", "scale-100");
        form.classList.add("opacity-0", "scale-95");

        setTimeout(() => {
            form.classList.add("hidden");
            if (successState) successState.classList.remove("hidden");

            // Small delay so the browser registers the un-hidden state
            setTimeout(() => {
                if (successState) {
                    successState.classList.remove("opacity-0", "scale-90", "pointer-events-none");
                    successState.classList.add("opacity-100", "scale-100");
                }
                if (successCheck) {
                    successCheck.classList.remove("scale-0");
                    successCheck.classList.add("scale-100");
                }

                if (typeof confetti === "function") {
                    triggerConfettiExplosion();
                }

                const message = `Thank you for reaching out, ${name}! Your message has been delivered straight to my inbox. Let's build something great!`;
                typeWriterAnimation(message);
            }, 50);
        }, 400);

        // Bring the form back after a while so visitors can send another message
        setTimeout(restoreForm, 12000);
    }

    function restoreForm() {
        if (successState) {
            successState.classList.remove("opacity-100", "scale-100");
            successState.classList.add("opacity-0", "scale-90", "pointer-events-none");
            setTimeout(() => successState.classList.add("hidden"), 700);
        }
        if (successCheck) {
            successCheck.classList.remove("scale-100");
            successCheck.classList.add("scale-0");
        }

        setTimeout(() => {
            form.classList.remove("hidden");
            // force reflow so the transition plays
            void form.offsetWidth;
            form.classList.remove("opacity-0", "scale-95");
            form.classList.add("opacity-100", "scale-100");
            resetButtonState();
        }, 700);
    }

    /* ---------- Effects ---------- */
    function triggerConfettiExplosion() {
        const end = Date.now() + 1500;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ["#10b981", "#ffffff", "#3b82f6"],
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ["#10b981", "#ffffff", "#3b82f6"],
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }

    function typeWriterAnimation(text) {
        if (!typingTarget) return;
        clearTimeout(typingTimer);
        typingTarget.textContent = "";

        let i = 0;
        (function type() {
            if (i < text.length) {
                typingTarget.textContent += text.charAt(i);
                i++;
                typingTimer = setTimeout(type, 25);
            }
        })();
    }
});