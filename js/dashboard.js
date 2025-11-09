// <CHANGE> Complete rewrite with page navigation and real chart functionality

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.querySelector('.theme-toggle');
const searchBtn = document.querySelector('.search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let currentPage = 'dashboard';
let currentPeriod = '30d';
let currentAngle = 109.9;
let targetAngle = 121.9;

// Page Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        showPage(page);
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        sidebar.classList.remove('active');
    });
});

function showPage(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
        pageTitle.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        currentPage = pageName;
    }
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
        sidebar.classList.remove('active');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Search Functionality
searchBtn.addEventListener('click', () => {
    alert('Search functionality - enter your query');
});

// <CHANGE> Real Energy Circle Chart
function drawEnergyCircle() {
    const canvas = document.getElementById('energyCircle');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e5e7eb';
    ctx.fill();

    // Draw progress (animated)
    const progress = 0.85; // 85% of 10 kWh = 8.5 kWh
    const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    gradient.addColorStop(0, '#f97316');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#ef4444');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 16;
    ctx.stroke();

    // Draw center text
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('8.5', centerX, centerY - 10);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('kWh', centerX, centerY + 15);
}

// <CHANGE> Hourly Production Mini Chart
function drawHourlyChart() {
    const canvas = document.getElementById('hourlyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;

    // Sample data - hourly production
    const data = [0.5, 1.2, 2.1, 3.2, 4.1, 4.8, 5.2, 4.9, 4.2, 3.1, 1.8, 0.6];
    const maxValue = Math.max(...data);
    const pointSpacing = (width - padding * 2) / (data.length - 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        const y = (height / 3) * i + padding;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        ctx.lineTo(x, y);
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#3b82f6';
    data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// <CHANGE> Real Analytics Chart
function drawAnalyticsChart(period = '30d') {
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Generate data based on period
    let data = [];
    if (period === '7d') {
        data = [35, 42, 38, 45, 52, 48, 55];
    } else if (period === '30d') {
        data = [32, 38, 42, 35, 48, 45, 50, 52, 55, 48, 42, 38, 45, 50, 48, 52, 55, 58, 52, 45, 42, 48, 45, 50, 52, 48, 45, 42, 38, 35];
    } else {
        data = Array.from({length: 90}, () => Math.random() * 40 + 30);
    }

    const maxValue = Math.max(...data);
    const pointSpacing = (width - padding * 2) / (data.length - 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#9ca3af';

    for (let i = 0; i < 5; i++) {
        const y = padding + (height - padding * 2) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        const value = Math.round(maxValue * (1 - i / 4));
        ctx.textAlign = 'right';
        ctx.fillText(value + ' kWh', padding - 10, y + 4);
    }

    // Draw area
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        ctx.lineTo(x, y);
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    data.forEach((value, i) => {
        const x = padding + i * pointSpacing;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });

    // Update stats
    const avg = Math.round(data.reduce((a, b) => a + b) / data.length);
    const peak = Math.max(...data);
    const total = Math.round(data.reduce((a, b) => a + b));

    document.getElementById('avgEnergy').textContent = avg + ' kWh';
    document.getElementById('peakEnergy').textContent = peak.toFixed(1) + ' kWh';
    document.getElementById('totalEnergy').textContent = total + ' kWh';
}

// <CHANGE> Solar Panel Visualization
function drawSolarPanel() {
    const canvas = document.getElementById('solarPanelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw circle background
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw degree markers
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const angles = [0, 90, 180, 270];
    const labels = ['0°', '90°', '180°', '270°'];

    angles.forEach((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180;
        const x = centerX + Math.cos(rad) * 140;
        const y = centerY + Math.sin(rad) * 140;
        ctx.fillStyle = '#6b7280';
        ctx.fillText(labels[i], x, y);
    });

    // Draw sun position (animated)
    const sunAngle = (currentAngle - 90) * Math.PI / 180;
    const sunX = centerX + Math.cos(sunAngle) * 100;
    const sunY = centerY + Math.sin(sunAngle) * 100;

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw sun rays
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const rayAngle = (i * 45) * Math.PI / 180;
        const x1 = centerX + Math.cos(rayAngle) * 130;
        const y1 = centerY + Math.sin(rayAngle) * 130;
        const x2 = centerX + Math.cos(rayAngle) * 155;
        const y2 = centerY + Math.sin(rayAngle) * 155;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Draw solar panel (blue rectangle at current angle)
    const panelAngle = (currentAngle - 90) * Math.PI / 180;
    const panelX = centerX + Math.cos(panelAngle) * 50;
    const panelY = centerY + Math.sin(panelAngle) * 50;

    ctx.save();
    ctx.translate(panelX, panelY);
    ctx.rotate(panelAngle + Math.PI / 2);

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-15, -30, 30, 60);

    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.strokeRect(-15, -30, 30, 60);

    // Panel grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-15, -30 + (60 / 3) * i);
        ctx.lineTo(15, -30 + (60 / 3) * i);
        ctx.stroke();
    }

    ctx.restore();

    // Draw target angle line (dashed)
    const targetAngleLine = (targetAngle - 90) * Math.PI / 180;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(targetAngleLine) * 120, centerY + Math.sin(targetAngleLine) * 120);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update angle values
    document.getElementById('currentAngle').textContent = currentAngle.toFixed(1) + '°';
    document.getElementById('targetAngle').textContent = targetAngle.toFixed(1) + '°';
    document.getElementById('rotationSpeed').textContent = (Math.random() * 2).toFixed(2) + '°/min';

    // Animate movement toward target
    if (Math.abs(currentAngle - targetAngle) > 0.5) {
        currentAngle += (targetAngle - currentAngle) * 0.02;
    }
}

// Filter buttons for analytics
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        drawAnalyticsChart(currentPeriod);
    });
});

// Animation loop
function animate() {
    drawEnergyCircle();
    drawHourlyChart();
    drawAnalyticsChart(currentPeriod);
    drawSolarPanel();
    requestAnimationFrame(animate);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    showPage('dashboard');
    animate();
});

// Resize handler for canvas
window.addEventListener('resize', () => {
    const analyticsCanvas = document.getElementById('analyticsChart');
    if (analyticsCanvas) {
        analyticsCanvas.width = analyticsCanvas.offsetWidth;
    }
});