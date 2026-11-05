(function () {
    'use strict';
    if (document.documentElement.lang !== 'en') return;

    var page = (location.pathname.split('/').pop() || 'acasa-en.html').replace('-en.html', '');
    function text(selector, value) { var el = document.querySelector(selector); if (el) el.textContent = value; }
    function html(selector, value) { var el = document.querySelector(selector); if (el) el.innerHTML = value; }
    function list(selector, values) { document.querySelectorAll(selector).forEach(function (el, i) { if (values[i] != null) el.textContent = values[i]; }); }

    var meta = {
        acasa: ['Security Company and Security Systems | Vigilent Security Group', 'Integrated guarding, monitoring, intervention and technical security services for companies, institutions and properties.'],
        'despre-noi': ['About us | Vigilent Security', 'About Vigilent Security.'],
        contact: ['Contact and quote request | Vigilent Security', 'Contact Vigilent Security and request an assessment for your property.'],
        monitorizare: ['Monitoring and intervention | Vigilent Security', 'Permanent monitoring of security signals and coordinated response according to agreed procedures.'],
        'sisteme-de-alarma': ['Alarm systems | Vigilent Security', 'Alarm systems designed around the risks and operating needs of each property.'],
        'control-acces': ['Access control | Vigilent Security', 'Controlled access solutions for people, vehicles and restricted areas.'],
        'sisteme-alerta-incendiu': ['Fire detection and alarm | Vigilent Security', 'Fire detection, signalling and warning systems configured for each property.'],
        bariere: ['Vehicle barriers and access | Vigilent Security', 'Vehicle barriers and access control solutions for commercial, industrial and residential properties.'],
        'grupuri-de-interventie': ['Mobile intervention teams | Vigilent Security', 'Mobile Vigilent Security teams available for alarm verification and intervention.'],
        'paza-umana': ['Security guards | Vigilent Security', 'Professional guarding services adapted to each property and its operating requirements.'],
        'paza-obiective': ['Property guarding | Vigilent Security', 'Guarding services for companies, institutions, commercial and industrial sites and private properties.'],
        'securitate-evenimente': ['Event security | Vigilent Security', 'Security planning, access control and on-site coordination for events.'],
        'plan-securitate': ['Security plan | Vigilent Security', 'Clear security procedures built around the property, risks and responsibilities.']
    };
    if (meta[page]) { document.title = meta[page][0]; var d = document.querySelector('meta[name="description"]'); if (d) d.content = meta[page][1]; }

    var nav = document.querySelector('.vs-nav'); if (nav) nav.setAttribute('aria-label', 'Main navigation');
    text('.vs-menu-toggle .sr-only', 'Open menu');
    list('.vs-main-link', ['Home', 'About us']);
    document.querySelectorAll('.vs-dropdown-toggle').forEach(function (button, i) {
        button.innerHTML = (i === 0 ? 'Vigilent Technical Security' : 'Vigilent Guarding') + ' <span class="vs-chevron" aria-hidden="true"></span>';
    });
    var navStrong = ['Monitoring', 'Alarm systems', 'Access control', 'Fire detection and alarm', 'Vehicle barriers', 'Mobile intervention teams', 'Security guards', 'Property guarding', 'Event security', 'Security plan'];
    var navSmall = ['Permanent monitoring 24/7', 'Fast detection and warning', 'Secure, managed access', 'Detection, signalling and warning systems', 'Vehicle and perimeter control', 'Mobile teams ready to respond', 'Trained and licensed personnel', 'Companies, institutions and properties', 'Organised control and protection', 'Solutions adapted to each property'];
    list('.vs-panel-link strong', navStrong); list('.vs-panel-link small', navSmall);
    text('.vs-contact', 'Contact  ↗');

    var services = {
        monitorizare: {
            kicker:'Monitoring centre and response', title:'Monitoring and response <em>24/7.</em>', lead:'Security system signals are monitored continuously, and events are handled according to the procedures established for each property.',
            intro:'Monitoring connects the systems installed on the property with a team able to interpret alerts quickly and initiate the agreed steps. The configuration is adapted to the risks, schedule and particularities of the location.',
            benefits:['Alarm signal reception','Event verification and classification','Notification of designated contacts','Escalation according to agreed procedures','Alarm history and traceability','Integration with intrusion and video systems'],
            equipment:['IP/GSM communicator|Securely transmits events to the monitoring centre.','Alarm control panels|Manage zones and signals across the property.','Video cameras|Enable visual verification where the solution requires it.','Panic button|Quickly triggers a silent or visible alert.','Management applications|Provide control and information about system status.','Communication equipment|Supports rapid response coordination.']
        },
        'sisteme-de-alarma': {
            kicker:'Detection and warning', title:'Intelligent <em>alarm systems.</em>', lead:'We design and install alarm solutions that detect intrusion attempts and promptly notify the designated people or monitoring centre.',
            intro:'The alarm system is configured according to access points, vulnerable areas, operating schedule and the way the space is used. Components are selected for reliable detection and simple day-to-day operation.',
            benefits:['Intrusion detection','Door and window protection','Indoor and outdoor detection','Audible and visual warning','Connection to the monitoring centre','Remote management options'],
            equipment:['Alarm control panel|Coordinates detectors, zones and system events.','Motion detectors|Identify movement in protected areas.','Magnetic contacts|Monitor doors, windows and other access points.','Outdoor siren|Provides visible and audible warning.','Keypad and readers|Allow secure arming and disarming.','Communication module|Sends alerts through IP or mobile networks.']
        },
        'control-acces': {
            kicker:'Controlled entry and clear records', title:'Access control <em>without compromise.</em>', lead:'We manage who can enter, where and when, using access rules adapted to employees, visitors, vehicles and restricted areas.',
            intro:'An access control system reduces dependence on physical keys and creates a clear record of entries. It can manage a single door or multiple areas, schedules and user categories.',
            benefits:['Individual access permissions','Time and area restrictions','Entry and exit history','Visitor and supplier management','Integration with barriers and turnstiles','Rapid blocking of lost credentials'],
            equipment:['Card and tag readers|Identify authorised users quickly.','Biometric readers|Provide enhanced identity verification.','Controllers|Apply access rules and manage doors.','Electromagnetic locks|Secure access points under system control.','Intercom systems|Allow remote visitor verification.','Management software|Centralises users, permissions and reports.']
        },
        'sisteme-alerta-incendiu': {
            kicker:'Early detection and warning', title:'Fire detection <em>and alarm.</em>', lead:'We implement systems that detect signs of fire early and warn occupants so established procedures can begin without delay.',
            intro:'The solution is designed according to the building, activity, occupancy and applicable requirements. Detection, signalling and control components are organised for clear operation and maintenance.',
            benefits:['Smoke and temperature detection','Manual alarm activation','Audible and visual warning','Event zoning and identification','Control of connected safety equipment','Testing and maintenance planning'],
            equipment:['Fire alarm panel|Receives, displays and manages system events.','Smoke detectors|Identify smoke at an early stage.','Heat detectors|Respond to temperature changes in suitable areas.','Manual call points|Allow occupants to trigger an alarm.','Sounders and beacons|Provide audible and visual warning.','Input/output modules|Connect auxiliary safety equipment.']
        },
        bariere: {
            kicker:'Vehicle access and perimeter flow', title:'Vehicle barriers <em>and access.</em>', lead:'We install vehicle barriers and access systems for controlled, efficient entry into car parks, residential areas and operational sites.',
            intro:'The solution is selected according to traffic volume, lane width, opening frequency and the required method of identification. It can operate independently or as part of an integrated access system.',
            benefits:['Controlled vehicle entry and exit','Card, remote or number-plate access','Visitor access management','Traffic light and safety sensor integration','Event and access records','Solutions for intensive operation'],
            equipment:['Automatic barrier|Controls vehicle flow reliably.','Barrier arm|Selected according to lane width and operating needs.','Safety photocells|Detect obstacles in the movement area.','Loop detector|Identifies vehicles in the lane.','Access reader|Allows entry using authorised credentials.','Control unit|Coordinates automation and access rules.']
        },
        'grupuri-de-interventie': {
            kicker:'Mobile response in the field', title:'Mobile <em>intervention teams.</em>', lead:'Mobile teams are available to verify alarms and act according to the established procedures and operational coverage.',
            intro:'When a connected system is triggered, the monitoring centre analyses the event and can dispatch a mobile intervention team. The response follows the contractual procedure and the situation found on site.',
            benefits:['Dispatch following alarm verification','Mobile teams equipped for field response','Coordination with the monitoring centre','On-site situation verification','Notification of designated contacts','Support for agreed escalation procedures'],
            equipment:['Intervention vehicles|Enable rapid movement within the covered area.','Operational communication|Keeps teams connected to the monitoring centre.','Protective equipment|Supports safe field activity.','Location and dispatch|Helps coordinate the nearest available team.','Event reporting|Records observations and actions taken.','Operational procedures|Define the response for each protected property.']
        },
        'paza-obiective': {
            kicker:'Protection adapted to the location', title:'Guarding for <em>properties.</em>', lead:'We organise guarding services for offices, commercial spaces, warehouses, industrial sites, institutions and properties, based on their real risks and flows.',
            intro:'Posts, schedules, patrols and guard responsibilities are established after assessing the location. The arrangement can cover people and vehicle access, vulnerable areas, the perimeter and out-of-hours activity.',
            benefits:['Fixed posts and patrols','People and vehicle access control','Perimeter and sensitive-area checks','Visitor and supplier records','Incident management according to instructions','Reporting to designated contacts'],
            equipment:['Control post|A clear point for access checks and visitor management.','Guarding plan|Defines posts, instructions and response procedures.','Scheduled patrols|Periodically verify the perimeter and agreed areas.','Operational communications|Maintain contact with managers and support teams.','Event register|Provides traceability for access, checks and incidents.','Technical integration|Can work with alarms, CCTV and access control.']
        },
        'securitate-evenimente': {
            kicker:'Control and coordination on site', title:'Security for <em>events.</em>', lead:'We organise access control, surveillance and response for private, corporate and public events, adapted to the venue and participant flow.',
            intro:'The security arrangement is planned with the organiser, based on entrances, capacity, programme, restricted areas and possible incidents. Teams receive clear roles and communication procedures.',
            benefits:['Participant access control','Entry and exit flow management','Restricted-area protection','Patrols across the venue','Incident prevention and management','Coordination with the organiser'],
            equipment:['Access teams|Check entry rules and guide participants.','Mobile patrols|Observe activity throughout the event area.','Coordination point|Centralises information and operational decisions.','Communication equipment|Keeps security staff connected.','Perimeter control|Protects service and restricted areas.','Event procedure|Defines responsibilities and escalation steps.']
        },
        'plan-securitate': {
            kicker:'Analysis, rules and responsibilities', title:'A clear <em>security plan.</em>', lead:'We turn identified risks into practical guarding rules, responsibilities and response procedures for the property.',
            intro:'The security plan establishes how protection is organised in practice: posts, schedules, patrols, access rules, communications and action in case of an incident.',
            benefits:['Property and activity analysis','Identification of vulnerable areas','Definition of posts and responsibilities','Access and patrol procedures','Incident and escalation rules','Periodic review when needs change'],
            equipment:['Risk assessment|Provides the basis for proportionate measures.','Post instructions|Clarify each guard’s duties and actions.','Access rules|Define how people, vehicles and goods are checked.','Patrol routes|Set the areas and frequency of checks.','Incident procedure|Structures notification and response steps.','Review and adaptation|Keeps the plan aligned with operational changes.']
        }
    };

    function applyService(data) {
        text('.service-kicker', data.kicker); html('.service-hero h1', data.title); text('.service-lead', data.lead);
        text('.service-intro .section-label', 'About the service'); text('.intro-copy>p', data.intro); list('.benefit-list li', data.benefits);
        text('.equipment .section-label', 'Organisation and equipment'); text('.equipment h2', 'What supports the service.');
        text('.equipment-head>p:last-child', 'The final configuration is established after assessing the property and its operational requirements.');
        var cards = data.equipment || []; document.querySelectorAll('.equipment-card').forEach(function (card, i) { var parts=(cards[i] || '|').split('|'); text.call(null, '.nothing', ''); var h=card.querySelector('h3'), p=card.querySelector('p'); if(h)h.textContent=parts[0]; if(p)p.textContent=parts[1]; });
        text('.service-cta h2', 'Tell us what needs protection.'); text('.service-cta a', 'Request an assessment →');
    }
    if (services[page]) applyService(services[page]);

    if (page === 'paza-umana') {
        applyService({kicker:'Professional presence on site',title:'Professional <em>security guarding.</em>',lead:'Trained security personnel protect people, property and daily operations according to clear, property-specific instructions.',intro:'The guarding service is designed around the location, activity, public flow, working hours and identified risks. Guards work according to defined duties and reporting procedures.',benefits:['Trained and licensed security personnel','Access and visitor control','Patrols and vulnerable-area checks','Incident prevention and response','Clear reporting procedures','Integration with technical security systems'],equipment:['Security personnel|Selected and instructed for the assigned property.','Post instructions|Define responsibilities and response procedures.','Communication equipment|Maintains operational contact and coordination.','Patrol planning|Ensures regular checks of sensitive areas.','Event reporting|Records relevant observations and incidents.','Operational supervision|Supports quality and procedural compliance.']});
    }

    if (page === 'contact') {
        text('.contact-eyebrow','We are here to help'); html('.contact-intro h1','Tell us what needs <em>protection.</em>'); text('.contact-lead','Describe the property and the services you need. The Vigilent Security team will review your request and contact you about the next steps.');
        list('.contact-detail small',['Head office','Phone / monitoring centre','Facebook','Email']); text('.contact-map-frame span','Nationwide coverage');
        text('.offer-card h2','Quote request'); text('.offer-card>p','Complete the form and our team will contact you to clarify the property requirements.');
        list('.field>label',['Full name *','Company','Phone','Email','What do you want to protect?','Message / details *']);
        text('.contact-rule','* Complete at least one contact field: phone or email.'); text('.service-choices legend','Services of interest *');
        list('.service-choice-groups>div>strong',['TECHNICAL','GUARDING']);
        var serviceNames=['Monitoring 24/7','Alarm systems','Access control','Fire detection','Vehicle barriers','Mobile intervention teams','Security guards','Property guarding','Event security','Security plan','I am not sure — recommend a solution'];
        document.querySelectorAll('.service-choice-groups label').forEach(function (label, i) {
            var input = label.querySelector('input');
            if (!input || !serviceNames[i]) return;
            input.value = serviceNames[i];
            label.replaceChildren(input, document.createTextNode(' ' + serviceNames[i]));
        });
        text('.privacy span','I agree that the information entered may be used to respond to my request. The data will not be published or sold.');
        text('#offer-submit span','SEND REQUEST'); text('.form-note','Your information is confidential and will only be used to handle your request.');
    }

    if (page === 'acasa') {
        html('.hero h1','We protect what <em>matters.</em>'); text('.hero-copy','Integrated guarding, video surveillance, monitoring and 24/7 intervention services for companies, institutions and properties.');
        text('.hero .eyebrow','NATIONWIDE SECURITY'); text('.hero-actions a','Request a quote →');
        list('.hero-metrics small',['employees','availability','nationwide coverage']); list('.hero-metrics strong',['650+','24/7','Romania']);
        text('#partners-title','PARTNERS WHO TRUST US'); list('.partner-set span',Array(20).fill('PARTNER LOGO')); html('.hero-status','<span class="pulse"></span> AVAILABLE 24 / 7');
        list('.hero-map .map-pin',['Bucharest','Cluj-Napoca','Iași','Timișoara','Drobeta-Turnu Severin','Constanța']);
        text('.solution-builder h2','What do you want to protect?'); text('.services-overview h2','Our services.');
        text('.services-overview-heading .eyebrow','INTEGRATED PROTECTION'); text('.services-overview-heading>p','Technology, monitoring and trained people working together to protect every property.');
        html('#technical-services-title','Technical<br><em>security.</em>'); html('#guard-services-title','Guarding &amp;<br><em>protection.</em>');
        list('.service-group-media>div>span',['COMPANY 01','COMPANY 02']); list('.service-group-media p',['Systems that detect, verify and trigger the appropriate response.','Trained people ready to prevent, observe and act.']);
        list('.service-overview-card h3',['Monitoring 24/7','Alarm systems','Access control','Fire detection','Vehicle barriers','Intervention','Security guards','Property guarding','Event security','Security plan']);
        list('.service-overview-card p',['Signals monitored continuously with a coordinated response.','Fast detection and immediate intrusion warning.','Secure, managed and fully traceable access.','Early warning and integrated systems.','Vehicle flow control and perimeter protection.','Mobile teams ready to respond to alarms.','Trained personnel for prevention, control and response.','Protection adapted to the location and activity.','Access control and on-site flow coordination.','Assessment, strategy and clear procedures for the property.']);
        list('.service-overview-card>a',Array(10).fill('Learn more →')); list('.service-label-tech',Array(6).fill('TECHNICAL')); list('.service-label-guard',Array(4).fill('GUARDING'));
        text('.services-offer p','Do you need several services?'); text('.services-offer a','Build your quote request →');
        html('.home-intervention h2','Ready to <em>respond.</em>'); text('.home-intervention-copy>p:last-of-type','When a system connected to the monitoring centre is triggered, Vigilent mobile teams can be dispatched to verify the situation and apply the established procedures.'); text('.home-intervention-cta','Discover the service  ↗');
        text('.home-intervention .eyebrow','REAL PRESENCE IN THE FIELD'); text('.home-process .eyebrow','HOW WE WORK');
        html('.home-process h2','From a need to a <em>clear solution.</em>'); text('.home-process-head>p:last-child','A straightforward process adapted to the property and its real level of risk.');
        list('.home-process-step h3',['Assess','Design','Implement','Stay close']);
        list('.home-process-step p',['We discuss your needs and analyse the location, flows and vulnerable points.','We establish the services, equipment and procedures suited to the property.','We install the systems or organise the guarding arrangement and verify operation.','We monitor, respond and adapt the solution as needs change.']);
    }
})();
