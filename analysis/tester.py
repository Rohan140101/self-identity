
import string

from playwright.sync_api import sync_playwright
import plotly.graph_objects as go
import numpy as np
from scipy.stats import norm
import base64
from io import BytesIO

user_email = "rkuckian@cs.stonybrook.edu"
data = {'email': 'rkuckian@cs.stonybrook.edu', 
        'top_identity_table': [
            {'component': 'Ethnicity', 'agree_pct': 1.875, 'top5_pct': 21.25, 'happiness_pct': 46.13593691045414}, 
            {'component': 'Religion', 'agree_pct': 5.625, 'top5_pct': 29.5, 'happiness_pct': 52.21064958419331}, 
            {'component': 'Generation', 'agree_pct': 2.75, 'top5_pct': 12.375, 'happiness_pct': 52.704718588250444}, 
            {'component': 'Occupation', 'agree_pct': 4.75, 'top5_pct': 20.625, 'happiness_pct': 50.59731927600028}, 
            {'component': 'Social Media', 'agree_pct': 1.625, 'top5_pct': 4.625, 'happiness_pct': 45.08980470452452}
        ], 
        'expected_vs_actual_rank_table': [
            {'component': 'Hobbies', 'predicted_rank': 1, 'actual_rank': ''}, 
            {'component': 'Personality Traits', 'predicted_rank': 2, 'actual_rank': ''}, 
            {'component': 'Health', 'predicted_rank': 3, 'actual_rank': ''}, 
            {'component': 'Appearance and Age', 'predicted_rank': 4, 'actual_rank': ''}, 
            {'component': 'Self Perception', 'predicted_rank': 5, 'actual_rank': ''},
            {'component': 'Generation', 'predicted_rank': 8, 'actual_rank': 3}, 
            {'component': 'Religion', 'predicted_rank': 10, 'actual_rank': 2}, 
            {'component': 'Occupation', 'predicted_rank': 12, 'actual_rank': 4}, 
            {'component': 'Ethnicity', 'predicted_rank': 18, 'actual_rank': 1}, 
            {'component': 'Social Media', 'predicted_rank': 20, 'actual_rank': 5}
        ], 
        'expected_vs_actual_rank_well_being': [
            {'wellBeingChoice': 'Happy', 'actualPct': 34.80509485583412, 'predictedPct': 21.861432861557773}, 
            {'wellBeingChoice': 'Good Person', 'actualPct': 10.112272861351524, 'predictedPct': 92.6154826375004}, 
            {'wellBeingChoice': 'Successful', 'actualPct': 52.897488092189036, 'predictedPct': 19.89133632890221}, 
            {'wellBeingChoice': 'Resilient', 'actualPct': 12.561496841609976, 'predictedPct': 89.20758214959537}, 
            {'wellBeingChoice': 'Extrovert', 'actualPct': 91.31684641577232, 'predictedPct': 2.026036575907103}
        ], 
        'optimized_result': {
            'Happy': {
                'optimized_top5': ['Religion', 'Generation', 'Ethnicity', 'Occupation', 'Family Relations'], 
                'actual_top5': ['Ethnicity', 'Religion', 'Generation', 'Occupation', 'Social Media'], 
                'predicted_top5': ['Hobbies', 'Personality Traits', 'Health', 'Appearance and Age', 'Self Perception'],
                'percentiles': {'actual_pct': 34.80509485583412, 'predicted_pct': 21.861432861557773, 'optimized_pct': 72.09376994004131}, 
                'optimization_message': {'case': 3, 'message': "By incorporating 'Family Relations' into your top priorities, you could significantly boost your happiness percentile from 34.8th to 72.1th.", 
        'actual_pct': 34.80509485583412, 'opt_pct': 72.09376994004131, 'added_component': 'Family Relations'}
        }, 'Good Person': {'optimized_top5': ['Ethnicity', 'Generation', 'Religion', 'Self Perception', 'Occupation'], 'actual_top5': ['Ethnicity', 'Religion', 'Generation', 'Occupation', 'Social Media'], 'predicted_top5': ['Hobbies', 'Personality Traits', 'Health', 'Appearance and Age', 'Self Perception'], 'percentiles': {'actual_pct': 10.112272861351524, 'predicted_pct': 92.6154826375004, 'optimized_pct': 48.843556081399846}, 'optimization_message': {'case': 3, 'message': "By incorporating 'Self Perception' into your top priorities, you could significantly boost your goodness percentile from 10.1th to 48.8th.", 'actual_pct': 10.112272861351524, 'opt_pct': 48.843556081399846, 'added_component': 'Self Perception'}}, 'Successful': {'optimized_top5': ['Ethnicity', 'Religion', 'Service', 'Generation', 'Occupation'], 'actual_top5': ['Ethnicity', 'Religion', 'Generation', 'Occupation', 'Social Media'], 'predicted_top5': ['Hobbies', 'Personality Traits', 'Health', 'Appearance and Age', 'Self Perception'], 'percentiles': {'actual_pct': 52.897488092189036, 'predicted_pct': 19.89133632890221, 'optimized_pct': 93.56523215655199}, 'optimization_message': {'case': 3, 'message': "By incorporating 'Service' into your top priorities, you could significantly boost your success percentile from 52.9th to 93.6th.", 'actual_pct': 52.897488092189036, 'opt_pct': 93.56523215655199, 'added_component': 'Service'}}, 'Resilient': {'optimized_top5': ['Ethnicity', 'Generation', 'Religion', 'Service', 'Occupation'], 'actual_top5': ['Ethnicity', 'Religion', 'Generation', 'Occupation', 'Social Media'], 'predicted_top5': ['Hobbies', 'Personality Traits', 'Health', 'Appearance and Age', 'Self Perception'], 'percentiles': {'actual_pct': 12.561496841609976, 'predicted_pct': 89.20758214959537, 'optimized_pct': 66.89277728093361}, 'optimization_message': {'case': 3, 'message': "By incorporating 'Service' into your top priorities, you could significantly boost your resilience percentile from 12.6th to 66.9th.", 'actual_pct': 12.561496841609976, 'opt_pct': 66.89277728093361, 'added_component': 'Service'}}, 'Extrovert': {'optimized_top5': ['Ethnicity', 'Religion', 'Service', 'Generation', 'Occupation'], 'actual_top5': ['Ethnicity', 'Religion', 'Generation', 'Occupation', 'Social Media'], 'predicted_top5': ['Hobbies', 'Personality Traits', 'Health', 'Appearance and Age', 'Self Perception'], 'percentiles': {'actual_pct': 91.31684641577232, 'predicted_pct': 2.026036575907103, 'optimized_pct': 98.68765550216013}, 'optimization_message': {'case': 3, 'message': "By incorporating 'Service' into your top priorities, you could significantly boost your extrovertedness percentile from 91.3th to 98.7th.", 'actual_pct': 91.31684641577232, 'opt_pct': 98.68765550216013, 'added_component': 'Service'}}}}



reportCatDescriptions = {
    "Happy": {
        "category": "Happiness",
        "definition": "refers to your overall sense of life satisfaction, emotional well-being, and perceived fulfillment in personal and social life."
    },
    "Good Person": {
        "category": "Goodness",
        "definition": "refers to your perception of your own moral character, including kindness, honesty, empathy, and ethical behavior toward others."
    },
    "Successful": {
        "category": "Success",
        "definition": "refers to your perceived achievements, accomplishments, and progress toward personal, professional, or societal goals."
    },
    "Resilient": {
        "category": "Resilience",
        "definition": "refers to your perceived ability to cope with adversity, recover from setbacks, and adapt positively to challenging situations."
    },
    "Extrovert": {
        "category": "Extrovertedness",
        "definition": "refers to your tendency toward sociability, outward expression, and preference for engaging with others in social environments."
    }
}




def get_plot_base64(fig):
    buf = BytesIO()
    fig.write_image(buf, format="png", scale=3)
    buf.seek(0)
    base64_string = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{base64_string}"

def get_bell_curve(actual: float, optimized: float, wb_cat_name: string):
    mu, sigma = 50, 14
    x = np.linspace(0, 100, 1000)
    y = norm.pdf(x, mu, sigma)
    y_max = max(y)

    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=x, y=y, mode='lines', fill='tozeroy',
        fillcolor='rgba(99, 102, 241, 0.05)',
        line=dict(color='#6366f1', width=2.5),
        showlegend=False,
        hoverinfo='skip'
    ))


    fig.add_trace(go.Scatter(x=[None], y=[None], mode='lines', 
                            line=dict(color='#94a3b8', width=3, dash='dash'), name='Population Avg'))
    fig.add_trace(go.Scatter(x=[None], y=[None], mode='lines', 
                            line=dict(color='#2791F5', width=5), name=f'Current {wb_cat_name}'))
    fig.add_trace(go.Scatter(x=[None], y=[None], mode='lines', 
                            line=dict(color='#10b981', width=5), name=f'Optimized {wb_cat_name}'))

    fig.add_vline(x=mu, line_width=2, line_dash="dash", line_color="#94a3b8")
    fig.add_vline(x=actual, line_width=4, line_color="#2791F5")
    fig.add_vline(x=optimized, line_width=4, line_color="#10b981")

    fig.add_annotation(
        x=optimized,      
        y=y_max * 0.2,   
        ax=actual,        
        ay=y_max * 0.2, 
        xref="x", yref="y",
        axref="x", ayref="y",
        text="",         
        showarrow=True,
        arrowhead=2,
        arrowsize=1.2,
        arrowwidth=2,
        arrowcolor="#10b981"
    )

    fig.add_annotation(
        x=(actual + optimized) / 2, \
        y=y_max * 0.20,
        xref="x", yref="y",
        text="GROWTH",
        showarrow=False,
        font=dict(size=13, color="#10b981", family="Arial Black"),
        yshift=15 
    )


    def add_bubble(val, color):
        fig.add_annotation(
            x=val, y=norm.pdf(val, mu, sigma) + 0.003,
            text=f"<b>{int(val)}%</b>",
            showarrow=False,
            font=dict(size=15, color=color, family="Arial"),
            bgcolor="white", bordercolor=color, borderwidth=2, borderpad=5
        )

    add_bubble(actual, "#2791F5")
    add_bubble(optimized, "#059669")


    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        margin=dict(t=130, b=60, l=50, r=50), 
        height=600,
        width=1000,
        showlegend=True,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.05,
            xanchor="center",
            x=0.2,
            font=dict(size=16, color="#334155"),
            itemsizing="constant",               
            itemwidth=60
        ),
        xaxis=dict(
            range=[0, 100],
            showgrid=False,
            zeroline=False,
            tickvals=[0, 50, 100],
            ticktext=[f'<b>LOW {wb_cat_name.upper()}</b>', '<b>POPULATION AVERAGE</b>', f'<b>HIGH {wb_cat_name.upper()}</b>'],
            tickfont=dict(size=11, color='#94a3b8')
        ),
        yaxis=dict(
            visible=False,
            range=[0, y_max * 1.4]
        )
    )

    # fig.write_image("bell_curve_professional.png", scale=3)
    # fig.show()
    return fig




def get_message(optimization_message, wb_cat_name):
    styles = {
        "variable": "text-purple-600 font-bold",
        "category": "text-blue-600 font-bold",
        "number": "text-black font-bold",
    }

    actual_pct = optimization_message["actual_pct"]
    opt_pct = optimization_message["opt_pct"]
    msgCase = optimization_message["case"]
    added_component = optimization_message["added_component"]

    actual = f"<span class={styles["number"]}>{actual_pct:.1f}th</span>"
    opt = f"<span class={styles["number"]}>{opt_pct:.1f}th</span>"
    variable = f"<span class={styles["variable"]}>{wb_cat_name}</span>"

    message = optimization_message["message"]
    if msgCase == 1:
        message = f"Your current identity ranking is already optimized for {variable}! You are in the {actual} percentile."
    elif msgCase == 2:
        message = f"By simply reprioritizing your current identities, you could move from the {actual} to the {opt} percentile of {variable}."
    elif msgCase == 3:
        message = f"By incorporating <span class={styles["category"]}>{added_component}</span> into your top priorities, you could significantly boost your {variable} percentile from {actual} to {opt}."
    

    boxColor = "bg-blue-50 border-blue-500" if msgCase == 1 else "bg-green-50 border-green-500"
    return f"""
    <div class="p-6 rounded-xl border-l-4 mb-8 shadow-sm transition-all {boxColor}">
            <p class="text-lg font-medium text-slate-800 leading-relaxed">
                {message}
            </p>
        </div>
    """


# Starting HTML Content

html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        slate: {{ 900: '#0f172a', 800: '#1e293b', 700: '#334155', 100: '#f1f5f9' }},
                    }}
                }}
            }}
        }}
    </script>"""

html_content += """
</head>
<body class="bg-white p-10">
    <header class="mb-10 border-b border-slate-100 pb-6">
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Identity Report
        </h1>
        <p class="text-slate-500 mt-2">Generated for: {user_email}</p>
    </header>
"""



# Identity Optimization Analysis
html_content += """
<section class='mt-16'>
            <h2 class="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                Identity Optimization Analysis
            </h2>

            <p class="text-slate-700 mt-2 pb-10">
                Now that we know the aspects of your personal identity that you feel are most important, we can make inferences about several aspects of your personality and well-being.   For each of these attributes (happiness, goodness, success, resilience, extrovertedness) we show where you sit relative to the U.S. population, and where you could be with minor changes in which identity components you prioritize.
            </p> """

i = 1
for key, optimized_result_data in data['optimized_result'].items():
    catDescData = reportCatDescriptions[key]
    actual_top5 = optimized_result_data["actual_top5"]
    optimized_top5 = optimized_result_data["optimized_top5"]
    fig = get_bell_curve(actual=optimized_result_data['percentiles']['actual_pct'],
                         optimized=optimized_result_data['percentiles']['optimized_pct'],
                         wb_cat_name=catDescData['category'])
    fig_data = get_plot_base64(fig)
    html_content += f"""
        <div class="mt-8 break-after-page mb-10">
        <h2 class="text-lg font-bold flex gap-2 mb-5">{i}. {key} </h2>
        <div class="p-6 rounded-xl border-l-4 mb-8 shadow-sm bg-yellow-50 border-yellow-500">
            <span class='text-lg font-bold text-purple-600 leading-relaxed'>
                {catDescData['category'] + " "}
            </span>
            <span class='text-lg font-medium text-slate-800 leading-relaxed'>
                {catDescData['definition']}
            </span>

        </div>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8">
            <img src="{fig_data}" class="w-full rounded-3xl shadow-lg">
        </div>

        {get_message(optimized_result_data['optimization_message'], wb_cat_name=catDescData['category'])}

    """


    html_content += """
    <div class='overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white'>
        <table class='w-full text-left border-collapse'>
            <thead>
                <tr class='bg-slate-900'>
                    <th class='p-4 text-sm font-semibold text-white'>Rank</th>
                    <th class='p-4 text-sm font-semibold text-white'>Your Current Identity</th>
                    <th class='p-4 text-sm font-semibold text-green-300'>Better Identity for You</th>
                </tr>
            </thead>
            <tbody class='divide-y divide-slate-100'>
    """

    for j in range(5):
        cur_index_actual = actual_top5[j]
        cur_index_opt = optimized_top5[j]
        newCatBool = True if not cur_index_opt in actual_top5 else False
        catColor = "text-green-600" if newCatBool else "text-slate-900"
        html_content += f"""
            <tr key={j} class='hover:bg-slate-50 transition-colors'>
                <td class='p-4 font-mono text-slate-400'>#{j + 1}</td>
                <td class='p-4 text-slate-700 font-medium'>{cur_index_actual}</td>
                <td class='p-4 text-slate-700 font-medium'>
                    <span class="font-bold {catColor}">
                        {cur_index_opt}
                    </span>
                        {'<span class="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">NEW</span>' if newCatBool else ""}
                </td>

            </tr>
        """






    html_content += """
    </tbody>
    </table>
    </div>
    </div>
"""
    i += 1


html_content += """
</section>
"""



            

#             <div class={"p-6 rounded-xl border-l-4 mb-8 shadow-sm bg-yellow-50 border-yellow-500"}>
#                 <span class='text-lg font-bold text-purple-600 leading-relaxed'>
#                     {catDesc.category + " "}
#                 </span>
#                 <span class='text-lg font-medium text-slate-800 leading-relaxed'>
#                     {catDesc.definition}
#                 </span>

#             </div>

#             <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8">
#                 <HappinessBellCurve
#                     actual={current.percentiles.actual_pct}
#                     optimized={current.percentiles.optimized_pct}
#                 />
#             </div>

#             {/* <div class={`p-6 rounded-xl border-l-4 mb-8 shadow-sm
#         ${msg.case === 1 ? "bg-blue-50 border-blue-500" : "bg-green-50 border-green-500"}`}>
#                 <p class='text-lg font-medium text-slate-800 leading-relaxed'>
#                     {msg.message}
#                 </p>
#             </div> */}

#             <HighlightedMessage msg={msg}
#                 wb_cat_name={catDesc.category} />

#             <div class='overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white'>
#                 <table class='w-full text-left border-collapse'>
#                     <thead>
#                         <tr class='bg-slate-900'>
#                             <th class='p-4 text-sm font-semibold text-white'>Rank</th>
#                             <th class='p-4 text-sm font-semibold text-white'>Your Current Identity</th>
#                             {/* <th class='p-4 text-sm font-semibold text-purple-300'>Predicted Ranking</th> */}
#                             <th class='p-4 text-sm font-semibold text-green-300'>Better Identity for You</th>
#                         </tr>
#                     </thead>
#                     <tbody class='divide-y divide-slate-100'>
#                         {[0, 1, 2, 3, 4].map((i) => (
#                             <tr key={i} class='hover:bg-slate-50 transition-colors'>
#                                 <td class='p-4 font-mono text-slate-400'>#{i + 1}</td>
#                                 <td class='p-4 text-slate-700 font-medium'>{current.actual_top5[i]}</td>
#                                 {/* <td class='p-4 text-slate-700 font-medium'>{current.predicted_top5[i]}</td> */}
#                                 <td class='p-4 text-slate-700 font-medium'>
#                                     <span class={`font-bold ${!current.actual_top5.includes(current.optimized_top5[i]) ? "text-green-600" : "text-slate-900"}`}>
#                                         {current.optimized_top5[i]}
#                                     </span>
#                                     {!current.actual_top5.includes(current.optimized_top5[i]) && (
#                                         <span class="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">NEW</span>
#                                     )}
#                                 </td>
#                             </tr>
#                         ))}
#                     </tbody>
#                 </table>
#             </div>
# """




# # Expected vs Actual Identity

html_content += """
<section class="mt-16">
        <h2 class="text-xl font-bold mb-5 text-slate-800 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Expected vs. Actual Identity
        </h2>
        <p class="text-slate-600 mt-2 pb-10 leading-relaxed">
            We formed an idea about how strongly you would value different facets of your identity based on our understanding of you. 
            This did not completely predict the five identity components that you selected. 
            Compare our model's sense of you with your self-declared identity.
        </p>

        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-900 text-white">
                        <th class="p-5 font-bold text-sm uppercase tracking-wider">Identity Component</th>
                        <th class="p-5 font-bold text-sm uppercase tracking-wider text-center">Predicted Rank</th>
                        <th class="p-5 font-bold text-sm uppercase tracking-wider text-center">Actual Rank</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">"""


for row in data['expected_vs_actual_rank_table']:
    isMatched = row['actual_rank'] != ''
    rowStyle = "bg-green-50/30" if isMatched else ""
    colorStyleTrow1 = "text-green-700" if isMatched else "text-slate-900"
    actualRankStyle = "font-bold text-slate-900" if isMatched else ""
    row3Code = f"<span class='font-bold text-slate-900'>#{row['actual_rank']}</span>" if isMatched else "<span class='text-slate-300'>-</span>"

    html_content += f"""
    <tr class='{rowStyle}'>
    <td class='p-4 font-medium {colorStyleTrow1}'>{row['component']} {"★" if isMatched else ""}</td>
    <td class='p-4 text-center font-mono'>#{row['predicted_rank']}</td>
    <td class="p-4 text-center">{row3Code}</td>


    </tr>
"""
                    



html_content += """
</div>
</section>
</body>
</html>
"""


with sync_playwright() as p:
    # 2. Launching browser
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 3. Content and Rendering Fix
    page.set_content(html_content, wait_until="load")
    
    # Give Tailwind a moment to compile the styles into the page
    page.wait_for_timeout(1000) 

    page.pdf(
        path="report.pdf",
        format="A4",
        margin={
            "top": "20mm",
            "bottom": "20mm",
            "left": "15mm",
            "right": "15mm"
        },
        print_background=True  # Crucial for bg-slate-900 and shadows
    )

    browser.close()
    print("PDF Generated Successfully: report.pdf")






    