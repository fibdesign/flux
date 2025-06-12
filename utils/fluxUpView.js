const showUpPage = (res) => {
    const html = `
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Status</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #1e293b, #1e1b4b);
                color: #f1f5f9;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 1rem;
            }
            
            .container {
                max-width: 500px;
                width: 100%;
            }
            
            .status-card {
                background: rgba(30, 41, 59, 0.85);
                backdrop-filter: blur(8px);
                border-radius: 20px;
                padding: 2.5rem 2rem;
                border: 1px solid rgba(99, 102, 241, 0.25);
                box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.4);
                position: relative;
                overflow: hidden;
            }
            
            .status-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #4ade80, #3b82f6);
            }
            
            .status-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(74, 222, 128, 0.15);
                position: relative;
                animation: pulse 2s infinite;
            }
            
            .status-icon svg {
                width: 40px;
                height: 40px;
                fill: #4ade80;
            }
            
            h1 {
                font-size: 2.2rem;
                margin-bottom: 0.8rem;
                background: linear-gradient(90deg, #c7d2fe, #a5b4fc);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .status-message {
                font-size: 1.1rem;
                margin-bottom: 1.8rem;
                color: #cbd5e1;
                line-height: 1.5;
            }
            
            .details {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 0.8rem 0;
                border-bottom: 1px solid rgba(148, 163, 184, 0.15);
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
            
            .uptime {
                color: #4ade80;
            }
            
            .footer {
                margin-top: 2rem;
                color: #64748b;
                font-size: 0.85rem;
            }
            
            .version {
                display: inline-block;
                background: rgba(99, 102, 241, 0.2);
                padding: 0.2rem 0.8rem;
                border-radius: 9999px;
                margin-top: 0.8rem;
                font-size: 0.8rem;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @media (max-width: 480px) {
                .status-card {
                    padding: 2rem 1.5rem;
                }
                
                h1 {
                    font-size: 1.8rem;
                }
                
                .status-message {
                    font-size: 1rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="status-card">
                <div class="status-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                </div>
                
                <h1>Service Operational</h1>
                
                <p class="status-message">
                    All systems are running smoothly. Your application is serving requests.
                </p>
                
                <div class="details">
                    <div class="detail-row">
                        <span class="detail-label">Status</span>
                        <span class="detail-value uptime">Active</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Server Time</span>
                        <span class="detail-value">${new Date().toLocaleTimeString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Environment</span>
                        <span class="detail-value">${process.env.NODE_ENV || 'development'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Version</span>
                        <span class="detail-value">v${process.env.npm_package_version || '1.0.0'}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Monitoring is active</p>
                <div class="version">${new Date().toLocaleDateString()}</div>
            </div>
        </div>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.end(html);
}
module.exports = { showUpPage };