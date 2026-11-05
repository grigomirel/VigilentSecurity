(function () {
    'use strict';

    var protectButtons = Array.prototype.slice.call(document.querySelectorAll('.protect-option'));
    var serviceButtons = Array.prototype.slice.call(document.querySelectorAll('.solution-service'));
    var submit = document.getElementById('solution-submit');
    var count = document.getElementById('solution-count');
    var selection = document.getElementById('solution-selection');
    var note = document.getElementById('recommendation-note');
    var protectedType = '';

    if (!submit || !serviceButtons.length) return;

    function selectedServices() {
        return serviceButtons.filter(function (button) {
            return button.classList.contains('is-selected');
        }).map(function (button) {
            return button.dataset.service;
        });
    }

    function updateSummary() {
        var services = selectedServices();
        var canContinue = services.length > 0 || protectedType === 'Am nevoie de recomandare';
        count.textContent = services.length ? services.length + (services.length === 1 ? ' serviciu selectat' : ' servicii selectate') : (canContinue ? 'Evaluare personalizată' : 'Niciun serviciu selectat');
        selection.textContent = services.length ? services.join(' · ') : (canContinue ? 'Echipa Vigilent îți va recomanda soluția potrivită.' : 'Alege serviciile sau solicită o recomandare.');
        submit.classList.toggle('is-disabled', !canContinue);
        submit.setAttribute('aria-disabled', String(!canContinue));
        submit.tabIndex = canContinue ? 0 : -1;
        submit.href = canContinue ? 'contact.html?protect=' + encodeURIComponent(protectedType || 'Nespecificat') + '&services=' + encodeURIComponent(services.join('|') || 'Am nevoie de recomandare') + '#solicitare' : 'contact.html#solicitare';
    }

    protectButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            protectedType = button.dataset.protect;
            protectButtons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
            serviceButtons.forEach(function (service) {
                var recommended = service.dataset.audiences.split(',').indexOf(protectedType) !== -1;
                service.classList.toggle('is-recommended', recommended);
                service.classList.toggle('is-muted', protectedType !== 'Am nevoie de recomandare' && !recommended);
            });
            note.textContent = protectedType === 'Am nevoie de recomandare' ? 'Nicio problemă — solicită evaluarea, iar echipa noastră îți va recomanda soluția.' : 'Serviciile recomandate pentru „' + protectedType + '” sunt evidențiate. Poți selecta orice combinație.';
            updateSummary();
        });
    });

    serviceButtons.forEach(function (button) {
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', function () {
            button.classList.toggle('is-selected');
            button.setAttribute('aria-pressed', String(button.classList.contains('is-selected')));
            updateSummary();
        });
    });

    updateSummary();
}());
