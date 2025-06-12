const showFluxRoutes = (routes, res) => {
    const html = `
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flux - Routes</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            :root {
                --primary: #6366f1;
                --primary-dark: #4f46e5;
                --dark: #1e293b;
                --darker: #0f172a;
                --light: #f1f5f9;
                --gray: #94a3b8;
                --success: #22c55e;
                --warning: #f59e0b;
                --danger: #ef4444;
                --info: #3b82f6;
            }
            
            body {
                background: linear-gradient(135deg, var(--dark), #1e1b4b);
                color: var(--light);
                min-height: 100vh;
                padding: 2rem;
            }
            
            header {
                text-align: center;
                margin-bottom: 3rem;
                padding-top: 1rem;
            }
            
            .logo {
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(90deg, #8b5cf6, var(--primary));
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 0.5rem;
            }
            
            .subtitle {
                color: var(--gray);
                font-weight: 300;
                letter-spacing: 1px;
            }
            
            .stats {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin: 2rem 0;
                flex-wrap: wrap;
            }
            
            .stat-card {
                background: rgba(30, 41, 59, 0.6);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 1.2rem 2rem;
                min-width: 180px;
                text-align: center;
                border: 1px solid rgba(99, 102, 241, 0.2);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            .stat-value {
                font-size: 2.2rem;
                font-weight: 700;
                background: linear-gradient(90deg, #c7d2fe, #a5b4fc);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .stat-label {
                color: var(--gray);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .table-container {
                background: rgba(30, 41, 59, 0.6);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid rgba(99, 102, 241, 0.2);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
                overflow-x: auto;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                min-width: 800px;
            }
            
            thead {
                background: rgba(79, 70, 229, 0.3);
                border-bottom: 2px solid rgba(99, 102, 241, 0.3);
            }
            
            th {
                padding: 1.2rem 1.5rem;
                text-align: left;
                color: #c7d2fe;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-size: 0.9rem;
            }
            
            tbody tr {
                border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                transition: all 0.2s ease;
            }
            
            tbody tr:last-child {
                border-bottom: none;
            }
            
            tbody tr:hover {
                background: rgba(79, 70, 229, 0.15);
            }
            
            td {
                padding: 1.2rem 1.5rem;
            }
            
            .method {
                display: inline-block;
                padding: 0.4rem 0.8rem;
                border-radius: 6px;
                font-weight: 700;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .method-get { background: rgba(34, 197, 94, 0.15); color: var(--success); }
            .method-post { background: rgba(59, 130, 246, 0.15); color: var(--info); }
            .method-put { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
            .method-delete { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
            .method-patch { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
            
            .path {
                font-family: 'Courier New', monospace;
                color: #c7d2fe;
                font-weight: 500;
            }
            
            .middlewares, .handler {
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                color: var(--gray);
            }
            
            .handler {
                color: #f0abfc;
            }
            
            .empty {
                text-align: center;
                padding: 3rem;
                color: var(--gray);
                font-style: italic;
            }
            
            footer {
                text-align: center;
                margin-top: 3rem;
                color: var(--gray);
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                body {
                    padding: 1rem;
                }
                
                .stat-card {
                    min-width: 140px;
                    padding: 1rem;
                }
                
                .stat-value {
                    font-size: 1.8rem;
                }
                
                th, td {
                    padding: 1rem;
                }
            }
            .version {
                display: inline-block;
                background: rgba(99, 102, 241, 0.2);
                padding: 0.2rem 0.8rem;
                border-radius: 9999px;
                margin-top: 0.8rem;
                font-size: 0.8rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <div class="logo">Flux</div>
                <div class="subtitle">API Routes Dashboard</div>
            </header>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-value">${routes.length}</div>
                    <div class="stat-label">Total Routes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${new Set(routes.map(r => r.method)).size}</div>
                    <div class="stat-label">HTTP Methods</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${new Set(routes.map(r => r.handler)).size}</div>
                    <div class="stat-label">Unique Handlers</div>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Path</th>
                            <th>Middlewares</th>
                            <th>Handler</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${routes.length > 0 ?
        routes.map(route => `
                                <tr>
                                    <td>
                                        <span class="method method-${route.method.toLowerCase()}">
                                            ${route.method}
                                        </span>
                                    </td>
                                    <td class="path">${route.path}</td>
                                    <td class="middlewares">${route.middlewares.join(', ') || '<span style="opacity:0.5">None</span>'}</td>
                                    <td class="handler">${route.handler}</td>
                                </tr>
                            `).join('')
        :
        `<tr><td colspan="4" class="empty">No routes defined</td></tr>`
    }
                    </tbody>
                </table>
            </div>
            
            <footer>
                <p>Generated by Flux</p>
                <div class="version">${new Date().toLocaleDateString()}</div>
            </footer>
        </div>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.end(html);
}
module.exports = { showFluxRoutes };