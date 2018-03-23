# Contentful-locale

Migrate an exported Space from one locale to another.

```
npm install -g @hoverbaum/contentful-locale

contentful-locale exportedSpace.json target-locale -s output.json
```

After running your exported Space through this script you will be able to import it into Contentful without trouble.

## Contributing locales

Originally this tool only supports the locales it's creators needed. You are super welcome to add a locale :+1:

To do so please export a space with your desired locale using [contentful-export](https://github.com/contentful/contentful-export) and open a pull request adding the locale from it to the `locale.json` file in this repo.
