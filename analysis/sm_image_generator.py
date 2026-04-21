from multiprocessing import process

from pdf_generator import get_bell_curve, reportCatDescriptions

import boto3
import os
import hashlib
import random

class S3_Instance:
    def __init__(self):
        self.s3_access_key_id = os.getenv("S3_ACCESS_KEY_ID")
        self.s3_secret_access_key = os.getenv("S3_SECRET_ACCESS_KEY")
        self.bucket_name=os.getenv("S3_BUCKET_NAME")
        region_name = os.getenv("AWS_REGION_NAME")
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=self.s3_access_key_id,
            aws_secret_access_key=self.s3_secret_access_key,
            region_name=region_name
        )


    def get_sm_image_paths(self, data, timestamp:str, user_email:str):
        image_path_dict = {}
        # Hash Formation
        rand_num_str = str(random.randint(1, 10**10))
        main_str = f"{timestamp}{user_email}{rand_num_str}"
        sha256_hash = hashlib.sha256(main_str.encode("utf-8")).hexdigest()
        if not os.path.exists("images"):
            os.makedirs("images")

        key = "Happy"
        # for key, optimized_result_data in data['optimized_result'].items():
        optimized_result_data = data['optimized_result'][key]
        catDescData = reportCatDescriptions[key]
        actual_top5 = optimized_result_data["actual_top5"]
        optimized_top5 = optimized_result_data["optimized_top5"]
        fig = get_bell_curve(actual=optimized_result_data['percentiles']['actual_pct'],
                            optimized=optimized_result_data['percentiles']['optimized_pct'],
                            wb_cat_name=catDescData['category'])
        image_name = f"{sha256_hash}_{key}.png"
        file_path = f"images/{image_name}"
        fig.write_image(file_path, scale=3, height=630, width=1200)
        try:
            self.s3.upload_file(
                file_path,
                self.bucket_name,
                image_name,
                ExtraArgs={"ContentType": "image/png"}
            )
            url = f"https://{self.bucket_name}.s3.amazonaws.com/{image_name}"
            image_path_dict[key] = url

        except Exception as e:
            print(f"S3 Upload Error: {e}")
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

            
        return image_path_dict

            




            
            



            
            
