#!/usr/bin/env python3
"""
Konverterer ALLE Stitch HTML-filer til Next.js React-komponenter
"""
import os
import re

stitch_dir = "stitch"
export_dir = "stitch-export/app"

def to_camel_case(text):
    """Konverter folder_navn til CamelCase"""
    return ''.join(x.title() for x in text.split('_'))

def get_route_from_folder(folder_name):
    """Map folder name to Next.js route"""
    # Fjern prefikser og konverter til path
    folder = folder_name.lower()
    
    # Definer mappings
    mappings = {
        "auth_": "auth/",
        "admin_": "admin/",
        "coach_": "coach/",
        "analytics_": "analytics/",
        "booking_": "booking/",
        "landing_": "landing/",
        "mobile_": "mobile/",
        "portal_": "portal/",
        "mission_control_": "mission-control/",
        "super_admin_": "super-admin/",
        "settings_": "settings/",
        "utility_": "utility/",
        "iup_": "",
        "log_": "",
        "sessions_": "",
        "dashboard_": "",
        "video_": "video/",
        "social_": "social/",
        "challenges_": "challenges/",
        "gamification_": "gamification/",
        "communication_": "communication/",
        "integration_": "integrations/",
        "theme_": "theme/",
        "custom_": "custom/",
        "workflow_": "workflow/",
        "template_": "template/",
        "language_": "language/",
        "email_": "email/",
        "sms_": "sms/",
        "push_": "push/",
        "group_": "group/",
        "head_to_head_": "head-to-head/",
        "career_": "career/",
        "points_": "points/",
        "badge_": "badge/",
        "levels_": "levels/",
        "streaks_": "streaks/",
        "daily_": "daily/",
        "season_": "season/",
        "clans_": "clans/",
        "tournaments_": "tournaments/",
        "referral_": "referral/",
        "membership_": "membership/",
        "purchase_": "purchase/",
        "reschedule_": "reschedule/",
        "waitlist_": "waitlist/",
        "package_": "package/",
        "team_": "team/",
        "migration_": "migration/",
        "upgrade_": "upgrade/",
        "downgrade_": "downgrade/",
        "cancel_": "cancel/",
        "error_": "error/",
        "utility_maintenance": "utility/maintenance",
        "utility_404": "utility/404",
        "utility_500": "utility/500",
        "utility_empty": "utility/empty",
        "utility_loading": "utility/loading",
    }
    
    route = folder.replace('_', '-')
    
    for prefix, path in mappings.items():
        if folder.startswith(prefix):
            route = path + folder[len(prefix):].replace('_', '-')
            break
    
    # Spesialtilfeller
    if folder == "iup_12_week_training_plan":
        route = "iup"
    elif folder == "dashboard_mission_control":
        route = "dashboard"
    elif folder == "log_practice_diary":
        route = "log"
    elif folder == "sessions_calendar_view":
        route = "sessions"
    elif folder == "heritage_grid" or folder == "heritage_grid_prd":
        return None  # Skip design system fil
    
    return route

def convert_html_to_tsx(html_content, component_name):
    """Konverterer HTML til TSX"""
    # Fjern DOCTYPE, html, head tags
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL | re.IGNORECASE)
    if body_match:
        content = body_match.group(1).strip()
    else:
        content = html_content
    
    # Konverter class til className
    content = re.sub(r'\bclass=', 'className=', content)
    
    # Konverter for til htmlFor
    content = re.sub(r'\bfor=', 'htmlFor=', content)
    
    # Fjern onclick, onchange etc
    content = re.sub(r'\son\w+="[^"]*"', '', content)
    
    # Fjern script tags
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Fjern kommentarer
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    # Wrap i export default
    tsx = f'''"use client";

export default function {component_name}Page() {{
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
    skipped = 0
    
    # Liste over alle mapper
    folders = [f for f in os.listdir(stitch_dir) if os.path.isdir(os.path.join(stitch_dir, f))]
    
    for folder in folders:
        route = get_route_from_folder(folder)
        
        if not route:
            skipped += 1
            continue
        
        html_path = os.path.join(stitch_dir, folder, "code.html")
        
        if not os.path.exists(html_path):
            print(f"⚠️  code.html ikke funnet i: {folder}")
            continue
        
        # Les HTML
        try:
            with open(html_path, 'r', encoding='utf-8') as f:
                html = f.read()
        except Exception as e:
            print(f"❌ Feil ved lesing av {folder}: {e}")
            continue
        
        # Konverter
        component_name = to_camel_case(folder.replace('_', ' ').replace('-', ' '))
        tsx = convert_html_to_tsx(html, component_name)
        
        # Lag filsti
        export_path = os.path.join(export_dir, route, "page.tsx")
        os.makedirs(os.path.dirname(export_path), exist_ok=True)
        
        # Skriv fil
        try:
            with open(export_path, 'w', encoding='utf-8') as f:
                f.write(tsx)
            total_converted += 1
            print(f"✅ {folder} -> {route}/page.tsx")
        except Exception as e:
            print(f"❌ Feil ved skriving av {route}: {e}")
    
    print(f"\n📊 Totalt konvertert: {total_converted} skjermer")
    print(f"⏭️  Skippet: {skipped} (design system filer)")

if __name__ == "__main__":
    main()
