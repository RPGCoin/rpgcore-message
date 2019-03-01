# RPGcoin Message Verification and Signing for RPGcore




rpgcore-message adds support for verifying and signing rpgcoin messages in [Node.js](http://nodejs.org/) and web browsers.

See [the main rpgcore repo](https://github.com/RPGCoin/rpgcore) for more information.

## Getting Started

```sh
npm install rpgcore-message
```

```sh
bower install rpgcore-message
```

To sign a message:

```javascript
var rpgcore = require('rpgcore-lib');
var Message = require('rpgcore-message');

var privateKey = rpgcore.PrivateKey.fromWIF('5K2DxqJ9kLFL3hF3KEWDftAig3TyAXenDxpr27PaLBieuSFo5PQ');
var signature = Message('hello, world').sign(privateKey);
```

To verify a message:

```javascript
var address = 'RGRsG7UQc3AmvdrhPDngpPjvTNhJQFeHYj';
var signature = 'G5cFMHRysjcxkBJ7mol8l3cjPbFQFQ68fNqTGehTO9/cLNUaflt3gQT//yAUp5fqWF0snDlZYkXJoooazBicRTg=';
var verified = Message('hello, world').verify(address, signature);
```

## Contributing

See [CONTRIBUTING.md](https://github.com/RPGCoin/rpgcore/blob/master/CONTRIBUTING.md) on the main rpgcore repo for information about how to contribute.

## License

Code released under [the MIT license](https://github.com/RPGCoin/rpgcore/blob/master/LICENSE).
