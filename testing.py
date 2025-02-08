# some initial testing of japanese libraries and whatnot
# copilot disabled


"""
Setup: imports and loading cache/config.
"""
# first wani kani api. get teh level of a given kanji
import json
import requests 
import re

# load tokens
with open('tokens.json', 'r') as file:
    tokens = json.load(file)

wanikani_api_token = tokens["wanikani_api_token"]


with open('kanji_id_cache.json', 'r') as file:
    kanji_id_cache = json.load(file)

"""
This code initializes the kanji to id lookup mapping. This is relatively permanent 
so it doesn't need to be refreshed that often.
"""
def initialize_kanji_cache(): 
    kanji_id_cache = {}
    url = f"https://api.wanikani.com/v2/subjects"
    params = {"types": "kanji"}
    headers = {"Authorization": "Bearer " + wanikani_api_token} 
    while url:
        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            print(f"Error: {response.status_code} - {response.text}")
            return
        data = response.json()
        for item in response.json()["data"]:
            kanji_data = item["data"]
            kanji_id_cache[kanji_data["characters"]] = item["id"]

        url = data["pages"]["next_url"]
    
    return kanji_id_cache
# kanji_id_cache = initialize_kanji_cache()
# cache_path = "kanji_id_cache.json"
# with open(cache_path, "w") as json_file:
#     json.dump(kanji_id_cache, json_file, indent=4)
"""
This code takes a list of Kanji and returns a dictionary of their levels, onyomi readings, and kunyomi readings.
Everything is done in one API call since all data is technically grouped. Would be redundant to make
multiple API calls.
"""
def getKanjiInfo(kanji: list[str]) -> dict:
    ids = []
    for k in kanji:
        if k in kanji_id_cache: # some n1 kanji that arent in wanikani. TODO to deal with this
            ids.append(kanji_id_cache[k])
    ids = ",".join(str(k) for k in ids)
    mapping = {}
    url = f"https://api.wanikani.com/v2/subjects"
    params = {"ids": ids}
    headers = {"Authorization": "Bearer " + wanikani_api_token} 
    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
    else:
        json = response.json()
        all_data = json["data"] # should be all data for all characters
        for item in all_data: # now get data for each kanji
            data = item["data"]
            character = data["characters"]
            level = data["level"]
            mapping[character] = {"level": level} # store mapping because return order is inconsistent 
            mapping[character]["on"] = []
            mapping[character]["kun"] = []
            for r in data["readings"]:
                if r["type"] == "onyomi":
                    mapping[character]["on"].append(r["reading"])
                else:
                    mapping[character]["kun"].append(r["reading"])
            
    return mapping

"""
Helper function to print Kanji from a returned mapping.
"""
def printKanji(mapping):
    for kanji in mapping:
        level = mapping[kanji]["level"]
        on = mapping[kanji]["on"]
        kun = mapping[kanji]["kun"]
        print(f"The kanji {kanji} is: \n\t WaniKani level {level} \
              \n\t and has onyomi readings {on} \
              \n\t and kunyomi readings {kun}")

"""
Outputs a list of Kanji based on a text input.
"""
def findKanjiFromString(text) -> list[str]:
    return re.findall(r'[\u4e00-\u9fff]', text)

"""
Testing here. -----------------------
"""
kanji = "食 家 上 下 飲 兄 服 深 探 何 芋 日"
kanji = kanji.split()
mapping = getKanjiInfo(kanji)
# printKanji(mapping)

# testing parsing 
text = """
        今日は。私の名前は田中です。よろしくお願いします。
        """
kanji = findKanjiFromString(text)# returns all kanji in a string text, since they are in between unicode values
# print(kanji)
printKanji(getKanjiInfo(kanji))