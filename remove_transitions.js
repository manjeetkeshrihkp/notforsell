const fs = require('fs');

const files = ['c:/gravity/index.html', 'c:/gravity/shop.html', 'c:/gravity/wishlist.html', 'c:/gravity/profile.html', 'c:/gravity/admin.html', 'c:/gravity/creator.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Remove opacity: 0; animation: pageFadeIn... from body { ... }
    content = content.replace(/body\s*\{([^}]*)opacity:\s*0;\s*animation:\s*pageFadeIn[^;]*;\s*([^}]*)\}/g, 'body { $1$2}');
    
    // Sometimes it might not have the semicolon or exact formatting:
    content = content.replace(/opacity:\s*0;\s*animation:\s*pageFadeIn[^;]*;/g, '');
    
    // 2. Remove body.fade-out and keyframes
    content = content.replace(/body\.fade-out\s*\{[^}]*\}/g, '');
    content = content.replace(/@keyframes\s*pageFadeIn\s*\{[^}]*\}/g, '');
    content = content.replace(/@keyframes\s*pageFadeOut\s*\{[^}]*\}/g, '');

    // Clean up empty lines created by removing the above blocks (optional, but good for tidiness)
    content = content.replace(/^\s*[\r\n]/gm, '\n');

    // Also remove the JavaScript that adds fade-out class just in case
    content = content.replace(/document\.body\.classList\.add\('fade-out'\);\s*/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Removed transitions from ' + file);
    }
});
