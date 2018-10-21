# dropbox-amazon-s3

> A Dropbox that uses Vue.Js and Amazon S3
> You must first create an Amazon S3 account and a bucket. 
> Retrieve the credentials from the amazon s3 console. 
## Build Setup

``` bash

# install dependencies
npm install

# Edit config/dev.env.js and config/prod.env.js and fill it with your Amazon S3 credentials
cd dropbox-amazon-s3/
nano config/dev.env.js
nano config/prod.env.js

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
