export function renderHtml(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>D1</title>
        <link rel="stylesheet" type="text/css" href="https://static.integrations.cloudflare.com/styles.css">
      </head>
    
      <body>
        <header>
          <img
            src="https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/30e0d3f6-6076-40f8-7abb-8a7676f83c00/public"
          />
          <h1>🎉 Successfully connected jorts to D1</h1>
        </header>
        <main>
          <form action="/submit" method="POST">
            <input type="text" name="short_id" placeholder="short_id" required>
            <input type="text" name="long_url" placeholder="long_url" required>
            <button type="submit">Submit</button>
          </form>
          <p>Your D1 Database contains the following data:</p>
          <pre><code><span style="color: #0E838F">&gt; </span>SELECT * FROM comments;<br>${content}</code></pre>
        </main>
      </body>
    </html>
`;
}
