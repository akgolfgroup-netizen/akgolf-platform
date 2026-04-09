#!/bin/bash

# Create directories
mkdir -p mission-board spillerportal shared

# Function to download file with proper name
download_file() {
    local url=$1
    local output=$2
    echo "Downloading: $output"
    curl -sL "$url" -o "$output" --max-time 60
}

# ===========================================
# MISSION BOARD (ADMIN) SCREENS
# ===========================================

echo "=== Downloading MISSION BOARD assets ==="

# 1. AK Golf Admin Dashboard
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhtBGlJHqNAKJIbtSVPX9zFYtRCCCkcdUuLHJ4iIq7C0O1OVTToSsaxx1y6XKT9PiAqW4Y2cjxBzG7iNphibGqcnof4WzqYOW6OzMxgDiB2nT1QcnxkKZb1Ap7yJdyoP5AO9clwOO3HwrIvA_tsPa-fdtuzW81vLRKLsCWHk1h3fnp-7Zik6TRWs4eDcjn4i2-9qLn8MdTRMAe6ZtOEA5GgFZcnnq1gwhkLxuq6oqmRx2Be6avxoV1qIYY" "mission-board/01-admin-dashboard.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdkMmEwM2VjNmQ4NDQ2ZDBhYzRhZWRjMGQwN2RiNWYwEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/01-admin-dashboard.html"

# 2. Admin Dashboard v5.0 FINAL
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhx5pCAnHWjodELjHvbbP8jy_iXE5KMYv5R5A6NR9s7Hl7Et-6WrpPGigM_ylxHJNgTS4xXzj8A2zBUYmZaRWWLUVuEaG5p7v5zv8Vjwq_VhQJV0ZB-zyHOmUXtSZUeKhWvr_2wdezSDIYoCa01NmJAsOq5cXnLz2CucdhjbUjAef25v8XD-z1LFPSZoPTut72CwkH7cU-NEjaYmP_8kTBz_pawfaOP-OP_66I5JwiImCzStgvja-WE7cE" "mission-board/02-admin-dashboard-v5.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2IzZjgwOTdiZjFjNDQwYzlhNGQ1MzRlOGQ5NTQ3YTUyEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/02-admin-dashboard-v5.html"

# 3. Admin Analytics Dashboard
download_file "https://lh3.googleusercontent.com/aida/ADBb0uiCrMPlDMfezl8E_EyPsq7U2n_Ot1qBVW6-gpj-TFYO533QhGqZqA3wSELXoQRDWqFRdOEobCwVzf1KMCck5CDQDPy8ho64AqAc7LWa0ZREtmcT8aF8b0blbkAbc7McvM54QQ8s7se5DZig4rAES2VXtx0QUTlVA7Hs-Z-yMnVKtElLnmvzrZw7sisjtrxNgDsp11Yh9uz0jSMEEb51xulcRFHQDfkwKSaxlu1qLXOQps_omn7XUmKMnG8" "mission-board/03-admin-analytics.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JiOTkyNGQ4MzgzMDRkZDZhYmRlYmVkMmQ3ZWY3NWNiEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/03-admin-analytics.html"

# 4. Admin Booking Management
download_file "https://lh3.googleusercontent.com/aida/ADBb0ugpGH77-_zVW8gAIq5tfcu-3wjz2LON4GIULXrnT2y6PmicBnGfBdhtlj5PRFC_oJVzYeQ0gvEhVo4UVMI8cuHHtCk8RpS1qVwq3zKfCoRCBinpHeXdmcTLvnTbkPKK_vXjbLo95-9rgil6guQE3dYKI0bVl_yF5xKJC4aQKHvCOIDGbBPcD8A6Ttl5HudB55iX1XWP5n1nz_q81sZtefCCJMY6VtQ0HYfiXkYFjM1hYC5KWPd8ykExXw" "mission-board/04-admin-booking-management.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI3M2M2MTdiMjM3YTQxYjZhYmQ3MWUyODk0OTgxYzY3EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/04-admin-booking-management.html"

# 5. Admin Waitlist Management
download_file "https://lh3.googleusercontent.com/aida/ADBb0ui-nPltqTJ8uhcOKs0v4PzZ0WAxq9kRclwMIe1e9KxVLN2OYmtp7m8mhaICZD0uUddniOkbl-8a9C8KnCm13HRiGfK2XFdINUr9bB4CG4sYmipSx2ln8urW30qRbfeFXMa44CPldoOCLL7qEwnbV9WTbGx0uFM_A74UDxWHkMzqnqC87jOGNCY3WDuQr-8rC2IOwB-t3aadPKPjy2Ib8JjhyNSvYND2xe6y8UgpQdh6EPKHiqcjEGGAvGk" "mission-board/05-admin-waitlist.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U4ZTRlNmI4ZDFhZDRhMDRhODVmOGYxZDU2NzVhYTQ5EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/05-admin-waitlist.html"

# 6. Elevoversikt (Admin)
download_file "https://lh3.googleusercontent.com/aida/ADBb0ujvtaJrJDSzXdfrXlm9RX1DZNy8SLiQHJq5EEjPJUaq7YeALrkk8B6ewS5nDpIxg9BJXXBwWnpx2XalM_-3fZyl1mGi2os59_lzAqcv7wn6_5es30ko6Bh7ligp7wRsGkbgo2q94LmYlfo04D8BlXYUdkAcO5yn7cI3ft9BogbQ9CUByd_-_ofO860IQjdImM-dxJyFvqY2U689G7oBTSKYrIgchNgX_M-lWKjfvtctCnln6yZF9PhA1Q" "mission-board/06-elevoversikt.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAxODlhMWEwZmNjNTRlYjA4MjMyZGY1NTg0M2I1YTE2EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/06-elevoversikt.html"

# 7. Studentprofil (Admin)
download_file "https://lh3.googleusercontent.com/aida/ADBb0ugHp6VQlRsvv05DAzHanZL8NhZG4eq_ZLe0Q_vKtWSXSczyDKLcBl4b_fizSCKRJBMs9ti3vydk0-v54dJp58pp23tGHwnZe4dAXbX9avf1rIThXIIdVj2lYSd2euatWa-O6fD3GvVBU0JD_WIMODm9-FHjAgiOzqAToOoC7inXspu17b5zKAFDPLD4-Bb-S9dl6ankn20QGD9mkuWjs4W2UfD3o0SSuRfnHBbXUryR-gXBR5X0n1ACdu4" "mission-board/07-studentprofil-admin.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI4MTUwOGMyYjkwMjQ2MjhhNzc2ZThmNjc1YzU1NDViEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/07-studentprofil-admin.html"

# 8. Admin Calendar
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhya6xZWpqUfliPWbRjLbVgBmJj6TFgMNpLoAj5pEaQ_MfoEf48o6dVMxoJUiSi1FKc1ijoywwmArwLLlklNpmqeYFET49DkXeokivRDgIHlzgxAmNaxTRRjf7gBTfFZJ-MBSeFURsWUJSlLecjZV_-pPVMH0mlxgr9_nEPpxMZjVHDU02DTgOqFxsQQcjdd6_seIAl7u_lAx1SJvJ3tFVc9zr8Xmcr1pOo1hqK3SOD3LKGUnyNHwLUZvU" "mission-board/08-admin-calendar.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2RlMmUzZjgyNTk1ZTQ2NzA5MWZjODY1ZDk3NTdjMmY2EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/08-admin-calendar.html"

# 9. Rabattkoder
download_file "https://lh3.googleusercontent.com/aida/ADBb0ujdLKnrURvoQ7YUuwllXzqYHebEO3M9dB4ySHqK1oLcjdO4NtOO6K4f451dI9eSXu9PkloFiFDOYXGEknOeLaftoDXcRvCAgiR2Jrk8ggouAQOnEr7aQTJ4r0cZgVp8OPKKdm0FLYItMpiDvsyBXd136Z_Vs04ZOp_JvIu6Q9Zr1rA_xCsiJ0jjtOK11tYUZYwwxO6m41ltBIG8Ckf8CwLGBLKj_uKf_klw2DHffxWc_u4Vt-vT2RkAzQ" "mission-board/09-rabattkoder.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ2NmYwNDFkMzQyYjQzOTg5MDVjNDJiZjM4MDBjNDRjEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/09-rabattkoder.html"

# 10. Inntektsrapport
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhik4DqUI108Nll692LJIAQM5mhHxwRXzwuv6ZRh-EUDCioEvo8sGJOc1rbQ2BK6jDlcEI8RRCOP9FsA6I1fZkL8Cb1J6ysxftDJ5h7j_XNrAlRPh0_M7Gx6crPYQzyIFnTTGKMVS4uLPfIFaq9cCWPHTJBj2vCOl0VdiKJu6uRu3VFm_7ccZANi9S33V7j2ciJmmneOiuMqi7GJlyWgTcPza7ghdmrauIOI4C8oqmyHdtjdhctocErmMA" "mission-board/10-inntektsrapport.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI3MmJlYjYzYzliOTRmOTM5ZTA0NDdlN2RmNGIxOTVlEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/10-inntektsrapport.html"

# 11. Admin Settings
download_file "https://lh3.googleusercontent.com/aida/ADBb0ujii4hncf6ylzgBlk2U4HA2v3JVBHtcJ8wQ8qEvEwcyMJSSr9YiIMCqIhcT14PVue-CY-_RFTHaZv_ZTR9CZZJ9z-r2TE5rpFlt00mODl00edyY-U8A7lVGQdUKKwUXTvlm3AE4v2H8ZPH11Jh661-gok18v9h9kpkakl5I1qYyOeSE3n-tFAhDijTjy4AfXlNOphxlfX7O0uy4DcnqRA1pE9hd3WC7HDW22RSou8JrEgS-VrxatFVEnFo" "mission-board/11-admin-settings.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzk0MmI1MzNhZmQ0MTQzN2Y4ZGY2YzE4MDMzMzc0NDYxEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "mission-board/11-admin-settings.html"

# ===========================================
# SPILLERPORTAL SCREENS
# ===========================================

echo "=== Downloading SPILLERPORTAL assets ==="

# 1. Academy Player Dashboard (Bento)
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhZ24Ctiki4I72x8DdyvoOv-bxqa_JAo7cBQDaXlU8FQXO4DXDTrWF6OhMht_o2Jf4LzMYnl6jWRBDKKKu7H0441D60cGsVPt1aVZldLKYVlt_e5fOelXkN3xWMzjIRm_T9ASiI8_Q1bP1oWPB0-fLY_cCZD0w5HZejcVIRB6_tVhyNMalQATzLkabNySXUH-1NPSt9YfLkFFr7sOyFhN5ucMHd1igp57uARE6p-BjHfs9CW9S1g-3oYkg" "spillerportal/01-player-dashboard-bento.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZhOGE4NTJhZjlhMDRhMTA4NDUyZDQxY2EzNzQxNmNjEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/01-player-dashboard-bento.html"

# 2. Spillerportal Mobil Dashboard
download_file "https://lh3.googleusercontent.com/aida/ADBb0uilla7Rl9sFknD6QLKVzEEXFnCdqKNyfi-NzCx8sKOK4J8dx6j7LOVODuiyy2ksWN5LQ80yKXAE4NLk4DpENkmO-Q6TYWTSp1d5kS2gAwnfNANTJCUciQ8uzHHrCa_nfxXbCzRs-muVuExxhR8Arzf9ofF_M8TVSBnBgDKKmp_qZCSYuurKBwkMJdQfF_4pU6NGachfWV3kzCk4XGh6XruCP7Kt5XF00VMRmoLrNXRncABTBFCMx9SAMO8" "spillerportal/02-mobil-dashboard.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc4NmNiYTBjODhlZjQ2ZGJiNWRjNjllYzBiMTg5NWIyEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/02-mobil-dashboard.html"

# 3. Din kalender
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhe04AAAY4O7MljB2efxo4Aq-msYBPImaTV6ii2xxKpr7h5gEwxtViGx6Uof_kcLiopuveBAvhJnDDjcr1bcfoo1lW1r-gpAXyxXCve9P4xjPvczFvRlg4mOFqwfzb9KdI1XupRtg_BtG4uGC8Zb_EwkxE4ReB7zTE0owYbfyMH7QHXAxYTSlK2q1Hfx2u4UCJ_8PYOYX3XReqdf7H3epteiGlB7X2FhIEYcdF1Mq5_hA2kjSAiT2Y9Yk8" "spillerportal/03-din-kalender.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFlNWI4YmZlY2FjMDQ4Y2ZhMGZmYTM3Njc1YTZhZTNiEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/03-din-kalender.html"

# 4. Spillerkalender Mobil
download_file "https://lh3.googleusercontent.com/aida/ADBb0uh40zpF26C28TfwFz7fd1jD92mfW8sYwpK5kVa9harv8Sp_7_V66c8DymjHymbi8HWdtsXpC2Kx1Jh2yD3ux0pYBaOpCJTS6uoRb83kYt7Ct1XdVogs9bZ030DZKjkgoPH8WqwDvOI2p88c777NDTIbYHbqadHbJWCrVDETCh3w_WFNoXiKRiDnigaQ4tUn-Xn68jHZLcXjbnfJYQHQTRGRQ2HWjnpHlN2rbvK0zHnzehdiOCrsc5YlWd8" "spillerportal/04-kalender-mobil.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzVmMTU5ZDBiYmJlMDQ1ZGViN2EwZDUxNzJhM2VjYzUxEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/04-kalender-mobil.html"

# 5. Training Plan v5.0 FINAL
download_file "https://lh3.googleusercontent.com/aida/ADBb0ui4UTA69wOuxtflcEXCwal1fnvYFhWA3hQ6efnWSpQh5DDWYkiwTNNoV85BChEdKZkotRm1AQEO85zO-bmCmD3sCQYB9fnO4BkYmT8w6wvd0QzIzLuih_Ey9ClHSEF5JbY1OMf13kwJYTnHaO-PL0ddHn-OH2n_6ZMvSQzFZ7stq84tZ2mDt6GSpoP110HWklsj7GUXqxGtZoXTHIlcNoDtbpAMvpKo4Pd7YFRSH94pDf57_Uam3o0AANQ" "spillerportal/05-training-plan.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA1OGZkNDYxYWIzYTQ1NDE4NzQ0Nzc0Nzk1M2E1NTc4EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/05-training-plan.html"

# 6. Player Statistics
download_file "https://lh3.googleusercontent.com/aida/ADBb0uig4-tnU2QLYMAD6yeQqnglsloTCE3zbTqUcueZvbzKY3QugfU4AhZrwWjFaP4GZgNX8hYBesEZ0RFjf1BHnZCtrB3itr2oPmCWzEuILDpJpu3n7G69DoruHaVRC1lq4TC39UTSb4LpRgnwbjvt5TpllHWVkpLWzlOFPkOSohtpj-LM8e7I6yAn1uT0jS3fjg0CDCK02WPeLCctq2R2XzKkoWIzG6OcRV-1GY8EAmD3ZDljttgFh0HJqhw" "spillerportal/06-statistics.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U0ZjZkNDRmNzE5ZjQ1NTJhNmU0YjY3MzM1YmE0Yzg0EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/06-statistics.html"

# 7. Din profil
download_file "https://lh3.googleusercontent.com/aida/ADBb0uinDyVsI6sHYiVe3mwkNEWfJTt5Po0vA2J6BBfaC_Sm_t03EAbgyLI0OhWrt8z3pBv99Y9bHKeOJSxcArW6kqtzbyhO_MxmjlFmB9y7bSpaHfpWqUnrA1rLJD7ABmkBOrc9wC-VW6R0SS46j9M-pR1BQ7mJ2P-BJWbvOVwwrYN5SAUfsAUwW3qtXX8AZ_3Huo-IawzO_5pazA8rELznz4LykkjLfAGRsnJO3IqjsKMlciF51bZWChfuckc" "spillerportal/07-din-profil.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2EwMzBiODQ0ZTE3YzRjNTFhM2IwYzY4OWFjNTU0NTJlEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/07-din-profil.html"

# 8. Økt-detaljer
download_file "https://lh3.googleusercontent.com/aida/ADBb0ujiLox0j7woXXsf1ok45VGDNrVt6wc3AWwZ_LleSqp80lbssOh9PHaLQEeVy7tAKhG5QkOcSNUsHsAkrn5d3_akqfyxbcJ5mi4EzOwdINCUr0HEzpYBb0tIVoWaSWaWc0TZtiPgdNNumKs2gjBtvfvOQ1epPnHnteHd1YvxeR6dDAL6D8UHbdrQ2YaieiQ9Y2OQbYHt58XOvTilEWgF-k16oho-T6uy6Wu_870qp4agY39Uuzr11BTqJQA" "spillerportal/08-okt-detaljer.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzFiYTY0ODdjNjdmZjQ0Yzc5M2Y5ODIzNmQwZDA1NGEzEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/08-okt-detaljer.html"

# 9. Notater fra timen - Mobil
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhpu5Q4kS81AE_XUffZ3iFnhRKQnEr4E1jQCAwBHnkXoxQhbGVQ9f25qEghWV-jlBOBm-vXYC04gGRlLAn76F8bxWUZbutm-OzS6Co6_jFFggzt41JXEd3IlS73JVNsZ7FKRUYHEvbwfFuRKOtZLpGXiy9zOkDvE-0PvSRswy4jAAdJ1HzZ7eNAt5lKjjwOE8FlLKJf0mbbjTmday75OsYcNIxnNs1kTEhfIxv28mkS24Fqz-p-IxsjgRc" "spillerportal/09-notater-mobil.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzRjNGQ5MGQ0MTRkMDQzMDhhNDlhYzRlMWFiYzA2MGMwEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "spillerportal/09-notater-mobil.html"

# ===========================================
# SHARED SCREENS (Booking, Auth, etc.)
# ===========================================

echo "=== Downloading SHARED assets ==="

# Login
download_file "https://lh3.googleusercontent.com/aida/ADBb0ugZRPAKLnmY1_4kdijL06gmhcUOCJAzITzU7ZIU2Mzxsz6DZ7ToV2KNUCVCM_aiBBpwSH742RSJRZT5QyPPtW3bG5BNKX7dbbMO14DXWzo6YXaVsxYpjOY3yO463K6SX5pTHclj6lqunyS7oUhfiwIwe0XAcAbYUrm8UhvPugp1-jHc17IUzsxAMBM6xrBlWw4kjN6C5MKSgpMnnIW5FF6D6Sqcl0tuKksqclLbEqCiu2-0OkU_BIcds38" "shared/01-login.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2VhY2E0MDM2ZTg0ZjRmMThiNjJjOTFiZmY2ZGYyNTIxEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "shared/01-login.html"

# Booking Wizard Step 1
download_file "https://lh3.googleusercontent.com/aida/ADBb0ujy5fBmKzX2XzXJ2CqNzzA0mc1B8G_QwNBtb8SrTiYPA1QQfQ1wQpQaoN8blJa5lExdxXIz_RXtjtsshI3cm2mZpcSDWUWCbQtZSoP93g2gcqbR1icOqVXcYngJGuj4sZq1GOFZSdtpebYCrWlmdrsSdKLfBa5wNuBlcfE3nAehkkF8ajiCKgBW23hD68giMYjk8F0_QS75QAjeRRP74nnS3GqMXY4N8gDTdjz1oVPmppetO-C7wkDrg6Q" "shared/02-booking-step1.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2NkNTk3NDVjMWZkNzRiYjFiY2NkODc5ZDExYzljYjE3EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "shared/02-booking-step1.html"

# Booking Step 2
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhzreW0xr3m0sYDp3jlaDWhxcW3zyz_FdQrRyNcual2XSi98xHoRbtPh3XnBs0FzN2OOADVIqSdc5a3YvItS81P8mT98AJtYUrckZMXyLwoc3pb94qgN_YYRG8yP_7Mds0bTsQ1PtzDo3S2AbxlFmTEPUmtBkjYLpc5o4_d3Am1zbezgE_VUF2qHNfyCztEhda22Y7bAFcdsRwFPvo0CjPnf7YKAX5_rkI_PFNnYekPP8zjh05JQxGnD7s" "shared/03-booking-step2.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzgzODEyOGYwYjM5ZjQ2ODA4NTViMzBlZDdlN2M5Y2NlEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "shared/03-booking-step2.html"

# Booking Checkout Step 4
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhhWWeleEKAxK1qEFC9AObg4Z4wgpHHD15sBeUPPkPWHElHTaGqEeXmZm-UGR2sSErjFf-hIdxpcoRKtN43YiuNJ-loMmWKEghuV5mPGLGahf5g3Vt-b1zchIPvh1LZwXflUwKVvWf694sR9YJieqzdt305NeYHFrQauCHhOPZf2v0c5xtKbdMblv1nVWPanAZmX8GCtIWvZCA_iUFgG43hEYqYIrJcuOnzvfurtq0SWMg_Hi8mWjxM3A" "shared/04-booking-checkout.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2UzZTA3NTQ2NGE0ODQ2MTdhOWU2ZGRiNWYyYjM3ZThmEgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "shared/04-booking-checkout.html"

# Booking Success
download_file "https://lh3.googleusercontent.com/aida/ADBb0uhXI47tdgRSEMgq5vdRXXjyitiT8Z3BZqGLAhoyoyOwT0A6Opx3ElB26nVtiixthj7h5B5_OpRn0pkEbPv0e-nc4Yy6sIowhdZkztGa4APBamNSo4EPaykgrqxgFPo8B_moNzboWa36tnO_I4U3Ur1fIm_3gZdOozGXHhxuWqbA_1QAxe4MtRHlezCVks4Bl61TrYPMTebDi5U7J7guOSnQVp9_PPEf_CoXvfttjs-M5mS1U-arwG8nQgU" "shared/05-booking-success.png"
download_file "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ2MzU3YThhZDgyYzRjY2U4ZWI5M2RjNDlhMDViMDI2EgsSBxCX5Z3QmhkYAZIBIwoKcHJvamVjdF9pZBIVQhM4NzUxMTQwNTYwNTE1MjU5NTk0&filename=&opi=96797242" "shared/05-booking-success.html"

echo "=== Download complete! ==="
echo "Assets saved to:"
echo "  - stitch-assets/mission-board/ (11 screens)"
echo "  - stitch-assets/spillerportal/ (9 screens)"
echo "  - stitch-assets/shared/ (5 screens)"
