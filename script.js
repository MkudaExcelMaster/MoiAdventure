// 1. AUTOMATIC IMAGE CAROUSEL (Inabadilika Kila Baada ya Sekunde 5)
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    if (slides.length > 0) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
}

// Badilisha slide kila baada ya milisekunde 5000 (sekunde 5)
setInterval(nextSlide, 5000);


// 2. JINSI YA KUGENERATE PDF (Yenye Logo Kulia na Kushoto)
function generatePDF() {
    // Chukua data zilizojazwa kwenye form
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const country = document.getElementById('country').value;
    const route = document.getElementById('selectedRoute').value;
    const date = document.getElementById('startDate').value;
    const notes = document.getElementById('notes').value;

    // Hakikisha form imejazwa vizuri
    if (!name || !phone || !route || !date) {
        alert("Tafadhali jaza taarifa zote muhimu kabla ya kupakua PDF.");
        return;
    }

    // Jaza data kwenye template ya PDF iliyoandaliwa
    document.getElementById('pdfName').innerText = name;
    document.getElementById('pdfPhone').innerText = phone;
    document.getElementById('pdfEmail').innerText = email;
    document.getElementById('pdfCountry').innerText = country;
    document.getElementById('pdfRoute').innerText = route;
    document.getElementById('pdfDate').innerText = date;
    document.getElementById('pdfNotes').innerText = notes || "Hakuna";

    // Onyesha template kwa muda ili kuitengeneza kuwa PDF
    const pdfTemplate = document.getElementById('pdfTemplate');
    pdfTemplate.style.display = 'block';

    // Mipangilio ya PDF
    const opt = {
        margin:       10,
        filename:     `MOI_Adventure_Booking_${name.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Tengeneza PDF
    html2pdf().set(opt).from(pdfTemplate).save().then(() => {
        // Ficha tena template baada ya kumaliza kupakua
        pdfTemplate.style.display = 'none';
    });
}


// 3. TUMA MOJA KWA MOJA WHATSAPP (Ili Taarifa Zijae Kwenye WhatsApp Yako)
function sendToWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const country = document.getElementById('country').value;
    const route = document.getElementById('selectedRoute').value;
    const date = document.getElementById('startDate').value;
    const notes = document.getElementById('notes').value;

    if (!name || !phone || !route || !date) {
        alert("Tafadhali jaza taarifa zote muhimu kabla ya kutuma WhatsApp.");
        return;
    }

    // Ujumbe unaotumwa WhatsApp kwenda +2557693345456
    const message = `Habari MOI ADVENTURE, Naomba kufanya Booking:\n\n` +
                    `👤 *Jina:* ${name}\n` +
                    `📞 *Simu:* ${phone}\n` +
                    `✉️ *Email:* ${email}\n` +
                    `🌍 *Nchi:* ${country}\n` +
                    `🏔️ *Route:* ${route}\n` +
                    `📅 *Tarehe:* ${date}\n` +
                    `📝 *Maelezo:* ${notes || 'Hakuna'}`;

    const whatsappUrl = `https://wa.me/2557693345456?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}
