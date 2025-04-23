export const renderErrorPage = (errorMessage: string, errorDetails?: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Error - URL Shortener</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            color: #333;
        }
        .error-container {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 2rem;
            margin-top: 2rem;
        }
        .error-title {
            color: #c53030;
            margin-top: 0;
        }
        .error-message {
            color: #4a5568;
        }
        .error-details {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.875rem;
            color: #4a5568;
            white-space: pre-wrap;
        }
        .home-link {
            display: inline-block;
            margin-top: 1rem;
            color: #3182ce;
            text-decoration: none;
        }
        .home-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1 class="error-title">Oops! Something went wrong</h1>
        <p class="error-message">${errorMessage}</p>
        ${errorDetails ? `<div class="error-details">${errorDetails}</div>` : ''}
        <a href="/" class="home-link">← Return to Home</a>
    </div>
</body>
</html>
`; 