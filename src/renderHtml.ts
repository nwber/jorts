export function renderHtml(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>jorts.zip</title>
        <link rel="stylesheet" type="text/css" href="https://static.integrations.cloudflare.com/styles.css">
      </head>
    
      <body>
        <header>
          <h1>👖 Welcome to jorts 👖</h1>
          <img
            src="/jorts.jpg" alt="picture of some jorts"
          />
          <h3>Enter a url below, and jorts will jorten it for you!</h3>
        </header>
        <main>
          <form action="/submit" method="POST">
            <input type="text" name="long_url" placeholder="https://jorts.zip" required>
            <button type="submit">Submit</button>
          </form>
          <pre>${content}</pre>
        </main>
      </body>
    </html>
`;
}
