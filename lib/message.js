'use strict';

var rpgcore = require('rpgcore-lib');
var _ = rpgcore.deps._;
var PrivateKey = rpgcore.PrivateKey;
var PublicKey = rpgcore.PublicKey;
var Address = rpgcore.Address;
var BufferWriter = rpgcore.encoding.BufferWriter;
var ECDSA = rpgcore.crypto.ECDSA;
var Signature = rpgcore.crypto.Signature;
var sha256sha256 = rpgcore.crypto.Hash.sha256sha256;
var JSUtil = rpgcore.util.js;
var $ = rpgcore.util.preconditions;

/**
 * constructs a new message to sign and verify.
 *
 * @param {String} message
 * @returns {Message}
 */
var Message = function Message(message) {
  if (!(this instanceof Message)) {
    return new Message(message);
  }
  $.checkArgument(_.isString(message), 'First argument should be a string');
  this.message = message;

  return this;
};

Message.MAGIC_BYTES = new Buffer('RPG Signed Message:\n');

Message.prototype.magicHash = function magicHash() {
  var prefix1 = BufferWriter.varintBufNum(Message.MAGIC_BYTES.length);
  var messageBuffer = new Buffer(this.message);
  var prefix2 = BufferWriter.varintBufNum(messageBuffer.length);
  var buf = Buffer.concat([prefix1, Message.MAGIC_BYTES, prefix2, messageBuffer]);
  var hash = sha256sha256(buf);
  return hash;
};

Message.prototype._sign = function _sign(privateKey) {
  $.checkArgument(privateKey instanceof PrivateKey,
    'First argument should be an instance of PrivateKey');
  var hash = this.magicHash();
  var ecdsa = new ECDSA();
  ecdsa.hashbuf = hash;
  ecdsa.privkey = privateKey;
  ecdsa.pubkey = privateKey.toPublicKey();
  ecdsa.signRandomK();
  ecdsa.calci();
  return ecdsa.sig;
};

/**
 * Will sign a message with a given rpgcoin private key.
 *
 * @param {PrivateKey} privateKey - An instance of PrivateKey
 * @returns {String} A base64 encoded compact signature
 */
Message.prototype.sign = function sign(privateKey) {
  var signature = this._sign(privateKey);
  return signature.toCompact().toString('base64');
};

Message.prototype._verify = function _verify(publicKey, signature) {
  $.checkArgument(publicKey instanceof PublicKey, 'First argument should be an instance of PublicKey');
  $.checkArgument(signature instanceof Signature, 'Second argument should be an instance of Signature');
  var hash = this.magicHash();
  var verified = ECDSA.verify(hash, signature, publicKey);
  if (!verified) {
    this.error = 'The signature was invalid';
  }
  return verified;
};

/**
 * Will return a boolean of the signature is valid for a given rpgcoin address.
 * If it isn't the specific reason is accessible via the "error" member.
 *
 * @param {Address|String} rpgcoinAddress - A rpgcoin address
 * @param {String} signatureString - A base64 encoded compact signature
 * @returns {Boolean}
 */
Message.prototype.verify = function verify(rpgcoinAddress, signatureString) {
  $.checkArgument(rpgcoinAddress);
  $.checkArgument(signatureString && _.isString(signatureString));

  if (_.isString(rpgcoinAddress)) {
    rpgcoinAddress = Address.fromString(rpgcoinAddress);
  }
  var signature = Signature.fromCompact(new Buffer(signatureString, 'base64'));

  // recover the public key
  var ecdsa = new ECDSA();
  ecdsa.hashbuf = this.magicHash();
  ecdsa.sig = signature;
  var publicKey = ecdsa.toPublicKey();

  var signatureAddress = Address.fromPublicKey(publicKey, rpgcoinAddress.network);

  // check that the recovered address and specified address match
  if (rpgcoinAddress.toString() !== signatureAddress.toString()) {
    this.error = 'The signature did not match the message digest';
    return false;
  }

  return this._verify(publicKey, signature);
};

/**
 * Instantiate a message from a message string
 *
 * @param {String} str - A string of the message
 * @returns {Message} A new instance of a Message
 */
Message.fromString = function(str) {
  return new Message(str);
};

/**
 * Instantiate a message from JSON
 *
 * @param {String} json - An JSON string or Object with keys: message
 * @returns {Message} A new instance of a Message
 */
Message.fromJSON = function fromJSON(json) {
  if (JSUtil.isValidJSON(json)) {
    json = JSON.parse(json);
  }
  return new Message(json.message);
};

/**
 * @returns {Object} A plain object with the message information
 */
Message.prototype.toObject = function toObject() {
  return {
    message: this.message
  };
};

/**
 * @returns {String} A JSON representation of the message information
 */
Message.prototype.toJSON = function toJSON() {
  return JSON.stringify(this.toObject());
};

/**
 * Will return a the string representation of the message
 *
 * @returns {String} Message
 */
Message.prototype.toString = function() {
  return this.message;
};

/**
 * Will return a string formatted for the console
 *
 * @returns {String} Message
 */
Message.prototype.inspect = function() {
  return '<Message: ' + this.toString() + '>';
};

module.exports = Message;