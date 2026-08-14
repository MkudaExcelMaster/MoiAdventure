// ==========================================
// 1. SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://kyuokonjmaunmprrvzin.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_e3GzVKCe5mAr6SBaomqKjw_gD9Ql3Eb';

// Create Supabase client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Function to save booking data to Supabase Database
async function saveBookingToSupabase(bookingData) {
    if (!supabase) {
        console.error("Supabase library is not loaded properly.");
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
        console.log("Booking successfully saved to Supabase:", data);
        return true;
    } catch (err) {
        console.error("System Error:", err);
        return false;
    }
}


// ==========================================
// 2. AUTOMATIC IMAGE SLIDER (Images from Supabase)
// ==========================================
const sliderContainer = document.querySelector('.slider-container');
const totalImages = 200; // Total number of images
const SUPABASE_STORAGE_URL = 'https://kyuokonjmaunmprrvzin.supabase.co/storage/v1/object/public/moi-adventure/images';

if (sliderContainer) {
    sliderContainer.innerHTML = '';
    for (let i = 1; i <= totalImages; i++) {
        const slideDiv = document.createElement('div');
        slideDiv.className = i === 1 ? 'slide active' : 'slide';
        
        // Loads images directly from Supabase Storage
        slideDiv.style.backgroundImage = `url('${SUPABASE_STORAGE_URL}/hero${i}.jpeg')`;
        
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
        alert("PDF library is not loaded. Please ensure it is included in index.html!");
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
        alert("Please fill in all required fields (Name, Phone, Route, and Date) before downloading the PDF.");
        return;
    }

    if (document.getElementById('pdfName')) document.getElementById('pdfName').innerText = name;
    if (document.getElementById('pdfPhone')) document.getElementById('pdfPhone').innerText = phone;
    if (document.getElementById('pdfEmail')) document.getElementById('pdfEmail').innerText = email || "Not provided";
    if (document.getElementById('pdfCountry')) document.getElementById('pdfCountry').innerText = country || "Not provided";
    if (document.getElementById('pdfRoute')) document.getElementById('pdfRoute').innerText = route;
    if (document.getElementById('pdfDate')) document.getElementById('pdfDate').innerText = date;
    if (document.getElementById('pdfNotes')) document.getElementById('pdfNotes').innerText = notes || "None";

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
            console.error("PDF Generation Error:", error);
            pdfTemplate.style.display = 'none';
            pdfTemplate.style.position = 'static';
        });
    }, 100);
}


// ==========================================
// 4. SEND WHATSAPP + SAVE TO SUPABASE
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
        alert("Please fill in all required fields before sending via WhatsApp.");
        return;
    }

    // Save to Supabase first
    await saveBookingToSupabase({ name, phone, email, country, route, date, notes });

    const message = `Hello MOI ADVENTURE, I would like to make a Booking:\n\n` +
                    `👤 *Name:* ${name}\n` +
                    `📞 *Phone:* ${phone}\n` +
                    `✉️ *Email:* ${email || 'Not provided'}\n` +
                    `🌍 *Country:* ${country || 'Not provided'}\n` +
                    `🏔️ *Route:* ${route}\n` +
                    `📅 *Date:* ${date}\n` +
                    `📝 *Notes:* ${notes || 'None'}`;

    const whatsappUrl = `https://wa.me/255769345456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}


// ==========================================
// 5. SEND EMAIL + SAVE TO SUPABASE
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
        alert("Please fill in all required fields before sending an Email.");
        return;
    }

    // Save to Supabase first
    await saveBookingToSupabase({ name, phone, email, country, route, date, notes });

    const subject = `New Booking Request: ${name} - ${route}`;
    const body = `Hello MOI ADVENTURE,\n\nI would like to make a booking:\n\n` +
                 `Full Name: ${name}\n` +
                 `Phone Number: ${phone}\n` +
                 `Email Address: ${email || 'Not provided'}\n` +
                 `Country: ${country || 'Not provided'}\n` +
                 `Selected Route: ${route}\n` +
                 `Trip Date: ${date}\n` +
                 `Additional Notes: ${notes || 'None'}\n\n` +
                 `Thank you!`;

    const mailtoUrl = `mailto:moiadventures@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}
