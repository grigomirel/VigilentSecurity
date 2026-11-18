(function () {
    var isEnglish = document.documentElement.lang === 'en';
    var form = document.querySelector('#offer-form');
    var status = document.querySelector('#form-status');
    var submit = document.querySelector('#offer-submit');
    if (!form || !status || !submit) return;

    var recipientEmail = 'vigilentsekurity@yahoo.com';
    var rateLimitKey = 'vigilent-offer-form-rate-limit';
    var rateLimitMs = 15000;
    var spamWords = ['http://', 'https://', 'bit.ly', 'click here', 'free', 'viagra', 'casino', 'loan'];

    function prefillHomepageSelection() {
        var params = new URLSearchParams(window.location.search);
        var services = params.get('services');
        var protectedType = params.get('protect');
        if (!services && !protectedType) return;

        var serviceList = services ? services.split('|').filter(Boolean) : [];
        if (isEnglish) {
            var legacyServiceAliases = {
                'Monitoring and intervention': 'Monitoring 24/7',
                'Fire detection and alarm': 'Fire detection',
                'Vehicle barriers and access': 'Vehicle barriers'
            };
            serviceList = serviceList.map(function (service) {
                return legacyServiceAliases[service] || service;
            });
        }
        var serviceField = form.querySelector('#service');
        var objectField = form.querySelector('#object-type');
        var messageField = form.querySelector('#message');

        var unspecified = isEnglish ? 'Not specified' : 'Nespecificat';
        if (objectField && protectedType && protectedType !== unspecified) objectField.value = protectedType;
        if (serviceField && serviceList.length) {
            var choices = Array.prototype.slice.call(form.querySelectorAll('.service-choices input[type="checkbox"]'));
            choices.forEach(function (choice) {
                choice.checked = serviceList.indexOf(choice.value) !== -1;
            });
            serviceField.value = serviceList.join(', ');
        }

        if (messageField) {
            var lines = [];
            if (protectedType && protectedType !== unspecified) lines.push((isEnglish ? 'Property type: ' : 'Tip obiectiv: ') + protectedType);
            if (serviceList.length) lines.push((isEnglish ? 'Selected services: ' : 'Servicii selectate: ') + serviceList.join(', '));
            messageField.value = lines.join('\n') + (lines.length ? '\n\n' : '');
        }
    }

    prefillHomepageSelection();

    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'form-status ' + (type || '');
    }

    function getFormSnapshot() {
        var fields = {
            name: (form.elements.from_name || {}).value || '',
            company: (form.elements.company || {}).value || '',
            phone: (form.elements.phone || {}).value || '',
            email: (form.elements.email || {}).value || '',
            objectType: (form.elements.object_type || {}).value || '',
            services: (form.elements.service || {}).value || '',
            message: (form.elements.message || {}).value || ''
        };

        return {
            name: (fields.name || '').trim(),
            company: (fields.company || '').trim(),
            phone: (fields.phone || '').trim(),
            email: (fields.email || '').trim(),
            objectType: (fields.objectType || '').trim(),
            services: (fields.services || '').trim(),
            message: (fields.message || '').trim()
        };
    }

    function hasConfiguration(config) {
        return config && config.enabled !== false && config.publicKey && config.serviceId && config.templateId;
    }

    function isSpamCandidate(value) {
        if (!value) return false;
        var lowered = value.toLowerCase();
        return spamWords.some(function (token) {
            return lowered.indexOf(token) !== -1;
        });
    }

    function isRateLimited() {
        try {
            var value = window.localStorage.getItem(rateLimitKey);
            if (!value) return false;
            var timestamp = Number(value);
            if (!timestamp || Number.isNaN(timestamp)) return false;
            return Date.now() - timestamp < rateLimitMs;
        } catch (error) {
            return false;
        }
    }

    function rememberSendAttempt() {
        try {
            window.localStorage.setItem(rateLimitKey, String(Date.now()));
        } catch (error) {
            // Ignore storage failures.
        }
    }

    function buildMailtoLink(snapshot) {
        var subject = isEnglish ? 'Quote request' : 'Cerere ofertă';
        var details = [];
        if (snapshot.name) details.push((isEnglish ? 'Name: ' : 'Nume: ') + snapshot.name);
        if (snapshot.company) details.push((isEnglish ? 'Company: ' : 'Companie: ') + snapshot.company);
        if (snapshot.phone) details.push((isEnglish ? 'Phone: ' : 'Telefon: ') + snapshot.phone);
        if (snapshot.email) details.push((isEnglish ? 'Email: ' : 'Email: ') + snapshot.email);
        if (snapshot.objectType) details.push((isEnglish ? 'Type of property: ' : 'Tip obiectiv: ') + snapshot.objectType);
        if (snapshot.services) details.push((isEnglish ? 'Services: ' : 'Servicii: ') + snapshot.services);
        if (snapshot.message) details.push((isEnglish ? 'Message: ' : 'Mesaj: ') + snapshot.message);

        var body = details.join('\n') || (isEnglish ? 'No details provided.' : 'Nu au fost furnizate detalii.');
        return 'mailto:' + recipientEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }

    function fallbackToMailto(snapshot) {
        var mailtoLink = buildMailtoLink(snapshot);
        status.textContent = isEnglish ? 'Your request has been prepared. Your email app will open so you can send it directly.' : 'Cererea a fost pregătită. Se va deschide aplicația de email pentru a o trimite direct.';
        status.className = 'form-status warning';
        window.location.href = mailtoLink;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var phone = (form.elements.phone || {}).value ? (form.elements.phone.value || '').trim() : '';
        var email = (form.elements.email || {}).value ? (form.elements.email.value || '').trim() : '';
        var honeypot = (form.elements.website || {}).value ? (form.elements.website.value || '').trim() : '';
        var serviceChoices = Array.prototype.slice.call(form.querySelectorAll('.service-choices input[type="checkbox"]:checked'));
        var serviceError = document.querySelector('#service-choice-error');
        var snapshot = getFormSnapshot();

        if (honeypot) return;
        if (isRateLimited()) {
            showStatus(isEnglish ? 'A request was already sent a moment ago. Please wait a few seconds and try again.' : 'O cerere a fost trimisă recent. Așteaptă câteva secunde și încearcă din nou.', 'error');
            return;
        }

        if (!serviceChoices.length) {
            serviceError.textContent = isEnglish ? 'Select at least one service or the “I am not sure” option.' : 'Selectează cel puțin un serviciu sau opțiunea „Nu sunt sigur”.';
            form.querySelector('.service-choices input[type="checkbox"]').focus();
            return;
        }
        serviceError.textContent = '';
        form.elements.service.value = serviceChoices.map(function (choice) { return choice.value; }).join(', ');
        snapshot = getFormSnapshot();

        if (!phone && !email) {
            showStatus(isEnglish ? 'Enter at least a phone number or an email address.' : 'Completează cel puțin un număr de telefon sau o adresă de email.', 'error');
            (form.elements.phone || form.elements.email).focus();
            return;
        }

        if (!snapshot.name || snapshot.name.length < 2) {
            showStatus(isEnglish ? 'Please enter your full name.' : 'Completează numele și prenumele.', 'error');
            (form.elements.from_name || form.elements.phone).focus();
            return;
        }

        if (snapshot.message.length < 20) {
            showStatus(isEnglish ? 'Please add a few more details about the location and the security requirements.' : 'Adaugă câteva detalii despre locație și cerințele de securitate.', 'error');
            (form.elements.message || form.elements.phone).focus();
            return;
        }

        if (!form.reportValidity()) return;

        if (isSpamCandidate(snapshot.message) || isSpamCandidate(snapshot.name) || isSpamCandidate(snapshot.company)) {
            showStatus(isEnglish ? 'The message contains content that looks like spam. Please rephrase it and try again.' : 'Mesajul conține conținut care pare spam. Reformulează-l și încearcă din nou.', 'error');
            (form.elements.message || form.elements.from_name).focus();
            return;
        }

        var config = window.VIGILENT_EMAILJS || {};
        if (!hasConfiguration(config)) {
            rememberSendAttempt();
            fallbackToMailto(snapshot);
            return;
        }

        if (!window.emailjs) {
            rememberSendAttempt();
            fallbackToMailto(snapshot);
            return;
        }

        submit.disabled = true;
        submit.querySelector('span').textContent = isEnglish ? 'SENDING…' : 'SE TRIMITE…';
        showStatus(isEnglish ? 'Your request is being sent.' : 'Cererea este în curs de trimitere.', 'pending');

        var sending = window.emailjs.sendForm(config.serviceId, config.templateId, form, {
            publicKey: config.publicKey,
            limitRate: { id: 'vigilent-offer-form', throttle: 15000 }
        });

        sending.then(function () {
            rememberSendAttempt();
            form.reset();
            showStatus(isEnglish ? 'Your request was sent. Our team will contact you shortly.' : 'Cererea a fost trimisă. Echipa noastră vă va contacta în curând.', 'success');
        }).catch(function () {
            rememberSendAttempt();
            fallbackToMailto(snapshot);
        }).finally(function () {
            submit.disabled = false;
            submit.querySelector('span').textContent = isEnglish ? 'SEND REQUEST' : 'TRIMITE CEREREA';
        });
    });
}());
