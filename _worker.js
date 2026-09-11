
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ১. D1 ডাটাবেজ থেকে সব লাইভ ডাটা পাঠানোর API
    if (url.pathname === "/api/nominations") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM nominations ORDER BY id DESC"
        ).all();
        return new Response(JSON.stringify({ results }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // ২. নতুন নমিনেশন সেভ করার API
    if (request.method === "POST" && url.pathname === "/api/nominate") {
      try {
        const body = await request.json();
        const { name, category, description, district, nominator_name } = body;

        await env.DB.prepare(
          `INSERT INTO nominations (name, category, description, district, nominator_name) 
           VALUES (?, ?, ?, ?, ?)`
        ).bind(name, category, description, district, nominator_name).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // ৩. বাকি স্ট্যাটিক ফাইলগুলো (index.html, etc.) রেন্ডার করা
    return env.ASSETS.fetch(request);
  }
};
