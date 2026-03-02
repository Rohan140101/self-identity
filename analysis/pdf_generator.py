from turtle import color

from matplotlib.lines import lineStyles
import matplotlib.pyplot as plt
import numpy as np
from xhtml2pdf import pisa
import base64
from io import BytesIO

def generate_full_identity_report(data, user_email, filename):
    plt.figure(figsize=(7, 3))
    x = np.linspace(0, 100, 1000)
    y = np.exp(-0.5 * ((x-50)/15)**2)
    plt.plot(x, y, color="#cbd5e1", lw=2)

    pcts = data['optimized_result']['percentiles']
    colors = {'actual_pct': '#3b82f6', 'predicted_pct': '#a855f7', 'optimized_pct': '#22c55e'}

    for key, val in pcts.items():
        plt.axvline(x=val, color=colors[key], label=key.replace("_pct", ""))
        plt.text(val, 1.1, f"{val:.1f}", color=colors[key], fontweight="bold", ha="center")

    plt.axis("off")
    plt.legend()

    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png', bbox_inches='tight', transparent=True)
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
    plt.close()


    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Helvetica, sans-serif; padding: 20px; color: #1e293b; }}
            h1 {{ font-size: 24px; color: #0f172a; margin-bottom: 5px; }}
            h2 {{ font-size: 16px; color: #1e293b; margin-top: 30px; border-left: 4px solid #3b82f6; padding-left: 10px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 10px; border-radius: 8px; overflow: hidden; table-layout: fixed;}}
            th {{ background-color: #0f172a; color: white; padding: 10px; font-size: 12px; text-align: left; }}
            td {{ padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }}
            .text-center {{ text-align: center; }}
            .highlight-box {{ background-color: #f8fafc; padding: 15px; border-radius: 10px; border-left: 4px solid #3b82f6; margin-top: 15px; }}
            .new-badge {{ background-color: #dcfce7; color: #15803d; font-size: 8px; padding: 2px 5px; border-radius: 10px; font-weight: bold; }}
        </style>
    </head>
    <body>
        <header>
            <h1>Your Identity Report</h1>
            <p style="color: #64748b;">Generated for: {user_email}</p>
        </header>

        <h2>Top Identity Components</h2>
        <table>
            <thead>
                <tr>
                    <th>Identity Component</th>
                    <th class="text-center">Agreement %</th>
                    <th class="text-center">Top 5 %</th>
                    <th class="text-center">Happiness Pct</th>
                </tr>
            </thead>
            <tbody>
                {"".join([f"<tr><td><i>{row['component']}</i></td><td class='text-center'>{row['agree_pct']:.1f}%</td><td class='text-center'>{row['top5_pct']:.1f}%</td><td class='text-center'>{row['happiness_pct']:.1f}</td></tr>" for row in data['top_identity_table']])}
            </tbody>
        </table>
        <div style="page-break-before: always;"></div>"""
    
    html_content += f"""
    <h2>2. Expected vs. Actual Identity</h2>
    <table>
        <thead>
            <tr style="background-color: #0f172a; color: white;">
                <th style="width: 50%; padding: 12px; text-align: left;">Identity Component</th>
                <th style="width: 25%; padding: 12px; text-align: center;">Predicted Rank</th>
                <th style="width: 25%; padding: 12px; text-align: center;">Actual Rank</th>
            </tr>
        </thead>
        <tbody>
    """

    for row in data['expected_vs_actual_rank_table']:
        is_matched = bool(row.get('actual_rank'))
        
        # Matching the styling from your images (image_19b4d2.png)
        bg_style = "background-color: #f0fdf4;" if is_matched else ""
        text_color = "#15803d" if is_matched else "#1e293b"
        
        html_content += f"""
            <tr style="{bg_style}">
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: {text_color};">
                    {row['component']}{' ★' if is_matched else ''}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b;">
                    #{row['predicted_rank']}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: bold;">
                    {'#' + str(row['actual_rank']) if is_matched else ''}
                </td>
            </tr>
        """

    html_content += "</tbody></table>"

    html_content +=  f"""
        <h2>Expected vs. Actual Well Being</h2>
        <table>
            <thead>
                <tr>
                    <th>Well Being Category</th>
                    <th class="text-center">Percentile as per Actual Answers</th>
                    <th class="text-center">Percentile as per Predicted Answers</th>
                </tr>
            </thead>
            <tbody>
                {"".join([f"<tr><td>{row['wellBeingChoice']}</td><td class='text-center'>{row['actualPct']:.1f}</td><td class='text-center'>{row['predictedPct']:.1f}</td></tr>" for row in data['expected_vs_actual_rank_well_being']])}
            </tbody>
        </table>

        <h2>Happiness Optimization</h2>
        <div style="text-align: center; background: #f8fafc; padding: 10px; border-radius: 10px;">
            <img src="data:image/png;base64,{img_base64}" width="450">
        </div>

        <div class="highlight-box">
            <p>{data['optimized_result']['optimization_message']['message']}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Current Ranking</th>
                    <th style="color: #d8b4fe;">Predicted Ranking</th>
                    <th style="color: #86efac;">Optimized Ranking</th>
                </tr>
            </thead>
            <tbody>
                {"".join([f"<tr><td>#{i+1}</td><td>{data['optimized_result']['actual_top5'][i]}</td><td>{data['optimized_result']['predicted_top5'][i]}</td><td>{data['optimized_result']['optimized_top5'][i]}</td></tr>" for i in range(5)])}
            </tbody>
        </table>

    </body>
    </html>
    """


    # with open(f"report_{user_email.split('@')[0]}.pdf", "wb") as f:
    #     pisa.CreatePDF(html_content, dest=f)
    with open(filename, "wb") as f:
        pisa.CreatePDF(html_content, f)
    return "PDF Generated"





# sample_data = {'top_identity_table': [{'component': 'Generation', 'agree_pct': 0.75, 'top5_pct': 12.375, 'happiness_pct': np.float64(52.704718588250444)}, {'component': 'Sexual Orientation', 'agree_pct': 3.875, 'top5_pct': 20.625, 'happiness_pct': np.float64(45.142437606129796)}, {'component': 'Occupation', 'agree_pct': 4.75, 'top5_pct': 20.625, 'happiness_pct': np.float64(50.59731927600028)}, {'component': 'Location', 'agree_pct': 3.75, 'top5_pct': 13.375, 'happiness_pct': np.float64(49.36153971653438)}, {'component': 'Education', 'agree_pct': 5.0, 'top5_pct': 26.375, 'happiness_pct': np.float64(51.01694693324084)}], 'expected_vs_actual_rank_table': [{'component': 'Sports', 'predicted_rank': 1, 'actual_rank': ''}, {'component': 'Family Relations', 'predicted_rank': 2, 'actual_rank': ''}, {'component': 'Personality Traits', 'predicted_rank': 3, 'actual_rank': ''}, {'component': 'Generation', 'predicted_rank': 4, 'actual_rank': 1}, {'component': 'Entertainment', 'predicted_rank': 5, 'actual_rank': ''}, {'component': 'Ethnicity', 'predicted_rank': 6, 'actual_rank': ''}, {'component': 'Self Perception', 'predicted_rank': 7, 'actual_rank': ''}, {'component': 'Lifestyle', 'predicted_rank': 8, 'actual_rank': ''}, {'component': 'Service', 'predicted_rank': 9, 'actual_rank': ''}, {'component': 'Politics', 'predicted_rank': 10, 'actual_rank': ''}, {'component': 'Appearance and Age', 'predicted_rank': 11, 'actual_rank': ''}, {'component': 'Occupation', 'predicted_rank': 12, 'actual_rank': 3}, {'component': 'Education', 'predicted_rank': 13, 'actual_rank': 5}, {'component': 'Economic Role and Status', 'predicted_rank': 14, 'actual_rank': ''}, {'component': 'Social Media', 'predicted_rank': 15, 'actual_rank': ''}, {'component': 'Hobbies', 'predicted_rank': 16, 'actual_rank': ''}, {'component': 'Health', 'predicted_rank': 17, 'actual_rank': ''}, {'component': 'Religion', 'predicted_rank': 18, 'actual_rank': ''}, {'component': 'Location', 'predicted_rank': 19, 'actual_rank': 4}, {'component': 'Sexual Orientation', 'predicted_rank': 20, 'actual_rank': 2}], 'expected_vs_actual_rank_well_being': [{'wellBeingChoice': 'Happy', 'actualPct': np.float64(37.266983633920034), 'predictedPct': np.float64(49.38978360848639)}, {'wellBeingChoice': 'Good Person', 'actualPct': np.float64(46.40979387003225), 'predictedPct': np.float64(36.477045489831895)}, {'wellBeingChoice': 'Successful', 'actualPct': np.float64(65.82444033992074), 'predictedPct': np.float64(25.812351004299817)}, {'wellBeingChoice': 'Resilient', 'actualPct': np.float64(48.32733795534717), 'predictedPct': np.float64(72.31360163195191)}, {'wellBeingChoice': 'Extrovert', 'actualPct': np.float64(48.95016702471609), 'predictedPct': np.float64(76.24818426326956)}], 'optimized_result': {'optimized_top5': ['Family Relations', 'Generation', 'Education', 'Occupation', 'Location'], 'actual_top5': ['Generation', 'Sexual Orientation', 'Occupation', 'Location', 'Education'], 'predicted_top5': ['Sports', 'Family Relations', 'Personality Traits', 'Generation', 'Entertainment'], 'percentiles': {'actual_pct': np.float64(37.266983633920034), 'predicted_pct': np.float64(49.38978360848639), 'optimized_pct': np.float64(96.11410462395139)}, 'optimization_message': {'case': 3, 'message': "By incorporating 'Family Relations' into your top priorities, you could significantly boost your happiness percentile from 37.3th to 96.1th.", 'actual_pct': np.float64(37.266983633920034), 'opt_pct': np.float64(96.11410462395139), 'added_component': 'Family Relations'}}}

# generate_full_identity_report(sample_data, "user@example.com")