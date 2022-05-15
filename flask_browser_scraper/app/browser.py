from time import sleep
from amazoncaptcha import AmazonCaptcha
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
# from Screenshot import Screenshot_Clipping

def close_driver(driver):
    driver.close()
    driver.quit()

def open_page(url, driver):
    driver.get(url)

def get_html(driver):
    return driver.page_source

def anti_bot_measures(driver, url, retry_counter):
    if has_caught_captcha(driver):
        solve_captcha(driver)
        sleep(0.564)
        if has_caught_cidispiace(driver):
            counter_cidispiace_page(driver, url, retry_counter)
        newPage = get_html(driver)
        # close_driver(driver)
        return newPage

    page = handle_broken_page(driver, url, retry_counter)
    # close_driver(driver)
    return page

def solve_captcha(driver):
    captcha = extract_captcha(driver)
    if captcha == "Not solved" or captcha.find("-") != -1:
        print(f"Couldn't solve captcha. This is what I got: {captcha}")
        return
    print(f"Solved captcha, it's: {captcha}")
    write_captcha_solution(captcha, driver)

def extract_captcha(driver):
    captcha = AmazonCaptcha.fromdriver(driver)
    return captcha.solve()
    
def write_captcha_solution(captcha, driver):
    captcha_input = driver.find_element_by_id("captchacharacters")
    captcha_input.clear()
    captcha_input.send_keys(captcha, Keys.ARROW_DOWN)
    sleep(0.486)
    driver.find_element_by_css_selector(".a-button-text").click()

def has_caught_cidispiace(driver):
    body = driver.find_element_by_css_selector("body").text
    if body.find("dispiace") != -1:
        print("Has caught Ci dispiace page. Refreshing page.")
        return True
    return False

def has_caught_captcha(driver):
    body = driver.find_element_by_css_selector("body").text
    if body.find("robot") != -1:
        return True
    
    return False      

def handle_broken_page(driver, url, retry_counter):
    if not has_caught_broken_page(driver):
        page = get_html(driver)
        return page
    counter_broken_page(driver, url, retry_counter)
    page = get_html(driver)
    return page
            

def counter_cidispiace_page(driver, url, retry_counter):
    if retry_counter < 1:
        retry_counter += 1
        click_here = driver.find_element_by_partial_link_text("Clicca")
        print(click_here.text)
        click_here.click()
        sleep(0.550)
        # ob = Screenshot_Clipping.Screenshot()
        # ob.full_Screenshot(driver, save_path=r'.', image_name='screen.png')
        open_page(url, driver) # go to the product page again
        anti_bot_measures(driver, url, retry_counter)

def counter_broken_page(driver, url, retry_counter):
    if retry_counter < 2:
        retry_counter += 1
        # driver.refresh()
        print("No title found. Opening new tab to try and get the correct page.")
        driver.execute_script("window.open('');") # open new tab
        driver.switch_to.window(driver.window_handles[1]) # switch focus to new tab
        open_page(url, driver) # go to the product page again
        anti_bot_measures(driver, url, retry_counter)
    # if retry_counter == 2:
    #     ob = Screenshot_Clipping.Screenshot()
    #     ob.full_Screenshot(driver, save_path=r'.', image_name='screen.png')
    #     logger(get_html(driver))
        

def has_caught_broken_page(driver):
    try:
        if driver.find_element_by_css_selector("#productTitle").text:
            print("Nothing wrong with this page.")
            return False
    except NoSuchElementException as e:
        print(f"No title found. This is what I got: {e}")
        return True        

def anticaptcha_browser(url, driver):
    # if not driver:
    #     driver = create_driver()
    try:
        open_page(url, driver)
        retry_counter = 0

        page = anti_bot_measures(driver, url, retry_counter)

    except Exception as e:
        print(f"There was a problem with chrome -> {e}")
    finally:
        close_driver(driver)

    return page