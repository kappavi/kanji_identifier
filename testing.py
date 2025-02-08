# some initial testing of japanese libraries and whatnot
# copilot disabled

# first wani kani api. get teh level of a given kanji
import json
import requests 

# load tokens
with open('tokens.json', 'r') as file:
    tokens = json.load(file)

wanikani_api_token = tokens["wanikani_api_token"]

"""
This code initializes the kanji to id lookup mapping. This is relatively permanent 
so it doesn't need to be refreshed that often.

"""
# def initialize_kanji_cache(): 
#     kanji_id_cache = {}
#     url = f"https://api.wanikani.com/v2/subjects"
#     params = {"types": "kanji"}
#     headers = {"Authorization": "Bearer " + wanikani_api_token} 
#     while url:
#         response = requests.get(url, params=params, headers=headers)
#         if response.status_code != 200:
#             print(f"Error: {response.status_code} - {response.text}")
#             return
#         data = response.json()
#         for item in response.json()["data"]:
#             kanji_data = item["data"]
#             kanji_id_cache[kanji_data["characters"]] = item["id"]

#         url = data["pages"]["next_url"]
    
#     return kanji_id_cache
# kanji_id_cache = initialize_kanji_cache()
# cache_path = "kanji_id_cache.json"
# with open(cache_path, "w") as json_file:
#     json.dump(kanji_id_cache, json_file, indent=4)

with open('kanji_id_cache.json', 'r') as file:
    kanji_id_cache = json.load(file)

def getKanjiLevel(kanji):
    ids = []
    for k in kanji:
        ids.append(kanji_id_cache[k])
    ids = ",".join(str(k) for k in ids)
    ret = {}
    url = f"https://api.wanikani.com/v2/subjects"
    params = {"ids": ids}
    headers = {"Authorization": "Bearer " + wanikani_api_token} 
    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        print("Error! Something happened")
    else:
        json = response.json()
        all_data = json["data"] # should be all data for all characters
        for item in all_data: # now get data for each kanji
            data = item["data"]
            character = data["characters"]
            level = data["level"]
            ret[character] = level # store mapping because return order is inconsistent 
    return ret

# kanji = [1, 2, 3, 4, 5]

kanji = "食 家 上 下 飲 兄 服 深 探 何 芋"
kanji = kanji.split()
kanji_levels = getKanjiLevel(kanji)
for kanji, level in kanji_levels.items():
    print(f"The kanji {kanji} is WaniKani level {level}")