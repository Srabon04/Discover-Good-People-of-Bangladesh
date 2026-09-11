export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // API Route for Nomination Submission
    if (request.method === "POST" && url.pathname === "/api/nominate") {
      try {
        const body = await request.json();
        if (env.NOMINATIONS_KV) {
          const id = Date.now().toString();
          await env.NOMINATIONS_KV.put(id, JSON.stringify(body));
        }
        return new Response(
          JSON.stringify({ success: true, message: "Nomination submitted successfully!" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, error: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // API Route for Fetching Nominations
    if (request.method === "GET" && url.pathname === "/api/nominations") {
      try {
        let list = [];
        if (env.NOMINATIONS_KV) {
          const keys = await env.NOMINATIONS_KV.list();
          for (const key of keys.keys) {
            const value = await env.NOMINATIONS_KV.get(key.name);
            if (value) list.push(JSON.parse(value));
          }
        }
        return new Response(
          JSON.stringify(list),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Serve static frontend assets for any other routes
    return env.ASSETS.fetch(request);
  }
};
