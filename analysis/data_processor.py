import pandas as pd
import json
from scipy.stats import norm
from collections import defaultdict
from lightgbm import LGBMRanker
import re
import numpy as np
import itertools
import os

## Class that Includes All Functions for processing and statistical analysis of survey data
class IdentityAnalyzer:
    def __init__(self, prolific_path, survey_path, did_option_dict_path):

        # Reading Data
        p_data = pd.read_csv(prolific_path)
        s_data = pd.read_csv(survey_path)
#         s_data['finalRankedChoices'].apply(lambda x: x.replace('Education Level', 'Education'))

        # Defining Categories
        self.all_categories = [
            'Appearance and Age', 'Economic Role and Status', 'Education', 'Entertainment',
            'Ethnicity', 'Family Relations', 'Generation', 'Health', 'Hobbies', 
            'Lifestyle', 'Location', 'Occupation', 'Personality Traits', 'Politics',
            'Religion', 'Self Perception', 'Service', 'Sexual Orientation', 
            'Social Media', 'Sports'
        ]

        # Defining Main Questions (Category Likert Choices)
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

        # Defining Other Likerts (Dichotomy)
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
        
        # Filtering Approved Ids and cleaning data
        approved_ids = p_data[p_data['Status'] == 'APPROVED']['Participant id']
        self.df = s_data[s_data['PROLIFIC_PID'].isin(approved_ids)].copy()
        self.df.replace(float('nan'), '', inplace=True)

        # Normalizing Likerts
        self.normalize_likerts()


        # Defining Feature Set for Training Prediction Model
        feature_set_keys = ['Age', 'Gender', 'ETH1'] + list(self.main_questions.keys())
        self.feature_set = self.df.loc[:, feature_set_keys]

        
        
        self.avg_happy = self.df['SEP1Choice'].astype(float).mean()
        self.std_happy = self.df['SEP1Choice'].astype(float).std()
        
        # Getting Positional and Overall Top 5 Stats for categories
        self.pos_counts = self._get_positional_counts()
        self.cat_stats = self._get_category_stats()
        
        # Loading DID from Survey Exported JSON
        self.did_dict = json.load(open(did_option_dict_path, 'r'))

        # Defining Well Being Variables and their Encodings
        self.well_being_variables  = ['SEP1Choice', 'SEP2Choice', 'ERS4Choice', 'PER4Choice', 'PER1Choice']
        self.well_being_vars_encoded =  {
            'SEP1Choice': 'Happy',
            'SEP2Choice': 'Good Person',
            'ERS4Choice': 'Successful',
            'PER4Choice': 'Resilient',
            'PER1Choice': 'Extrovert'
        }
        self.well_being_vars_encoded_verb = {
            'SEP1Choice': 'happiness',
            'SEP2Choice': 'goodness',
            'ERS4Choice': 'success',
            'PER4Choice': 'resilience',
            'PER1Choice': 'extrovertedness'
        }

        # Getting Well Being of Categories when they are in the top 5
        self.well_being_vars_top5 = self._get_well_being_vars_top5()
        self.well_being_vars_top5_df = pd.DataFrame(self.well_being_vars_top5).T

        # Run Monte Carlo Iterations for Normal Distribution
        self.monte_carlo_samples_metrics = self.monte_carlo_simulation_samples()

        # Training Predictive Model
        self.model, self.id_to_name, self.feature_cols = self._train_ranker()

    # Function for Normalizing Likerts
    def normalize_likerts(self):

        # Considering All Likerts, and then normalizing them to have a mean value of 4 for every user
        all_likerts =list(self.main_questions.keys()) + list(self.other_likerts.keys())
        mainChoices = self.df[all_likerts]
        mainChoices = mainChoices.astype(float)
        mainChoicesNorm = mainChoices.copy()
        rowSum = mainChoicesNorm.sum(axis=1)

        for i in range(mainChoicesNorm.shape[0]):
            mainChoicesNorm.iloc[i] = mainChoicesNorm.iloc[i]*(mainChoicesNorm.shape[1]*4)/rowSum.iloc[i]


        self.df[mainChoicesNorm.columns] = self.df[mainChoicesNorm.columns].astype(float)
        self.df[mainChoicesNorm.columns] = mainChoicesNorm


    # Getting Positional Counts of every category in top 5 
    def _get_positional_counts(self):
        counts = defaultdict(lambda: defaultdict(int))
        for _, row in self.df.iterrows():
            splitted = row['finalRankedChoices'].split('|')
            for i, cat in enumerate(splitted):
                counts[cat][i+1] += 1
        return counts

    # Getting Category Stats (Percentage of times it appears in top 5 & Happiness Percentile when it appears in top 5)
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

    # Getting Happiness Percentile from Raw Values
    def _get_pct_happy(self, val):
        z = (val - self.avg_happy) / self.std_happy
        return norm.cdf(z) * 100
        
    # Getting Percentile of a sample mean based on mu and std
    def _get_pct(self, sample_mean, mu, std):
        zscore = (sample_mean - mu)/std
        percentile = norm.cdf(zscore) * 100
        return percentile

    # Getting Identity Report of how closely user top 5 matches with others
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

    # Function For training the predictive model
    def _train_ranker(self):
        # Creating Feature Set
        cat_cols = self.feature_set.select_dtypes(include=['object', 'category']).columns.tolist()
        feature_set = pd.get_dummies(self.feature_set, columns=cat_cols)
        
        # Calculating Importance for every category for every user and creating the input 
        all_options = list(self.all_categories)
        name_to_id = {name: i for i, name in enumerate(all_options)}
        id_to_name = {i: name for name, i in name_to_id.items()}
        long_data = []
        for idx in feature_set.index:
            rank_arr = self.df.loc[idx, 'finalRankedChoices'].split('|')
            for opt in all_options:
                importance = 5 - rank_arr.index(opt) if opt in rank_arr else 0
                long_data.append({
                    'option': opt,
                    **feature_set.loc[idx],
                    'importance': importance
                })
        
        df_train = pd.DataFrame(long_data)
        df_train = df_train.rename(columns = lambda x:re.sub('[^A-Za-z0-9_]+', '', x))
        cat_cols_train = df_train.select_dtypes(include=['object', 'category']).columns.tolist()
        df_train = pd.get_dummies(df_train, columns=cat_cols_train)

        # Training a LGBM Model
        X = df_train.drop(columns=['importance'])
        y = df_train['importance'].astype(int)
        model = LGBMRanker(objective="lambdarank", metric="ndcg")
        groups = [len(all_options)] * len(feature_set)
        model.fit(X, y, group=groups)
    
        return model, id_to_name, X.columns.tolist()

    # Function to Normalize likert values of ongoing survey
    def normalize_user_answer_likerts(self, user_answers_dict: dict):
        all_likerts = list(self.main_questions.keys())
        sumOfLikerts = 0
        for likert in all_likerts:
            sumOfLikerts += user_answers_dict[likert]

        for likert in all_likerts:
            cur_likert_val = user_answers_dict[likert]
            new_likert_val = cur_likert_val*len(all_likerts)*4/sumOfLikerts
            user_answers_dict[likert] = new_likert_val


        return user_answers_dict

        
    # Function to shorten the table consisting of Actual vs Expected
    def shorten_expected_vs_actual_rank(self, final_report: list):
        rankedByUser = []
        notRankedByUser = []
        for i in range(len(final_report)):
            if len(rankedByUser) == 5 and len(notRankedByUser) == 5:
                break

            cur_index = final_report[i]
            if cur_index["actual_rank"]:
                rankedByUser.append(cur_index)
            elif len(notRankedByUser) < 5:
                notRankedByUser.append(cur_index)

        shortened_report = []
        i = 0
        j = 0
        while i<len(rankedByUser) and j < len(notRankedByUser):
            r = rankedByUser[i]
            n = notRankedByUser[j]
            if r["predicted_rank"] < n["predicted_rank"]:
                shortened_report.append(r)
                i += 1
            else:
                shortened_report.append(n)
                j += 1

        while i < len(rankedByUser):
            shortened_report.append(rankedByUser[i])
            i += 1

        while j < len(notRankedByUser):
            shortened_report.append(notRankedByUser[j])
            j += 1



        return shortened_report
            
    # Function to calculate a user's expected category rank
    def get_expected_vs_actual_rank(self, user_answers_dict: dict):
        clean_input = {}
        all_options = list(self.all_categories)
        # Conveting Input
        for key, value in user_answers_dict.items():
            if isinstance(value, list):
                continue
            clean_input[key] = value

        # Creating user features dataframe
        user_features = pd.DataFrame([clean_input])
        user_features = user_features.reindex(columns=self.feature_cols[:20], fill_value=0)

        # Creating model input
        all_options_ids = list(self.id_to_name.keys())
        predict_block = pd.DataFrame([user_features.iloc[0]] * 20)
        predict_block['option'] = all_options
        predict_block = pd.get_dummies(predict_block, columns=['option'])
        predict_block = predict_block.reindex(columns=self.feature_cols, fill_value=0)

        # Predicting scores
        scores = self.model.predict(predict_block[self.feature_cols])
        results = pd.DataFrame({
            'category': [self.id_to_name[i] for i in all_options_ids],
            'score': scores
        })
        
        # Computing Predicted Rank, Based on Predicted Scores 
        results = results.sort_values(by='score', ascending=False).reset_index(drop=True)
        results['predicted_rank'] = results.index + 1
        

        # Generating Table and returning
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
        shortened_report = self.shorten_expected_vs_actual_rank(final_report)
        return final_report, shortened_report
        # ret

    # Getting User Well Being Percentiles based on ranked choices
    def get_user_wb_percentile_scores(self, finalRankedChoices):
        user_wb_percentiles = defaultdict(float)
        user_wb_scores = defaultdict(float)
        # For each Well Being Variable, we calculate its scores, take the weighted average and convert it into percentile
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
        
    # Simulating Monte Carlo Samples for better bell shaped curve distribution
    def monte_carlo_simulation_samples(self, iterations=100000):
        # If Metrics already exists, then use them, otherwise run the simulation
        metrics_path = f"data/monte_carlo_samples_metrics_{iterations}.json"
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                metrics = json.load(f)
        else:
            # Calculating Probabilty of a category landing up at a position
            category_positional_counts_df = pd.DataFrame(self.pos_counts).T
            category_positional_counts_df = category_positional_counts_df+1
            category_positional_probs_df = category_positional_counts_df/category_positional_counts_df.sum()

            # Creating Samples Based on the existing Probablilties and calculating well being scores for them
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
            metrics = defaultdict(lambda: defaultdict(float))

            # Calculating Metrics and saving
            for wb in self.well_being_variables:
                metrics[wb]["mu"] = samples_df[wb].mean()
                metrics[wb]["std"] = samples_df[wb].std()

            with open(metrics_path, "w") as f:
                json.dump(metrics, f)

        return metrics
    


    # Getting Well Being Variables, specifically for the top 5
    def _get_well_being_vars_top5(self):
        well_being_vars_top5 = defaultdict(lambda: defaultdict(float))
        for category in self.all_categories:
            for wb in self.well_being_variables:
                mu = self.df.loc[:, wb].mean()
                std = self.df.loc[:, wb].std()
                sample_df = self.df[self.df.loc[:, 'finalRankedChoices'].str.contains(category)]
                sample_mean = sample_df[wb].mean()
                percentile = self._get_pct(sample_mean, mu, std)
                well_being_vars_top5[category][wb] = sample_mean

        return well_being_vars_top5
    
    # Getting Percentiles for a user, based on the Monte Carlo Simulations
    def get_monte_carlo_percentile(self, rankedChoices: list):
        user_wb_percentile = {}
        user_wb_raw = defaultdict(float)
        for wb in self.well_being_variables:
            sumOfScores = 0
            for i in range(len(rankedChoices)):
                weight = 5 - i
                sumOfScores += weight * self.well_being_vars_top5[rankedChoices[i]][wb]
            user_wb_raw[wb] = sumOfScores / 15
            sample_mean = user_wb_raw[wb]
            mu = self.monte_carlo_samples_metrics[wb]["mu"]
            std = self.monte_carlo_samples_metrics[wb]["std"]
            user_wb_percentile[wb] = self._get_pct(sample_mean, mu, std)
            
        return user_wb_percentile
            
    # Calculating Actual vs Expected Well Being Scores
    def get_expected_vs_actual_well_being(self, user_answers_dict: dict, final_report: list):
        # user_answers_dict = self.normalize_user_answer_likerts(user_answers_dict)
        user_percentiles = []
        # Getting Actual and Expected top 5 for users and calculating percentiles
        finalRankedChoices = user_answers_dict['finalRankedChoices']
        final_report_df = pd.DataFrame(final_report)
        final_report_df = final_report_df.sort_values(by='predicted_rank', ascending=True)
        predictedRanked = final_report_df[final_report_df['predicted_rank'] <= 5]
        predictedRankedCategories = predictedRanked['component'].tolist()
        finalRankedChoicesPercentiles = self.get_monte_carlo_percentile(finalRankedChoices)
        predictedRankedChoicesPercentiles = self.get_monte_carlo_percentile(predictedRankedCategories)

        # Adding values for each trait and returning
        for wb in self.well_being_variables:
            user_percentiles.append(
                {
                    'wellBeingChoice': self.well_being_vars_encoded[wb],
                    'actualPct': finalRankedChoicesPercentiles[wb],
                    'predictedPct': predictedRankedChoicesPercentiles[wb]
                }
            )

        return user_percentiles
    
    # Calculaitng Kendall Tau Distance between 2 lists
    def _kendall_tau_distance(self, list1, list2):
        distance = 0
        for i, j in itertools.combinations(range(len(list1)), 2):
            elem_i = list1[i]
            elem_j = list1[j]
            if elem_i in list2 and elem_j in list2:
                b = list2.index(elem_i) < list2.index(elem_j)
                if not b: 
                    distance += 1
        return distance
    
    # Calculating Happiness for user based on their ranked Choices
    def get_user_happy_score(self, finalRankedChoices):
        sumOfScores = 0
        wb = 'SEP1Choice'
        for i in range(len(finalRankedChoices)):
            category = finalRankedChoices[i]
            weight = max(5-i, 0)
            cat_percentile = self.well_being_vars_top5_df.loc[category, wb]
            sumOfScores += weight*cat_percentile
        raw_score = sumOfScores / 15
        return raw_score
    

    # Generating Optimization Message that appears on the front end dynamically based on the actual and predicted percentiles
    def generate_optimization_message(self, actual_choices, optimized_result, wb_cat):
        actual_pct = self.get_monte_carlo_percentile(actual_choices)[wb_cat]
        opt_pct = self.get_monte_carlo_percentile(optimized_result[wb_cat]['optimized_top5'])[wb_cat]

        swapped_in = [cat for cat in optimized_result[wb_cat]['optimized_top5'] if cat not in actual_choices]

        if actual_choices == optimized_result[wb_cat]['optimized_top5']:
            return {
                "case": 1,
                "message": f"Your current identity ranking is already optimized for {self.well_being_vars_encoded_verb[wb_cat]}! You are in the {actual_pct:.1f}th percentile.",
                "actual_pct": actual_pct,
                "opt_pct": opt_pct
            }

        if not swapped_in:
            return {
                "case": 2,
                "message": f"By simply reprioritizing your current identities, you could move from the {actual_pct:.1f}th to the {opt_pct:.1f}th percentile of {self.well_being_vars_encoded_verb[wb_cat]}.",
                "actual_pct": actual_pct,
                "opt_pct": opt_pct
            }

        if swapped_in:
            new_cat = swapped_in[0]
            return {
                "case": 3,
                "message": f"By incorporating {new_cat} into your top priorities, you could significantly boost your {self.well_being_vars_encoded_verb[wb_cat]} percentile from {actual_pct:.1f}th to {opt_pct:.1f}th.",
                "actual_pct": actual_pct,
                "opt_pct": opt_pct,
                "added_component": new_cat
            }
    
    
    # Function to get the most optimal iteration for happiness
    def get_highest_happiness_permutations(self, user_answers_dict: dict, final_report: list, max_iterations=3):
        finalRankedChoices = user_answers_dict['finalRankedChoices']
        highest_happiness_cat = None
        highest_happiness_cat_score = -1
        not_in_user_cats = {k:v for k,v in self.well_being_vars_top5.items() if k not in finalRankedChoices}
        for cat, wb_dict in not_in_user_cats.items():
            if wb_dict['SEP1Choice'] > highest_happiness_cat_score:
                highest_happiness_cat_score = wb_dict['SEP1Choice']
                highest_happiness_cat = cat
            

        # Modified Ranking Calculation
        original_perm = list(finalRankedChoices) + [highest_happiness_cat]
        best_perm = original_perm.copy()
        best_happiness = self.get_user_happy_score(best_perm)
        for perm in itertools.permutations(original_perm):
            dist = self._kendall_tau_distance(original_perm, list(perm))
            # Distance between 2 lists must be lower than or equal to the max iterations defined
            if dist <= max_iterations:
                current_h = self.get_user_happy_score(perm)
                # If New Happiness is better, we assign it
                if current_h > best_happiness:
                    best_happiness = current_h
                    best_perm = list(perm)


        optimized_result = {}
        optimized_result['optimized_top5'] = best_perm[:5]
        optimized_result['actual_top5'] = finalRankedChoices
        actual_pct = self.get_monte_carlo_percentile(finalRankedChoices)['SEP1Choice']
        optimized_pct = self.get_monte_carlo_percentile(optimized_result['optimized_top5'])['SEP1Choice']


        final_report_df = pd.DataFrame(final_report)
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


    # Function to get the category score for a ranked list
    def get_user_cat_score(self, finalRankedChoices, wb_cat):
        sumOfScores = 0
        for i in range(len(finalRankedChoices)):
            category = finalRankedChoices[i]
            weight = max(5-i, 0)
            cat_percentile = self.well_being_vars_top5_df.loc[category, wb_cat]
            sumOfScores += weight*cat_percentile
        raw_score = sumOfScores / 15
        return raw_score
    

    # Getting the best permutation for each trait (whatever permutation will maximize the trait percentile)
    def get_highest_permutation(self, user_answers_dict: dict, final_report: list, max_iterations=3):
        finalRankedChoices = user_answers_dict['finalRankedChoices']
        final_report_df = pd.DataFrame(final_report)
        final_report_df = final_report_df.sort_values(by='predicted_rank', ascending=True)
        predictedRanked = final_report_df[final_report_df['predicted_rank'] <= 5]
        predictedRankedCategories = predictedRanked['component'].tolist()
        optimized_result = defaultdict(lambda: defaultdict(float))
        for wb_cat in self.well_being_vars_encoded.keys():
            highest_cat = None
            highest_cat_score = -1
            not_in_user_cats = {k:v for k,v in self.well_being_vars_top5.items() if k not in finalRankedChoices}
            for cat, wb_dict in not_in_user_cats.items():
                if wb_dict[wb_cat] > highest_cat_score:
                    highest_cat_score = wb_dict[wb_cat]
                    highest_cat = cat

            original_perm = list(finalRankedChoices) + [highest_cat]
            best_perm = original_perm.copy()
            highest_cat_score = self.get_user_cat_score(best_perm, wb_cat)
            for perm in itertools.permutations(original_perm):
                dist = self._kendall_tau_distance(original_perm, list(perm))
                # Distance between 2 lists must be lower than or equal to the max iterations defined
                if dist <= max_iterations:
                    current_score = self.get_user_cat_score(perm, wb_cat)
                    # If New Happiness is better, we assign it
                    if current_score > highest_cat_score:
                        highest_cat_score = current_score
                        best_perm = list(perm)

            optimized_result[wb_cat]['optimized_top5'] = best_perm[:5]
            optimized_result[wb_cat]['actual_top5'] = finalRankedChoices
            actual_pct = self.get_monte_carlo_percentile(finalRankedChoices)[wb_cat]
            optimized_pct = self.get_monte_carlo_percentile(optimized_result[wb_cat]['optimized_top5'])[wb_cat]

            predicted_pct = self.get_monte_carlo_percentile(predictedRankedCategories)[wb_cat]
            optimized_result[wb_cat]['predicted_top5'] = predictedRankedCategories
            optimized_result[wb_cat]['percentiles'] = {
                'actual_pct': actual_pct,
                'predicted_pct' : predicted_pct,
                'optimized_pct': optimized_pct
            }
            optimization_message = self.generate_optimization_message(finalRankedChoices, optimized_result, wb_cat)
            optimized_result[wb_cat]['optimization_message'] = optimization_message
        optimized_result = {self.well_being_vars_encoded[k]: v for (k, v) in optimized_result.items()}

        return optimized_result


    def get_user_order(self, user_answers_dict):
        t5 = user_answers_dict['T5']
        main_likert_mapping = {v:k for (k,v) in self.main_questions.items()}
        likert_vals_top5 = {}
        for cat in t5:
            likert_vals_top5[cat] = (user_answers_dict[main_likert_mapping[cat]], self.cat_stats[cat]["pct_in_top5"])
        
        sorted_data = sorted(likert_vals_top5.items(), key=lambda x: (x[1][0], x[1][1]), reverse=True)
        
        return sorted_data
            




        
        


        


        

        
        
        
        