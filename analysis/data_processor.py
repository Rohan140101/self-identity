from os import replace
from pydoc import doc

import pandas as pd
import json
from scipy.stats import norm
from collections import defaultdict
from sklearn.preprocessing import MinMaxScaler
from lightgbm import LGBMRanker, train
import re
import numpy as np
import itertools

class IdentityAnalyzer:
    def __init__(self, prolific_path, survey_path, did_option_dict_path):
        p_data = pd.read_csv(prolific_path)
        s_data = pd.read_csv(survey_path)
#         s_data['finalRankedChoices'].apply(lambda x: x.replace('Education Level', 'Education'))
        self.all_categories = [
            'Appearance and Age', 'Economic Role and Status', 'Education', 'Entertainment',
            'Ethnicity', 'Family Relations', 'Generation', 'Health', 'Hobbies', 
            'Lifestyle', 'Location', 'Occupation', 'Personality Traits', 'Politics',
            'Religion', 'Self Perception', 'Service', 'Sexual Orientation', 
            'Social Media', 'Sports'
        ]

        self.main_questions = {
            'ethMainChoice': 'Ethnicity',
            'sorMainChoice': 'Sexual Orientation',
            'famMainChoice': 'Family Relations',
            'occMainChoice': 'Occupation',
            'serMainChoice': 'Service',
            'eduMainChoice': 'Education',
            'helMainChoice': 'Health',
            'locMainChoice': 'Location',
            'spoMainChoice': 'Sports',
            'relMainChoice': 'Religion',
            'polMainChoice': 'Politics',
            'hobMainChoice': 'Hobbies',
            'genMainChoice': 'Generation',
            'entMainChoice': 'Entertainment',
            'socMainChoice': 'Social Media',
            'ersMainChoice': 'Economic Role and Status',
            'aaMainChoice' : 'Appearance and Age',
            'perMainChoice': 'Personality Traits',
            'lifMainChoice': 'Lifestyle',
            'sepMainChoice': 'Self Perception'
        }


        self.other_likerts = {
            'PER1Choice': 'Introvert/Extrovert', 
             'PER2Choice': 'Thinking/Feeling', 
             'ERS3Choice': 'Lazy/Hardworking', 
             'PER3Choice': 'Cautious/Adventurous', 
             'PER4Choice': 'Fragile/Resilient', 
             'ERS4Choice': 'Unsuccessful/Successful', 
             'PER5Choice': 'Dumb/Smart', 
             'AA2Choice': 'Ugly/Good Looking', 
             'LIF1Choice': 'Couch Potato/Athletic', 
             'SEP1Choice': 'Sad/Happy', 
             'SEP2Choice': 'Bad Person/Good Person', 
             'LIF2Choice': 'Cheap/Extravagant', 
             'LIF3Choice': 'Chaotic/Structured', 
             'ERS2Choice': 'Caregiver/Provider', 
             'LOC3Choice': 'Immigrant/Native', 
             'LOC4Choice': 'Ambivalent/Very Patriotic', 
             'LOC5Choice': 'Homebody/Wanderer', 
             'SPO2Choice': 'Casual Sports Participant/Serious Athlete', 
             'SPO3Choice': 'Not a Sports Fan/Sports Fan', 
             'HOB1Choice': 'Indoor Person/Outdoor Person', 
             'HOB2Choice': 'Not Creative/Creative', 
             'HOB3Choice': 'Unimaginative/Artistic', 
             'HOB4Choice': 'Unrefined/Cultured', 
             'HOB5Choice': 'Declutterer/Collector'
             }
        

        approved_ids = p_data[p_data['Status'] == 'APPROVED']['Participant id']
        self.df = s_data[s_data['PROLIFIC_PID'].isin(approved_ids)].copy()
        self.df.replace(float('nan'), '', inplace=True)
        self.normalize_likerts()

        feature_set_keys = ['Age', 'Gender', 'ETH1'] + list(self.main_questions.keys()) + list(self.other_likerts.keys())
        self.feature_set = self.df.loc[:, feature_set_keys]
        # print('Here1: ', feature_set_keys)

        
        
        
        self.avg_happy = self.df['SEP1Choice'].astype(float).mean()
        self.std_happy = self.df['SEP1Choice'].astype(float).std()
        
        self.pos_counts = self._get_positional_counts()
        self.cat_stats = self._get_category_stats()

        self.did_dict = json.load(open(did_option_dict_path, 'r'))
        self.well_being_variables  = ['SEP1Choice', 'SEP2Choice', 'ERS4Choice', 'PER4Choice', 'PER1Choice']
        self.well_being_vars_encoded =  {
            'SEP1Choice': 'Happy',
            'SEP2Choice': 'Good Person',
            'ERS4Choice': 'Successful',
            'PER4Choice': 'Resilient',
            'PER1Choice': 'Extrovert'
        }
        self.well_being_vars_top5 = self._get_well_being_vars_top5()


        self.well_being_vars_top5_df = pd.DataFrame(self.well_being_vars_top5).T

        self.monte_carlo_samples_df, self.monte_carlo_samples_metrics = self.monte_carlo_simulation_samples(10000)
        self.model, self.id_to_name, self.feature_cols = self._train_ranker()
#         print(self.monte_carlo_samples_df.shape)

        
    def normalize_likerts(self):
        all_likerts =list(self.main_questions.keys()) + list(self.other_likerts.keys())
        mainChoices = self.df[all_likerts]
        mainChoices = mainChoices.astype(float)
        mainChoicesNorm = mainChoices.copy()
        rowSum = mainChoicesNorm.sum(axis=1)

        for i in range(mainChoicesNorm.shape[0]):
            mainChoicesNorm.iloc[i] = mainChoicesNorm.iloc[i]*(mainChoicesNorm.shape[1]*4)/rowSum.iloc[i]


        self.df[mainChoicesNorm.columns] = self.df[mainChoicesNorm.columns].astype(float)
        self.df[mainChoicesNorm.columns] = mainChoicesNorm
        # print(self.df[mainChoicesNorm.columns].mean(axis=1))

    def _get_positional_counts(self):
        counts = defaultdict(lambda: defaultdict(int))
        for _, row in self.df.iterrows():
            splitted = row['finalRankedChoices'].split('|')
            for i, cat in enumerate(splitted):
                counts[cat][i+1] += 1
        return counts

    def _get_category_stats(self):
        stats = {}
        for cat in self.all_categories:
            subset = self.df[self.df['finalRankedChoices'].str.contains(cat)]
            m = subset['SEP1Choice'].astype(float).mean()
            stats[cat] = {
                'pct_in_top5': (len(subset) / len(self.df)) * 100,
                'happy_pct': self._get_pct_happy(m)
            }
        return stats

    def _get_pct_happy(self, val):
        z = (val - self.avg_happy) / self.std_happy
        return norm.cdf(z) * 100
        
    def _get_pct(self, sample_mean, mu, std):
        zscore = (sample_mean - mu)/std
        percentile = norm.cdf(zscore) * 100
        return percentile

    def get_top_identity_report(self, user_top_5: list):
        report = []
        for i, cat in enumerate(user_top_5):
            rank = i + 1
            report.append({
                "component": cat,
                "agree_pct": (self.pos_counts[cat][rank] / len(self.df)) * 100,
                "top5_pct": self.cat_stats.get(cat, {}).get('pct_in_top5', 0),
                "happiness_pct": self.cat_stats.get(cat, {}).get('happy_pct', 0)
            })
        return report

    def _train_ranker(self):
        cat_cols = self.feature_set.select_dtypes(include=['object', 'category']).columns.tolist()
        feature_set = pd.get_dummies(self.feature_set, columns=cat_cols)
        
        
        all_options = list(self.all_categories)
        name_to_id = {name: i for i, name in enumerate(all_options)}
        id_to_name = {i: name for name, i in name_to_id.items()}
        long_data = []
        for idx in feature_set.index:
            rank_arr = self.df.loc[idx, 'finalRankedChoices'].split('|')
            for opt in all_options:
                importance = 5 - rank_arr.index(opt) if opt in rank_arr else 0
                # long_data.append({
                #     'option_id': name_to_id[opt],
                #     **feature_set.loc[idx],
                #     'importance': importance
                # })
                long_data.append({
                    'option': opt,
                    **feature_set.loc[idx],
                    'importance': importance
                })
        
        df_train = pd.DataFrame(long_data)
        df_train = df_train.rename(columns = lambda x:re.sub('[^A-Za-z0-9_]+', '', x))
        cat_cols_train = df_train.select_dtypes(include=['object', 'category']).columns.tolist()
        df_train = pd.get_dummies(df_train, columns=cat_cols_train)

        # print('df_train:', df_train.columns.tolist())
        X = df_train.drop(columns=['importance'])
        # print('X:', X.columns[20:])
        y = df_train['importance'].astype(int)
        # print(df_train)
        model = LGBMRanker(objective="lambdarank", metric="ndcg")
        groups = [len(all_options)] * len(feature_set)
        model.fit(X, y, group=groups)
    
        
        return model, id_to_name, X.columns.tolist()

    def normalize_user_answer_likerts(self, user_answers_dict: dict):
        # print('Here1: ', user_answers_dict)
        all_likerts = list(self.main_questions.keys()) + list(self.other_likerts.keys())
        sumOfLikerts = 0
        for likert in all_likerts:
            sumOfLikerts += user_answers_dict[likert]

        for likert in all_likerts:
            cur_likert_val = user_answers_dict[likert]
            new_likert_val = cur_likert_val*len(all_likerts)*4/sumOfLikerts
            user_answers_dict[likert] = new_likert_val

        # print('Here3:', user_answers_dict)

        return user_answers_dict

        

    def get_expected_vs_actual_rank(self, user_answers_dict: dict):
        clean_input = {}
        all_options = list(self.all_categories)
        # user_answers_dict = self.normalize_user_answer_likerts(user_answers_dict)
        for key, value in user_answers_dict.items():
            if isinstance(value, list):
                continue
            clean_input[key] = value

        user_features = pd.DataFrame([clean_input])
        
#         print('Here2: ', self.feature_cols)
        user_features = user_features.reindex(columns=self.feature_cols[:20], fill_value=0)
#         for col in user_features.columns:
#             print(col)

        
        all_options_ids = list(self.id_to_name.keys())
        predict_block = pd.DataFrame([user_features.iloc[0]] * 20)
        # predict_block['option_id'] = all_options_ids
        predict_block['option'] = all_options
        # predict_block = pd.get_dummies(predict_block, columns=['option_id'])
        predict_block = pd.get_dummies(predict_block, columns=['option'])

        # print(predict_block.columns)
#         cl_Count =defaultdict(int)
#         for col in predict_block.columns:
#             cl_Count[col] += 1
#             if cl_Count[col] >= 2:
#                 print(col, cl_Count[col])

            
        predict_block = predict_block.reindex(columns=self.feature_cols, fill_value=0)
        # print('predict_block: ', predict_block.columns.tolist())
        scores = self.model.predict(predict_block[self.feature_cols])
        
        results = pd.DataFrame({
            'category': [self.id_to_name[i] for i in all_options_ids],
            'score': scores
        })
        
        results = results.sort_values(by='score', ascending=False).reset_index(drop=True)
        results['predicted_rank'] = results.index + 1
        
        user_actual = user_answers_dict.get('finalRankedChoices', [])
        
        final_report = []
        for _, row in results.iterrows():
            actual_rank = ""
            if row['category'] in user_actual:
                actual_rank = user_actual.index(row['category']) + 1
                
            final_report.append({
                "component": row['category'],
                "predicted_rank": int(row['predicted_rank']),
                "actual_rank": actual_rank
            })
            
        return final_report
        # ret

    def get_user_wb_percentile_scores(self, finalRankedChoices):
        user_wb_percentiles = defaultdict(float)
        user_wb_scores = defaultdict(float)
        for wb in self.well_being_variables:
            sumOfScores = 0
            for i in range(len(finalRankedChoices)):
                category = finalRankedChoices[i]
                weight = 5-i
                cat_percentile = self.well_being_vars_top5_df.loc[category, wb]
                sumOfScores += weight*cat_percentile
            raw_score = sumOfScores / 15
            mu = self.df[wb].mean()
            std = self.df[wb].std()
            user_wb_scores[wb] = raw_score
            user_wb_percentiles[wb] = self._get_pct(raw_score, mu, std)
        return user_wb_percentiles, user_wb_scores
        
    def monte_carlo_simulation_samples(self, iterations=1000):
        category_positional_counts_df = pd.DataFrame(self.pos_counts).T
        category_positional_counts_df = category_positional_counts_df+1
        category_positional_probs_df = category_positional_counts_df/category_positional_counts_df.sum()

        samples = dict()
        for i in range(iterations):
            rankedChoices = []
            for rank in category_positional_probs_df.columns:
                while True:
                    choice = np.random.choice(category_positional_probs_df.index, p=category_positional_probs_df[rank])
                    if choice not in rankedChoices:
                        rankedChoices.append(choice)
                        break

#                 choice = np.random.choice(category_positional_probs_df.index, p=category_positional_probs_df[rank], replace=False)


            user_wb_percentiles, user_wb_scores = self.get_user_wb_percentile_scores(rankedChoices)
            cur_sample = {}
            for j in range(len(rankedChoices)):
                cur_sample[j+1] = rankedChoices[j]
                
            for wb, score in user_wb_scores.items():
                
                cur_sample[wb] = score
                
            samples[len(samples)] = cur_sample
            
        samples_df = pd.DataFrame(samples).T
        # print(samples_df)
        metrics = defaultdict(lambda: defaultdict(float))

        for wb in self.well_being_variables:
            metrics[wb]["mu"] = samples_df[wb].mean()
            metrics[wb]["std"] = samples_df[wb].std()
#             print(wb, metrics[wb]["mu"], metrics[wb]["std"])

        return samples_df, metrics
    



    def _get_well_being_vars_top5(self):
        well_being_vars_top5 = defaultdict(lambda: defaultdict(float))
        for category in self.all_categories:
            for wb in self.well_being_variables:
                # print(self.df.loc[:, wb].iloc[1], self.df.loc[:, wb].iloc[20])
                mu = self.df.loc[:, wb].mean()
                std = self.df.loc[:, wb].std()
                sample_df = self.df[self.df.loc[:, 'finalRankedChoices'].str.contains(category)]
                sample_mean = sample_df[wb].mean()
                percentile = self._get_pct(sample_mean, mu, std)
                well_being_vars_top5[category][wb] = sample_mean

        return well_being_vars_top5
    
    def get_monte_carlo_percentile(self, rankedChoices: list):
        user_wb_percentile = {}
        user_wb_raw = defaultdict(float)
        for wb in self.well_being_variables:
            sumOfScores = 0
            for i in range(len(rankedChoices)):
                weight = 5 - i
#                 print(wb, self.well_being_vars_top5[rankedChoices[i]][wb])
                sumOfScores += weight * self.well_being_vars_top5[rankedChoices[i]][wb]
            user_wb_raw[wb] = sumOfScores / 15
            sample_mean = user_wb_raw[wb]
            mu = self.monte_carlo_samples_metrics[wb]["mu"]
            std = self.monte_carlo_samples_metrics[wb]["std"]
#             print('Sample Mean: ', sample_mean, 'Mu: ', mu, 'Std: ', std)
            user_wb_percentile[wb] = self._get_pct(sample_mean, mu, std)
            
        return user_wb_percentile
            
            
            

        


    def get_expected_vs_actual_well_being(self, user_answers_dict: dict, final_report: list):
        # user_answers_dict = self.normalize_user_answer_likerts(user_answers_dict)
        user_percentiles = []
        finalRankedChoices = user_answers_dict['finalRankedChoices']
        final_report_df = pd.DataFrame(final_report)
        final_report_df = final_report_df.sort_values(by='predicted_rank', ascending=True)
        predictedRanked = final_report_df[final_report_df['predicted_rank'] <= 5]
        predictedRankedCategories = predictedRanked['component'].tolist()
        # print('finalRankedChoices: ', finalRankedChoices)
        # print()
        # print('predictedRankedCategories: ', predictedRankedCategories)
        finalRankedChoicesPercentiles = self.get_monte_carlo_percentile(finalRankedChoices)
        predictedRankedChoicesPercentiles = self.get_monte_carlo_percentile(predictedRankedCategories)


        for wb in self.well_being_variables:
            user_percentiles.append(
                {
                    'wellBeingChoice': self.well_being_vars_encoded[wb],
                    'actualPct': finalRankedChoicesPercentiles[wb],
                    'predictedPct': predictedRankedChoicesPercentiles[wb]
                }
            )

        return user_percentiles
    
    
    def _kendall_tau_distance(self, list1, list2):
        distance = 0
        for i, j in itertools.combinations(range(len(list1)), 2):
            if (list1[i] in list2 and list1[j] in list2):
                a = list1.index(list1[i]) < list1.index(list1[j])
                b = list2.index(list1[i]) < list2.index(list1[j])
                if a != b:
                    distance += 1
        return distance
    
    
    def get_user_happy_score(self, finalRankedChoices):
        sumOfScores = 0
        wb = 'SEP1Choice'
        for i in range(len(finalRankedChoices)):
            category = finalRankedChoices[i]
            weight = 5-i
            cat_percentile = self.well_being_vars_top5_df.loc[category, wb]
            sumOfScores += weight*cat_percentile
        raw_score = sumOfScores / 15
        return raw_score
    
#     def get_user_happy_percentiles(self, finalRankedChoices):
#         raw_score  = self.get_user_happy_score(finalRankedChoices)
#         mu = 
        
    def generate_optimization_message(self, actual_choices, optimized_result):
        actual_pct = self.get_monte_carlo_percentile(actual_choices)['SEP1Choice']
        opt_pct = self.get_monte_carlo_percentile(optimized_result['optimized_top5'])['SEP1Choice']

        swapped_in = [cat for cat in optimized_result['optimized_top5'] if cat not in actual_choices]

        if actual_choices == optimized_result['optimized_top5']:
            return {
                "case": 1,
                "message": f"Your current identity ranking is already optimized for happiness! You are in the {actual_pct:.1f}th percentile.",
                "actual_pct": actual_pct,
                "opt_pct": opt_pct
            }

        if not swapped_in:
            return {
                "case": 2,
                "message": f"By simply reprioritizing your current identities, you could move from the {actual_pct:.1f}th to the {opt_pct:.1f}th percentile of happiness.",
                "actual_pct": actual_pct,
                "opt_pct": opt_pct
            }

        if swapped_in:
            new_cat = swapped_in[0]
            return {
                "case": 3,
                "message": f"By incorporating '{new_cat}' into your top priorities, you could significantly boost your happiness percentile from {actual_pct:.1f}th to {opt_pct:.1f}th.",
                "actual_pct": actual_pct,
                "opt_pct": opt_pct,
                "added_component": new_cat
            }
    
    
    def get_highest_happiness_permutations(self, user_answers_dict: dict, final_report: list, max_iterations=3):
        finalRankedChoices = user_answers_dict['finalRankedChoices']
        highest_happiness_cat = None
        highest_happiness_cat_score = -1
        not_in_user_cats = {k:v for k,v in self.well_being_vars_top5.items() if k not in finalRankedChoices}
        for cat, wb_dict in not_in_user_cats.items():
            if wb_dict['SEP1Choice'] > highest_happiness_cat_score:
                highest_happiness_cat_score = wb_dict['SEP1Choice']
                highest_happiness_cat = cat
                
                
        best_perm = list(finalRankedChoices)
        best_happiness = self.get_user_happy_score(finalRankedChoices)
    
#         print('Hee:', highest_happiness_cat)
        candidate_sets = [finalRankedChoices]
        for i in range(len(finalRankedChoices)):
            new_set = list(finalRankedChoices)
            new_set[i] = highest_happiness_cat 
            candidate_sets.append(new_set)
            
#         print(candidate_sets)
        for c_set in candidate_sets:
#             print(c_set)
            for perm in itertools.permutations(c_set):
                dist = self._kendall_tau_distance(finalRankedChoices, list(perm))
#                 print(perm, dist)
                if dist <= max_iterations:
                    current_h = self.get_user_happy_score(perm)
#                     print(c_set, current_h)
                    if current_h > best_happiness:
                        best_happiness = current_h
                        best_perm = list(perm)

        optimized_result = {}
        optimized_result['optimized_top5'] = best_perm
        optimized_result['actual_top5'] = finalRankedChoices
        actual_pct = self.get_monte_carlo_percentile(finalRankedChoices)['SEP1Choice']
        optimized_pct = self.get_monte_carlo_percentile(optimized_result['optimized_top5'])['SEP1Choice']


        final_report_df = pd.DataFrame(final_report)
#         print(final_report_df.columns)
        final_report_df = final_report_df.sort_values(by='predicted_rank', ascending=True)
        predictedRanked = final_report_df[final_report_df['predicted_rank'] <= 5]
        predictedRankedCategories = predictedRanked['component'].tolist()
        predicted_pct = self.get_monte_carlo_percentile(predictedRankedCategories)['SEP1Choice']
        optimized_result['predicted_top5'] = predictedRankedCategories
        optimized_result['percentiles'] = {
            'actual_pct': actual_pct,
            'predicted_pct' : predicted_pct,
            'optimized_pct': optimized_pct
        }

        optimization_message = self.generate_optimization_message(finalRankedChoices, optimized_result)
        optimized_result['optimization_message'] = optimization_message
        return optimized_result

        


        

        
        
        
        