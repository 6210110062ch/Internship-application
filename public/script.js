document.getElementById('application-form').addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มจริง

    // แสดงข้อความการส่งฟอร์มสำเร็จ
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';

    // ส่งฟอร์มจริงผ่าน AJAX
    const formData = new FormData(this);

    fetch('/apply', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            successMessage.textContent = 'Application submitted successfully';
            this.reset(); // รีเซ็ตฟอร์มหลังจากส่งสำเร็จ
        } else {
            successMessage.textContent = 'Failed to submit application';
            successMessage.style.color = 'red';
        }
    })
    .catch(error => {
        successMessage.textContent = 'An error occurred: ' + error.message;
        successMessage.style.color = 'red';
    });
});
