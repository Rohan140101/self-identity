from os import replace
from pydoc import doc
import string
from tkinter import W

import pandas as pd
import json
from scipy.stats import norm
from collections import defaultdict
from sklearn.preprocessing import MinMaxScaler
from lightgbm import LGBMRanker, train
import re
import numpy as np
import math
import itertools

class WordPersonalityAnalyzer:
    def __init__(self, words_data_csv_path, words_pvalues_csv_path):
        self.words_data = pd.read_csv(words_data_csv_path)
        self.words_data = self.words_data.set_index('word')
        self.well_being_categories = ["Happy", "Stable", "Introvert", "Anxious", "Depressed"]
        self.km_curve_params = ['bio_frequency','km_half_life_days','lognormal_half_life_days','lognormal_mu','lognormal_sigma', 'unique_users']
        self.words_pvalues = pd.read_csv(words_pvalues_csv_path)
        self.words_pvalues = self.words_pvalues.set_index('Word')
        print(self.words_pvalues.columns)
    
    def get_personality_scores(self, word_list, categories):
        print("in get_personality_scores, word_list: ", word_list)
        results_table = []
        pvalues_table = []
        for word in word_list:
            clean_word = word.strip().lower()
            clean_word = re.sub(r'[!"#$%&\'()*+,-./:;<=>?@\[\\\]^_`{|}~]', '', clean_word)
            print(word, clean_word)
            if clean_word in self.words_data.index:
                row_data = {"word": clean_word}
                row_pvalue_data = {"word": clean_word}
                for cat in categories:
                    if cat in self.well_being_categories:
                        val = self.words_data.loc[clean_word, cat]
                        row_data[cat] = float(val) if not math.isnan(val) else "-"
                        if clean_word in self.words_pvalues.index:
                            pval = self.words_pvalues.loc[clean_word, cat]
                            row_pvalue_data[cat] = float(pval) if not math.isnan(val) else 1
                        else:
                            row_pvalue_data[cat] = 1
                lognormal_half_life_days = self.words_data.loc[clean_word, 'lognormal_half_life_days']
                row_data['Half-Life'] = f'{lognormal_half_life_days:.2f}' if not math.isnan(lognormal_half_life_days) else "-"
                
                prev1 = self.words_data.loc[clean_word, 'prev1']
                prev2 = self.words_data.loc[clean_word, 'prev2']
                if math.isnan(prev1) or math.isnan(prev2):
                    row_data['Prevalence'] = "-"
                else:
                    avg_prev = (prev1 + prev2)/2
                    row_data['Prevalence'] = f'{avg_prev:.2f}'
                results_table.append(row_data)
                pvalues_table.append(row_pvalue_data)
            else:
                results_table.append({"word": word, "error": "Not in database"})
                
        return results_table, pvalues_table

    def get_km_curve_params(self, word_list):
        result_data = []
        required_params = ["lognormal_mu", "lognormal_sigma", "unique_users"]
        
        for word in word_list:
            clean_word = word.strip().lower()
            
            if clean_word in self.words_data.index:
                try:
                    row_data = {"word": word}
                    for param in required_params:
                        val = self.words_data.loc[clean_word, param]
                        if pd.isna(val):
                            raise ValueError(f"Missing {param}")
                        row_data[param] = float(val)
                    
                    result_data.append(row_data)
                except (ValueError, KeyError):
                    result_data.append({"word": word, "error": "Insufficient data for curve"})
            else:
                result_data.append({"word": word, "error": "Not in database"})
                
        return result_data


        




