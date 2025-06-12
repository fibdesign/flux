const showWelcomePage = (res) => {
    const html = `
    <html>
    <head>
        <title>Flux API Language</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #0f172a, #1e1b4b);
                color: #f1f5f9;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            
            .container {
                max-width: 500px;
                width: 100%;
            }
            
            .welcome-card {
                background: rgba(30, 41, 59, 0.85);
                backdrop-filter: blur(8px);
                border-radius: 20px;
                padding: 2.5rem 2rem;
                border: 1px solid rgba(99, 102, 241, 0.25);
                box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.4);
                position: relative;
                overflow: hidden;
            }
            
            .welcome-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #4f46e5, #8b5cf6);
            }
            
            .header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .logo {
                font-size: 2.5rem;
                font-weight: 700;
                color: #6366f1;
            }
            
            .tagline {
                color: #cbd5e1;
                margin-top: 0.5rem;
                font-size: 1.1rem;
            }
            
            .status-badge {
                display: inline-block;
                background: rgba(74, 222, 128, 0.15);
                color: #4ade80;
                padding: 0.3rem 1rem;
                border-radius: 9999px;
                font-size: 0.9rem;
                font-weight: 500;
                margin-top: 1rem;
            }
            
            .links-section {
                margin: 2rem 0;
            }
            
            .link-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .link-card {
                background: rgba(30, 41, 59, 0.6);
                border-radius: 12px;
                padding: 1.2rem;
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid rgba(99, 102, 241, 0.15);
            }
            
            .link-card:hover {
                transform: translateY(-3px);
                border-color: #818cf8;
                background: rgba(30, 41, 59, 0.8);
            }
            
            .link-card a {
                color: #e0e7ff;
                text-decoration: none;
                font-weight: 500;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
            
            .link-icon {
                width: 30px;
                height: 30px;
                fill: #818cf8;
            }
            
            .details {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(148, 163, 184, 0.15);
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
            }
            
            .detail-label {
                color: #94a3b8;
                font-weight: 500;
            }
            
            .detail-value {
                font-weight: 500;
                color: #e2e8f0;
                text-align: right;
            }
            
            .footer {
                margin-top: 2rem;
                color: #64748b;
                font-size: 0.85rem;
                text-align: center;
            }
            
            .version {
                display: inline-block;
                background: rgba(99, 102, 241, 0.2);
                padding: 0.2rem 0.8rem;
                border-radius: 9999px;
                margin-top: 0.8rem;
                font-size: 0.8rem;
            }
            
            @media (max-width: 480px) {
                .link-grid {
                    grid-template-columns: 1fr;
                }
                
                .welcome-card {
                    padding: 2rem 1.5rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="welcome-card">
                <div class="header">
                    <div class="logo">Flux</div>
                    <div class="tagline">Custom language for web APIs</div>
                    <div class="status-badge">API Server Running</div>
                </div>
                
                <div class="links-section">
                    <div class="link-grid">
                        <div class="link-card">
                            <a href="https://docs.flux.fibdesign.ir/getting-started">
                                <svg class="link-icon" viewBox="0 0 24 24">
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                                </svg>
                                Getting Started
                            </a>
                        </div>
                        
                        <div class="link-card">
                            <a href="https://docs.flux.fibdesign.ir/language-reference">
                                <svg class="link-icon" viewBox="0 0 24 24">
                                    <path d="M20 6.54v10.91c-2.6-.77-5.28-1.16-8-1.16-2.72 0-5.4.39-8 1.16V6.54c2.6.77 5.28 1.16 8 1.16 2.72.01 5.4-.38 8-1.16M21.43 4c-.1 0-.2.02-.31.06C18.18 5.16 15.09 5.7 12 5.7c-3.09 0-6.18-.55-9.12-1.64-.11-.04-.22-.06-.31-.06-.34 0-.57.23-.57.63v14.75c0 .39.23.62.57.62.1 0 .2-.02.31-.06 2.94-1.1 6.03-1.64 9.12-1.64 3.09 0 6.18.55 9.12 1.64.11.04.21.06.31.06.33 0 .57-.23.57-.63V4.63c0-.4-.24-.63-.57-.63z"/>
                                </svg>
                                Language Reference
                            </a>
                        </div>
                        
                        <div class="link-card">
                            <a href="https://github.com/flux-api/examples">
                                <svg class="link-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                </svg>
                                Examples
                            </a>
                        </div>
                        
                        <div class="link-card">
                            <a href="https://discord.gg/flux-api">
                                <svg class="link-icon" viewBox="0 0 24 24">
                                    <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"/>
                                </svg>
                                Community
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="details">
                    <div class="detail-row">
                        <span class="detail-label">Flux Version</span>
                        <span class="detail-value">v${process.env.npm_package_version || '1.0.0'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Environment</span>
                        <span class="detail-value">${process.env.NODE_ENV || 'development'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Server Time</span>
                        <span class="detail-value">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Flux API Language • High-performance API development</p>
                    <div class="version">${new Date().toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.end(html);
}
module.exports = { showWelcomePage };