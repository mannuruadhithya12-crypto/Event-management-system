const fs = require('fs');

try {
    if (fs.existsSync('backend.log')) {
        const data = fs.readFileSync('backend.log', 'utf8');
        console.log("--- Backend Log Tail ---");
        console.log(data.slice(-5000));
    }
} catch (err) {
    console.error("Error:", err);
}
