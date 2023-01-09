activate_this = '/nfs/stak/users/liukaib/.virtualenvs/flask/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
##Virtualenv Settings

##Replace the standard out
import logging, sys, os
#sys.stdout = sys.stderr

# ##Add this file path to sys.path in order to import app
sys.path.insert(0, '/scratch/webroot/linearfold_wsgi')
sys.path.append('/nfs/stak/users/liukaib/.virtualenvs/flask')
sys.path.append('/nfs/stak/users/liukaib/.virtualenvs/flask/lib/python2.7/site-packages')


##Create appilcation for our app
from server_flask_socketClient import app as application
#application.debug = True
#logging.basicConfig(stream=sys.stderr)


###  def application(environ, start_response):
###      status = '200 OK'
###  
###      if not environ['mod_wsgi.process_group']:
###        output = u'EMBEDDED MODE'
###      else:
###        output = u'DAEMON MODE'
###  
###      response_headers = [('Content-Type', 'text/plain'),
###                          ('Content-Length', str(len(output)))]
###  
###      start_response(status, response_headers)
###  
###      return [output.encode('UTF-8')]
