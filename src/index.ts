import { renderHtml } from "./renderHtml";
import { renderErrorPage } from "./errorPage";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle POST request for form submission
    if (request.method === "POST" && path === "/submit") {
      const formData = await request.formData();
      const long_url = formData.get("long_url") as string;

      // Check if long_url is valid
      // Prefix 'https' if missing
      let validatedUrl = long_url;
      if (!validatedUrl.startsWith('https://')) {
        validatedUrl = 'https://' + validatedUrl;
      }

      try {
        new URL(validatedUrl);
      } catch (error) {
        return new Response(renderErrorPage(
          'Invalid URL provided. Please make sure to enter a valid URL.',
          error instanceof Error ? error.message : String(error)
        ), {
          headers: { "content-type": "text/html" },
          status: 400
        });
      }

      // Generate random hex string, up to 5 chars
      const randomHex = Math.random().toString(16).substring(2, 7).toUpperCase();
      const short_id = randomHex;
      
      // Insert valid short_id and validated long_url into D1 table
      // TODO: use Sessions API below to take advantage of D1 read replicas
      if (short_id) {
        // Insert the new URL into the database
        const stmt = env.DB.prepare("INSERT INTO urls (short_id, long_url) VALUES (?, ?)");
        await stmt.bind(short_id, validatedUrl).run();
      }
      
      // Redirect back to the main page
      return Response.redirect(new URL(request.url).origin, 302);
    }

    // Handle dynamic short_id paths
    if (path !== "/" && path !== "/submit") {
      // Extract short_id from path (remove leading slash)
      const short_id = path.substring(1);
      
      // Query the database for the long_url
      const stmt = env.DB.prepare("SELECT long_url FROM urls WHERE short_id = ?");
      const { results } = await stmt.bind(short_id).all();
      
      if (results && results.length > 0) {
        // Redirect to the long_url
        try {
          return Response.redirect(results[0].long_url as string, 302);
        } catch (error) {
          console.error(`Error accessing the url ${results[0].long_url}: ${error}`);
          return new Response(renderErrorPage(
            'Received an error redirecting to your jortened url.',
            error instanceof Error ? error.message : String(error)
          ), {
            headers: { "content-type": "text/html" },
            status: 404
          });
        }
      } else {
        // Short ID not found
        return new Response(renderErrorPage(
          'The short URL you are looking for does not exist.',
          `Short ID "${short_id}" was not found in the database.`
        ), {
          headers: { "content-type": "text/html" },
          status: 404
        });
      }
    }

    // Handle GET request for the main page
    const stmt = env.DB.prepare("SELECT * FROM urls");
    const { results } = await stmt.all();

    return new Response(renderHtml(JSON.stringify(results, null, 2)), {
      headers: {
        "content-type": "text/html",
      },
    });
  },
} satisfies ExportedHandler<Env>;
