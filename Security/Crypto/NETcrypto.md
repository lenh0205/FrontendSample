#
* AES is only a subset of Rijndael
*  CryptoStream is limited to push everything through a stream and there is no way you can pick up the data while it's being encrypted.
*  choice of algorithm, what cipher mode, key length, block size and understand what salt is and how to use it and also how to hash a password to a proper key ?
* how you store keys generate keys/Salt in a secure manner, making sure that your application has a safe flow in how the data is handled, and also making sure you made the right choices of how to set up your encryption in a good way. Even performance could play an important part if you are dealing with huge sets of data.