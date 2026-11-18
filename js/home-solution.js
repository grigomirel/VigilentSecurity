(function () {
    'use strict';

    var trustBanner = document.querySelector('.trusted-environments');
    var trustBackdrop = document.querySelector('.trusted-backdrop');
    var trustClose = document.querySelector('.trusted-close');
    var sessionKey = 'vigilentTrustBannerDismissed';
    var revealTimer = null;

    // The announcement is a viewport takeover, so keep it outside the hero's
    // clipping and stacking context. This also covers content below the hero
    // on tall screens.
    if (trustBackdrop && trustBackdrop.parentNode !== document.body) {
        document.body.appendChild(trustBackdrop);
    }
    if (trustBanner && trustBanner.parentNode !== document.body) {
        document.body.appendChild(trustBanner);
    }

    function setSessionDismissed() {
        try {
            sessionStorage.setItem(sessionKey, 'true');
        } catch (error) {
            // Ignore storage failures gracefully.
        }
    }

    function dismissTrustBanner() {
        if (!trustBanner || !trustBackdrop) return;
        if (!trustBanner.classList.contains('is-visible') && !trustBackdrop.classList.contains('is-visible')) return;
        if (revealTimer) {
            clearTimeout(revealTimer);
            revealTimer = null;
        }
        trustBanner.classList.remove('is-visible');
        trustBackdrop.classList.remove('is-visible');
        var hero = document.querySelector('.trust-hero');
        if (hero) {
            hero.classList.remove('is-takeover-active');
        }
        setSessionDismissed();
    }

    function showTrustBanner() {
        if (!trustBanner || !trustBackdrop) return;

        var hero = document.querySelector('.trust-hero');
        if (!hero) return;

        var rect = hero.getBoundingClientRect();
        var heroVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (!heroVisible) return;

        hero.classList.add('is-takeover-active');
        trustBackdrop.classList.add('is-visible');
        revealTimer = setTimeout(function () {
            var revealHero = document.querySelector('.trust-hero');
            if (!revealHero) return;
            var revealRect = revealHero.getBoundingClientRect();
            if (revealRect.top >= window.innerHeight || revealRect.bottom <= 0) {
                dismissTrustBanner();
                return;
            }
            trustBanner.classList.add('is-visible');
            revealTimer = null;
        }, 250);
    }

    if (trustBanner && trustBackdrop) {
        var shouldDismiss = false;
        var startupTimer = null;

        try {
            shouldDismiss = sessionStorage.getItem(sessionKey) === 'true';
        } catch (error) {
            shouldDismiss = false;
        }

        function cancelScheduledReveal() {
            if (startupTimer) {
                clearTimeout(startupTimer);
                startupTimer = null;
            }
            if (revealTimer) {
                clearTimeout(revealTimer);
                revealTimer = null;
            }
        }

        function handleInteractionDismiss() {
            if (trustBanner && trustBanner.classList.contains('is-visible')) {
                dismissTrustBanner();
            }
        }

        if (!shouldDismiss) {
            startupTimer = setTimeout(showTrustBanner, 1000);
        }

        var onScroll = function () {
            var hero = document.querySelector('.trust-hero');
            if (!hero) return;

            var rect = hero.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) return;

            if (trustBackdrop && trustBackdrop.classList.contains('is-visible')) {
                dismissTrustBanner();
            } else {
                cancelScheduledReveal();
                setSessionDismissed();
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('pointerdown', function (event) {
            if (!trustBackdrop.classList.contains('is-visible')) return;
            if (trustClose && trustClose.contains(event.target)) return;
            dismissTrustBanner();
        }, { passive: true });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && trustBanner && trustBanner.classList.contains('is-visible')) {
                dismissTrustBanner();
            }
        });

        if (trustClose) {
            trustClose.addEventListener('click', dismissTrustBanner);
        }

        trustBackdrop.addEventListener('click', dismissTrustBanner);
    }

    var protectButtons = Array.prototype.slice.call(document.querySelectorAll('.protect-option'));
    var serviceButtons = Array.prototype.slice.call(document.querySelectorAll('.solution-service'));
    var submit = document.getElementById('solution-submit');
    var count = document.getElementById('solution-count');
    var selection = document.getElementById('solution-selection');
    var note = document.getElementById('recommendation-note');
    var protectedType = '';
    var isEnglish = document.documentElement.lang === 'en';
    var recommendationValue = isEnglish ? 'I need a recommendation' : 'Am nevoie de recomandare';

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
        var canContinue = services.length > 0 || protectedType === recommendationValue;
        count.textContent = services.length ? services.length + (isEnglish ? (services.length === 1 ? ' service selected' : ' services selected') : (services.length === 1 ? ' serviciu selectat' : ' servicii selectate')) : (canContinue ? (isEnglish ? 'Personalised assessment' : 'Evaluare personalizată') : (isEnglish ? 'No services selected' : 'Niciun serviciu selectat'));
        selection.textContent = services.length ? services.join(' · ') : (canContinue ? (isEnglish ? 'The Vigilent team will recommend the appropriate solution.' : 'Echipa Vigilent îți va recomanda soluția potrivită.') : (isEnglish ? 'Choose services or request a recommendation.' : 'Alege serviciile sau solicită o recomandare.'));
        submit.classList.toggle('is-disabled', !canContinue);
        submit.setAttribute('aria-disabled', String(!canContinue));
        submit.tabIndex = canContinue ? 0 : -1;
        var contactPage = isEnglish ? 'contact-en.html' : 'contact.html';
        submit.href = canContinue ? contactPage + '?protect=' + encodeURIComponent(protectedType || (isEnglish ? 'Not specified' : 'Nespecificat')) + '&services=' + encodeURIComponent(services.join('|') || recommendationValue) + '#solicitare' : contactPage + '#solicitare';
    }

    protectButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            protectedType = button.dataset.protect;
            protectButtons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
            serviceButtons.forEach(function (service) {
                var recommended = service.dataset.audiences.split(',').indexOf(protectedType) !== -1;
                service.classList.toggle('is-recommended', recommended);
                service.classList.toggle('is-muted', protectedType !== recommendationValue && !recommended);
            });
            note.textContent = protectedType === recommendationValue ? (isEnglish ? 'No problem — request an assessment and our team will recommend a solution.' : 'Nicio problemă — solicită evaluarea, iar echipa noastră îți va recomanda soluția.') : (isEnglish ? 'Recommended services for “' + protectedType + '” are highlighted. You can select any combination.' : 'Serviciile recomandate pentru „' + protectedType + '” sunt evidențiate. Poți selecta orice combinație.');
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
