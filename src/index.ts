import { renderHtml } from "./renderHtml";
import { renderErrorPage } from "./errorPage";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    var short_id: string | null = 'emptyString'

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

      var short_id: string | null = Math.random().toString(16).substring(2, 7).toUpperCase(); 
      
      // Insert valid short_id and validated long_url into D1 table
      if (short_id) {
        // Insert the new URL into the database
        console.log(`Inserting ${short_id} mapped to ${long_url}`)
        const stmt = env.DB.prepare("INSERT INTO urls (short_id, long_url) VALUES (?, ?)");
        try {
          await stmt.bind(short_id, validatedUrl).run();
        }
        catch (error) {
          if (error === "Error: D1_ERROR: UNIQUE constraint failed: urls.short_id: SQLITE_CONSTRAINT") {
            console.log(`short_id record ${short_id} already exists for ${long_url}.`)
          }
        }
      }
      
      // Redirect back to the main page with success parameter
      const redirectUrl = new URL(request.url);
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('success', 'true');
      if (short_id) {
        redirectUrl.searchParams.set('short_id', short_id);
      }
      return Response.redirect(redirectUrl.toString(), 302);
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
          console.log(`Redirected from path ${short_id} to ${results[0].long_url}`)
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
          'The path you are looking for does not exist.',
          `The path /${short_id} was not found.`
        ), {
          headers: { "content-type": "text/html" },
          status: 404
        });
      }
    }

    // Only show success message if we're coming from a successful submission
    short_id = url.searchParams.get('short_id');
    const successMessage = url.searchParams.get('success') === 'true' && short_id
      ? `https://jorts.zip/${short_id}`
      : '';

    return new Response(renderHtml(successMessage), {
      headers: {
        "content-type": "text/html",
      },
    });
  },
} satisfies ExportedHandler<Env>;
