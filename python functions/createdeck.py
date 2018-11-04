
import MTG_data_extraction as MTG
import pymongo
from pymongo import MongoClient
import argparse
import pickle

######## need to be able to passs a list of the deck as well as the name for the deck

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Create a new MTG deck')
    parser.add_argument('--D', metavar='--Deck', required=True,
                        help='the decklist file/object')
    parser.add_argument('--N', metavar='--Name', required=True,
                        help='The new deck name')
    args = parser.parse_args()

    f=open(args.D,'r')
    data=eval(f.read())

    client = MongoClient('localhost', 27017)
    masterdb = client['MTG_CARDS']['cards']
    targetdb=client['MTG_CARDS'][args.N]
    
    mydeck=MTG.create_collection(data,masterdb,targetdb)
