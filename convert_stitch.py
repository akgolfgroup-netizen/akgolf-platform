#!/usr/bin/env python3
"""
Konverterer Stitch HTML-filer til Next.js React-komponenter
"""
import os
import re
import shutil

stitch_dir = "stitch"
export_dir = "stitch-export/app"

# Mappe-mapping: stitch_folder -> nextjs_route
folder_mapping = {
    "dashboard_mission_control": "dashboard/page",
    "iup_12_week_training_plan": "iup/page",
    "analytics_strokes_gained": "analytics/page",
    "log_practice_diary": "log/page",
    "sessions_calendar_view": "sessions/page",
    "booking_select_service": "booking/select-service/page",
    "booking_date_time": "booking/date-time/page",
    "booking_coach_selection": "booking/coach/page",
    "booking_review_confirm": "booking/review/page",
    "booking_confirmed": "booking/confirmed/page",
    "auth_sign_in": "auth/login/page",
    "auth_register_step_1": "auth/register/step-1/page",
    "auth_register_step_2": "auth/register/step-2/page",
    "auth_register_step_3": "auth/register/step-3/page",
    "auth_forgot_password": "auth/forgot-password/page",
    "landing_homepage": "landing/page",
    "landing_pricing": "landing/pricing/page",
    "landing_about_us": "landing/about/page",
    "landing_contact": "landing/contact/page",
}

def convert_html_to_tsx(html_content, component_name):
    """Konverterer HTML til TSX"""
    # Fjern DOCTYPE, html, head tags
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
    if body_match:
        content = body_match.group(1)
    else:
        content = html_content
    
    # Konverter class til className
    content = re.sub(r'\bclass=', 'className=', content)
    
    # Konverter for til htmlFor
    content = re.sub(r'\bfor=', 'htmlFor=', content)
    
    # Konverter style attributt med template literals
    content = re.sub(r'style="([^"]+)"', r'style={{\1}}', content)
    
    # Fjern onclick, onchange etc (vi skal legge til React handlers senere)
    content = re.sub(r'\son\w+="[^"]*"', '', content)
    
    # Fjern script tags
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    
    # Wrap i export default
    tsx = f'''"use client";

export default function {component_name}() {{
  return (
    <>
      {content}
    </>
  );
}}
'''
    return tsx

def main():
    total_converted = 0
    
    for stitch_folder, nextjs_route in folder_mapping.items():
        stitch_path = os.path.join(stitch_dir, stitch_folder, "code.html")
        export_path = os.path.join(export_dir, f"{nextjs_route}.tsx")
        
        if os.path.exists(stitch_path):
            # Les HTML
            with open(stitch_path, 'r', encoding='utf-8') as f:
                html = f.read()
            
            # Konverter
            component_name = ''.join([x.title() for x in nextjs_route.replace('/page', '').replace('/', '_').split('_')])
            tsx = convert_html_to_tsx(html, component_name)
            
            # Lag mappen hvis den ikke finnes
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            
            # Skriv fil
            with open(export_path, 'w', encoding='utf-8') as f:
                f.write(tsx)
            
            total_converted += 1
            print(f"✅ Konvertert: {stitch_folder} -> {nextjs_route}.tsx")
        else:
            print(f"⚠️  Ikke funnet: {stitch_path}")
    
    print(f"\n📊 Totalt konvertert: {total_converted} skjermer")

if __name__ == "__main__":
    main()
