import undetected_chromedriver.v2 as uc

def create_driver():
    try:
        options = uc.ChromeOptions()
        options.headless=True
        options.add_argument('--headless')
        return uc.Chrome(options=options)
    except:
        print("There was a problem opening chrome driver.")