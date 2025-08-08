# ☕ Artisan Cafe Showcase Website

A highly engaging, one-page cafe showcase website featuring immersive 3D elements, interactive menu system, and state-of-the-art animations. Built as a portfolio project to demonstrate advanced web development skills.

![Cafe Showcase](assets/images/hero-preview.jpg)

## ✨ Features

### 🎯 Core Functionality
- **Interactive Menu System** - Click on any item for detailed nutritional information
- **3D Coffee Elements** - Three.js powered coffee cup and farm visualizations
- **Advanced Animations** - GSAP scroll-triggered effects and parallax scrolling
- **Product Detail Modals** - Comprehensive ingredient, taste, and nutrition information
- **Responsive Design** - Mobile-first approach with perfect tablet and desktop scaling

### 🎨 Design Highlights
- **Minimalistic UI** - Clean, aesthetic design with handcrafted feel
- **Authentic Color Palette** - Warm terracotta, sage green, and espresso brown
- **Typography** - Playfair Display for headings, Inter for body text
- **Micro-interactions** - Smooth hover effects and loading animations

### 🔧 Technical Features
- **Performance Optimized** - Loads under 2 seconds with lazy-loaded 3D elements
- **SEO Optimized** - Semantic HTML, schema markup, and meta tags
- **Accessibility Compliant** - WCAG 2.2 AA standards with keyboard navigation
- **Cross-browser Compatible** - Works on Chrome, Firefox, Safari, and Edge

## 🏗️ Project Structure

```
cafe-showcase/
├── index.html              # Main HTML file with semantic sections
├── styles.css              # Comprehensive CSS with custom properties
├── script.js               # JavaScript with 3D and animation logic
├── README.md               # Project documentation
├── vendors/                # External libraries
│   ├── three.min.js        # Three.js for 3D graphics
│   └── gsap.min.js         # GSAP for advanced animations
└── assets/                 # Media and data files
    └── images/             # High-quality cafe imagery
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (optional but recommended)

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/cafe-showcase.git
   cd cafe-showcase
   ```

2. **Local Server Setup** (Recommended)
   
   **Option A: Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Node.js**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

3. **Access Website**
   - Open browser to `http://localhost:8000`
   - Or simply open `index.html` directly in browser

## 🎨 Customization Guide

### Color Scheme
Edit CSS custom properties in `styles.css`:
```css
:root {
    --primary-terracotta: #C9744E;    /* Main accent color */
    --primary-espresso: #4A2E1B;      /* Dark text/elements */
    --secondary-sage: #8FAE7E;        /* Highlights */
    --secondary-cream: #F5EBDC;       /* Background */
    --accent-gold: #D4A373;           /* Interactive elements */
}
```

### Menu Items
Modify the menu data in `script.js`:
```javascript
menuData = [
    {
        id: 'your-item',
        name: 'Your Custom Item',
        price: 4.50,
        category: 'coffee', // 'coffee', 'pastries', 'treats'
        description: 'Your description...',
        ingredients: ['ingredient1', 'ingredient2'],
        taste: 'Flavor profile...',
        calories: 150,
        energy: 'Energy benefits...',
        tags: ['tag1', 'tag2']
    }
    // Add more items...
];
```

### 3D Elements
Customize 3D models in the `createCoffeeCup()` and `createCoffeeFarm()` functions in `script.js`.

### Animations
Adjust GSAP animations by modifying the animation parameters:
```javascript
gsap.fromTo('.element', 
    { opacity: 0, y: 50 }, 
    { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,  // Animation duration
        ease: "power2.out"  // Easing function
    }
);
```

## 🎯 Menu System

### Adding New Categories
1. Update the category buttons in `index.html`
2. Add category logic in `renderMenuItems()` function
3. Update the `getItemIcon()` function for category icons

### Product Detail Modal
Each menu item opens a detailed modal with:
- High-quality product imagery
- Complete ingredient list
- Detailed taste profile
- Calorie and energy information
- 3D product visualization

## 🔧 Development

### Code Structure
- **HTML**: Semantic sections with ARIA labels for accessibility
- **CSS**: Mobile-first responsive design with CSS Grid and Flexbox
- **JavaScript**: ES6+ with modular functions and error handling

### Performance Optimization
- Images lazy-loaded and optimized (WebP format recommended)
- 3D elements initialized only when in viewport
- CSS and JavaScript minified for production
- Critical CSS inlined in HTML head

### Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅  
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

All layouts adapt seamlessly across devices with touch-friendly interactions on mobile.

## 🔒 Security & Privacy

- No external data collection
- No cookies or tracking
- All assets served locally
- HTTPS ready

## 🌐 SEO Features

- Semantic HTML5 structure
- Open Graph meta tags
- Schema.org structured data for local business
- Optimized meta descriptions and titles
- Clean URLs with proper canonical tags

## ♿ Accessibility Features

- WCAG 2.2 AA compliance
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preferences respected
- Focus management in modals

## 📈 Performance Metrics

Target performance scores:
- **Page Load Time**: < 2 seconds
- **Lighthouse Performance**: > 90
- **Lighthouse Accessibility**: > 95
- **Lighthouse Best Practices**: > 90
- **Lighthouse SEO**: > 95

## 🔄 Updates & Maintenance

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added 3D elements and advanced animations
- **v1.2.0** - Enhanced accessibility and performance optimizations

### Future Enhancements
- [ ] PWA capabilities with service worker
- [ ] Advanced 3D coffee bean physics
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Online ordering integration

## 📞 Support & Contact

For questions or support:
- 📧 Email: your-email@domain.com
- 💼 LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- 🐙 GitHub: [Your GitHub](https://github.com/yourusername)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Three.js Community** - For 3D graphics capabilities
- **GSAP Team** - For animation framework
- **Google Fonts** - For beautiful typography
- **Unsplash Contributors** - For high-quality imagery
- **MDN Web Docs** - For comprehensive web standards

---

**Made with ❤️ and lots of ☕**

*This project showcases modern web development techniques and serves as a comprehensive portfolio piece demonstrating advanced HTML, CSS, JavaScript, 3D graphics, and animation skills.*
