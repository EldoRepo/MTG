import MTG_data_extraction as MTG
import pymongo
from pymongo import MongoClient
import requests
import json
import bson
import urllib3 as urllib


if __name__ == "__main__":

    ##connect to local db
    client = MongoClient('localhost', 27017)
    targetdb=client['MTG_CARDS'].test_deck
    
    #create_collection(collection_config,masterdb,targetdb)
    decklist=[]
    for i in targetdb.find():
            decklist.append(i)

    mydeck=MTG.clean_collection(decklist)
    mydeck=MTG.add_gameplay_properties(decklist)
    MTG.serve_firebase(mydeck)

