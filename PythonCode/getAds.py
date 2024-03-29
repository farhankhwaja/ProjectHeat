import numpy as np
from firebase.firebase import FirebaseApplication, FirebaseAuthentication
import sys
from scipy.stats import pearsonr
import json
from config import config

FIREBASE_SECRET = config['firebase_secret']
FIREBASE_URL = config['firebase_url']
EMAIL = config['email']
REQUEST_URL = '/newreq'

class Coupon:
	def __init__(self, shop, text):
		self.shop = shop
		self.text = text


	def reprJSON(self):
		return dict(shop=self.shop, text=self.text)


class Group:
	def __init__(self, coup1, coup2, coup3):
		self.couplist = [coup1,coup2,coup3]
	

	def reprJSON(self):
		return dict(c1=self.couplist[0], c2=self.couplist[1], c3=self.couplist[2])


class Recommendation:
	def __init__(self, group1, group2):
		self.visited = group1
		self.other = group2


	def reprJSON(self):
		return dict(visited=self.visited, other=self.other)


class ComplexEncoder(json.JSONEncoder):
	def default(self,obj):
		if hasattr(obj,'reprJSON'):
			return obj.reprJSON()
		else:
			return json.JSONEncoder.default(self,obj)
	
class PredictCoupons:
	def __init__(self, requestKey, request):
		self.visitor_id = request
		self.reqKey = requestKey
		self.authentication = FirebaseAuthentication(FIREBASE_SECRET, EMAIL, True, True)
		self.firebase = FirebaseApplication(FIREBASE_URL, self.authentication)


	def updateCoupons(self, request, requestKey, coupons):
		currentRequest = {}
		currentRequest['copounsGenerated'] = coupons
		currentRequest['status'] = 'completed'
		URL = REQUEST_URL + '/' + requestKey 
		self.firebase.patch(URL, currentRequest)


	def execute(self):
		ratings = np.loadtxt('simulated_data.csv',delimiter=',',dtype='float32')
		model = np.loadtxt('model',dtype='float32')
		Coupons = {}

		#load all coupons
		infile = open('coupons.csv','r')
		i = 0
		for line in infile:
			line = line.split(',')
			c1 = Coupon(line[0],line[2])
			Coupons[i] = c1
			i += 1
		infile.close()
		dim = ratings.shape
		numUsers = dim[0]
		numShops = dim[1]
		dim = model.shape
		numClusters = dim[0]
		visited = None
		others = None
		if(self.visitor_id >=0 and self.visitor_id <= numUsers): # repeating visitor
			pRating = [0]*numClusters
			for i in range(numClusters):
				out = pearsonr(model[i,:],ratings[self.visitor_id,1:])
				pRating[i] = out[0]
			cOrder = [i[0] for i in sorted(enumerate(pRating),key=lambda x:x[1],reverse=True)] #order clusters based on pearson coefficient
			nRating = (model[cOrder[0],:] + model[cOrder[1],:] + model[cOrder[2],:])/3 # neighbourhood rating
			sOrder = [i[0] for i in sorted(enumerate(nRating.tolist()),key=lambda x:x[1],reverse=True)]
		
			hOrder = [i[0] for i in sorted(enumerate(ratings[self.visitor_id,1:].tolist()),key=lambda x:x[1],reverse=True)]
			visited_id = [hOrder[0],hOrder[1],hOrder[2]]
			count = 0
			current = 0
			others_id = []	
			while count <3:
				if not sOrder[current] in visited_id:
					count +=1
					others_id.append(sOrder[current])
				current += 1	 
			visited = Group(Coupons[visited_id[0]],Coupons[visited_id[1]],Coupons[visited_id[2]])
			others = Group(Coupons[others_id[0]],Coupons[others_id[1]],Coupons[others_id[2]])
		else: #new visitor
			visited = None
			rand = np.random.randint(0,20,3)		
			others = Group(Coupons[rand[0]],Coupons[rand[1]],Coupons[rand[2]])
		ads = Recommendation(visited,others)
		coupons = json.dumps(ads.reprJSON(),cls=ComplexEncoder)
		self.updateCoupons(self.visitor_id, self.reqKey, coupons)
		
