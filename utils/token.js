function getAccessToken(req) {
  // @ts-ignore
  return req.header(global.authHeader) || '';
}

function parseSchemaToken(token) {
  var tokenRegEx = /(\S+)\s+(\S+)/;

  if (typeof token !== 'string') {
    return null;
  }

  var matches = token.match(tokenRegEx);
  return matches && matches[2];
}

function getParsedSchemaToken(req) {
  const token = getAccessToken(req);

  if (!token) null;

  return parseSchemaToken(token);
}

module.exports.getAccessToken = getAccessToken;
module.exports.parseSchemaToken = parseSchemaToken;
module.exports.getParsedSchemaToken = getParsedSchemaToken;
