# GPT3 Accessible Tables
> GPT3 Accessible Tables is a Chrome Extension that uses OpenAI's GPT3 technology to give insights on tables rendered in web pages.

GPT3 Accessible Tables then will scan the page you access (unless you disable the scan for a given page) and run the data on those tables through OpenAI's GPT3 technology. Then OpenAI's API will return some insight on the data and this extension will inject that insight adding a <caption> element on top of the table. It will also add a "summary" tag to the <table> element, making those tables readables by any screen reader.

## Installation

You can install the extension in your Chrome web browser by going [this website](https://chrome.google.com/webstore/detail/gpt3-accessible-tables/ebfppmgmfdndnjbkljogmijldhppejig?hl=en)

## Usage example

This extension can be used to make HTML tables accessible to be able to get some insights with any screen reader.

## Development setup

Process to run the project's UI locally:

```sh
npm i
npm run dev
```

## Release History

* 0.0.4
    * First proper release

## Meta

Leniolabs LLC – [@Leniolabs_](https://twitter.com/Leniolabs_) – info@leniolabs.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/Leniolabs/accessible-tables](https://github.com/Leniolabs)

## Contributing

1. Fork it (<https://github.com/Leniolabs/accessible-tables/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'feat: Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request