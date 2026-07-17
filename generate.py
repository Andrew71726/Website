import os
import sys
import re
from datetime import datetime
from openai import OpenAI

def write_fresh_sitemap(sitemap_file, article_url, current_date, sitemap_entry):
    fresh_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{sitemap_entry}
</urlset>"""
    with open(sitemap_file, "w", encoding="utf-8") as sf:
        sf.write(fresh_content)
    print(f"[INFO] Created new sitemap.xml with initial entry {article_url}")

def main():
    # 1. Initialize OpenAI Client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("[ERROR] OPENAI_API_KEY environment variable is not configured.")
        print("Please add it as a Repository Secret in GitHub Settings.")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # 2. Select a topic for today's article
    topics = [
        "The Future of AI-Powered GitHub Actions in Modern DevOps",
        "How Automated Article Generation with GPT-4 Transforms Blogging",
        "Optimizing Python Scripts for Static Site Search Engines",
        "Setting Up High-Density Performance Monitors for Cloud Workloads",
        "A Guide to Dynamic Sitemap Updates with Python and XML Tree",
        "The Evolution of Zero-Maintenance Serverless Web Applications"
    ]

    # Pick a topic based on day of the month
    day_of_month = datetime.now().day
    selected_topic = topics[day_of_month % len(topics)]
    print(f"[INFO] Selected Topic for Today: '{selected_topic}'")

    # Create directories if they do not exist
    os.makedirs("articles", exist_ok=True)

    # 3. Request OpenAI GPT-4o-mini to write an SEO-optimized HTML article
    prompt = f"""
    Write a comprehensive, engaging, and SEO-optimized article about: "{selected_topic}".
    The article should be written as a full-page, beautiful standalone HTML file.
    Requirements:
    1. Include a responsive, beautiful modern navigation header, main article body, author info, and a stylish footer.
    2. Use Tailwind CSS via CDN (https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4) for visual styling. Make it look clean, with rich margins, high readability, and responsive padding.
    3. Use a soft, modern color scheme (light theme with charcoal gray text, or a modern dark slate design).
    4. Output ONLY valid, complete HTML. Do NOT wrap the HTML in ```html markdown backticks.
    """

    try:
        print("[INFO] Calling OpenAI API to generate article contents...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert tech blogger, copywriter, and frontend designer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        html_content = response.choices[0].message.content.strip()
        
        # Clean up any potential markdown wrapper backticks if returned
        if html_content.startswith("```html"):
            html_content = html_content[7:]
        if html_content.endswith("```"):
            html_content = html_content[:-3]
        html_content = html_content.strip()
        
        # 4. Save the generated article
        file_slug = re.sub(r'[^a-zA-Z0-9]+', '-', selected_topic.lower()).strip('-')
        filename = f"articles/{file_slug}.html"
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"[SUCCESS] Generated new article successfully: {filename}")
        
        # 5. Update sitemap.xml
        sitemap_file = "sitemap.xml"
        article_url = f"https://example.com/{filename}"
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        sitemap_entry = f"""  <url>
    <loc>{article_url}</loc>
    <lastmod>{current_date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"""
        
        if os.path.exists(sitemap_file):
            with open(sitemap_file, "r", encoding="utf-8") as sf:
                sitemap_content = sf.read()
                
            # Insert before the closing </urlset> tag
            if "</urlset>" in sitemap_content:
                if article_url not in sitemap_content:
                    updated_content = sitemap_content.replace("</urlset>", f"{sitemap_entry}\n</urlset>")
                    with open(sitemap_file, "w", encoding="utf-8") as sf_write:
                        sf_write.write(updated_content)
                    print(f"[INFO] Added {article_url} to sitemap.xml")
                else:
                    print(f"[INFO] {article_url} already exists in sitemap.xml. Skipping insertion.")
            else:
                print("[WARNING] Could not find </urlset> tag in sitemap.xml. Regenerating standard sitemap.")
                write_fresh_sitemap(sitemap_file, article_url, current_date, sitemap_entry)
        else:
            write_fresh_sitemap(sitemap_file, article_url, current_date, sitemap_entry)

    except Exception as e:
        print(f"[ERROR] Failed to run article generation: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
