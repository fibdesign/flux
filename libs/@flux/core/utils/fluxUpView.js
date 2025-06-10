export const showUpPage = (res) => {
    const html = `
    <html>
    <head>
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
                padding: 2rem;
            }
            
            .container {
                max-width: 800px;
                width: 100%;
            }
            
            .status-card {
                background: rgba(30, 41, 59, 0.8);
                backdrop-filter: blur(10px);
                border-radius: 24px;
                padding: 4rem 3rem;
                border: 1px solid rgba(99, 102, 241, 0.3);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                position: relative;
                overflow: hidden;
            }
            
            .status-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(90deg, #4ade80, #3b82f6, #6366f1);
            }
            
            .status-icon {
                width: 120px;
                height: 120px;
                margin: 0 auto 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(74, 222, 128, 0.15);
                position: relative;
                animation: pulse 2s infinite;
            }
            
            .status-icon svg {
                width: 60px;
                height: 60px;
                fill: #4ade80;
            }
            
            h1 {
                font-size: 3.5rem;
                margin-bottom: 1rem;
                background: linear-gradient(90deg, #c7d2fe, #a5b4fc);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .status-message {
                font-size: 1.5rem;
                margin-bottom: 2rem;
                color: #cbd5e1;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.6;
            }
            
            .details {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin-top: 3rem;
                flex-wrap: wrap;
            }
            
            .detail-card {
                background: rgba(30, 41, 59, 0.6);
                border-radius: 16px;
                padding: 1.5rem;
                min-width: 200px;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }
            
            .detail-card h3 {
                color: #94a3b8;
                font-weight: 600;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            
            .detail-card p {
                font-size: 1.25rem;
                font-weight: 600;
                color: #e2e8f0;
            }
            
            .uptime {
                color: #4ade80;
            }
            
            .footer {
                margin-top: 3rem;
                color: #64748b;
                font-size: 0.9rem;
            }
            
            .version {
                display: inline-block;
                background: rgba(99, 102, 241, 0.2);
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                margin-top: 0.5rem;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
                70% { box-shadow: 0 0 0 20px rgba(74, 222, 128, 0); }
                100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
            }
            
            @media (max-width: 768px) {
                .status-card {
                    padding: 3rem 1.5rem;
                }
                
                h1 {
                    font-size: 2.5rem;
                }
                
                .status-message {
                    font-size: 1.25rem;
                }
                
                .detail-card {
                    min-width: 140px;
                    padding: 1.25rem;
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
                
                <h1>Application Running</h1>
                
                <p class="status-message">
                    Your application is up and serving requests successfully.
                    All systems are operational and performing as expected.
                </p>
                
                <div class="details">
                    <div class="detail-card">
                        <h3>Server Time</h3>
                        <p>${new Date().toLocaleString()}</p>
                    </div>
                    
                    <div class="detail-card">
                        <h3>Status</h3>
                        <p class="uptime">Operational</p>
                    </div>
                    
                    <div class="detail-card">
                        <h3>Environment</h3>
                        <p>${process.env.NODE_ENV || 'development'}</p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>All systems nominal - Monitoring is active</p>
                <div class="version">v${process.env.npm_package_version || '1.0.0'}</div>
            </div>
        </div>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.end(html);
}