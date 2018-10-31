import MTG_data_extraction as MTG
import pymongo
from pymongo import MongoClient
import requests
import json
import bson
import argparse


if __name__ == "__main__":

    ##connect to local db
    parser = argparse.ArgumentParser(description='Create a new MTG deck')
    parser.add_argument('--D1', metavar='--Deck1', required=True,
                        help='the decklist name')
    parser.add_argument('--D2', metavar='--Deck2', required=True,
                        help='the decklist name')
    args = parser.parse_args()


    client = MongoClient('localhost', 27017)
    targetdb=client['MTG_CARDS'][args.D1]
    target2db=client['MTG_CARDS'][args.D2]
    decklist=[]
    decklist1=[]
    for i in targetdb.find():
            decklist.append(i)
    for i in target2db.find():
            decklist1.append(i)

    deck1=MTG.add_gameplay_properties(MTG.clean_collection(decklist))
    deck2=MTG.add_gameplay_properties(MTG.clean_collection(decklist1))
    MTG.create_game([deck1,deck2])

