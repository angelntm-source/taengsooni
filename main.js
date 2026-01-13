// Main JS
console.log('Clean Landing Page Loaded');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

// Inquiry Form Submission
const inquiryForm = document.querySelector('.inquiry-form');
if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const agreement = document.getElementById('agreement');
        if (agreement && !agreement.checked) {
            alert('이용약관 및 개인정보처리방침에 동의해 주세요.');
            return;
        }

        const submitBtn = inquiryForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerText = '전송 중...';

        const formData = new FormData(inquiryForm);

        fetch("https://formspree.io/f/xzddbodw", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('문의가 정상적으로 전송되었습니다. 확인 후 빠른 시일 내에 답변드리겠습니다.');
                    inquiryForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
                        }
                    });
                }
            })
            .catch(error => {
                alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
            })
            .finally(() => {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
    });
}

// Modal Toggle Logic
const modalTriggers = [
    { linkId: 'terms-link', modalId: 'terms-modal' },
    { linkId: 'privacy-link', modalId: 'privacy-modal' }
];

modalTriggers.forEach(trigger => {
    const link = document.getElementById(trigger.linkId);
    const modal = document.getElementById(trigger.modalId);

    if (link && modal) {
        const closeBtn = modal.querySelector('.modal-close');

        link.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
