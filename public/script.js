/* ============================= */
/* Lógica General del Sitio (V1.9 - CORRECCIÓN FORMULARIO Y LOGOS)
/* ============================= */

// --- Variables Globales de Firebase ---
let db, auth, storage;

/**
 * Función que se ejecuta cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- Inicializar Íconos Lucide ---
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // --- DOM helpers ---
    const qs = (s) => document.querySelector(s);
    const qsa = (s) => document.querySelectorAll(s);

    // --- Footer: Año actual ---
    const yearSpan = qs('#year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth scroll para links internos ---
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;

        const href = a.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const tgt = document.querySelector(href);
            if (tgt) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = tgt.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.warn('Error en smooth scroll:', error);
        }
    });

    // --- Menú Hamburguesa (Corregido) ---
    const hamburger = qs('#hamburger');
    const mainNav = qs('#mainNav > ul');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            hamburger.classList.toggle('open');
        });

        mainNav.addEventListener('click', (ev) => {
            const link = ev.target.closest('a');
            if (!link) return;

            if (link.classList.contains('dropbtn') && window.innerWidth <= 768) {
                ev.preventDefault();
                return;
            }

            mainNav.classList.remove('open');
            hamburger.classList.remove('open');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mainNav.classList.remove('open');
                hamburger.classList.remove('open');
            }
        });
    }

    // --- Lógica del Selector de Idioma ---
    const langButtons = qsa('.lang-btn');
    const translatableElements = qsa('[data-es]');
    const placeholderElements = qsa('[placeholder-es]');

    const setLanguage = (lang) => {
        translatableElements.forEach(el => {
            el.textContent = el.dataset[lang];
        });
        placeholderElements.forEach(el => {
            el.placeholder = el.getAttribute(`placeholder-${lang}`);
        });
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
    };

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            setLanguage(lang);
        });
    });

    const savedLang = localStorage.getItem('lang') || 'es';
    setLanguage(savedLang);

    // --- Lógica Botón "Volver Arriba" ---
    const scrollToTopBtn = qs('#scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
    }

    // --- Resaltado de Navegación al hacer Scroll ---
    const sections = qsa('section[id]');
    const navLinks = qsa('#mainNav ul li a');
    const solutionSections = ['agentes', 'casos-de-uso', 'proceso'];

    if (sections.length > 0 && navLinks.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    let activeLinkHref = `#${id}`;

                    if (solutionSections.includes(id)) {
                        activeLinkHref = '#agentes';
                    }

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const linkHref = link.getAttribute('href');
                        if (linkHref && linkHref.startsWith('#') && linkHref === activeLinkHref) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-30% 0px -70% 0px' });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // --- Control del menú desplegable con CLICK (Corregido) ---
    if (dropdown && dropdownBtn && dropdownContent) {

        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // --- INICIO DE LA CORRECCIÓN ---
            // 1. Obtenemos el target del scroll (el href del botón)
            const href = dropdownBtn.getAttribute('href');
            const tgt = document.querySelector(href);

            // 2. Hacemos el scroll manualmente
            if (tgt) {
                const headerOffset = 70;
                const elementPosition = tgt.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'auto'
                });
            }
            // --- FIN DE LA CORRECCIÓN ---

            // Lógica existente para abrir/cerrar el menú
            const isVisible = dropdownContent.style.display === 'block';
            if (isVisible) {
                // ... (código para cerrar) ...
            } else {
                // Abrir
                dropdownContent.style.display = 'block';
                // Forzar reflow
                dropdownContent.offsetHeight;
                dropdownContent.style.opacity = '1';
                dropdownContent.style.transform = 'translateY(0)';
            }
        });

        // Cerrar menú al hacer clic en cualquier link del menú
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                dropdownContent.style.opacity = '0';
                dropdownContent.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    dropdownContent.style.display = 'none';
                }, 200);
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                if (dropdownContent.style.display === 'block') {
                    dropdownContent.style.opacity = '0';
                    dropdownContent.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        dropdownContent.style.display = 'none';
                    }, 200);
                }
            }
        });

        // BONUS: Añadir indicador visual de que es clickeable
        dropdownBtn.style.cursor = 'pointer';
    }

    // *** CORRECCIÓN CRÍTICA: Configurar el formulario INMEDIATAMENTE ***
    setupContactForm();

    // --- FUNCIÓN DE INICIALIZACIÓN DE FIREBASE ---
    const checkFirebase = () => {
        if (typeof firebase !== 'undefined' && firebase.app && typeof firebaseConfig !== 'undefined' && firebase.firestore) {
            initializeFirebase();
        } else {
            setTimeout(checkFirebase, 100);
        }
    };

    function initializeFirebase() {
        if (firebase.apps.length > 0) {
            return; // Evitar doble inicialización
        }
        firebase.initializeApp(firebaseConfig);

        // --- INICIALIZAR SERVICIOS GLOBALES ---
        db = firebase.firestore();

        // --- LÓGICA DEL PORTAL DE CLIENTES (SI EXISTE) ---
        if (document.getElementById('login-form')) {
            if (firebase.auth && firebase.storage) {
                auth = firebase.auth();
                storage = firebase.storage();
                setupClientPortal(auth, storage);
            } else {
                console.error("No se pudieron cargar los SDK de Auth o Storage para el portal.");
            }
        }
    }

    // --- EJECUTAR INICIALIZACIÓN ---
    checkFirebase();

}); // Fin del DOMContentLoaded

/* ============================= */
/* Lógica del Formulario de Contacto (AHORA CON PROMISE)
/* ============================= */
function setupContactForm() {
    const qs = (s) => document.querySelector(s);
    const contactForm = qs('#contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const name = qs('#name').value.trim();
        const email = qs('#email').value.trim();
        const message = qs('#message').value.trim();
        const feedback = qs('#contactFeedback');
        const currentLang = localStorage.getItem('lang') || 'es';

        feedback.textContent = '';

        const msgs = {
            es: {
                fill: 'Por favor completá todos los campos.',
                email: 'Ingresá un email válido.',
                success: '¡Mensaje enviado! Gracias por contactarte.',
                error: 'Error: No se pudo enviar el mensaje. Intenta de nuevo.',
                waiting: 'Iniciando conexión...'
            },
            en: {
                fill: 'Please fill in all fields.',
                email: 'Please enter a valid email.',
                success: 'Message sent! Thank you for getting in touch.',
                error: 'Error: Could not send message. Please try again.',
                waiting: 'Connecting...'
            }
        };

        // Validaciones básicas
        if (!name || !email || !message) {
            feedback.style.color = 'var(--color-error)';
            feedback.textContent = msgs[currentLang].fill;
            submitButton.disabled = false;
            return;
        }

        const re = /\S+@\S+\.\S+/;
        if (!re.test(email)) {
            feedback.style.color = 'var(--color-error)';
            feedback.textContent = msgs[currentLang].email;
            submitButton.disabled = false;
            return;
        }

        // *** CORRECCIÓN: Esperar a que 'db' esté listo ***
        const waitForDB = () => {
            return new Promise((resolve, reject) => {
                if (db) {
                    resolve();
                } else {
                    feedback.style.color = 'var(--color-texto-secundario)';
                    feedback.textContent = msgs[currentLang].waiting;

                    let attempts = 0;
                    const checkDB = setInterval(() => {
                        attempts++;
                        if (db) {
                            clearInterval(checkDB);
                            resolve();
                        } else if (attempts > 50) { // 5 segundos máximo
                            clearInterval(checkDB);
                            reject(new Error('Firebase timeout'));
                        }
                    }, 100);
                }
            });
        };

        // Enviar datos a Firestore
        waitForDB()
            .then(() => {
                return db.collection("mensajes_contacto").add({
                    nombre: name,
                    email: email,
                    mensaje: message,
                    fecha: new Date()
                });
            })
            .then(() => {
                feedback.style.color = 'var(--color-exito)';
                feedback.textContent = msgs[currentLang].success;
                contactForm.reset();
                submitButton.disabled = false;
            })
            .catch((error) => {
                console.error("Error al guardar mensaje en Firestore: ", error);
                feedback.style.color = 'var(--color-error)';
                feedback.textContent = msgs[currentLang].error;
                submitButton.disabled = false;
            });
    });
}

/* ============================= */
/* Lógica del Portal de Clientes (Firebase)
/* (Refactorizada en su propia función)
/* ============================= */
function setupClientPortal(auth, storage) {

    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const clientPortal = document.getElementById('client-portal');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadResult = document.getElementById('uploadResult');
    const fileList = document.getElementById('fileList');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    auth.onAuthStateChanged(user => {
        if (user) {
            loginForm.classList.add('hidden');
            clientPortal.classList.remove('hidden');
        } else {
            loginForm.classList.remove('hidden');
            clientPortal.classList.add('hidden');
        }
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            const currentLang = localStorage.getItem('lang') || 'es';

            loginError.style.color = 'var(--color-error)';

            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    loginForm.classList.add('hidden');
                    clientPortal.classList.remove('hidden');
                    loginError.textContent = '';
                })
                .catch(error => {
                    console.error("Error de login:", error.code, error.message);
                    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                        loginError.textContent = (currentLang === 'es') ? 'Email o contraseña incorrectos.' : 'Incorrect email or password.';
                    } else {
                        loginError.textContent = (currentLang === 'es') ? 'Error al iniciar sesión.' : 'Error logging in.';
                    }
                });
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();

            const email = emailInput.value;
            const currentLang = localStorage.getItem('lang') || 'es';

            if (!email) {
                loginError.style.color = 'var(--color-error)';
                loginError.textContent = (currentLang === 'es') ? 'Por favor, ingresá tu email primero.' : 'Please enter your email address first.';
                return;
            }

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    loginError.style.color = 'var(--color-exito)';
                    loginError.textContent = (currentLang === 'es') ? '¡Revisá tu correo! Te enviamos un enlace para cambiar la contraseña.' : 'Check your email! We sent you a password reset link.';
                })
                .catch(error => {
                    console.error("Error al enviar email:", error);
                    loginError.style.color = 'var(--color-error)';
                    loginError.textContent = (currentLang === 'es') ? 'Error: No se pudo enviar el email. Verificá que esté bien escrito.' : 'Error: Could not send email. Verify it is correct.';
                });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut();
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const files = fileInput.files;
            const currentLang = localStorage.getItem('lang') || 'es';

            if (!files.length) {
                alert((currentLang === 'es') ? 'Seleccioná al menos un archivo.' : 'Please select at least one file.');
                return;
            }

            const user = auth.currentUser;
            if (!user) {
                alert((currentLang === 'es') ? 'Error: No estás autenticado.' : 'Error: You are not authenticated.');
                return;
            }

            const userId = user.uid;
            uploadResult.innerHTML = '';
            uploadProgress.value = 0;

            Array.from(files).forEach(file => {
                const storageRef = storage.ref(`${userId}/${file.name}`);
                const uploadTask = storageRef.put(file);

                uploadTask.on('state_changed',
                    snapshot => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        uploadProgress.value = progress;
                    },
                    error => {
                        console.error("Error de subida:", error);
                        uploadResult.innerHTML += `<p style="color:var(--color-error);">Error: ${error.message}</p>`;
                    },
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then(url => {
                            const successMsg = (currentLang === 'es') ? 'Archivo subido:' : 'File uploaded:';
                            uploadResult.innerHTML += `<p style="color:var(--color-exito);">${successMsg} <a href="${url}" target="_blank">${file.name}</a></p>`;
                        });
                    }
                );
            });

            fileInput.value = null;
            fileList.textContent = (currentLang === 'es') ? 'No hay archivos seleccionados.' : 'No files selected.';
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            const currentLang = localStorage.getItem('lang') || 'es';

            if (!files.length) {
                fileList.textContent = (currentLang === 'es') ? 'No hay archivos seleccionados.' : 'No files selected.';
                return;
            }

            let fileNames = Array.from(files).map(f => f.name).join('<br>');
            fileList.innerHTML = fileNames;
        });
    }
}