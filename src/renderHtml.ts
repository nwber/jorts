export function renderHtml(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>jorts.zip</title>
        <link rel="icon" type="image/jpeg" href="/jorts.jpg">
        <link rel="stylesheet" type="text/css" href="/style.css">
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
          ${content ? `<p>Your shortened URL: ${content}</p>` : ''}
        </main>
        <footer>
          <a href="https://github.com/nwber/jorts" target="_blank" rel="noopener noreferrer" class="github-link">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
          </a>
        </footer>
      </body>
    </html>
`;
}
