from django.http import HttpResponse
from django.views.decorators.http import require_GET

@require_GET
def dynamic_sitemap_xml(request):
    """
    Dynamically builds XML sitemap for public SEO indexing.
    """
    site_url = "https://docspot.vercel.app"
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    # Static Core Public Pages
    static_pages = [
        ('', '1.0', 'daily'),
        ('/doctors', '0.9', 'daily'),
        ('/hospitals', '0.9', 'daily'),
        ('/diagnostics', '0.8', 'weekly'),
        ('/medicines', '0.8', 'weekly'),
        ('/ambulance', '0.8', 'weekly'),
        ('/about', '0.5', 'monthly'),
        ('/contact', '0.5', 'monthly'),
    ]

    for path, priority, freq in static_pages:
        xml_content += f'  <url><loc>{site_url}{path}</loc><changefreq>{freq}</changefreq><priority>{priority}</priority></url>\n'

    # Demo Doctor Profile URLs
    demo_doctors = ['dr-ananya-roy', 'dr-patel-neurologist', 'dr-sharma-cardiologist']
    for slug in demo_doctors:
        xml_content += f'  <url><loc>{site_url}/doctor/{slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n'

    xml_content += '</urlset>'
    return HttpResponse(xml_content, content_type='application/xml')


@require_GET
def robots_txt(request):
    """
    Dynamic robots.txt configuration allowing public index while protecting API & admin paths.
    """
    content = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /patient/
Disallow: /doctor/dashboard
Disallow: /hospital/dashboard

Sitemap: https://docspot.vercel.app/sitemap.xml
"""
    return HttpResponse(content, content_type='text/plain')
