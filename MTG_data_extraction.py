from mtgsdk import Set
from mtgsdk import Card
from mtgsdk import Type
from mtgsdk import Supertype
from mtgsdk import Subtype
from mtgsdk import Changelog
import pymongo
from pymongo import MongoClient
import requests

def get_card(db,card_name):
    
    return card

def get_collection(collection_id):
    return()

def add_card():
    return()

def remove_card():
    return()

def generate_url(mutliverseid):
    url='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='
    url=url+str(multiverseid)+str('&type=card')
    return url

def get_card_image(url):
    try:
        image=requests.get(url).content
    except:
        image=None
        pass
    return image

#waitnign on applciaiton for developer
def tcg_return_price():

    url = "http://api.tcgplayer.com/v1.5.0/catalog/categories"

    response = requests.request("GET", url)

    return(response.text)

def ck_return_price(mtgcard):
    ##need to figure out how not be a bot
    url
    cardkingdom1=urllib.request.urlretrieve("https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=Teferi%27s+Care&ac=1")

def parse_set(mtgset):
    set_properties= ['code','name','gatherer_code','old_code','magic_cards_info_code','release_date',
    'border','type','block','online_only','booster','mkm_id','mkm_name']

    post = {"code": mtgset.code,
         "name": mtgset.name,
         "gatherer_code": mtgset.gatherer_code,
         "old_code": mtgset.old_code,
         "magic_cards_info_code":mtgset.magic_cards_info_code,
         "release_date": mtgset.release_date,
         "border": mtgset.border,
         "type": mtgset.type,
         "block": mtgset.block,
         "online_only": mtgset.online_only,
         "booster": mtgset.booster,
         "mkm_id": mtgset.mkm_id,
         "mkm_name": mtgset.mkm_name,
         }
    return(post)

def parse_card(mtgcard):


    card_properties= ['name','multiverse_id','layout','names','mana_cost','cmc','colors','color_identity','type','supertypes','subtypes','rarity','text','flavor','artist','number','power','toughness','loyalty','variations','watermark','border','timeshifted','hand','life','reserved','release_date','starter','rulings','foreign_names','printings','original_text','original_type','legalities','source','image_url','set','set_name','id']

    post = {"name": mtgcard.name,
            "multiverse_id": mtgcard.multiverse_id,
            "layout": mtgcard.layout,
            "names": mtgcard.names,
            "mana_cost": mtgcard.mana_cost,
            "cmc": mtgcard.cmc,
            "colors": mtgcard.colors,
            "color_identity": mtgcard.color_identity,
            "type": mtgcard.type,
            "supertypes": mtgcard.supertypes,
            "subtypes": mtgcard.subtypes,
            "rarity": mtgcard.rarity,
            "text": mtgcard.text,
            "flavor": mtgcard.flavor,
            "artist": mtgcard.artist,
            "number": mtgcard.number,
            "power": mtgcard.power,
            "toughness": mtgcard.toughness,
            "loyalty": mtgcard.loyalty,
            "variations": mtgcard.variations,
            "watermark": mtgcard.watermark,
            "border": mtgcard.border,
            "timeshifted": mtgcard.timeshifted,
            "hand": mtgcard.hand,
            "life": mtgcard.life,
            #"": mtgcard.reserved,
            "release_date": mtgcard.release_date,
            "starter": mtgcard.starter,
            "rulings": mtgcard.rulings,
            "foreign_names": mtgcard.foreign_names,
            "printings": mtgcard.printings,
            "original_text": mtgcard.original_text,
            "original_type": mtgcard.original_type,
            "legalities": mtgcard.legalities,
            "source": mtgcard.source,
            "image": str(get_card_image(mtgcard.image_url)),
            "set": mtgcard.set,
            "set_name": mtgcard.set_name,
            "id": mtgcard.id,
            }

    return(post)


#cards=Card.all()
def insert_cards(cards):
for i in cards:
        dbcards.posts.insert_one(parse_card(i))

#for j in set:
#        dbsets.posts.insert_one(parse_set(j))
