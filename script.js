// ==========================================
// 1. SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://kyuokonjmaunmprrvzin.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_e3GzVKCe5mAr6SBaomqKjw_gD9Ql3Eb';

// Kutengeneza Supabase client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Function ya kuhifadhi data kwenye Supabase Database
async function saveBookingToSupabase(bookingData) {
    if (!supabase) {
        console.error("Supabase library haijapakia vizuri.");
        return false;
    }

    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    full_name: bookingData.name,
                    phone: bookingData.phone,
                    email: bookingData.email,
                    country: bookingData.country,
                    route: bookingData.route,
                    start_date: bookingData.date,
                    notes: bookingData.notes
                }
            ]);

        if (error) {
            console.error("Supabase Error:", error);
            return false;
        }
        console.log("Booking imehifadhiwa Supabase kikamilifu:", data);
        return true;
    } catch (err) {
        console.error("System Error:", err);
        return false;
    }
}


// ==========================================
// 2. AUTOMATIC IMAGE SLIDER (Picha 200)
// ==========================================
const sliderContainer = document.querySelector('.slider-container');
const totalImages = 200; // Idadi ya picha

if (sliderContainer) {
    sliderContainer.innerHTML = '';
    for (let i = 1; i <= totalImages; i++) {
        const slideDiv = document.createElement('div');
        slideDiv.className = i === 1 ? 'slide active' : 'slide';
        slideDiv.style.backgroundImage = `url('images/hero${i}.jpeg')`;
        
        slideDiv.innerHTML = `
            <div class="slide-overlay">
                <h2>MOI ADVENTURE</h2>
                <p>Your Trusted Guide to the Roof of Africa - Mount Kilimanjaro</p>
            </div>
        `;
        sliderContainer.appendChild(slideDiv);
    }
}

let currentSlide = 0;
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
}
setInterval(nextSlide, 5000);


// ==========================================
// 3. GENERATE PDF BOOKING CONFIRMATION
// ==========================================
function generatePDF() {
    if (typeof html2pdf === 'undefined') {
        alert("Library ya PDF haijapakia. Hakikisha umeiweka kwenye index.html!");
        return;
    }

    const name = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const country = document.getElementById('country')?.value.trim();
    const route = document.getElementById('selectedRoute')?.value;
    const date = document.getElementById('startDate')?.value;
    const notes = document.getElementById('notes')?.value.trim();

    if (!name || !phone || !route || !date) {
        alert("Tafadhali jaza taarifa zote muhimu (Jina, Simu, Route, na Tarehe) kabla ya kupakua PDF.");
        return;
    }

    if (document.getElementById('pdfName')) document.getElementById('pdfName').innerText = name;
    if (document.getElementById('pdfPhone')) document.getElementById('pdfPhone').innerText = phone;
    if (document.getElementById('pdfEmail')) document.getElementById('pdfEmail').innerText = email || "Hazijawekwa";
    if (document.getElementById('pdfCountry')) document.getElementById('pdfCountry').innerText = country || "Hazijawekwa";
    if (document.getElementById('pdfRoute')) document.getElementById('pdfRoute').innerText = route;
    if (document.getElementById('pdfDate')) document.getElementById('pdfDate').innerText = date;
    if (document.getElementById('pdfNotes')) document.getElementById('pdfNotes').innerText = notes || "Hakuna";

    const pdfTemplate = document.getElementById('pdfTemplate');
    if (!pdfTemplate) return;

    pdfTemplate.style.display = 'block';
    pdfTemplate.style.position = 'fixed';
    pdfTemplate.style.left = '-9999px';
    pdfTemplate.style.top = '0';
    pdfTemplate.style.width = '800px';

    const opt = {
        margin:       10,
        filename:     `MOI_Adventure_Booking_${name.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
        html2pdf().set(opt).from(pdfTemplate).save().then(() => {
            pdfTemplate.style.display = 'none';
            pdfTemplate.style.position = 'static';
        }).catch((error) => {
            console.error("Error kwenye PDF:", error);
            pdfTemplate.style.display = 'none';
            pdfTemplate.style.position = 'static';
        });
    }, 100);
}


// ==========================================
// 4. TUMA WHATSAPP + SAVE SUPABASE
// ==========================================
async function sendToWhatsApp(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const country = document.getElementById('country')?.value.trim();
    const route = document.getElementById('selectedRoute')?.value;
    const date = document.getElementById('startDate')?.value;
    const notes = document.getElementById('notes')?.value.trim();

    if (!name || !phone || !route || !date) {
        alert("Tafadhali jaza taarifa zote muhimu kabla ya kutuma WhatsApp.");
        return;
    }

    // Hifadhi kwanza kwenye Supabase
    await saveBookingToSupabase({ name, phone, email, country, route, date, notes });

    const message = `Habari MOI ADVENTURE, Naomba kufanya Booking:\n\n` +
                    `👤 *Jina:* ${name}\n` +
                    `📞 *Simu:* ${phone}\n` +
                    `✉️ *Email:* ${email || 'Hakuweka'}\n` +
                    `🌍 *Nchi:* ${country || 'Hakuweka'}\n` +
                    `🏔️ *Route:* ${route}\n` +
                    `📅 *Tarehe:* ${date}\n` +
                    `📝 *Maelezo:* ${notes || 'Hakuna'}`;

    const whatsappUrl = `https://wa.me/2557693345456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}


// ==========================================
// 5. TUMA EMAIL + SAVE SUPABASE
// ==========================================
async function sendToEmail(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const country = document.getElementById('country')?.value.trim();
    const route = document.getElementById('selectedRoute')?.value;
    const date = document.getElementById('startDate')?.value;
    const notes = document.getElementById('notes')?.value.trim();

    if (!name || !phone || !route || !date) {
        alert("Tafadhali jaza taarifa zote muhimu kabla ya kutuma Email.");
        return;
    }

    // Hifadhi kwanza kwenye Supabase
    await saveBookingToSupabase({ name, phone, email, country, route, date, notes });

    const subject = `Booking Mpya: ${name} - ${route}`;
    const body = `Habari MOI ADVENTURE,\n\nNaomba kufanya Booking:\n\n` +
                 `Jina Kamili: ${name}\n` +
                 `Namba ya Simu: ${phone}\n` +
                 `Barua Pepe (Email): ${email || 'Hakuweka'}\n` +
                 `Nchi Anayotoka: ${country || 'Hakuweka'}\n` +
                 `Njia Aliyochagua (Route): ${route}\n` +
                 `Tarehe ya Safari: ${date}\n` +
                 `Maelezo Ziada: ${notes || 'Hakuna'}\n\n` +
                 `Asante!`;

    const mailtoUrl = `mailto:moiadventures@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}
