activate_this = '/nfs/stak/users/liukaib/.virtualenvs/flask/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
 
import sys, os
sys.stdout = sys.stderr

sys.path.insert(0, '/scratch/webroot/')
sys.path.insert(0,'/nfs/stak/users/liukaib/.virtualenvs/flask/lib/python2.7/site-packages')

import flask
application = flask.Flask(__name__)
 
loc = str(sys.modules['flask'])[1:-1]
print(loc)
loc1 = sys.prefix
loc0 = os.getcwd()
print(loc0)
loc00 = os.path.dirname(__file__)
print(loc00)
#print(sys.path)

#import arc_pairing_single_json
#print(sys.modules['arc_pairing_single_json'])
import server_flask_socketClient
print(sys.modules['server_flask_socketClient'])

@application.route('/')
def index():
    return '<h1>Hello World!</h1>flask: {}<br>sys.prefix: {}<br>current dir: {}<br>script dir: {}'.format(loc, loc1, loc0, loc00)
