from django.shortcuts import render
from django.http import HttpResponse
from selenium import webdriver
import os


chrome_options = webdriver.ChromeOptions()
chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--remote-debugging-address=0.0.0.0")
chrome_options.add_argument("--remote-debugging-port=9222")
#chrome_options.addArguments("load-extension=/path/to/extension");
driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=chrome_options)

# Now you can start using Selenium
driver.get("https://www.google.com")


from .models import Greeting

# Create your views here.
def index(request):
    return HttpResponse(driver.page_source)
    #return render(request, "index.html")


def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, "db.html", {"greetings": greetings})
