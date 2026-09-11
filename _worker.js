<html>
<style>
   div{min-height:1em;}
</style>
<body>export default {<br/>  async fetch(request, env) {<br/>    const url = new URL(request.url);<br/><br/>    // ১. ফর্ম থেকে সাবমিট নেওয়া (/api/submit)<br/>    if (url.pathname === &#39;/api/submit&#39; &amp;&amp; request.method === &#39;POST&#39;) {<br/>      try {<br/>        const body = await request.json();<br/>        const { nominee_type, name, district, category, reason, story, proof } = body;<br/><br/>        await env.DB.prepare(`<br/>          INSERT INTO nominations (nominee_type, name, district, category, reason, story, proof)<br/>          VALUES (?, ?, ?, ?, ?, ?, ?)<br/>        `).bind(nominee_type, name, district, category, reason, story, proof).run();<br/><br/>        return new Response(JSON.stringify({ success: true, message: &quot;মনোনয়ন সফলভাবে জমা হয়েছে!&quot; }), {<br/>          headers: { &#39;Content-Type&#39;: &#39;application/json&#39; }<br/>        });<br/>      } catch (err) {<br/>        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });<br/>      }<br/>    }<br/><br/>    // ২. মেইন ওয়েবসাইটে লাইভ ডাটা পাঠানো (/api/nominations)<br/>    if (url.pathname === &#39;/api/nominations&#39; &amp;&amp; request.method === &#39;GET&#39;) {<br/>      try {<br/>        const { results } = await env.DB.prepare(`SELECT * FROM nominations ORDER BY created_at DESC`).all();<br/>        return new Response(JSON.stringify(results), {<br/>          headers: { &#39;Content-Type&#39;: &#39;application/json&#39; }<br/>        });<br/>      } catch (err) {<br/>        return new Response(JSON.stringify({ error: err.message }), { status: 500 });<br/>      }<br/>    }<br/><br/>    return env.ASSETS.fetch(request);<br/>  }<br/>};</body>
</html> export default {
  async fetch(request, env) {
    // CORS headers for all responses
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // POST: Save nomination data
    if (request.method === "POST" && url.pathname === "/api/nominate") {
      try {
        const body = await request.json();
        // Save to Cloudflare KV or D1 Database if binding exists
        if (env.NOMINATIONS_KV) {
          const id = Date.now().toString();
          await env.NOMINATIONS_KV.put(id, JSON.stringify(body));
        }
        return new Response(JSON.stringify({ success: true, message: "Nomination submitted successfully!" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // GET: Fetch nomination data
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
        return new Response(JSON.stringify(list), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
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
