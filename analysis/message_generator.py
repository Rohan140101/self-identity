import string

import asyncio
from playwright.sync_api import sync_playwright  
import plotly.graph_objects as go
import numpy as np
from scipy.stats import norm
import base64
from io import BytesIO


def twitter_message_generator(data: dict):
    optimized_result_data = data['optimized_result']['Happy']
    actual  = optimized_result_data['percentiles']['actual_pct']
    optimized=optimized_result_data['percentiles']['optimized_pct']
    if actual > 90:
        msg = f"My Happiness rating currently sits in the top {100-actual:.0f}% of the population. 📈 A significant milestone in personal alignment and well-being. ✨"
    else:
        optimized_str = f"{optimized:.2f}"
        msg = f"My identity is performing at the {actual:.0f}th percentile. Strategic adjustments suggest a potential optimization to the {optimized:.0f}th percentile. 🚀 📊" 


    return msg