import { sign, verify } from 'jsonwebtoken';

/**
 * represent the json web token signing, verifying methods
 */
export default class JWTSecure {
  /**
   * @param1 - { username, id }
   * @param2 - secretKey
   * @return - jsonwebtoken.sign(param1, param2)
   */
  static sign(object, secretKey) {
    return sign(object, secretKey);
  }

  /**
   * @param1 - token
   * @param2 - secretKey
   * @return - { username, id } or null
   */
  static verify(token, secretKey) {
    let validToken;
    try {
      validToken = verify(token, secretKey);
      if (!validToken.username) throw new Error('missing username');
    } catch (err) {
      return null;
    }
    return validToken;
  }
}
