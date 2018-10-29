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
    targetdb=client['MTG_CARDS'].Leovold
    target2db=client['MTG_CARDS'].Grenzo

    #create_collection(collection_config,masterdb,targetdb)
    decklist=[]
    decklist1=[]
    for i in targetdb.find():
            decklist.append(i)
    for i in target2db.find():
            decklist1.append(i)

    deck1=MTG.clean_collection(decklist)
    deck1=MTG.add_gameplay_properties(decklist)

    deck2=MTG.clean_collection(decklist1)
    deck2=MTG.add_gameplay_properties(decklist1)
    MTG.create_game([deck1,deck2])

