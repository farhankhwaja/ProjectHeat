import sys, io
from firebase.firebase import FirebaseApplication, FirebaseAuthentication
from getAds import PredictCoupons
from threading import Thread
from multiprocessing import Process
from multiprocessing import Queue
import time
import operator
from config import config

FIREBASE_SECRET = config['firebase_secret']
FIREBASE_URL = config['firebase_url']
EMAIL = config['email']
REQUEST_URL = '/newreq'


class FirebaseManager:

	def __init__(self):
		self.IS_SERVER_RUNNING = False
		self.authentication = FirebaseAuthentication(FIREBASE_SECRET, EMAIL, True, True)
		self.firebase = FirebaseApplication(FIREBASE_URL, self.authentication)

	def readStatus(self):
		self.getAllRequests()
		self.requestsStatus = {}
		for req in self.requests:
			requestKey = req
			if 'ready' in self.requests[req]['status'].lower():
				visitor = self.requests[req]['visitorID']
				self.requestsStatus[(visitor, requestKey)] = self.requests[req]['date']

	def getAllRequests(self):
		requests = self.firebase.get(REQUEST_URL, None)
		self.requests = {}
		for req in requests:
			self.requests[req] = requests[req]

	def processReadyRequests(self):
		sortedKeys = list(sorted(self.requestsStatus, key=operator.itemgetter(1), reverse=False))
		if len(sortedKeys) == 0:
			return
		if not self.IS_SERVER_RUNNING:
			requestToExecute = sortedKeys[0]
			for key in sortedKeys:
				newPriority = self.requestsStatus[key] - 1
				request = key[0]
				requestKey = key[1]
				self.updatePriority(request, requestKey, newPriority)
			self.startProject(requestToExecute[1], requestToExecute[0])

	def handleRequestType(self, requestKey, request):
		# sourcesKey = {"twitter" : "tweet", "facebook" : "message", "reddit" : "title"}
		executor = PredictCoupons(requestKey, int(request))
		executor.execute()
		self.IS_SERVER_RUNNING = False

	def startProject(self, requestKey, request):
		self.IS_SERVER_RUNNING = True
		print ("starting recommendation algorithm for Key: " + requestKey + " visitor " + request)
		# Create a new thread and start executing the prediction task
		thread = Thread(target = self.handleRequestType, args = (requestKey, request))
		thread.start()

	def updatePriority(self, request, requestKey, priority):
		currentRequest = {}
		currentRequest['date'] = priority
		URL = REQUEST_URL + '/' + requestKey 
		self.firebase.patch(URL, currentRequest)

	def executeServer(self):
		while True:
				self.readStatus()
				self.processReadyRequests()
				time.sleep(1)


def main():
	firebaseManager = FirebaseManager()
	firebaseManager.executeServer()

if __name__ == '__main__':
	main()
