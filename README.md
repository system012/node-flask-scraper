Scraping software for amazon using both Node and Flask, Mongodb for saving products to scrape (using a Telegram bot as an interface to add products) and telegram to send a message when a specific product's price is below a certain threshold.

Node queries a local server made in flask which spins up a selenium browser that employs some simple anti-bot protections. The flask server then returns a json containing the html of the web page for node to scrape through Cheerio.
