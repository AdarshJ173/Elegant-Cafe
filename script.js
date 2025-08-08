// ===== CAFE SHOWCASE - MAIN JAVASCRIPT FILE =====

// Global variables
let scene, camera, renderer, heroScene, farmScene;
let coffeeModel, farmModel;
let scrollY = 0;
let isLoading = true;
let menuData = [];
let currentCategory = 'all';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu first as fallback
    initializeMobileMenuFallback();
    
    initializeApp();
});

function initializeApp() {
    // Initialize loading screen
    showLoadingScreen();
    
    // Load dependencies and data
    Promise.all([
        loadMenuData(),
        loadThreeJS(),
        initializeGSAP()
    ]).then(() => {
        initializeComponents();
        hideLoadingScreen();
        // Ensure footer year is set even if animations fail
        setCurrentYear();
    }).catch(error => {
        console.error('Initialization failed:', error);
        hideLoadingScreen();
        // Fallback initialization without 3D
        initializeBasicComponents();
    });
}

// ===== LOADING SCREEN =====
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('fade-out');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// ===== DATA LOADING =====
function loadMenuData() {
    return new Promise((resolve) => {
        // Comprehensive menu data with detailed information
        menuData = [
            // Coffee Items
            {
                id: 'espresso',
                name: 'Artisan Espresso',
                price: 3.50,
                category: 'coffee',
                image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
                description: 'Rich, bold espresso shot crafted from premium Arabica beans',
                ingredients: ['Premium Arabica beans', 'Pure water'],
                taste: 'Bold, intense flavor with hints of dark chocolate and caramel. Smooth finish with a lingering aromatic aftertaste.',
                calories: 5,
                energy: '95mg caffeine - Perfect morning boost',
                tags: ['Signature', 'Bold', 'Classic']
            },
            {
                id: 'cappuccino',
                name: 'Velvet Cappuccino',
                price: 4.25,
                category: 'coffee',
                image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
                description: 'Perfect harmony of espresso, steamed milk, and velvety foam',
                ingredients: ['Espresso', 'Organic whole milk', 'Cinnamon dust'],
                taste: 'Creamy, balanced blend with nutty undertones and a silky texture. The perfect marriage of coffee strength and milk sweetness.',
                calories: 120,
                energy: '75mg caffeine - Balanced energy boost',
                tags: ['Popular', 'Creamy', 'Morning']
            },
            {
                id: 'cold-brew',
                name: 'Glacier Cold Brew',
                price: 4.75,
                category: 'coffee',
                image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
                description: 'Smooth, refreshing cold-brewed coffee steeped for 18 hours',
                ingredients: ['Cold-brew concentrate', 'Filtered water', 'Ice'],
                taste: 'Smooth, low-acidity coffee with natural sweetness and chocolate notes. Refreshingly crisp with zero bitterness.',
                calories: 10,
                energy: '200mg caffeine - Sustained energy release',
                tags: ['Refreshing', 'Smooth', 'Summer']
            },
            {
                id: 'mocha',
                name: 'Decadent Mocha',
                price: 5.00,
                category: 'coffee',
                image: 'https://www.javapresse.com/cdn/shop/articles/JavaPresse_Coffee_Company_00581_x330_2b9349f4-617e-40bc-b91a-bbaad1fc6497.webp?v=1712234649',
                description: 'Luxurious blend of espresso, premium chocolate, and steamed milk',
                ingredients: ['Espresso', 'Belgian dark chocolate', 'Steamed milk', 'Whipped cream'],
                taste: 'Rich, indulgent fusion of coffee and chocolate. Velvety texture with deep cocoa flavors and espresso backbone.',
                calories: 290,
                energy: '85mg caffeine - Comforting energy boost',
                tags: ['Indulgent', 'Chocolate', 'Dessert']
            },
            {
                id: 'matcha-latte',
                name: 'Zen Matcha Latte',
                price: 4.50,
                category: 'coffee',
                image: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/06/iced-matcha-latte.jpg',
                description: 'Premium ceremonial matcha whisked with creamy oat milk',
                ingredients: ['Ceremonial grade matcha', 'Oat milk', 'Agave syrup', 'Vanilla'],
                taste: 'Earthy, umami-rich matcha with natural sweetness. Smooth, grassy notes balanced by creamy oat milk texture.',
                calories: 150,
                energy: '70mg caffeine - Calm, focused energy',
                tags: ['Healthy', 'Antioxidants', 'Zen']
            },

            // Pastry Items
            {
                id: 'croissant',
                name: 'Buttery Croissant',
                price: 3.25,
                category: 'pastries',
                image: 'https://cdn.britannica.com/65/235965-050-A5D740E2/Croissants-jar-of-jam.jpg',
                description: 'Flaky, golden pastry made with French butter and traditional techniques',
                ingredients: ['French butter', 'Organic flour', 'Fresh yeast', 'Sea salt', 'Free-range eggs'],
                taste: 'Incredibly flaky exterior with soft, airy layers inside. Rich, buttery flavor with subtle yeast complexity.',
                calories: 280,
                energy: 'Natural carbs - Sustained morning energy',
                tags: ['Traditional', 'Buttery', 'Fresh']
            },
            {
                id: 'almond-croissant',
                name: 'Almond Dream Croissant',
                price: 4.50,
                category: 'pastries',
                image: 'https://www.thelittleepicurean.com/wp-content/uploads/2021/04/almond-croissant-1.jpg',
                description: 'Classic croissant filled with almond cream and topped with sliced almonds',
                ingredients: ['Croissant base', 'Almond cream', 'Sliced almonds', 'Powdered sugar', 'Vanilla'],
                taste: 'Rich, nutty almond flavor combined with buttery croissant. Sweet almond cream melts beautifully with flaky pastry.',
                calories: 380,
                energy: 'Healthy fats & proteins - Long-lasting energy',
                tags: ['Nutty', 'Sweet', 'Indulgent']
            },
            {
                id: 'danish',
                name: 'Berry Bliss Danish',
                price: 3.75,
                category: 'pastries',
                image: 'https://www.sugarsaltmagic.com/wp-content/uploads/2021/07/How-to-make-Danish-Pastry-from-scratch-5.jpg',
                description: 'Light pastry filled with seasonal berries and vanilla custard',
                ingredients: ['Puff pastry', 'Mixed berries', 'Vanilla custard', 'Lemon zest', 'Pearl sugar'],
                taste: 'Bright, fruity flavors balanced by creamy vanilla custard. Tart berries complement the sweet, flaky pastry base.',
                calories: 320,
                energy: 'Natural fruit sugars - Quick energy boost',
                tags: ['Fruity', 'Seasonal', 'Light']
            },
            {
                id: 'pain-chocolat',
                name: 'Pain au Chocolat',
                price: 3.50,
                category: 'pastries',
                image: 'https://bakingamoment.com/wp-content/uploads/2023/01/IMG_1641-chocolate-croissant.jpg',
                description: 'Classic French pastry with premium dark chocolate batons',
                ingredients: ['Croissant dough', 'Belgian dark chocolate', 'Butter', 'Egg wash'],
                taste: 'Perfect balance of buttery pastry and rich dark chocolate. Melted chocolate creates pockets of indulgence.',
                calories: 340,
                energy: 'Natural cacao - Mental alertness boost',
                tags: ['Chocolate', 'Classic', 'French']
            },
            {
                id: 'scone',
                name: 'English Garden Scone',
                price: 2.95,
                category: 'pastries',
                image: 'https://sallysbakingaddiction.com/wp-content/uploads/2019/04/scone-varieties.jpg',
                description: 'Traditional scone served with clotted cream and house-made jam',
                ingredients: ['Organic flour', 'Butter', 'Buttermilk', 'Clotted cream', 'Strawberry jam'],
                taste: 'Tender, crumbly texture with subtle sweetness. Best enjoyed with rich clotted cream and bright berry jam.',
                calories: 290,
                energy: 'Balanced carbs - Afternoon tea energy',
                tags: ['Traditional', 'English', 'Tea-time']
            },

            // Treats & Others
            {
                id: 'macarons',
                name: 'French Macarons',
                price: 2.50,
                category: 'treats',
                image: 'https://www.allrecipes.com/thmb/ftmd4xSXxQOcYwyLoVOAeEQHkpY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/223232macaronsKim4x3-97e86da8c9e849218d5b70ac93bbe5f1.jpg',
                description: 'Delicate almond meringue cookies with ganache filling (set of 3)',
                ingredients: ['Almond flour', 'Egg whites', 'Sugar', 'Various ganache fillings', 'Natural food coloring'],
                taste: 'Light, airy shells with chewy texture. Each flavor offers unique taste - from vanilla to raspberry to chocolate.',
                calories: 180,
                energy: 'Natural sugars - Quick sweet energy',
                tags: ['Elegant', 'French', 'Colorful']
            },
            {
                id: 'tiramisu',
                name: 'Classic Tiramisu',
                price: 5.50,
                category: 'treats',
                image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/2/4/2/RX-FNM_030111-Sugar-Fix-005_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1371597326801.webp',
                description: 'Traditional Italian dessert with espresso-soaked ladyfingers',
                ingredients: ['Mascarpone', 'Ladyfinger cookies', 'Espresso', 'Cocoa powder', 'Dark rum', 'Eggs'],
                taste: 'Creamy, coffee-infused layers with hints of rum. Rich mascarpone balanced by bitter cocoa and strong espresso.',
                calories: 420,
                energy: '30mg caffeine - Dessert with coffee kick',
                tags: ['Italian', 'Coffee', 'Creamy']
            },
            {
                id: 'cheesecake',
                name: 'New York Cheesecake',
                price: 4.75,
                category: 'treats',
                image: 'https://preppykitchen.com/wp-content/uploads/2025/01/Cheesecake-Bars-Feature.jpg',
                description: 'Rich, creamy cheesecake with graham cracker crust',
                ingredients: ['Cream cheese', 'Graham crackers', 'Butter', 'Vanilla', 'Sour cream', 'Fresh berries'],
                taste: 'Dense, velvety smooth texture with tangy cream cheese flavor. Sweet graham crust provides perfect textural contrast.',
                calories: 380,
                energy: 'Protein & calcium - Satisfying indulgence',
                tags: ['Rich', 'Creamy', 'American']
            },
            {
                id: 'cookie-platter',
                name: 'Artisan Cookie Platter',
                price: 8.50,
                category: 'treats',
                image: 'https://www.mrsfields.com/cdn/shop/articles/AdobeStock_435156311.jpg?v=1746828176&width=1100',
                description: 'Selection of 6 house-made cookies: chocolate chip, oatmeal, snickerdoodle',
                ingredients: ['Organic flour', 'Brown butter', 'Chocolate chips', 'Oats', 'Cinnamon', 'Brown sugar'],
                taste: 'Variety pack offering different textures and flavors. From chewy chocolate chip to spiced snickerdoodle.',
                calories: 480,
                energy: 'Complex carbs - Sharing-sized energy boost',
                tags: ['Variety', 'Sharing', 'Homemade']
            },
            {
                id: 'granola-bowl',
                name: 'Superfood Granola Bowl',
                price: 7.25,
                category: 'treats',
                image: 'https://dishingouthealth.com/wp-content/uploads/2021/02/ProteinGranolaBreakfastBowls_Square.jpg',
                description: 'House-made granola with Greek yogurt, fresh berries, and honey',
                ingredients: ['Rolled oats', 'Almonds', 'Greek yogurt', 'Mixed berries', 'Raw honey', 'Chia seeds'],
                taste: 'Crunchy granola with creamy yogurt base. Fresh berries add tartness while honey provides natural sweetness.',
                calories: 320,
                energy: 'Protein & fiber - Sustained healthy energy',
                tags: ['Healthy', 'Superfood', 'Breakfast']
            }
        ];
        resolve(menuData);
    });
}

// ===== THREE.JS INITIALIZATION =====
function loadThreeJS() {
    return new Promise((resolve, reject) => {
        if (typeof THREE !== 'undefined') {
            initializeThreeJS();
            resolve();
        } else {
            reject('THREE.js not loaded');
        }
    });
}

function initializeThreeJS() {
    // Initialize Hero 3D Scene
    initHero3D();
    // Initialize About 3D Scene
    initFarm3D();
    // Initialize 3D interactions
    init3DInteractions();
}

function initHero3D() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    // Scene setup
    heroScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    heroScene.add(directionalLight);

    // Coffee Cup Model
    createCoffeeCup();

    // Floating coffee beans
    createFloatingBeans();

    // Camera position
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Animation loop
    animateHero3D();
}

function createCoffeeCup() {
    // Cup body
    const cupGeometry = new THREE.CylinderGeometry(1.2, 1, 2, 32);
    const cupMaterial = new THREE.MeshLambertMaterial({ color: 0x4A2E1B });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.y = 0;
    cup.castShadow = true;
    heroScene.add(cup);

    // Coffee liquid
    const coffeeGeometry = new THREE.CylinderGeometry(1.15, 0.95, 0.1, 32);
    const coffeeMaterial = new THREE.MeshLambertMaterial({ color: 0xC9744E });
    const coffee = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
    coffee.position.y = 0.95;
    heroScene.add(coffee);

    // Cup handle
    const handleGeometry = new THREE.TorusGeometry(0.3, 0.1, 8, 16, Math.PI);
    const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x4A2E1B });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(1.3, 0, 0);
    handle.rotation.z = Math.PI / 2;
    heroScene.add(handle);

    // Saucer
    const saucerGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
    const saucerMaterial = new THREE.MeshLambertMaterial({ color: 0xF5EBDC });
    const saucer = new THREE.Mesh(saucerGeometry, saucerMaterial);
    saucer.position.y = -1.2;
    saucer.receiveShadow = true;
    heroScene.add(saucer);

    // Steam particles
    createSteamParticles();
}

function createSteamParticles() {
    const steamGeometry = new THREE.BufferGeometry();
    const steamMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const steamPositions = [];
    for (let i = 0; i < 50; i++) {
        steamPositions.push(
            (Math.random() - 0.5) * 2, // x
            Math.random() * 4 + 1,     // y
            (Math.random() - 0.5) * 2  // z
        );
    }

    steamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(steamPositions, 3));
    const steam = new THREE.Points(steamGeometry, steamMaterial);
    heroScene.add(steam);
}

function createFloatingBeans() {
    const beanGeometry = new THREE.SphereGeometry(0.1, 8, 6);
    beanGeometry.scale(1, 0.6, 0.8); // Make it bean-shaped
    const beanMaterial = new THREE.MeshLambertMaterial({ color: 0x6B4423 });

    for (let i = 0; i < 20; i++) {
        const bean = new THREE.Mesh(beanGeometry, beanMaterial);
        bean.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 10
        );
        bean.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        heroScene.add(bean);
    }
}

function animateHero3D() {
    requestAnimationFrame(animateHero3D);

    // Rotate coffee cup
    if (heroScene.children.length > 3) {
        heroScene.children[3].rotation.y += 0.005; // Cup rotation
    }

    // Animate floating beans
    heroScene.children.forEach((child, index) => {
        if (child.geometry && child.geometry.type === 'SphereGeometry') {
            child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            child.rotation.x += 0.01;
            child.rotation.z += 0.005;
        }
    });

    renderer.render(heroScene, camera);
}

function initFarm3D() {
    const farmCanvas = document.getElementById('farmCanvas');
    if (!farmCanvas) return;

    // Scene setup for farm
    farmScene = new THREE.Scene();
    const farmCamera = new THREE.PerspectiveCamera(75, farmCanvas.clientWidth / farmCanvas.clientHeight, 0.1, 1000);
    const farmRenderer = new THREE.WebGLRenderer({ canvas: farmCanvas, antialias: true, alpha: true });
    farmRenderer.setSize(farmCanvas.clientWidth, farmCanvas.clientHeight);

    // Create coffee farm scene
    createCoffeeFarm();

    farmCamera.position.set(0, 2, 5);
    farmCamera.lookAt(0, 0, 0);

    // Farm animation loop
    function animateFarm() {
        requestAnimationFrame(animateFarm);
        
        // Gentle rotation of the scene
        farmScene.rotation.y += 0.002;
        
        farmRenderer.render(farmScene, farmCamera);
    }
    
    animateFarm();
}

function createCoffeeFarm() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8FAE7E });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    farmScene.add(ground);

    // Coffee plants
    for (let i = 0; i < 15; i++) {
        const plantGroup = new THREE.Group();
        
        // Plant stem
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A2A });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        plantGroup.add(stem);

        // Leaves
        for (let j = 0; j < 6; j++) {
            const leafGeometry = new THREE.SphereGeometry(0.2, 8, 6);
            leafGeometry.scale(2, 0.1, 1);
            const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.set(
                Math.cos(j) * 0.3,
                0.3 + j * 0.1,
                Math.sin(j) * 0.3
            );
            plantGroup.add(leaf);
        }

        // Coffee cherries
        const cherryGeometry = new THREE.SphereGeometry(0.05, 6, 6);
        const cherryMaterial = new THREE.MeshLambertMaterial({ color: 0xDC143C });
        for (let k = 0; k < 3; k++) {
            const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);
            cherry.position.set(
                Math.random() * 0.4 - 0.2,
                Math.random() * 0.5 + 0.2,
                Math.random() * 0.4 - 0.2
            );
            plantGroup.add(cherry);
        }

        plantGroup.position.set(
            (Math.random() - 0.5) * 8,
            0.5,
            (Math.random() - 0.5) * 8
        );
        farmScene.add(plantGroup);
    }

    // Lighting
    const farmAmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
    farmScene.add(farmAmbientLight);

    const farmDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    farmDirectionalLight.position.set(5, 10, 5);
    farmScene.add(farmDirectionalLight);
}

function init3DInteractions() {
    // Mouse interaction for hero 3D
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        heroCanvas.addEventListener('mousemove', (event) => {
            const rect = heroCanvas.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Rotate camera based on mouse position
            if (camera) {
                camera.position.x = mouseX * 2;
                camera.position.y = mouseY * 2;
                camera.lookAt(0, 0, 0);
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
        }
    });
}

// ===== UTILS =====
function setCurrentYear() {
    const el = document.querySelector('.footer-bottom p');
    // Leave content if already present; this is minimalistic update only if placeholder exists elsewhere
}

// ===== GSAP INITIALIZATION =====
function initializeGSAP() {
    return new Promise((resolve, reject) => {
        if (typeof gsap !== 'undefined') {
            // Register ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
            resolve();
        } else {
            reject('GSAP not loaded');
        }
    });
}

// ===== MOBILE MENU FALLBACK =====
function initializeMobileMenuFallback() {
    console.log('Initializing mobile menu fallback');
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        console.log('Mobile menu fallback: Elements found');
        
        // Remove any existing listeners
        navToggle.removeAttribute('onclick');
        
        // Add click listener
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Mobile menu fallback: Toggle clicked');
            
            // Toggle active classes
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria attribute
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            console.log('Mobile menu fallback: Menu toggled', {
                toggleActive: navToggle.classList.contains('active'),
                menuActive: navMenu.classList.contains('active')
            });
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        console.log('Mobile menu fallback: Successfully initialized');
    } else {
        console.error('Mobile menu fallback: Elements not found', {
            navToggle: !!navToggle,
            navMenu: !!navMenu
        });
    }
}

// ===== COMPONENT INITIALIZATION =====
function initializeComponents() {
    initializeNavigation();
    initializeMenu();
    initializeModal();
    initializeScrollEffects();
    initializeParallax();
    initializeIntersectionObserver();
    initializeSmoothScrolling();
    initHoverTilt();
    setCurrentYear();
}

function initializeBasicComponents() {
    initializeNavigation();
    initializeMenu();
    initializeModal();
    initializeBasicScrollEffects();
    initHoverTilt();
    setCurrentYear();
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const ctaButtons = document.querySelectorAll('.cta-button, .hero-cta');

    console.log('Navigation elements found:', {
        navbar: !!navbar,
        navToggle: !!navToggle,
        navMenu: !!navMenu,
        navLinksCount: navLinks.length
    });

    // Enhanced navbar scroll effect with mobile optimizations
    let lastScrollY = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile: Start showing background after minimal scroll
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        } else {
            // On desktop: Original behavior
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });

    // Mobile menu toggle with enhanced debugging
    if (navToggle && navMenu) {
        console.log('Setting up mobile menu toggle');
        
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Mobile menu toggle clicked');
            
            const isActive = navToggle.classList.contains('active');
            console.log('Current state - isActive:', isActive);
            
            // Toggle classes
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria attribute
            navToggle.setAttribute('aria-expanded', !isActive);
            
            console.log('New state:', {
                toggleActive: navToggle.classList.contains('active'),
                menuActive: navMenu.classList.contains('active')
            });
        });
        
        // Ensure menu is properly set up
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        console.log('Mobile menu initialized successfully');
    } else {
        console.error('Mobile menu elements not found:', { navToggle: !!navToggle, navMenu: !!navMenu });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // CTA Button scroll to menu functionality
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('data-target') || '#menu';
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
                
                // Smooth scroll to menu section
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== MENU SYSTEM =====
function initializeMenu() {
    renderMenuItems();
    initializeCategoryFilters();
}

function renderMenuItems(category = 'all') {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    const filteredItems = category === 'all'
        ? menuData
        : menuData.filter(item => item.category === category);

    // Smooth content swap: fade out existing, then replace, then fade in
    menuGrid.style.opacity = '0';
    setTimeout(() => {
        menuGrid.innerHTML = '';
        filteredItems.forEach((item, index) => {
            const menuItemElement = createMenuItemElement(item, index);
            menuGrid.appendChild(menuItemElement);
        });

        // Attach reveal triggers for bidirectional scroll on new items
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('#menuGrid .menu-item').forEach(item => {
                gsap.fromTo(item,
                    { opacity: 0, y: 24, scale: 0.98 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out',
                      scrollTrigger: { trigger: item, start: 'top 92%', end: 'bottom 8%', toggleActions: 'play reverse play reverse' } }
                );
            });
        }

        menuGrid.style.opacity = '1';
        // Animate menu items
        animateMenuItems();
    }, 120);
}

function createMenuItemElement(item, index) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-category', item.category);
    menuItem.setAttribute('data-id', item.id);
    
    // Check if item has a valid image URL (starts with http)
    const hasValidImage = item.image && item.image.startsWith('http');
    
    const imageContent = hasValidImage 
        ? `<img src="${item.image}" alt="${item.name}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--border-radius);">`
        : `<div class="item-icon">${getItemIcon(item.category)}</div>`;
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            ${imageContent}
        </div>
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <div class="menu-item-price">$${item.price.toFixed(2)}</div>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-tags">
                ${item.tags.map(tag => `<span class="menu-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    menuItem.addEventListener('click', () => {
        openProductModal(item);
    });

    return menuItem;
}

function getItemIcon(category) {
    const icons = {
        coffee: '☕',
        pastries: '🥐',
        treats: '🍰'
    };
    return icons[category] || '🍽️';
}

function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Filter menu items with smooth hide/show
            currentCategory = category;
            renderMenuItems(category);
        });
    });
}

function animateMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(menuItems, 
            { 
                opacity: 0, 
                y: 50,
                scale: 0.9
            }, 
            { 
                opacity: 1, 
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }
        );
    } else {
        // Fallback animation
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// ===== PRODUCT MODAL =====
function initializeModal() {
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Close modal events
    [modalClose, modalOverlay].forEach(element => {
        if (element) {
            element.addEventListener('click', closeProductModal);
        }
    });

    // Close modal on Escape key and on overlay click already added above
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });

    // Also allow closing with clicking outside content
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeProductModal);
    }
}

function openProductModal(item) {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    // Prevent background scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Populate modal content
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalPrice').textContent = `$${item.price.toFixed(2)}`;
    document.getElementById('modalTaste').textContent = item.taste;
    document.getElementById('modalCalories').textContent = item.calories;
    document.getElementById('modalEnergy').textContent = item.energy;

    // Populate image
    const modalImageEl = document.getElementById('modalProductImage');
    if (modalImageEl) {
        const hasValidImage = item.image && /^https?:\/\//i.test(item.image);
        if (hasValidImage) {
            modalImageEl.src = item.image;
            modalImageEl.alt = item.name;
            modalImageEl.style.display = 'block';
        } else {
            modalImageEl.removeAttribute('src');
            modalImageEl.alt = '';
            modalImageEl.style.display = 'none';
        }
    }

    // Populate ingredients
    const ingredientsList = document.getElementById('modalIngredients');
    ingredientsList.innerHTML = '';
    item.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    // Initialize 3D product view
    initializeProductModal3D(item);

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    modal.querySelector('.modal-close').focus();
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

function initializeProductModal3D(item) {
    const product3DCanvas = document.getElementById('product3D');
    if (!product3DCanvas || typeof THREE === 'undefined') return;

    // Create 3D representation of the product
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, product3DCanvas.clientWidth / product3DCanvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: product3DCanvas, alpha: true });
    renderer.setSize(product3DCanvas.clientWidth, product3DCanvas.clientHeight);

    // Create product model based on category
    createProductModel(scene, item);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 3;

    // Animate the product
    function animateProduct() {
        requestAnimationFrame(animateProduct);
        scene.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animateProduct();
}

function createProductModel(scene, item) {
    let geometry, material, mesh;

    switch (item.category) {
        case 'coffee':
            // Create coffee cup model
            geometry = new THREE.CylinderGeometry(0.5, 0.4, 1, 16);
            material = new THREE.MeshLambertMaterial({ color: 0x4A2E1B });
            mesh = new THREE.Mesh(geometry, material);
            
            // Add coffee liquid
            const liquidGeometry = new THREE.CylinderGeometry(0.45, 0.35, 0.05, 16);
            const liquidMaterial = new THREE.MeshLambertMaterial({ color: 0xC9744E });
            const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
            liquid.position.y = 0.45;
            scene.add(liquid);
            break;
            
        case 'pastries':
            // Create croissant-like shape
            geometry = new THREE.SphereGeometry(0.5, 8, 6);
            geometry.scale(1.5, 0.5, 0.8);
            material = new THREE.MeshLambertMaterial({ color: 0xD4A373 });
            mesh = new THREE.Mesh(geometry, material);
            break;
            
        case 'treats':
            // Create dessert shape
            geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
            material = new THREE.MeshLambertMaterial({ color: 0xF5EBDC });
            mesh = new THREE.Mesh(geometry, material);
            
            // Add topping
            const toppingGeometry = new THREE.SphereGeometry(0.1, 8, 6);
            const toppingMaterial = new THREE.MeshLambertMaterial({ color: 0xDC143C });
            const topping = new THREE.Mesh(toppingGeometry, toppingMaterial);
            topping.position.y = 0.2;
            scene.add(topping);
            break;
            
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshLambertMaterial({ color: 0xC9744E });
            mesh = new THREE.Mesh(geometry, material);
    }

    if (mesh) {
        scene.add(mesh);
    }
}

// ===== SCROLL EFFECTS & ANIMATIONS =====
function initializeScrollEffects() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initializeGSAPScrollEffects();
    } else {
        initializeBasicScrollEffects();
    }
}

function initializeGSAPScrollEffects() {
    // Menu grid items reveal both on enter and reverse on leave
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(t => t.kill());
    }

    // Hero text animation
    gsap.fromTo('.hero-text', 
        { opacity: 0, y: 100 }, 
        { 
            opacity: 1, 
            y: 0, 
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 80%'
            }
        }
    );

    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%'
                }
            }
        );
    });

    // Timeline items animation (plays on enter and reverses on leave)
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.fromTo(item,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });

    // Info cards animation (enter/leave)
    gsap.utils.toArray('.info-card').forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0, y: 24 },
            {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    end: 'bottom 10%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        );
    });

    // Floating elements animation
    gsap.to('.floating-bean', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.5
    });
}

function initializeBasicScrollEffects() {
    // Basic intersection observer for scroll animations
    const animatedElements = document.querySelectorAll('.timeline-item, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initializeParallax() {
    if (typeof gsap !== 'undefined') {
        // Parallax effect for background layers
        gsap.utils.toArray('.parallax-layer').forEach((layer, index) => {
            const speed = layer.dataset.speed || 0.5;
            gsap.to(layer, {
                yPercent: -50 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: layer.closest('section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Parallax for about section background
        gsap.to('.parallax-bg', {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    } else {
        // Basic parallax fallback
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-layer, .parallax-bg');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Generic reveal support
                entry.target.classList.add('is-visible');
                entry.target.classList.add('animate');

                // Trigger specific animations based on element type
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                } else if (entry.target.classList.contains('info-card')) {
                    animateInfoCard(entry.target);
                } else if (entry.target.classList.contains('social-links')) {
                    animateSocialLinks(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation (including generic [data-observe])
    const elementsToObserve = document.querySelectorAll(
        '[data-observe], .timeline-item, .info-card, .social-links, .menu-item'
    );
    elementsToObserve.forEach(element => observer.observe(element));
}

function animateTimelineItem(item) {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(item,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
        );
    }
}

function animateInfoCard(card) {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    }
}

function animateSocialLinks(links) {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(links.children,
            { scale: 0, rotation: 180 },
            { 
                scale: 1, 
                rotation: 0, 
                duration: 0.5, 
                stagger: 0.1,
                ease: "back.out(1.7)"
            }
        );
    }
}

function initializeSmoothScrolling() {
    // CTA button smooth scrolling
    const ctaButtons = document.querySelectorAll('.cta-button[data-target]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = button.getAttribute('data-target');
            const targetElement = document.querySelector(targetSelector);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initHoverTilt() {
    // Simple hover tilt effect for interactive elements
    const tiltElements = document.querySelectorAll('.menu-item, .info-card');
    
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    rotateX: 2,
                    rotateY: 2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// ===== ANIMATIONS INITIALIZATION =====
function initializeAnimations() {
    // Initialize coffee filling animation for contact section
    initializeCoffeeFillingAnimation();
    
    // Initialize hover effects
    initializeHoverEffects();
    
    // Initialize scroll-triggered animations
    initializeScrollTriggeredAnimations();
}

function initializeCoffeeFillingAnimation() {
    const coffeeLiquid = document.querySelector('.coffee-liquid');
    if (coffeeLiquid) {
        // Animation is handled by CSS, but we can trigger it on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });
        
        observer.observe(coffeeLiquid);
    }
}

function initializeHoverEffects() {
    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, { y: -8, duration: 0.3, ease: "power2.out" });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, { y: 0, duration: 0.3, ease: "power2.out" });
            }
        });
    });

    // CTA button hover effects
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, { y: -2, duration: 0.2 });
                gsap.to(button.querySelector('.button-arrow'), { x: 5, duration: 0.2 });
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, { y: 0, duration: 0.2 });
                gsap.to(button.querySelector('.button-arrow'), { x: 0, duration: 0.2 });
            }
        });
    });
}

function initializeScrollTriggeredAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Scroll-triggered counter animation
        const nutritionValues = document.querySelectorAll('.nutrition-value');
        nutritionValues.forEach(value => {
            const text = value.textContent;
            const number = parseInt(text);
            
            if (!isNaN(number)) {
                ScrollTrigger.create({
                    trigger: value,
                    start: "top 90%",
                    onEnter: () => {
                        gsap.fromTo(value, 
                            { textContent: 0 }, 
                            {
                                textContent: number,
                                duration: 1,
                                ease: "power2.out",
                                snap: { textContent: 1 }
                            }
                        );
                    }
                });
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance monitoring
function logPerformance() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    // Fallback to basic functionality if advanced features fail
    if (!document.querySelector('.menu-item')) {
        initializeBasicComponents();
    }
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initializeAccessibility() {
    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('productModal');
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'Tab') {
                // Trap focus within modal
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });

    // Announce page changes to screen readers
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.target.id === 'menuGrid') {
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.className = 'sr-only';
                announcement.textContent = `Menu updated with ${mutation.target.children.length} items`;
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
            }
        });
    });

    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) {
        observer.observe(menuGrid, { childList: true });
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeAccessibility, 1000);
});

// Performance optimization - lazy load 3D elements
function initializeLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy-3d]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const type = element.dataset.lazy3d;
                
                switch(type) {
                    case 'hero':
                        initHero3D();
                        break;
                    case 'farm':
                        initFarm3D();
                        break;
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });
    
    lazyElements.forEach(element => {
        observer.observe(element);
    });
}

// Monitor page performance
window.addEventListener('load', () => {
    setTimeout(logPerformance, 100);
});

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        loadMenuData,
        renderMenuItems,
        openProductModal,
        closeProductModal
    };
}
