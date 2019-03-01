# Message Verification and Signing
RPGcore implementation of [bitcoin message signing and verification](http://bitcoin.stackexchange.com/questions/3337/what-are-the-safety-guidelines-for-using-the-sign-message-feature/3339#3339). This is used to cryptographically prove that a certain message was signed by the holder of an address private key.

For more information refer to the [rpgcore-message](https://github.com/RPGCoin/rpgcore-message) github repo.

## Installation
Message Verification and Signing is implemented as a separate module and you must add it to your dependencies:

For node projects:

```bash
npm install rpgcore-message --save
```

For client-side projects:

```bash
bower install rpgcore-message --save
```

## Example
To sign a message:

```javascript
var privateKey = PrivateKey.fromWIF('5K2DxqJ9kLFL3hF3KEWDftAig3TyAXenDxpr27PaLBieuSFo5PQ');
var signature = Message('hello, world').sign(privateKey);
```

To verify a message:

```javascript
var address = 'RGRsG7UQc3AmvdrhPDngpPjvTNhJQFeHYj';
var signature = 'G5cFMHRysjcxkBJ7mol8l3cjPbFQFQ68fNqTGehTO9/cLNUaflt3gQT//yAUp5fqWF0snDlZYkXJoooazBicRTg=';
var verified = Message('hello, world').verify(address, signature);
```
