(function () {
    var isEnglish = document.documentElement.lang === 'en';
    var romanianHome = window.location.protocol === 'file:' ? 'index.html' : './';
    // Relative site-root links work on GitHub Pages and on the custom domain,
    // but under file:// a directory URL does not reliably load index.html.
    if (window.location.protocol === 'file:') {
        document.querySelectorAll('a[href="/"],a[href="./"]').forEach(function (link) {
            link.setAttribute('href', 'index.html');
        });
    }
    // Send every technical-service menu item straight to its complete service page.
    // Keeping this mapping here also updates older page headers without duplicating
    // navigation edits across every static HTML file.
    var serviceRoutes = {
        'paza-umana.html#agenti-securitate': 'paza-umana.html',
        'paza-umana.html#paza-obiective': 'paza-obiective.html',
        'paza-umana.html#paza-evenimente': 'securitate-evenimente.html',
        'paza-umana.html#consultanta': 'plan-securitate.html',
        'paza-umana-en.html#agenti-securitate': 'paza-umana-en.html',
        'paza-umana-en.html#paza-obiective': 'paza-obiective-en.html',
        'paza-umana-en.html#paza-evenimente': 'securitate-evenimente-en.html',
        'paza-umana-en.html#consultanta': 'plan-securitate-en.html'
    };
    document.querySelectorAll('a[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (serviceRoutes[href]) link.setAttribute('href', serviceRoutes[href]);
    });

    var actions = document.querySelector('.vs-actions');
    if (actions) {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var romanianPage = currentPage === 'acasa-en.html'
            ? 'index.html'
            : ((/-en\.html$/.test(currentPage))
                ? currentPage.replace('-en.html', '.html')
                : './');
        var englishPage = currentPage === 'index.html'
            ? 'acasa-en.html'
            : (/-en\.html$/.test(currentPage) ? currentPage : currentPage.replace('.html', '-en.html'));
        var language = document.createElement('div');
        language.className = 'vs-language';
        language.innerHTML = '<button class="vs-language-toggle" type="button" aria-expanded="false" aria-haspopup="true" aria-label="' + (isEnglish ? 'Select language' : 'Selecteaz&#259; limba') + '"><img src="images/Flags/' + (isEnglish ? 'united-kingdom.svg' : 'romania.svg') + '" alt=""><span>' + (isEnglish ? 'EN' : 'RO') + '</span><i aria-hidden="true"></i></button><div class="vs-language-menu"><a href="' + romanianPage + '"><img src="images/Flags/romania.svg" alt="">Rom&#226;n&#259;</a><a href="' + englishPage + '"><img src="images/Flags/united-kingdom.svg" alt="">English</a></div>';
        actions.insertBefore(language, actions.firstChild);
        var languageToggle = language.querySelector('.vs-language-toggle');
        languageToggle.addEventListener('click', function () {
            var open = language.classList.toggle('open');
            languageToggle.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', function (event) {
            if (!language.contains(event.target)) { language.classList.remove('open'); languageToggle.setAttribute('aria-expanded', 'false'); }
        });
    }

    // Service pages focus the hero on the selected service; company-wide figures
    // remain on the homepage where they add context without repeating here.
    if (document.querySelector('.service-hero')) {
        document.querySelectorAll('.service-hero .hero-facts').forEach(function (facts) {
            facts.remove();
        });
    }

    var hero = document.querySelector('.service-hero');
    var serviceCta = document.querySelector('.service-cta');
    var accentByHero = {
        'hero-monitorizare': '#35d4e5',
        'hero-alarma': '#f5c638',
        'hero-acces': '#79df9b',
        'hero-incendiu': '#ff7248',
        'hero-bariere': '#ffad21',
        'hero-interventie': '#68aefe',
        'hero-paza': '#55c7ef'
    };
    var isServicePage = hero && Object.keys(accentByHero).some(function (heroClass) {
        return hero.classList.contains(heroClass);
    });

    if (isServicePage) {
        document.body.classList.add('service-detail-page');
        if (hero.classList.contains('hero-paza')) document.body.classList.add('guarding-service-page');
        if (/\/paza-umana(?:-en)?\.html$/.test(window.location.pathname)) {
            var guardingOverview = document.querySelector('.division-service-list');
            if (guardingOverview) guardingOverview.remove();
        }
        document.querySelectorAll('.process, .project-showcase').forEach(function (section) {
            section.remove();
        });

        var intro = document.querySelector('.service-intro');
        if (intro) {
            var introLabel = intro.querySelector('.section-label');
            var genericHeading = intro.querySelector('h2');
            if (introLabel) introLabel.textContent = isEnglish ? 'What the service includes' : 'Ce include serviciul';
            if (genericHeading) genericHeading.remove();

            var pageName = (window.location.pathname.split('/').pop() || '').replace('-en.html', '.html');
            var evidenceByPage = {
                'monitorizare.html': [
                    ['images/Vigilent/projects/cctv-installation-detail.jpg', 'Camer&#259; video instalat&#259; la obiectiv'],
                    ['images/Vigilent/projects/cctv-night-capture.jpg', 'Exemplu de verificare video pe timp de noapte']
                ],
                'sisteme-de-alarma.html': [
                    ['images/Vigilent/projects/technical-team.jpg', 'Echipa tehnic&#259; Vigilent Security'],
                    ['images/Vigilent/projects/cctv-installation-wide.jpg', 'Echipamente instalate la obiectiv']
                ],
                'bariere.html': [
                    ['images/Vigilent/projects/barrier-installation-entry.jpg', 'Barier&#259; auto instalat&#259; la intrarea &#238;n obiectiv'],
                    ['images/Vigilent/projects/barrier-installation-front.jpg', 'Sistem de acces auto finalizat']
                ],
                'grupuri-de-interventie.html': [
                    ['images/Vigilent/projects/intervention-team.jpg', 'Echipa &#537;i flota de interven&#539;ie Vigilent'],
                    ['images/Vigilent/projects/intervention-vehicles-road.jpg', 'Vehicule de interven&#539;ie &#238;n teren']
                ]
            };
            if (evidenceByPage[pageName]) {
                var evidenceSection = document.createElement('section');
                evidenceSection.className = 'work-evidence';
                if (pageName === 'bariere.html') evidenceSection.classList.add('work-evidence--portrait');
                evidenceSection.innerHTML = '<div class="work-evidence-head"><p class="section-label">' + (isEnglish ? 'Gallery' : 'Galerie') + '</p><h2>' + (isEnglish ? 'Vigilent in the field.' : 'Vigilent &#238;n teren.') + '</h2><p>' + (isEnglish ? 'A selection of images showing Vigilent Security teams at work.' : 'C&#226;teva imagini din activitatea echipelor Vigilent Security.') + '</p></div><div class="work-evidence-grid">' + evidenceByPage[pageName].map(function (photo) {
                    return '<figure><img src="' + photo[0] + '" alt="' + photo[1] + '" loading="lazy"><figcaption>' + photo[1] + '</figcaption></figure>';
                }).join('') + '</div>';
                var equipmentSection = document.querySelector('.equipment');
                if (equipmentSection) equipmentSection.insertAdjacentElement('afterend', evidenceSection);
            }

            var supportsIntervention = !hero.classList.contains('hero-paza') && !hero.classList.contains('hero-interventie');
            if (supportsIntervention) {
                var interventionNote = document.createElement('aside');
                interventionNote.className = 'intervention-note';
                interventionNote.innerHTML = isEnglish ? '<span aria-hidden="true">24/7</span><div><strong>Intervention teams available</strong><p>When a system connected to the monitoring centre is triggered, a mobile team can be dispatched to verify the situation and apply the established procedures. Availability depends on the contract and operational coverage.</p><a href="grupuri-de-interventie-en.html">Intervention details &#8594;</a></div>' : '<span aria-hidden="true">24/7</span><div><strong>Grupuri de interven&#539;ie disponibile</strong><p>La declan&#537;area unui sistem conectat la dispecerat, un grup mobil de interven&#539;ie poate fi trimis pentru verificarea situa&#539;iei &#537;i aplicarea procedurilor stabilite. Serviciul este disponibil &#238;n func&#539;ie de contract &#537;i de acoperirea opera&#539;ional&#259;.</p><a href="grupuri-de-interventie.html">Detalii despre interven&#539;ie &#8594;</a></div>';
                intro.insertAdjacentElement('afterend', interventionNote);
            }
        }

        if (serviceCta) {
        Object.keys(accentByHero).some(function (heroClass) {
            if (!hero.classList.contains(heroClass)) return false;
            serviceCta.style.setProperty('--service-accent', accentByHero[heroClass]);
            document.body.style.setProperty('--service-accent', accentByHero[heroClass]);
            return true;
        });
        }
    }

    var fieldImages = Array.prototype.slice.call(document.querySelectorAll('.work-evidence img, .certification-document img'));
    if (fieldImages.length) {
        var lightbox = document.createElement('div');
        lightbox.className = 'vs-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', isEnglish ? 'Image viewer' : 'Vizualizator imagini');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = '<button class="vs-lightbox-close" type="button" aria-label="' + (isEnglish ? 'Close image' : '&#206;nchide imaginea') + '">&times;</button><button class="vs-lightbox-arrow vs-lightbox-prev" type="button" aria-label="' + (isEnglish ? 'Previous image' : 'Imaginea precedent&#259;') + '">&#8249;</button><figure><img src="" alt=""><figcaption></figcaption></figure><button class="vs-lightbox-arrow vs-lightbox-next" type="button" aria-label="' + (isEnglish ? 'Next image' : 'Imaginea urm&#259;toare') + '">&#8250;</button>';
        document.body.appendChild(lightbox);
        var enlargedImage = lightbox.querySelector('img');
        var enlargedCaption = lightbox.querySelector('figcaption');
        var activeImage = 0;
        var previousFocus = null;

        function showFieldImage(index) {
            activeImage = (index + fieldImages.length) % fieldImages.length;
            enlargedImage.src = fieldImages[activeImage].src;
            enlargedImage.alt = fieldImages[activeImage].alt;
            var card = fieldImages[activeImage].closest('.certification-document');
            var cardTitle = card && card.querySelector('h3');
            var figure = fieldImages[activeImage].closest('figure');
            var figureCaption = figure && figure.querySelector('figcaption');
            enlargedCaption.textContent = cardTitle ? cardTitle.textContent : (figureCaption ? figureCaption.textContent : fieldImages[activeImage].alt);
        }
        function openFieldImage(index) {
            previousFocus = document.activeElement;
            showFieldImage(index);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('vs-lightbox-open');
            lightbox.querySelector('.vs-lightbox-close').focus();
        }
        function closeFieldImage() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('vs-lightbox-open');
            if (previousFocus) previousFocus.focus();
        }
        fieldImages.forEach(function (image, index) {
            var trigger = image.closest('figure') || image.closest('a');
            if (!trigger) return;
            if (trigger.tagName !== 'A') trigger.tabIndex = 0;
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-label', (isEnglish ? 'Enlarge: ' : 'Mărește: ') + image.alt);
            trigger.addEventListener('click', function (event) { event.preventDefault(); openFieldImage(index); });
            trigger.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openFieldImage(index); }
            });
        });
        lightbox.querySelector('.vs-lightbox-close').addEventListener('click', closeFieldImage);
        lightbox.querySelector('.vs-lightbox-prev').addEventListener('click', function () { showFieldImage(activeImage - 1); });
        lightbox.querySelector('.vs-lightbox-next').addEventListener('click', function () { showFieldImage(activeImage + 1); });
        lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeFieldImage(); });
        document.addEventListener('keydown', function (event) {
            if (!lightbox.classList.contains('open')) return;
            if (event.key === 'Escape') closeFieldImage();
            if (event.key === 'ArrowLeft') showFieldImage(activeImage - 1);
            if (event.key === 'ArrowRight') showFieldImage(activeImage + 1);
            if (event.key === 'Tab') {
                var controls = Array.prototype.slice.call(lightbox.querySelectorAll('button'));
                var firstControl = controls[0];
                var lastControl = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === firstControl) {
                    event.preventDefault();
                    lastControl.focus();
                } else if (!event.shiftKey && document.activeElement === lastControl) {
                    event.preventDefault();
                    firstControl.focus();
                }
            }
        });
    }

    var siteFooter = document.querySelector('.vs-footer');
    if (siteFooter) {
        siteFooter.innerHTML = isEnglish ? '<div class="vs-footer-compact"><div class="vs-footer-identities"><a href="acasa-en.html" aria-label="Vigilent Technical Security services"><img src="images/Vigilent/vigilent-security-tehnic-logo.png" alt="Vigilent Security Tehnic"></a><span aria-hidden="true"></span><a href="acasa-en.html" aria-label="Vigilent guarding services"><img src="images/Vigilent/vigilent-security-logo.png" alt="Vigilent Security"></a></div><address class="vs-footer-contact-details"><strong>Two specialised companies. Integrated security.</strong><span>76 Adrian Street, Drobeta-Turnu Severin, 220126</span><span><a href="tel:+40252317317">0252 317 317</a><a href="mailto:vigilentsekurity@yahoo.com">vigilentsekurity@yahoo.com</a></span></address><nav class="vs-footer-essential" aria-label="Useful links"><a href="https://www.facebook.com/InterventieVigilent" target="_blank" rel="noopener">Facebook ↗</a><a href="contact-en.html">Contact</a><a href="#" class="vs-back-top">Back to top ↑</a></nav></div><div class="vs-footer-legal"><span>&copy; 2026 Vigilent Security Group. All rights reserved.</span><a href="despre-noi-en.html">About us</a><a href="#privacy" class="vs-privacy-open">Privacy</a></div>' : '<div class="vs-footer-compact"><div class="vs-footer-identities"><a href="' + romanianHome + '" aria-label="Servicii Vigilent Security Tehnic"><img src="images/Vigilent/vigilent-security-tehnic-logo.png" alt="Vigilent Security Tehnic"></a><span aria-hidden="true"></span><a href="' + romanianHome + '" aria-label="Servicii Vigilent Security Pază"><img src="images/Vigilent/vigilent-security-logo.png" alt="Vigilent Security Pază"></a></div><address class="vs-footer-contact-details"><strong>Două companii specializate. Securitate integrată.</strong><span>Strada Adrian 76, Drobeta-Turnu Severin, 220126</span><span><a href="tel:+40252317317">0252 317 317</a><a href="mailto:vigilentsekurity@yahoo.com">vigilentsekurity@yahoo.com</a></span></address><nav class="vs-footer-essential" aria-label="Linkuri utile"><a href="https://www.facebook.com/InterventieVigilent" target="_blank" rel="noopener">Facebook ↗</a><a href="contact.html">Contact</a><a href="#" class="vs-back-top">Înapoi sus ↑</a></nav></div><div class="vs-footer-legal"><span>&copy; 2026 Vigilent Security Group. Toate drepturile rezervate.</span><a href="despre-noi.html">Despre noi</a><a href="#privacy" class="vs-privacy-open">Confiden&#539;ialitate</a></div>';
        var backTop = siteFooter.querySelector('.vs-back-top');
        backTop.addEventListener('click', function (event) {
            event.preventDefault();
            var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    var privacyDialog = document.createElement('div');
    privacyDialog.className = 'vs-privacy-dialog';
    privacyDialog.id = 'privacy';
    privacyDialog.setAttribute('aria-hidden', 'true');
    privacyDialog.innerHTML = '<div class="vs-privacy-backdrop" data-privacy-close></div><section class="vs-privacy-panel" role="dialog" aria-modal="true" aria-labelledby="vs-privacy-title" tabindex="-1"><button class="vs-privacy-close" type="button" data-privacy-close aria-label="' + (isEnglish ? 'Close privacy information' : 'Închide informarea') + '">&times;</button>' + (isEnglish ? '<p class="vs-privacy-kicker">Privacy</p><h2 id="vs-privacy-title">How we use your information</h2><p>When you send a request, Vigilent Security uses the contact details and message you provide only to respond, clarify your requirements and prepare an assessment or quotation.</p><ul><li>The message is transmitted through EmailJS and delivered to our email inbox.</li><li>We do not use form information for marketing or sell it.</li><li>We keep correspondence only while it is useful for handling the request and any resulting contractual or legal obligations.</li><li>You may ask us to access, correct or delete your information.</li></ul><p>For privacy questions, contact <a href="mailto:vigilentsekurity@yahoo.com">vigilentsekurity@yahoo.com</a> or <a href="tel:+40252317317">0252 317 317</a>.</p>' : '<p class="vs-privacy-kicker">Confidențialitate</p><h2 id="vs-privacy-title">Cum folosim datele tale</h2><p>Când trimiți o solicitare, Vigilent Security folosește datele de contact și mesajul doar pentru a răspunde, a clarifica cerințele și a pregăti o evaluare sau ofertă.</p><ul><li>Mesajul este transmis prin EmailJS și ajunge în căsuța noastră de email.</li><li>Nu folosim datele formularului pentru marketing și nu le vindem.</li><li>Păstrăm corespondența numai cât este utilă pentru gestionarea solicitării și a eventualelor obligații contractuale sau legale.</li><li>Ne poți cere accesul, corectarea sau ștergerea datelor tale.</li></ul><p>Pentru întrebări despre date, scrie la <a href="mailto:vigilentsekurity@yahoo.com">vigilentsekurity@yahoo.com</a> sau sună la <a href="tel:+40252317317">0252 317 317</a>.</p>') + '</section>';
    document.body.appendChild(privacyDialog);
    var privacyPanel = privacyDialog.querySelector('.vs-privacy-panel');
    var privacyPreviousFocus = null;

    function openPrivacy(event) {
        if (event) event.preventDefault();
        privacyPreviousFocus = document.activeElement;
        privacyDialog.classList.add('open');
        privacyDialog.setAttribute('aria-hidden', 'false');
        document.body.classList.add('vs-privacy-opened');
        privacyPanel.focus();
    }
    function closePrivacy() {
        privacyDialog.classList.remove('open');
        privacyDialog.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('vs-privacy-opened');
        if (privacyPreviousFocus) privacyPreviousFocus.focus();
    }
    document.addEventListener('click', function (event) {
        if (event.target.closest('.vs-privacy-open')) openPrivacy(event);
        if (event.target.closest('[data-privacy-close]')) closePrivacy();
    });
    document.addEventListener('keydown', function (event) {
        if (!privacyDialog.classList.contains('open')) return;
        if (event.key === 'Escape') closePrivacy();
        if (event.key === 'Tab') {
            var privacyFocusable = privacyPanel.querySelectorAll('a[href],button:not([disabled])');
            var privacyFirst = privacyFocusable[0];
            var privacyLast = privacyFocusable[privacyFocusable.length - 1];
            if (event.shiftKey && (document.activeElement === privacyFirst || document.activeElement === privacyPanel)) {
                event.preventDefault();
                privacyLast.focus();
            } else if (!event.shiftKey && document.activeElement === privacyLast) {
                event.preventDefault();
                privacyFirst.focus();
            }
        }
    });

    var toggle = document.querySelector('.vs-menu-toggle');
    var menu = document.querySelector('.vs-links');
    var dropdowns = document.querySelectorAll('.vs-dropdown');
    if (!toggle || !menu) return;

    // On mobile the action row belongs inside the scrollable menu. Keeping it
    // in normal flow prevents Contact and the language selector from covering
    // service links when the menu or a dropdown grows taller.
    if (actions) {
        var actionsHome = document.createComment('navigation actions');
        actions.parentNode.insertBefore(actionsHome, actions);
        var mobileNavigation = window.matchMedia('(max-width: 760px)');
        function placeNavigationActions() {
            if (mobileNavigation.matches) {
                if (actions.parentNode !== menu) menu.insertBefore(actions, menu.firstChild);
            } else if (actions.parentNode === menu && actionsHome.parentNode) {
                actionsHome.parentNode.insertBefore(actions, actionsHome.nextSibling);
            }
        }
        placeNavigationActions();
        if (mobileNavigation.addEventListener) mobileNavigation.addEventListener('change', placeNavigationActions);
        else mobileNavigation.addListener(placeNavigationActions);
    }

    toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('vs-menu-open', isOpen);
        if (!isOpen) {
            var openLanguage = menu.querySelector('.vs-language.open');
            if (openLanguage) {
                openLanguage.classList.remove('open');
                openLanguage.querySelector('.vs-language-toggle').setAttribute('aria-expanded', 'false');
            }
        }
    });

    menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('vs-menu-open');
        }
    });

    dropdowns.forEach(function (dropdown) {
        var dropdownToggle = dropdown.querySelector('.vs-dropdown-toggle');
        function setDropdown(open) {
            // Close sibling menus only when this dropdown is being opened.
            // Every dropdown owns an outside-click listener; closing an already
            // closed sibling must not also close the dropdown that was clicked.
            if (open) {
                dropdowns.forEach(function (item) {
                    if (item !== dropdown) {
                        item.classList.remove('open');
                        item.querySelector('.vs-dropdown-toggle').setAttribute('aria-expanded', 'false');
                    }
                });
            }
            dropdown.classList.toggle('open', open);
            dropdownToggle.setAttribute('aria-expanded', String(open));
        }

        dropdownToggle.addEventListener('click', function () {
            setDropdown(!dropdown.classList.contains('open'));
        });

        dropdown.addEventListener('mouseenter', function () {
            if (window.innerWidth > 760) setDropdown(true);
        });

        dropdown.addEventListener('mouseleave', function () {
            if (window.innerWidth > 760) setDropdown(false);
        });

        document.addEventListener('click', function (event) {
            if (!dropdown.contains(event.target)) setDropdown(false);
        });

        dropdown.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setDropdown(false);
                dropdownToggle.focus();
            }
        });
    });
}());
