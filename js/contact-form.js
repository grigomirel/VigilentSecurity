(function () {
    var isEnglish = document.documentElement.lang === 'en';
    var form = document.querySelector('#offer-form');
    var status = document.querySelector('#form-status');
    var submit = document.querySelector('#offer-submit');
    if (!form || !status || !submit) return;

    function prefillHomepageSelection() {
        var params = new URLSearchParams(window.location.search);
        var services = params.get('services');
        var protectedType = params.get('protect');
        if (!services && !protectedType) return;

        var serviceList = services ? services.split('|').filter(Boolean) : [];
        var serviceField = form.querySelector('#service');
        var objectField = form.querySelector('#object-type');
        var messageField = form.querySelector('#message');

        if (objectField && protectedType && protectedType !== 'Nespecificat') objectField.value = protectedType;
        if (serviceField && serviceList.length) {
            var choices = Array.prototype.slice.call(form.querySelectorAll('.service-choices input[type="checkbox"]'));
            choices.forEach(function (choice) {
                choice.checked = serviceList.indexOf(choice.value) !== -1;
            });
            serviceField.value = serviceList.join(', ');
        }

        if (messageField) {
            var lines = [];
            if (protectedType && protectedType !== 'Nespecificat') lines.push('Tip obiectiv: ' + protectedType);
            if (serviceList.length) lines.push('Servicii selectate: ' + serviceList.join(', '));
            messageField.value = lines.join('\n') + (lines.length ? '\n\n' : '');
        }
    }

    prefillHomepageSelection();

    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'form-status ' + (type || '');
    }

    function hasConfiguration(config) {
        return config && config.publicKey && config.serviceId && config.templateId;
    }

    function sendWithFormSubmit(config) {
        var payload = new FormData(form);
        payload.append('_subject', 'Cerere nouă de ofertă — Vigilent Security');
        payload.append('_template', 'table');
        payload.append('_url', window.location.href);
        return fetch(config.formSubmitEndpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: payload
        }).then(function (response) {
            if (!response.ok) throw new Error('FormSubmit request failed');
            return response.json();
        });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var phone = form.elements.phone.value.trim();
        var email = form.elements.email.value.trim();
        var honeypot = form.elements.website.value.trim();
        var serviceChoices = Array.prototype.slice.call(form.querySelectorAll('.service-choices input[type="checkbox"]:checked'));
        var serviceError = document.querySelector('#service-choice-error');
        if (honeypot) return;

        if (!serviceChoices.length) {
            serviceError.textContent = isEnglish ? 'Select at least one service or the “I am not sure” option.' : 'Selectează cel puțin un serviciu sau opțiunea „Nu sunt sigur”.';
            form.querySelector('.service-choices input[type="checkbox"]').focus();
            return;
        }
        serviceError.textContent = '';
        form.elements.service.value = serviceChoices.map(function (choice) { return choice.value; }).join(', ');

        if (!phone && !email) {
            showStatus(isEnglish ? 'Enter at least a phone number or an email address.' : 'Completează cel puțin un număr de telefon sau o adresă de email.', 'error');
            (form.elements.phone || form.elements.email).focus();
            return;
        }

        if (!form.reportValidity()) return;

        var config = window.VIGILENT_EMAILJS;
        if (!config || (!config.formSubmitEndpoint && !hasConfiguration(config))) {
            showStatus(isEnglish ? 'The form is ready, but the EmailJS details must be configured.' : 'Formularul este pregătit, dar trebuie completate datele EmailJS în js/emailjs-config.js.', 'error');
            return;
        }

        if (!config.formSubmitEndpoint && !window.emailjs) {
            showStatus(isEnglish ? 'The sending service did not load. Please try again or contact us directly.' : 'Serviciul de trimitere nu s-a încărcat. Reîncearcă sau contactează-ne direct.', 'error');
            return;
        }

        submit.disabled = true;
        submit.querySelector('span').textContent = isEnglish ? 'SENDING…' : 'SE TRIMITE…';
        showStatus(isEnglish ? 'Your request is being sent.' : 'Cererea este în curs de trimitere.', 'pending');

        var sending = config.formSubmitEndpoint ? sendWithFormSubmit(config) : window.emailjs.sendForm(config.serviceId, config.templateId, form, {
            publicKey: config.publicKey,
            limitRate: { id: 'vigilent-offer-form', throttle: 10000 }
        });

        sending.then(function () {
            form.reset();
            showStatus(isEnglish ? 'Your request was sent. Our team will contact you shortly.' : 'Cererea a fost trimisă. Echipa noastră vă va contacta în curând.', 'success');
        }).catch(function () {
            showStatus(isEnglish ? 'The request could not be sent. Please try again.' : 'Cererea nu a putut fi trimisă. Verifică datele EmailJS sau încearcă din nou.', 'error');
        }).finally(function () {
            submit.disabled = false;
            submit.querySelector('span').textContent = isEnglish ? 'SEND REQUEST' : 'TRIMITE CEREREA';
        });
    });
}());
