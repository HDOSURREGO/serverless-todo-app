// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'h0xzb7b4r8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-cw0q3s9i.us.auth0.com', // Auth0 domain
  clientId: 'eWDCN4Fj6fVNGDVc8A8a2ckcng3i7NIi', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
